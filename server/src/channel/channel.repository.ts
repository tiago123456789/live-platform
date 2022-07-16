import { Inject, Injectable } from "@nestjs/common";
import * as AWS from 'aws-sdk';
import { ChannelDto } from "./dto/channel.dto"
import { DatabaseInterface } from "src/common/database/database.interface";
import { OnlineChannelDto } from "./dto/online-channel.dto";

@Injectable()
export class ChannelRepository {

    constructor(
        @Inject("Database") private database: DatabaseInterface<AWS.DynamoDB>
    ) {

    }

    async findById(id): Promise<ChannelDto | null> {
        const params = {
            TableName: 'live-platform-dev',
            Key: {
                'id': { S: id.toString() },
                'second_id': { S: "channel" }
            }
        };

        // @ts-ignore
        const register = await this.database.newInstance().getItem(params).promise()

        const isNull = Object.keys(register).length == 0;
        if (isNull) {
            return null;
        }

        const channelDto = new ChannelDto();
        channelDto.id = id 
        channelDto.second_id = "channel"
        channelDto.name = register.Item.name.S
        channelDto.description = register.Item.description.S

        return channelDto;
    }

    create(id, register) {
        return this.database.newInstance().putItem({
            TableName: 'live-platform-dev',
            Item: {
                'id': { S: id.toString() },
                'second_id': { S: "channel" },
                ...register
            }
        }).promise();
    }


    async finishChannelStream(id: string) {
        return this.database.newInstance().deleteItem({
            TableName: 'live-platform-dev',
            Key: {
                'id': { S: id.toString() },
                'second_id': { S: "online-channel" },
            }
        }).promise()
    }

    async getOnlineChannels() {
        const params = {
            TableName: 'live-platform-dev',
            FilterExpression: "second_id = :second_id ",
            ExpressionAttributeValues: {
                ":second_id": { S: "online-channel" }
            }
        };

        // @ts-ignore
        const registers = await this.database.newInstance().scan(params).promise()

        const isNull = registers.Items.length == 0
        if (isNull) {
            return null;
        }

        return registers.Items.map(item => {
            const onlineChannelDto = new OnlineChannelDto()
            onlineChannelDto.id = item.id.S;
            onlineChannelDto.avatarUrl = item.avatarUrl.S;
            onlineChannelDto.channelName = item.channelName.S;
            return onlineChannelDto;
        })
    }
 
    setChannelToOnline(id, register) {
        return this.database.newInstance().putItem({
            TableName: 'live-platform-dev',
            Item: {
                'id': { S: id.toString() },
                'second_id': { S: "online-channel" },
                ...register
            }
        }).promise()
    }
}