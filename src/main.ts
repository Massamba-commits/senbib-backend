import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // CORS pour le frontend
  app.enableCors({ origin: 'http://localhost:5173' });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('SENBibliothèque API')
    .setDescription('API REST pour la gestion de la bibliothèque')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 API running on http://localhost:3000');
  console.log('📚 Swagger: http://localhost:3000/api/docs');
}
bootstrap();