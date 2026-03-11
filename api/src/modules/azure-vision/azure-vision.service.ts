import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AzureVisionService {
  private readonly logger = new Logger(AzureVisionService.name)
  private readonly endpoint: string
  private readonly apiKey: string
  private readonly apiVersion: string

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.getOrThrow<string>('azureVision.endpoint')
    this.apiKey = this.configService.getOrThrow<string>('azureVision.apiKey')
    this.apiVersion = this.configService.getOrThrow<string>('azureVision.apiVersion')
  }

  /**
   * Send image URL to Azure Computer Vision to get vector embedding (1024 dimensions).
   * Using Image Retrieval API (Vectorize Image).
   *
   * @param imageUrl - Public URL of the image to vectorize
   * @returns number[] - array of 1024 elements (float)
   */
  async getImageEmbedding(imageUrl: string): Promise<number[]> {
    const url = `${this.endpoint}/computervision/retrieval:vectorizeImage`
      + `?api-version=${this.apiVersion}`
      + `&model-version=2023-04-15`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.apiKey,
      },
      body: JSON.stringify({ url: imageUrl }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      this.logger.error(
        `Azure Vision API error: ${response.status} - ${errorBody}`,
      )
      throw new Error(`Azure Vision API failed with status ${response.status}`)
    }

    const data = await response.json()

    // Response format: { modelVersion: "...", vector: [0.123, -0.456, ...] }
    return data.vector as number[]
  }

  /**
   * Send image buffer to Azure Computer Vision to get vector embedding (1024 dimensions).
   * Used when user uploads image directly (search by image).
   *
   * @param imageBuffer - Buffer containing image data (JPEG/PNG)
   * @returns number[] - array of 1024 elements (float)
   */
  async getImageEmbeddingFromBuffer(imageBuffer: Buffer): Promise<number[]> {
    const url = `${this.endpoint}/computervision/retrieval:vectorizeImage`
      + `?api-version=${this.apiVersion}`
      + `&model-version=2023-04-15`
    const requestBody = Uint8Array.from(imageBuffer).buffer

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key': this.apiKey,
      },
      body: requestBody,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      this.logger.error(
        `Azure Vision API error: ${response.status} - ${errorBody}`,
      )
      throw new Error(`Azure Vision API failed with status ${response.status}`)
    }

    const data = await response.json()
    return data.vector as number[]
  }
}