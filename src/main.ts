import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // app.enableCors({
  //   allowedHeaders: '*',
  //   origin: '*',
  // });

  // app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(
          result?.[0]?.message || 'Something went wrong!',
        );
      },
      stopAtFirstError: true,
    }),
  );

  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(process.env.PORT);
}

bootstrap();
