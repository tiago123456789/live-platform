import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { BotCommandDto } from "./dto/bot-command.dto";
import { BotCommandService } from "./bot-command.service";
import { DeleteBotCommandDto } from "./dto/delete-bot-command.dto";

@Controller("/channels/:id/bot-commands")
export class BotCommandController {

    constructor(private readonly botCommandService: BotCommandService) {}

    @Get("/")
    getCommands(@Param("id") id: string) {
        return this.botCommandService.getCommands(id);
    }

    @Post("/")
    @HttpCode(201)
    async create(@Param("id") id: string, @Body() botCommand: BotCommandDto) {
        await this.botCommandService.create(id, botCommand);
    }


    @Delete("/")
    @HttpCode(204)
    async remove(@Param("id") id: string, @Body() deleteBotCommand: DeleteBotCommandDto) {
        await this.botCommandService.remove(id, deleteBotCommand);
    }
}