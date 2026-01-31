import { Body, Controller, Post } from '@nestjs/common'
import { UploadService } from '@modules/uploads/upload.service'
import { GetPresignedUrlDto } from '@modules/uploads/uploads.dto'
import { ApiOperation } from '@nestjs/swagger'
import {
  BackendResponse,
  GetPresignedUrlResponse,
} from '@src/common/interfaces'
import { Public } from '@modules/auth/decorators/public.decorator'

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Get presigned URL' })
  @Public()
  @Post('presigned-url')
  async getPresignedUrl(
    @Body() body: GetPresignedUrlDto,
  ): Promise<GetPresignedUrlResponse>{
    const result = await this.uploadService.getPresignedUrl(
      body.fileName,
      body.contentType,
      'images',
    )
    return result
  }
}
