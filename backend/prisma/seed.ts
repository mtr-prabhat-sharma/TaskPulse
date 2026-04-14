import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Manager One",
        email: "manager1@test.com",
        password: "password123",
        role: "MANAGER"
      },
      {
        name: "Employee One",
        email: "employee1@test.com",
        password: "password123",
        role: "EMPLOYEE"
      }
    ],
  });

  console.log("✅ Users seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });