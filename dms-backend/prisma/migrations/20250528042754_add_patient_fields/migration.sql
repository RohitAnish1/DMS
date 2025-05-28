-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "profilePhoto" TEXT,
ALTER COLUMN "medicalRegistrationNumber" DROP NOT NULL;
