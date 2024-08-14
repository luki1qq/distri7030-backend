/*
  Warnings:

  - You are about to drop the column `hasChangedPass` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `hasChangedPass`,
    DROP COLUMN `verified`,
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT false;
