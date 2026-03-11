-- CreateTable
CREATE TABLE "post_image_embeddings" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "embedding" vector(1024),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_image_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: 
CREATE INDEX "post_image_embeddings_embedding_idx"
ON "post_image_embeddings"
USING hnsw ("embedding" vector_cosine_ops);

-- AddForeignKey
ALTER TABLE "post_image_embeddings"
ADD CONSTRAINT "post_image_embeddings_post_id_fkey"
FOREIGN KEY ("post_id") REFERENCES "posts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;