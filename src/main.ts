import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseSuccessInterceptor } from './common/interceptors/response-success.interceptor';

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

  app.setGlobalPrefix('api');

  // GLOBAL
  const reflector = app.get(Reflector);
  //INTERCEPTORS
  app.useGlobalInterceptors(new ResponseSuccessInterceptor(reflector));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  const logger = new Logger('Bootstrap');
  await app.listen(port, () => {
    logger.log(`Server is running on http://localhost:${port} 🚀`);
  });
}
bootstrap();
