import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService as CustomConfig } from 'src/modules/modules-system/config/config.service';
import { Users } from 'generated/prisma';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';

@Injectable()
export class ProtectStrategy extends PassportStrategy(Strategy, 'protect') {
  constructor(
    private readonly customConfig: CustomConfig,
    private readonly prisma: PrismaService,
  ) {
    const secret = customConfig.accessTokenSecret;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate({ userId }: { userId: Users['id'] }) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      omit: { password: true },
    });

    if (!user) {
      return false;
    }

    return user;
  }
}
