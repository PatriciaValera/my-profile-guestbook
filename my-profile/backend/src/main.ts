import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Allow ALL origins in development (temporary fix)
  app.enableCors({
    origin: true,  // This allows any origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  
  app.setGlobalPrefix('api');
  await app.listen(3000);
  console.log(`Backend running on port 3000`);
}

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