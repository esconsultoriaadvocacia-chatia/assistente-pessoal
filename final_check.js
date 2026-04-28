const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finalCheck() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    // Count items by month
    const march = await prisma.creditCardItem.count({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-03-01'),
          lt: new Date('2026-04-01')
        }
      }
    });

    const april = await prisma.creditCardItem.count({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-04-01'),
          lt: new Date('2026-05-01')
        }
      }
    });

    const may = await prisma.creditCardItem.count({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-05-01'),
          lt: new Date('2026-06-01')
        }
      }
    });

    const june = await prisma.creditCardItem.count({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-06-01'),
          lt: new Date('2026-07-01')
        }
      }
    });

    console.log(`\n✅ VERIFICAÇÃO FINAL DE DADOS:\n`);
    console.log(`Março 2026: ${march} itens`);
    console.log(`Abril 2026: ${april} itens`);
    console.log(`Maio 2026: ${may} itens`);
    console.log(`Junho 2026: ${june} itens`);
    console.log(`\n📊 Total de itens: ${march + april + may + june}`);
    
    if (april === 0) {
      console.log(`\n✅ SUCESSO: Nenhum item em Abril!`);
    }

    if (march === 43) {
      console.log(`✅ SUCESSO: Todos os 43 itens estão em Março (11 originais + 32 movidos)!`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

finalCheck();
