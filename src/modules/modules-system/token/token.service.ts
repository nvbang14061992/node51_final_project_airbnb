import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService as CustomConfig } from '../config/config.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private readonly CustomConfig: CustomConfig,
  ) {}
  createTokens(userId) {
    const accessToken = this.jwtService.sign(
      { userId: userId },
      {
        secret: this.CustomConfig.accessTokenSecret,
        expiresIn: this.CustomConfig.accessTokenExpires,
      },
    );

    const refeshToken = this.jwtService.sign(
      { userId: userId },
      {
        secret: this.CustomConfig.refreshTokenSecret,
        expiresIn: this.CustomConfig.refreshTokenExpires,
      },
    );

    return {
      accessToken: accessToken,
      refreshToken: refeshToken,
    };
  }

  verifyAccessToken(accessToken, option) {
    const decoded = this.jwtService.verify(accessToken, {
      ...option,
      secret: this.CustomConfig.accessTokenSecret,
    });
    return decoded;
  }

  verifyRefreshToken(refeshToken) {
    const decoded = this.jwtService.verify(refeshToken, {
      secret: this.CustomConfig.refreshTokenSecret,
    });
    return decoded;
  }
}
