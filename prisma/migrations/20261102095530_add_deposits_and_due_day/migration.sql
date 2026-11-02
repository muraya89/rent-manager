/*
  Warnings:

  - You are about to alter the column `monthlyRent` on the `lease` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE `lease` ADD COLUMN `rentDueDay` INTEGER NOT NULL DEFAULT 1,
    MODIFY `monthlyRent` DECIMAL(12, 2) NOT NULL;

-- CreateIndex
CREATE INDEX `Lease_unitId_status_idx` ON `Lease`(`unitId`, `status`);

-- CreateIndex
CREATE INDEX `Lease_tenantId_status_idx` ON `Lease`(`tenantId`, `status`);
