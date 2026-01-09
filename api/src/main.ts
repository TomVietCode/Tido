import { NestFactory } from '@nestjs/core'
import { AppModule } from '@src/app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { TransformInterceptor } from '@common/interceptors/transform.interceptor'
import { HttpExceptionFilter } from '@common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
  
  // Swagger
  const config = new DocumentBuilder().setTitle('TIDO API DOCUMENT').build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, documentFactory)

  const port = configService.get('port')
  console.log(`Server is running on port ${port}`)
  await app.listen(port)
}
bootstrap()
