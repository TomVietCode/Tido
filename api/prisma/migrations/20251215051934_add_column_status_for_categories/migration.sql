-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE';
