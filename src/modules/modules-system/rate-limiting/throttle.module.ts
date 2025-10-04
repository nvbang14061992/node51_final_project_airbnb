import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { hours, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: hours(2),
          limit: 200,
        },
      ],
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
