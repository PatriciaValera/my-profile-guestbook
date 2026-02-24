import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Get the frontend URL from environment or use wildcard for development
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Enable CORS - critical for frontend to connect
  app.enableCors({
    origin: isDevelopment 
      ? ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://*.vercel.app']
      : ['https://personal-website-finals-theta.vercel.app', 'https://*.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  
  app.setGlobalPrefix('api');
  
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Backend running on http://localhost:${port}/api/guestbook`);
  console.log(`🔓 CORS enabled for: ${isDevelopment ? 'development origins' : 'production origins'}`);
}

// IMPORTANT: This MUST be uncommented for local development!
bootstrap();

// Export for Vercel Serverless (keep this for deployment)
export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  
  // Get the config service to access env vars
  const configService = app.get(ConfigService);
  
  app.enableCors({
    origin: ['https://personal-website-finals-theta.vercel.app', 'https://*.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  
  app.setGlobalPrefix('api');
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};