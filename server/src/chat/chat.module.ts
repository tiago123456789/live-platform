import { CacheModule, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { BotCommandController } from './bot-command.controller';
import { BotCommandRepository } from './bot-command.repository';
import { BotCommandService } from './bot-command.service';
import { ChatListener } from './chat.listener';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [CommonModule, CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: 6379,
    ttl: 86400
  }),],
  controllers: [BotCommandController],
  providers: [ChatListener, BotCommandRepository, BotCommandService],
  exports: [BotCommandService]
})
export class ChatModule {}
