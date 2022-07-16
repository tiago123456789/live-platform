import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CommonModule } from 'src/common/common.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    CommonModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get("JWT_SECRET")
        };
      },
      inject: [ConfigService]
    })
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UseModule {}
