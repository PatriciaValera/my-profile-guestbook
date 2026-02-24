import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for your Vercel frontend
  app.enableCors({
    origin: ['https://my-profile-guestbook-8xzo.vercel.app', 'https://*.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  
  app.setGlobalPrefix('api');  // ✅ This adds the /api prefix globally
  await app.listen(3000);
  console.log('🚀 Backend running on port 3000');
}

bootstrap();

export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://my-profile-guestbook-8xzo.vercel.app', 'https://*.vercel.app'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};