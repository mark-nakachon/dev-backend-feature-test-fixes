import { NestFactory } from '@nestjs/core';
import { get } from 'config';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AllExceptionFilter } from './filter/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: { target: false },
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      skipMissingProperties: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(cors());
  app.use(bodyParser.json({ limit: '2048mb' }));
  app.use(bodyParser.urlencoded({ limit: '2048mb', extended: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(get('PORT'));
}
bootstrap();
