import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

export async function createTestApp() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  return app;
}
