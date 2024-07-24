/*
  Warnings:

  - You are about to drop the column `shoppingCartItemId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `ShoppingCart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_shoppingCartItemId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_username_fkey";

-- DropIndex
DROP INDEX "ShoppingCart_username_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "shoppingCartItemId";

-- AlterTable
ALTER TABLE "ShoppingCart" DROP COLUMN "username",
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "totalPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ShoppingCartItem" ADD COLUMN     "productId" TEXT;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCartItem" ADD CONSTRAINT "ShoppingCartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
