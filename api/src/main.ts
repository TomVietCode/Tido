import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  
  // Swagger
  const config = new DocumentBuilder()
  .setTitle('TIDO API DOCUMENT')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  
  const port = configService.get('port');
  console.log(`Server is running on port ${port}`);
  await app.listen(port);
}
bootstrap()
