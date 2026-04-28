const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listMarchItems() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    // Get all items in March
    const items = await prisma.creditCardItem.findMany({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-03-01'),
          lt: new Date('2026-04-01')
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`\n📋 TOTAL DE ITENS EM MARÇO: ${items.length}\n`);
    console.log('═'.repeat(80));
    
    items.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.description}`);
      console.log(`   Valor: R$ ${item.installmentValue.toFixed(2)}`);
      console.log(`   Parcelas: ${item.paidInstallments}/${item.installments}`);
      console.log(`   Categoria: ${item.category} | Utilidade: ${item.utility}`);
      console.log('');
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

listMarchItems();
