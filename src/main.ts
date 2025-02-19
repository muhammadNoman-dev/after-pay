import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Backend')
    .setDescription('Nest')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors();

  // Ensure the app binds to Heroku's provided PORT
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`Swagger Docs available at /docs`);
  console.log(`Application is running on: http://localhost:${port}/docs`);
}

bootstrap();
