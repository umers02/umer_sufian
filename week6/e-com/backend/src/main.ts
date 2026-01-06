import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting application...');
    const app = await NestFactory.create(AppModule);
    console.log('NestJS app created successfully');
    
    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    // Global prefix
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 4000;
    console.log(`Attempting to listen on port ${port}...`);
    await app.listen(port);
    
    console.log(`🚀 Ecommerce API is running on: http://localhost:${port}/api`);
  } catch (error) {
    console.error('❌ Error starting application:', error);
    process.exit(1);
  }
}

bootstrap();