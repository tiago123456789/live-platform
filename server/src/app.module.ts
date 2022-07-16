import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { UseModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    ChatModule,
    UseModule,
    ChannelModule
  ],
})
export class AppModule {}
