import { Injectable } from "@nestjs/common";
import axios from "axios";
import { HttpClientInterface } from "./http-client.interface";

@Injectable()
export class HttpClient implements HttpClientInterface {
    async get(url: string, headers: { [key: string]: any }): Promise<any> {
        const { data } = await axios.get(url, headers);
        return data;
    }

    async post(
        url: string,
        data: { [key: string]: any; }, 
        headers: { [key: string]: any; }
    ) {
        const { data: responseData } = await axios.post(url, data, headers);
        return responseData;
    }

}