/*
  Warnings:

  - You are about to drop the column `image_url` on the `books` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "image_url";

-- CreateTable
CREATE TABLE "book_images" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "book_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "book_images" ADD CONSTRAINT "book_images_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
