import { Body, Controller, Get, HttpCode, Param, Post, Request, UseFilters, UseInterceptors } from "@nestjs/common";
import { HandlerException } from "src/common/exceptions/handle.exception";
import { AuthorizationSecurity } from "src/common/security/authorization.security";
import { ChannelDto } from "../dto/channel.dto";
import { ChannelService } from "../services/channel.service";


@Controller("/channels")
@UseInterceptors(AuthorizationSecurity)
@UseFilters(HandlerException)
export class ChannelController {

    constructor(private channelService: ChannelService) {

    }

    @Get("/:id")
    getChannelById(@Param("id") id: string) {
        return this.channelService.getChannelById(id);
    }

    @Post("/")
    @HttpCode(201)
    async create(@Body() channel: ChannelDto, @Request() request: Request) {
        // @ts-ignore
        channel.name = request.username;
        // @ts-ignore
        channel.id = request.userId;
        await this.channelService.create(channel);
    }

}