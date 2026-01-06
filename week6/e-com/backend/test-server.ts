import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
class TestModule {}

async function bootstrap() {
  try {
    console.log('Creating minimal NestJS app...');
    const app = await NestFactory.create(TestModule);
    
    const port = 4000;
    console.log(`Starting server on port ${port}...`);
    await app.listen(port);
    
    console.log(`🚀 Test server running on: http://localhost:${port}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

bootstrap();