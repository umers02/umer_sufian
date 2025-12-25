import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }));
  
  await app.listen(process.env.PORT || 8000);
  console.log(`Reviews service running on port ${process.env.PORT || 8000}`);
}
bootstrap();