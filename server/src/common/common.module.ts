import { Module } from '@nestjs/common';
import { Database } from './database/database';
import { HttpClient } from './http-client/http-client';

@Module({
    imports: [],
    providers: [
        {
            provide: "HttpClientAxios",
            useValue: new HttpClient()
        },
        {
            provide: "Database",
            useValue: new Database()
        },
    ],
    exports: [
        {
            provide: "HttpClientAxios",
            useValue: new HttpClient()
        },
        {
            provide: "Database",
            useValue: new Database()
        }, 
    ]
})
export class CommonModule { }
