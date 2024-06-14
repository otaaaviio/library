import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ErrorPrismaHandlerMiddleware } from './middlewares/errorPrismaHandlerMiddleware';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || 'localhost';
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalFilters(new ErrorPrismaHandlerMiddleware());
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
}

bootstrap();
