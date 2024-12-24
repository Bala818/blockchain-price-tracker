import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EmailService } from './email.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Blockchain Price Tracker API')
    .setDescription('API documentation for the Blockchain Price Tracker')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Optionally call a test method (remove after testing)
  const emailService = app.get(EmailService);
  await emailService.sendTestEmail(); // Test email configuration

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger is running on: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
