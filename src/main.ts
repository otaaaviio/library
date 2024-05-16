import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || 'localhost';
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}
bootstrap();
