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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { FileValidationModule } from './modules/modules-system/file-validation/file-validation.module';
import { UsersModule } from './modules/modules-api/users/users.module';
import { LocationModule } from './modules/modules-api/location/location.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    RoomModule,
    AuthModule,
    TokenModule,
    CommentModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    FileValidationModule,
    UsersModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProtectStrategy],
})
export class AppModule {
  constructor() {
    const roomImagePath = join(__dirname, '..', 'public', 'roomImage');
    const userAvatarPath = join(__dirname, '..', 'public', 'userAvatar');
    if (!existsSync(roomImagePath)) {
      mkdirSync(roomImagePath, { recursive: true });
    }
    if (!existsSync(userAvatarPath)) {
      mkdirSync(userAvatarPath, { recursive: true });
    }
  }
}
