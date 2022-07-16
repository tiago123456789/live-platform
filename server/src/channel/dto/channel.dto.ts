import { IsNotEmpty } from 'class-validator';

export class ChannelDto {

    public id: string;
    public second_id: string;
    public name: String;

    @IsNotEmpty()
    public description: String
}