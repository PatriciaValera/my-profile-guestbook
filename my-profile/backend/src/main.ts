import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with proper configuration for local development
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  
  app.setGlobalPrefix('api');
  
  // THIS LINE IS CRITICAL - it actually starts your server!
  await app.listen(3000);
  
  console.log(`Backend running on http://localhost:3000/api/guestbook`);
}

// For local development - KEEP THIS UNCOMMENTED!
bootstrap();

// Export for Vercel Serverless (keep this for deployment)
export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};