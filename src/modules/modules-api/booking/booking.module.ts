import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { RealtimeNotificationModule } from 'src/modules/modules-system/realtime-notification/realtime-notification.module';

@Module({
  imports: [RealtimeNotificationModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
