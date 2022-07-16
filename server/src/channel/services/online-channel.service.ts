import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { ChannelRepository } from "../channel.repository";
import { ChannelService } from "./channel.service";

@Injectable()
export class OnlineChannelService { 

    constructor(
        private channelRepository: ChannelRepository,
        private channelService: ChannelService,
        private userService: UserService, 
    ) {

    }

    finishChannelStream(id: string) {
        return this.channelRepository.finishChannelStream(id);
    }

    getOnlineChannels() {
        return this.channelRepository.getOnlineChannels()
    }

    async setChannelOnline(id) { 
        const [channel, user] = await Promise.all([
            this.channelService.getChannelById(id),
            this.userService.findById(id)
        ])
        return this.channelRepository.setChannelToOnline(id, {
            channelName: { S: channel.name },
            avatarUrl: { S: user.avatarUrl }
        })
    }

}