/*
  Warnings:

  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_userId_fkey";

-- DropTable
DROP TABLE "patients";

-- CreateTable
CREATE TABLE "doctor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "image" TEXT,
    "phone" VARCHAR(20),
    "address" TEXT,
    "registrationNumber" VARCHAR(50) NOT NULL,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "gender" "Gender" NOT NULL,
    "appointmentFee" DOUBLE PRECISION NOT NULL,
    "qualification" TEXT NOT NULL,
    "currentWorkingPlace" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "image" TEXT,
    "phone" VARCHAR(20),
    "address" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specialities" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specialityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_specialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_doctor_isDeleted" ON "doctor"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_registrationNumber_key" ON "doctor"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_email_key" ON "doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_userId_key" ON "doctor"("userId");

-- CreateIndex
CREATE INDEX "idx_patient_isDeleted" ON "patient"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patient_userId_key" ON "patient"("userId");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_doctor_id" ON "doctor_specialities"("doctorId");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_speciality_id" ON "doctor_specialities"("specialityId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_specialities_doctorId_specialityId_key" ON "doctor_specialities"("doctorId", "specialityId");

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
