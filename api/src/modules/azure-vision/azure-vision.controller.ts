import { Controller } from '@nestjs/common';
import { AzureVisionService } from './azure-vision.service';

@Controller('azure-vision')
export class AzureVisionController {
  constructor(private readonly azureVisionService: AzureVisionService) {}
}
