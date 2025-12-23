import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
     origin: [
      'http://localhost:3000',               // local frontend
      'https://real-time-comments-frontend.vercel.app',    // production frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  });

  await app.listen(3001);
  console.log('🚀 Comment System Backend running on http://localhost:3001');
}
bootstrap();