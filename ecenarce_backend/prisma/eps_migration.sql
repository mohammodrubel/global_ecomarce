-- Rename BKASH to EPS on PaymentMethod enum
ALTER TYPE "PaymentMethod" RENAME VALUE 'BKASH' TO 'EPS';

-- Create PaymentStatus enum
DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Add EPS-related columns to orders
ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS "merchantTransactionId" TEXT,
  ADD COLUMN IF NOT EXISTS "epsTransactionId" TEXT,
  ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3);

-- Unique index on merchantTransactionId
CREATE UNIQUE INDEX IF NOT EXISTS "orders_merchantTransactionId_key" ON "orders"("merchantTransactionId");
