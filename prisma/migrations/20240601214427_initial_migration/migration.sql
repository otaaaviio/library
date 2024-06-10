-- CreateTable
CREATE TABLE "user_books" (
    "book_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_books_pkey" PRIMARY KEY ("user_id","book_id")
);

-- AddForeignKey
ALTER TABLE "user_books" ADD CONSTRAINT "user_books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_books" ADD CONSTRAINT "user_books_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
