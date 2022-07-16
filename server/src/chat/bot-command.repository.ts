import { Inject, Injectable } from "@nestjs/common";
import * as AWS from 'aws-sdk';

import { DatabaseInterface } from "src/common/database/database.interface";
import { BotCommandDto } from "./dto/bot-command.dto";

@Injectable()
export class BotCommandRepository {

    constructor(
        @Inject("Database") private database: DatabaseInterface<AWS.DynamoDB>
    ) {}


    // async findByIdAndSecondId(id, secondId) {
        
    //     const params = {
    //         TableName: 'live-platform-dev',
    //         Key: {
    //             'id': { S: id.toString() },
    //             'second_id': { S: secondId }
    //         }
    //     };

    //     // @ts-ignore
    //     const register = await this.database.newInstance().getItem(params).promise()
    //     const isNull = Object.keys(register).length === 0
    //     if (isNull) {
    //         return null;
    //     }

    //     const user: UserDto = new UserDto();
    //     user.avatarUrl = register.Item.avatar_url.S;
    //     user.email = register.Item.email.S;
    //     user.username = register.Item.username.S;
    //     return user;
    // }


    async remove(id, command) {
        return this.database.newInstance().deleteItem({
            TableName: 'live-platform-dev',
            Key: {
                "id": { S: id },
                "second_id": { S: `bot_command#${command}` }
            }
        }).promise();
    }

    async getCommands(id) {
        const registers = await this.database.newInstance().query({
            TableName: 'live-platform-dev',
            KeyConditionExpression: "id = :id and begins_with(second_id, :second_id)",
            ExpressionAttributeValues: {
                ":id": { S: id },
                ":second_id": { S: "bot_command#" }
            }
        }).promise();

        const isNull = registers.Items.length == 0
        if (isNull) {
            return []
        }

        return registers.Items.map(item => {
            const botCommand: BotCommandDto = new BotCommandDto();
            botCommand.command = item.command.S;
            botCommand.reply = item.reply.S;

            return botCommand;
        })
    }

    create(id, secondId, register) {
        return this.database.newInstance().putItem({
            TableName: 'live-platform-dev',
            Item: {
                'id': { S: id.toString() },
                'second_id': { S: secondId },
                ...register
            }
        }).promise();
    }

}