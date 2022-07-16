import { IsNotEmpty } from "class-validator"

export class DeleteBotCommandDto {
    
    @IsNotEmpty()
    command: string;

}