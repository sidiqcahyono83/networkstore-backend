-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "shoppingCartItemId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shoppingCartItemId_fkey" FOREIGN KEY ("shoppingCartItemId") REFERENCES "ShoppingCartItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
