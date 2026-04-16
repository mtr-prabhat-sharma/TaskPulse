import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Rajesh Gupta",
        email: "manager1@test.com",
        password: "password123",
        role: "MANAGER",
        phone: "919000000001",
      },
      {
        name: "Anita Sharma",
        email: "manager2@test.com",
        password: "password123",
        role: "MANAGER",
        phone: "919000000002",
      },
      {
        name: "Vikram Patel",
        email: "employee1@test.com",
        password: "password123",
        role: "EMPLOYEE",
        phone: "919000000003",
      },
      {
        name: "Priya Singh",
        email: "employee2@test.com",
        password: "password123",
        role: "EMPLOYEE",
        phone: "919000000004",
      },
      {
        name: "Arjun Mehta",
        email: "employee3@test.com",
        password: "password123",
        role: "EMPLOYEE",
        phone: "919000000005",
      },
    ],
    skipDuplicates: true, 
  });

}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });