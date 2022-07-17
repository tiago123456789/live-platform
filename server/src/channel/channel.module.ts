import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { CommonModule } from 'src/common/common.module';
import { ChannelRepository } from './channel.repository';
import { ChannelService } from './services/channel.service';
import { ChannelController } from './controllers/channel.controller';
import * as redisStore from 'cache-manager-redis-store';
import { OnlineChannelController } from './controllers/online-channel.controller';
import { UseModule } from 'src/user/user.module';
import { OnlineChannelService } from './services/online-channel.service';
import { ChatModule } from 'src/chat/chat.module';
import { StreamListener } from './stream.listener';

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
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 86400
    }),
    UseModule,
    ChatModule
  ],
  controllers: [ChannelController, OnlineChannelController],
  providers: [StreamListener, ChannelRepository, ChannelService, OnlineChannelService],
})
export class ChannelModule { }
