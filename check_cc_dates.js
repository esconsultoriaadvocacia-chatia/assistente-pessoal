const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDates() {
  const user = await prisma.user.findUnique({
    where: { email: 'dossan.7.santos@gmail.com' }
  });

  const items = await prisma.creditCardItem.findMany({
    where: {
      userId: user.id,
      description: {
        in: [
          'Ren*J D Despachante',
          'Zp *Ks Bitencourt',
          'Jusbrasil'
        ]
      }
    },
    select: {
      description: true,
      purchaseDate: true,
      paidInstallments: true,
      installments: true,
      installmentValue: true
    }
  });

  console.log(`\n📅 Datas dos itens inseridos:\n`);
  items.forEach((item) => {
    const date = new Date(item.purchaseDate);
    const dateStr = date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    console.log(`${item.description} | ${dateStr} | ${item.paidInstallments}/${item.installments} | R$ ${item.installmentValue.toFixed(2)}`);
  });

  await prisma.$disconnect();
}

checkDates();
