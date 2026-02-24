import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get the frontend URL from environment or use a wildcard for development
  const frontendUrl = process.env.FRONTEND_URL || true;
  
  app.enableCors({
    origin: frontendUrl,  // Allow your specific Codespaces frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  
  app.setGlobalPrefix('api');
  await app.listen(3000);
  console.log(`Backend running on port 3000`);
  console.log(`CORS enabled for: ${frontendUrl === true ? 'all origins' : frontendUrl}`);
}

// UNCOMMENT THIS LINE!
bootstrap();

export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};