import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {ErrorHandlerMiddleware} from "./middlewares/errorHandler.middleware";

async function bootstrap() {
    const PORT = Number(process.env.PORT) || 3000;
    const HOST = process.env.HOST || 'localhost';
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.useGlobalFilters(new ErrorHandlerMiddleware());
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => {
        console.log(`Server is running on http://${HOST}:${PORT}`);
    });
}

bootstrap();
