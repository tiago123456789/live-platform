import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationException } from './application.exception';

@Catch(ApplicationException)
export class HandlerException implements ExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response
      .status(exception.getStatusCode())
      .json({
        statusCode: exception.getStatusCode(),
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
  }
}