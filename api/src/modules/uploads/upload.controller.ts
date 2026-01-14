import { Body, Controller, Post } from '@nestjs/common'
import { UploadService } from '@modules/uploads/upload.service'
import { GetPresignedUrlDto } from '@modules/uploads/uploads.dto'
import { ApiOperation } from '@nestjs/swagger'
import { BackendResponse, GetPresignedUrlResponse } from '@src/common/interfaces'
import { Public } from '@modules/auth/decorators/public.decorator'

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
