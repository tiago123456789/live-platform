import { Body, Controller, Post } from "@nestjs/common";
import { OAuth2CodeCredentialDto } from "./oauth2-code-credential.dto";
import { UserService } from "./user.service";

@Controller("/users")
export class UserController {

    constructor(private userService: UserService) {}

    @Post("/oauthcallback")
    async oauthCallback(@Body() codeCredential: OAuth2CodeCredentialDto): Promise<any> {
        const data = this.userService.authenticate(codeCredential);
        return data
    }
}