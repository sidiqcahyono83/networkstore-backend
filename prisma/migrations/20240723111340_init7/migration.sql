/*
  Warnings:

  - You are about to drop the column `shoppingCartId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_shoppingCartId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "shoppingCartId";
