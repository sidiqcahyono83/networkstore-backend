/*
  Warnings:

  - You are about to drop the column `productId` on the `ShoppingCartItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShoppingCartItem" DROP CONSTRAINT "ShoppingCartItem_productId_fkey";

-- AlterTable
ALTER TABLE "ShoppingCartItem" DROP COLUMN "productId";
