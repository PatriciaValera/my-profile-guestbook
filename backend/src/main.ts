import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(3000);
}

// Export for Vercel Serverless
export default async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};

// Uncomment for local development
// bootstrap();