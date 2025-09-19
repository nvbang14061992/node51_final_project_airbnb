import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/modules-system/config/config.module';
import { PrismaModule } from './modules/modules-system/prisma/prisma.module';
import { RoomModule } from './modules/modules-api/room/room.module';

@Module({
  imports: [ConfigModule, PrismaModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
