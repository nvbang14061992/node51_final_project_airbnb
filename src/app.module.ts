import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/modules-system/config/config.module';
import { PrismaModule } from './modules/modules-system/prisma/prisma.module';
import { RoomModule } from './modules/modules-api/room/room.module';
import { AuthModule } from './modules/modules-api/auth/auth.module';
import { TokenModule } from './modules/modules-system/token/token.module';
import { ProtectStrategy } from './common/guard/protect/protect.strategy';
import { CommentModule } from './modules/modules-api/comment/comment.module';

@Module({
  imports: [ConfigModule, PrismaModule, RoomModule, AuthModule, TokenModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, ProtectStrategy],
})
export class AppModule {}
