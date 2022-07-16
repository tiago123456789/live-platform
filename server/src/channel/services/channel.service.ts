import { Injectable } from "@nestjs/common";
import { BusinessException } from "src/common/exceptions/business.xception";
import { NotFoundException } from "src/common/exceptions/not-found.exception";
import { ChannelDto } from "../dto/channel.dto";
import { ChannelRepository } from "../channel.repository";

@Injectable()
export class ChannelService { 

    constructor(
        private channelRepository: ChannelRepository
    ) {

    }

    async getChannelById(id: string): Promise<ChannelDto | null> {
        const register = await this.channelRepository.findById(id);
        if (!register) {
            throw new NotFoundException("Not found channel")
        }
        return register;
    }

    async create(channel: ChannelDto) {
        const register = await this.channelRepository.findById(channel.id);
        if (register) {
            throw new BusinessException("You already have channel created")
        }
        return this.channelRepository.create(channel.id, {
            description: { S: channel.description },
            name: { S: channel.name }
        })   
    }

}