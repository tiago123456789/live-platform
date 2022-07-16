import { IsNotEmpty } from "class-validator"

export class BotCommandDto {
    
    @IsNotEmpty()
    command: string;

    @IsNotEmpty()
    reply: string
}