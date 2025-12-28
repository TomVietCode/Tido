import { Module } from '@nestjs/common';
import { UploadService } from '@/modules/uploads/upload.service';
import { UploadController } from '@/modules/uploads/upload.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule {}
