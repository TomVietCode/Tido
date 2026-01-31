import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UploadService {
  private s3Client: S3Client
  private bucket: string

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get('aws.doSpaceEnpoint'),
      region: this.configService.get('aws.doSpaceRegion'),
      credentials: {
        accessKeyId: this.configService.get('aws.doSpaceAccessKey')!,
        secretAccessKey: this.configService.get('aws.doSpaceSecretKey')!,
      },
    })
    this.bucket = this.configService.get('aws.doSpaceBucket')!
  }

  async getPresignedUrl(
    fileName: string,
    contentType: string,
    folder: string = 'uploads',
  ) {
    const key = `${folder}/${fileName}`

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    })
    console.log(fileName, contentType, folder);
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 5,
    })
    console.log('Generated presigned URL:', uploadUrl)  
    const region = this.configService.get('aws.doSpaceRegion')!
    const uploadedUrl = `https://${this.bucket}.${region}.cdn.digitaloceanspaces.com/${key}`

    return { uploadUrl, uploadedUrl }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = fileUrl.split(`${this.bucket}/`)[1]
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })
    await this.s3Client.send(command)
  }
}
