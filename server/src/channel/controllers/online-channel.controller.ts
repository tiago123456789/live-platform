import { CACHE_MANAGER, Controller, Delete, Get, HttpCode, Inject, Param, Post, UseFilters } from "@nestjs/common";
import { Cache } from "cache-manager"
import { HandlerException } from "src/common/exceptions/handle.exception";
import { ChannelService } from "../services/channel.service";
import { UserService } from "../../user/user.service"
import { OnlineChannelService } from "../services/online-channel.service";
import { BotCommandService } from "src/chat/bot-command.service";

@Controller("online-channels")
@UseFilters(HandlerException)
export class OnlineChannelController {

    private readonly TIME_TO_LIVE_CACHE = 600;

    constructor(
        private onlineChannelService: OnlineChannelService,
        private botCommandService: BotCommandService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    }

    @Get("/")
    async getChannelsOnline() {

        const onlineChannelCached = await this.cacheManager.get("online")

        if (!onlineChannelCached) {
            const registers = await this.onlineChannelService.getOnlineChannels();
            await this.cacheManager.set(
                "online", 
                JSON.stringify(registers), 
                this.TIME_TO_LIVE_CACHE
            )
            return registers || [];
        }

        // @ts-ignore
        return JSON.parse(onlineChannelCached) || [];
    }

    @Post("/:id")
    @HttpCode(201)
    async setChannelOnline(@Param("id") id: string) {
        await Promise.all([
            this.onlineChannelService.setChannelOnline(id),
            this.cacheManager.del("online"),
            this.botCommandService.storeChannelBotCommandsInCache(id)
        ])
    }
    

    @Delete("/:id")
    @HttpCode(204)
    async finishChannelStream(@Param("id") id: string) {
        await this.botCommandService.removeChannelBotCommandsCache(id)
        let onlineChannelCached = await this.cacheManager.get(
            "online"
        );

        if (!onlineChannelCached) {
            return;
        }


        // @ts-ignore
        onlineChannelCached = JSON.parse(onlineChannelCached)
        // @ts-ignore
        for (let index = 0; index < onlineChannelCached.length; index++) {
            const itemCached = onlineChannelCached[index];
            if (itemCached.id == id) {
                // @ts-ignore
                onlineChannelCached.splice(index, 1)
            }
        }

        // @ts-ignore
        if (onlineChannelCached.length == 0) {
            return Promise.all([
                this.onlineChannelService.finishChannelStream(id),
                this.cacheManager.del(
                    "online", 
                ),
            ]);
        }

        return Promise.all([
            this.onlineChannelService.finishChannelStream(id),
            this.cacheManager.set(
                "online", 
                JSON.stringify(onlineChannelCached), 
                this.TIME_TO_LIVE_CACHE
            ),
        ]);
    }
}