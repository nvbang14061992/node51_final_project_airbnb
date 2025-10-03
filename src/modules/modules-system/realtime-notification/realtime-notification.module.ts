import { Module } from '@nestjs/common';
import { RealtimeNotificationService } from './realtime-notification.service';
import { RealtimeNotificationGateway } from './realtime-notification.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
      }),
    }),
  ],
  providers: [RealtimeNotificationGateway, RealtimeNotificationService],
  exports: [RealtimeNotificationService],
})
export class RealtimeNotificationModule {}
