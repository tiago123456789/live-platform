import { Inject, Injectable } from "@nestjs/common";
import * as AWS from 'aws-sdk';

import { DatabaseInterface } from "src/common/database/database.interface";
import { UserDto } from "./dtos/user.dto";

@Injectable()
export class UserRepository {

    constructor(
        @Inject("Database") private database: DatabaseInterface<AWS.DynamoDB>
    ) {

    }

    async findByIdAndSecondId(id, secondId) {
        
        const params = {
            TableName: 'live-platform-dev',
            Key: {
                'id': { S: id.toString() },
                'second_id': { S: secondId }
            }
        };

        // @ts-ignore
        const register = await this.database.newInstance().getItem(params).promise()
        const isNull = Object.keys(register).length === 0
        if (isNull) {
            return null;
        }

        const user: UserDto = new UserDto();
        user.avatarUrl = register.Item.avatar_url.S;
        user.email = register.Item.email.S;
        user.username = register.Item.username.S;
        return user;
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