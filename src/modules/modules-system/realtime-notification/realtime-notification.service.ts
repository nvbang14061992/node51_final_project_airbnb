import { Injectable } from '@nestjs/common';
import { RealtimeNotificationGateway } from './realtime-notification.gateway';

@Injectable()
export class RealtimeNotificationService {
  constructor(private gateway: RealtimeNotificationGateway) {}

  async notifyBookingSuccess(hostId: string, message: string) {
    const payload = {
      type: 'BOOKING_SUCCESS',
      message,
      timestamp: new Date().toISOString(),
    };

    this.gateway.sendToHostRoom(hostId, payload);
    return true;
  }
}
