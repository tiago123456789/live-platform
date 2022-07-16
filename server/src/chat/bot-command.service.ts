import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { BotCommandDto } from "./dto/bot-command.dto";
import { BotCommandRepository } from "./bot-command.repository";
import { DeleteBotCommandDto } from "./dto/delete-bot-command.dto";
import { Cache } from "cache-manager";

@Injectable()
export class BotCommandService {

    private readonly TIME_TO_LIVE_CACHE = 72000;

    constructor(
        private botCommandRepository: BotCommandRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    getCommands(id) {
        return this.botCommandRepository.getCommands(id)
    }

    remove(id, deleteBotCommand: DeleteBotCommandDto) {
        return Promise.all([
            this.botCommandRepository.remove(id, deleteBotCommand.command),
            this.cacheManager.del(
                `bot_command:${id}:${deleteBotCommand.command}`,
            )
        ]);
    }

    async create(id, botCommandDto: BotCommandDto) {
        const [botCommandCreated] = await Promise.all([
            this.botCommandRepository.create(
                id,
                `bot_command#${botCommandDto.command}`,
                {
                    command: { S: botCommandDto.command },
                    reply: { S: botCommandDto.reply }
                }
            ),
            this.cacheManager.set(
                `bot_command:${id}:${botCommandDto.command}`,
                botCommandDto.reply,
                this.TIME_TO_LIVE_CACHE
            )

        ])
        return botCommandCreated;
    }

    async removeChannelBotCommandsCache(channelId) {
        const botCommands = await this.getCommands(channelId);
        let promisesDeleteBotCommands = []
        for (let index = 0; index < botCommands.length; index += 1) {
            const command = botCommands[index].command;

            if (promisesDeleteBotCommands.length > 20) {
                await Promise.all(promisesDeleteBotCommands)
                promisesDeleteBotCommands = []
            }

            promisesDeleteBotCommands.push(
                this.cacheManager.del(
                    `bot_command:${channelId}:${command}`,
                )
            )
        }

        if (promisesDeleteBotCommands.length > 0) {
            promisesDeleteBotCommands.push(
                this.cacheManager.del(`bot_command:${channelId}:!all`)
            )
            await Promise.all(promisesDeleteBotCommands)
            promisesDeleteBotCommands = []
        }
    }

    async storeChannelBotCommandsInCache(channelId) {
        const botCommands = await this.getCommands(channelId);
        let allCommands = []
        let promisesStoreBotCommands = []
        for (let index = 0; index < botCommands.length; index += 1) {
            const command = botCommands[index].command;
            const reply = botCommands[index].reply;

            allCommands.push(command);

            if (promisesStoreBotCommands.length > 20) {
                await Promise.all(promisesStoreBotCommands)
                promisesStoreBotCommands = []
            }

            promisesStoreBotCommands.push(
                this.cacheManager.set(
                    `bot_command:${channelId}:${command}`,
                    reply,
                    this.TIME_TO_LIVE_CACHE
                )
            )
        }

        if (promisesStoreBotCommands.length > 0) {
            promisesStoreBotCommands.push(
                this.cacheManager.set(
                    `bot_command:${channelId}:!all`, 
                    allCommands.join(" "),
                    this.TIME_TO_LIVE_CACHE
                )
            )
            await Promise.all(promisesStoreBotCommands)
            promisesStoreBotCommands = []
        }
    }

    async replyCommand(channelId, command) {
        let messageTypeCommandInvalid = "Command is not valid. Command available: \n"
        const replyCommandInCached = await this.cacheManager.get(`bot_command:${channelId}:${command}`)
        if (replyCommandInCached) {
            return replyCommandInCached;
        }

        const allCommandsCached = await this.cacheManager.get(`bot_command:${channelId}:!all`)
        return `${messageTypeCommandInvalid} ${allCommandsCached}`
    }

    public isBotCommand(command) {
        return command[0] == "!"
    }

}