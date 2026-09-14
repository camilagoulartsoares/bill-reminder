import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const examples = [
    { name: "Academia", amount: 8990, dueDay: 10, category: "Saúde", recurring: true },
    { name: "Faculdade", amount: 50000, dueDay: 10, category: "Educação", recurring: true },
    { name: "Cartão de crédito", amount: 120000, dueDay: 19, category: "Financeiro", recurring: true },
  ];
  for (const bill of examples) {
    const exists = await prisma.bill.findFirst({ where: { name: bill.name, dueDay: bill.dueDay } });
    if (!exists) await prisma.bill.create({ data: bill });
  }
}
main().finally(() => prisma.$disconnect());
