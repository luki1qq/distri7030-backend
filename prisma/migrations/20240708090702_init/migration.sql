/*
  Warnings:

  - Made the column `description` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subCategoryId` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `Products_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `Products_subCategoryId_fkey`;

-- AlterTable
ALTER TABLE `products` MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `categoryId` INTEGER NOT NULL,
    MODIFY `subCategoryId` INTEGER NOT NULL,
    MODIFY `image` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `subCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
