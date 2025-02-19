import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Backend')
    .setDescription('Nest API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors();

  // ✅ Ensure we bind to the correct port
  const port = process.env.PORT || 3000;
  console.log(`🔹 Process ENV PORT: ${process.env.PORT}`);
  console.log(`🚀 Starting server on port ${port}...`);

  try {
    await app.listen(port, '0.0.0.0'); // Ensure app binds to all interfaces
    console.log(`Server running on: http://localhost:${port}/docs`);
  } catch (error) {
    console.error(`Failed to start server:`, error);
  }
}

bootstrap();
