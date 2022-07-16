

export interface HttpClientInterface {

    get(url: string,  headers: { [key: string]: any }): Promise<any>;
    post(url: string, data: { [key: string]: any }, headers: { [key: string]: any });
}