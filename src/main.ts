import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseSuccessInterceptor } from './common/interceptors/response-success.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ProtectGuard } from './common/guard/protect/protect.guard';
import { ExcludeFieldsInterceptor } from './common/interceptors/exclusiveFields.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SWAGGER
  // init
  const config = new DocumentBuilder()
    .setTitle('Cyber Comuunity API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: { persistAuthorization: true },
  });

  // GLOBAL
  const reflector = app.get(Reflector);
  app.setGlobalPrefix('api');
  // PIPE
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true, // ✅ strips properties that are not in the DTO
      forbidNonWhitelisted: true, // ✅ throws an error if unknown properties are present
    }),
  );
  //INTERCEPTORS
  app.useGlobalInterceptors(new ResponseSuccessInterceptor(reflector));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ExcludeFieldsInterceptor(reflector));

  // GUARD
  app.useGlobalGuards(new ProtectGuard(reflector));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  const logger = new Logger('Bootstrap');
  await app.listen(port, () => {
    logger.log(`Server is running on http://localhost:${port} 🚀`);
  });
}
bootstrap();
