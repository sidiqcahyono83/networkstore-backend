-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "shoppingCartId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shoppingCartId_fkey" FOREIGN KEY ("shoppingCartId") REFERENCES "ShoppingCart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
