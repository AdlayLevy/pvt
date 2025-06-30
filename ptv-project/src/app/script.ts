import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const getUsers = await prisma.user.findMany();

  const createUser = await prisma.user.create({
    data: {
      name: "",
      email: "",
      password: "",
      phone: 0,
      isActive: true,
      role: "ADMIN",
      createdAt: "",
      lastLogin: "",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
