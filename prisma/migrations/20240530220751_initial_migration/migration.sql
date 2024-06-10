/*
  Warnings:

  - You are about to drop the column `url` on the `book_images` table. All the data in the column will be lost.
  - Added the required column `image_path` to the `book_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "book_images" DROP COLUMN "url",
ADD COLUMN     "image_path" TEXT NOT NULL;
