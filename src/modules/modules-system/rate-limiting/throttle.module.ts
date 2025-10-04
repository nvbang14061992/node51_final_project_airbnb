import { ExecutionContext, Global, Logger, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  hours,
  minutes,
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: minutes(1),
          limit: 30,
          blockDuration: hours(2),
        },
        {
          name: 'medium',
          ttl: minutes(10),
          limit: 100,
          blockDuration: hours(2),
        },
        {
          name: 'long',
          ttl: hours(2),
          limit: 300,
          blockDuration: hours(2),
        },
      ],
      getTracker: (req: Record<string, any>, context: ExecutionContext) => {
        // override
        // track on company id instead of ip, because one router's IP can be use by multiple company or user in public place like hotel, park
        const companyId = req.headers['x-device-id'];
        const logger = new Logger('IP-tracker');
        logger.log(`Company Id: ${companyId}`);
        return companyId;
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ThrottlerModuleCustom {}
