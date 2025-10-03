import { Global, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
})
export class ThrottlerModuleCustom {}
