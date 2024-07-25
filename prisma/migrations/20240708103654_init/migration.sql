/*
  Warnings:

  - You are about to drop the column `name` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `subcategory` table. All the data in the column will be lost.
  - Made the column `description` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `subcategory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `category` DROP COLUMN `name`,
    MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subcategory` DROP COLUMN `name`,
    MODIFY `description` VARCHAR(191) NOT NULL;
