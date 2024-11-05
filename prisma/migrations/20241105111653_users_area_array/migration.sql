/*
  Warnings:

  - You are about to drop the column `areaId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `modemId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_areaId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_modemId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `areaId`,
    DROP COLUMN `modemId`;

-- CreateTable
CREATE TABLE `_AreaToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AreaToUser_AB_unique`(`A`, `B`),
    INDEX `_AreaToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ModemToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ModemToUser_AB_unique`(`A`, `B`),
    INDEX `_ModemToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AreaToUser` ADD CONSTRAINT `_AreaToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Area`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AreaToUser` ADD CONSTRAINT `_AreaToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ModemToUser` ADD CONSTRAINT `_ModemToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Modem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ModemToUser` ADD CONSTRAINT `_ModemToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
