import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { UploadService } from '@/modules/uploads/upload.service'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { GetPresignedUrlDto } from '@/modules/uploads/uploads.dto'
import { ApiOperation } from '@nestjs/swagger'
import { BackendResponse, GetPresignedUrlResponse } from '@/common/interfaces'
import { Public } from '../auth/decorators/public.decorator'

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Get presigned URL' })
  @Public()
  @Post('presigned-url')
  async getPresignedUrl(
    @Body() body: GetPresignedUrlDto,
  ): Promise<BackendResponse<GetPresignedUrlResponse>> {
    const result = await this.uploadService.getPresignedUrl(
      body.fileName,
      body.contentType,
      'images',
    )
    return { statusCode: 200, message: 'Upload ảnh thành công', data: result }
  }
}
