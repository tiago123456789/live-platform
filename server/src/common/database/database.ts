import * as AWS from 'aws-sdk';
import { DatabaseInterface } from './database.interface';

AWS.config.update({region: 'us-east-1'});

const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;

export class Database implements DatabaseInterface<AWS.DynamoDB> {

    newInstance(): AWS.DynamoDB {
        return new AWS.DynamoDB({apiVersion: '2012-08-10'});
    }

}