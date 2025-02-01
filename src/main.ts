/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const GLOBAL_PREFIX = 'api/v1' as const;
    app.setGlobalPrefix(GLOBAL_PREFIX);

    const apiDocsConfig = new DocumentBuilder()
        .setTitle('Receipt Processor')
        .setDescription('A simple receipt processor')
        .setVersion('1.0.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, apiDocsConfig);
    SwaggerModule.setup(`${GLOBAL_PREFIX}/docs`, app, documentFactory);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    const port = +process.env.PORT || 4000;
    await app.listen(port);

    Logger.log(`Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`);
}

bootstrap();
