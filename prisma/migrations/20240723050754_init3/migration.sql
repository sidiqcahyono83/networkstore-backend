/*
  Warnings:

  - You are about to drop the column `userId` on the `ShoppingCart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `ShoppingCart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `ShoppingCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_userId_fkey";

-- DropIndex
DROP INDEX "ShoppingCart_userId_key";

-- AlterTable
ALTER TABLE "ShoppingCart" DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_username_key" ON "ShoppingCart"("username");

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
