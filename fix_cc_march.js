const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the specific item that needs fixing (5 paid, 6 total)
  const item = await prisma.creditCardItem.findUnique({
    where: { id: 'cmndsew4o0021sqxh3mwqezao' }
  });

  console.log('Current state:');
  console.log(`  Installments: ${item.installments}`);
  console.log(`  Paid Installments: ${item.paidInstallments}`);
  console.log(`  Installment Value: R$ ${item.installmentValue}`);
  console.log(`  Total Amount: R$ ${item.totalAmount}`);

  // Calculate new values
  const newInstallments = 4;
  const newPaidInstallments = 4;
  const newTotalAmount = parseFloat((item.installmentValue * newInstallments).toFixed(2));

  console.log('\nNew state:');
  console.log(`  Installments: ${newInstallments}`);
  console.log(`  Paid Installments: ${newPaidInstallments}`);
  console.log(`  Total Amount: R$ ${newTotalAmount}`);

  // Update
  const updated = await prisma.creditCardItem.update({
    where: { id: 'cmndsew4o0021sqxh3mwqezao' },
    data: {
      installments: newInstallments,
      paidInstallments: newPaidInstallments,
      totalAmount: newTotalAmount
    }
  });

  console.log('\n✅ Updated successfully!');
  console.log(`  Installments: ${updated.installments}/${updated.totalAmount / updated.installmentValue}`);
  console.log(`  Paid: ${updated.paidInstallments}/${updated.installments}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
