import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HttpClientInterface } from "src/common/http-client/http-client.interface";
import { OAuth2CodeCredentialDto } from "./oauth2-code-credential.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {

    constructor(
        @Inject("HttpClientAxios") private httpClient: HttpClientInterface,
        private readonly userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async authenticate(codeCredential: OAuth2CodeCredentialDto): Promise<{[key: string]: any}> {
        const response = await this.httpClient.post(process.env.OAUTH2_URL_ACCESS_TOKEN,
            {
                client_id: process.env.OAUTH2_CLIENT_ID,
                client_secret: process.env.OAUTH2_CLIENT_SECRET,
                code: codeCredential.code,
                redirect_uri: process.env.OAUTH2_REDIRECT_URI
            },
            { headers: { "accept": "application/json" } }
        );

        const accessToken = response.access_token
        const user = await this.httpClient.get(process.env.API_URL_USER_GITHUB, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const userReturned = await this.userRepository.findByIdAndSecondId(
            user.id,
            "user"
        )

        const isNull = Object.keys(userReturned).length == 0
        if (isNull) {
            await this.userRepository.create(
                user.id,
                "user",
                {
                    email: { S: user.email },
                    username: { S: user.login },
                    avatar_url: { S: user.avatar_url }
                }
            )
        }

        const token = this.jwtService.sign({
            userId: user.id,
            username: user.login
        })

        return {
            accessToken: token,
            username: user.login
        };
    }

    findById(id) {
        return this.userRepository.findByIdAndSecondId(id, "user")
    }
}