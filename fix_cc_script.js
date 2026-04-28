const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find Despachante item from March
  const items = await prisma.creditCardItem.findMany({
    where: {
      description: { contains: 'Despachante' }
    },
    orderBy: { purchaseDate: 'desc' },
    take: 5
  });

  console.log('Found items:');
  items.forEach(item => {
    console.log(`- ${item.description}: ${item.installments}x R$ ${item.installmentValue}`);
    console.log(`  Total: R$ ${item.totalAmount}, Paid: ${item.paidInstallments}, ID: ${item.id}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
