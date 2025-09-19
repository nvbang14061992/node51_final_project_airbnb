import { Injectable, Logger } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);

  constructor(private readonly configService: NestConfigService) {
    this.logConfig();
  }

  get port(): number {
    return this.mustGet<number>('PORT');
  }

  get databaseUrl(): string {
    return this.mustGet('DATABASE_URL');
  }

  get domainBe(): string {
    return this.mustGet('DOMAIN_BE');
  }

  get accessTokenSecret(): string {
    return this.mustGet('ACCESS_TOKEN_SECRET');
  }

  get accessTokenExpires(): string {
    return this.mustGet('ACCESS_TOKEN_EXPIRES');
  }

  get refreshTokenSecret(): string {
    return this.mustGet('REFRESH_TOKEN_SECRET');
  }

  get refreshTokenExpires(): string {
    return this.mustGet('REFRESH_TOKEN_EXPIRES');
  }

  private logConfig() {
    this.logger.log(`✅ PORT: ${this.port}`);
    this.logger.log(`✅ DATABASE_URL: ${this.databaseUrl.slice(0, 5)}...`);

    this.logger.log(
      `✅ ACCESS_TOKEN_SECRET: ${this.accessTokenSecret.slice(0, this.accessTokenSecret.length / 2)}...`,
    );
    this.logger.log(`✅ ACCESS_TOKEN_EXPIRES: ${this.accessTokenExpires}`);

    this.logger.log(
      `✅ REFRESH_TOKEN_SECRET: ${this.refreshTokenSecret.slice(0, this.refreshTokenSecret.length / 2)}...`,
    );
    this.logger.log(`✅ REFRESH_TOKEN_EXPIRES: ${this.refreshTokenExpires}`);
  }

  /**
   * Helper method to safely get a required env var.
   * Throws or exits if not found.
   */
  private mustGet<T>(key: string): T {
    const value = this.configService.get<T>(key);

    if (value === null || value === undefined) {
      this.logger.error(`❌ Missing required config: ${key}`);

      // Option 1: throw error to let NestJS crash
      throw new Error(`Missing config: ${key}`);

      // Option 2: exit process immediately (optional if outside bootstrap)
      // process.exit(1);
    }

    return value;
  }
}
