-- Remove size system (not needed for non-fashion catalog)

-- DropForeignKey
ALTER TABLE "_ProductSizes" DROP CONSTRAINT IF EXISTS "_ProductSizes_A_fkey";
ALTER TABLE "_ProductSizes" DROP CONSTRAINT IF EXISTS "_ProductSizes_B_fkey";

-- DropTable (many-to-many join table)
DROP TABLE IF EXISTS "_ProductSizes";

-- DropTable (sizes lookup table)
DROP TABLE IF EXISTS "sizes";
