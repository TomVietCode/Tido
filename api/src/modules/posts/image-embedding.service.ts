import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@src/database/prisma/prisma.service'
import { AzureVisionService } from '@modules/azure-vision/azure-vision.service'
import { toSql } from 'pgvector'
import { PostType } from '@common/enums'

@Injectable()
export class ImageEmbeddingService {
  private readonly logger = new Logger(ImageEmbeddingService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly azureVision: AzureVisionService,
  ) {}

  /**
   * Create embeddings for all images of a post.
   * Run after the post has been created successfully.
   */
  async createEmbeddingsForPost(postId: string, imageUrls: string[]) {
    const results = await Promise.allSettled(
      imageUrls.map((url) => this.createSingleEmbedding(postId, url)),
    )

    const failed = results.filter((r) => r.status === 'rejected')
    if (failed.length > 0) {
      this.logger.warn(
        `${failed.length}/${imageUrls.length} embeddings failed for post ${postId}`,
      )
    }
  }

  /**
   * Create embedding for a single image and save it to the database.
   */
  private async createSingleEmbedding(postId: string, imageUrl: string) {
    const vector = await this.azureVision.getImageEmbedding(imageUrl)
    const vectorSql = toSql(vector)

    await this.prisma.$executeRawUnsafe(
      `INSERT INTO post_image_embeddings (id, post_id, image_url, embedding, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3::vector, NOW())`,
      postId,
      imageUrl,
      vectorSql,
    )
  }

  /**
   * Delete all embeddings of a post.
   * Called when the post is deleted or updated.
   */
  async deleteEmbeddingsForPost(postId: string) {
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM post_image_embeddings WHERE post_id = $1`,
      postId,
    )
  }

  /**
   * Search similar posts by image.
   *
   * @param queryVector - vector embedding of the query image (1024 dimensions)
   * @param limit - maximum number of results (default 10)
   * @param threshold - maximum cosine distance threshold (default 0.2, the smaller the more similar)
   * @returns list of post_id + distance, sorted by similarity
   */
  async searchSimilarPosts(
    queryVector: number[],
    limit: number = 10,
    threshold: number = 0.2,
    postType: PostType = PostType.LOST,
    currentUserId?: string,
  ): Promise<{ postId: string; distance: number; imageUrl: string }[]> {
    const vectorSql = toSql(queryVector)

    // Cosine distance: <=> returns a value in [0, 2]
    //   0 = completely similar
    //   1 = not similar
    //   2 = completely different
    const results = await this.prisma.$queryRawUnsafe<
      { post_id: string; distance: number; image_url: string }[]
    >(
      `SELECT x.post_id, x.image_url, x.distance
       FROM (
         SELECT DISTINCT ON (e.post_id)
                e.post_id,
                e.image_url,
                e.embedding <=> $1::vector AS distance
         FROM post_image_embeddings e
         INNER JOIN posts p ON p.id = e.post_id
         WHERE p.status = 'OPEN'
           AND p.type = $4
           AND ($2::uuid IS NULL OR p.user_id <> $2::uuid)
           AND (e.embedding <=> $1::vector) < $3
         ORDER BY e.post_id, distance ASC
       ) x
       ORDER BY x.distance ASC
       LIMIT $5`,
      vectorSql,
      currentUserId ?? null,
      threshold,
      postType,
      limit,
    )

    // Sort by distance (DISTINCT ON has grouped by post_id)
    results.sort((a, b) => a.distance - b.distance)

    return results.slice(0, limit).map((r) => ({
      postId: r.post_id,
      distance: Number(r.distance),
      imageUrl: r.image_url,
    }))
  }
}
