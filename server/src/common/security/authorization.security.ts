import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { Observable } from "rxjs";

@Injectable()
export class AuthorizationSecurity implements NestInterceptor {

    constructor(
        private jwtService: JwtService
    ) {

    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request: Request = ctx.getRequest();
        const response: Response  = ctx.getResponse();

        let accessToken = request.headers.authorization

        if (!accessToken) {
            response.status(403).json({
                statusCode: 403,
                message: "Token invalid",
                timestamp: new Date()
            })
            return;
        }

        accessToken = accessToken.replace("Bearer ", "")

        try {
            const data = this.jwtService.verify(accessToken);
            // @ts-ignore
            request.userId = data.userId;
            // @ts-ignore
            request.username = data.username;

            return next.handle()
        } catch(error) {
            response.status(403).json({
                statusCode: 403,
                message: "Token invalid",
                timestamp: new Date()
            })
        }
        
    }
    
}