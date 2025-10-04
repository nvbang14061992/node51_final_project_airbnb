import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { RealtimeNotificationModule } from 'src/modules/modules-system/realtime-notification/realtime-notification.module';
import { RealtimeNotificationService } from 'src/modules/modules-system/realtime-notification/realtime-notification.service';
import { NotificationModule } from '../notification/notification.module';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [RealtimeNotificationModule, NotificationModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
