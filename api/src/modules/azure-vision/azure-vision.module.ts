import { Module } from '@nestjs/common';
import { AzureVisionService } from './azure-vision.service';
import { AzureVisionController } from './azure-vision.controller';

@Module({
  controllers: [AzureVisionController],
  providers: [AzureVisionService],
  exports: [AzureVisionService],
})
export class AzureVisionModule {}
