import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { ConfigService } from '@nestjs/config';
import { env } from 'prisma/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  console.log(`Server is running on port ${port}`);
  await app.listen(port);
}
bootstrap()
