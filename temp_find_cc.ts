import { prisma } from '@/lib/prisma';

async function findCC() {
  const items = await prisma.creditCardItem.findMany({
    where: {
      description: { contains: 'Ren' },
      purchaseDate: {
        gte: new Date('2026-03-01'),
        lt: new Date('2026-04-01')
      }
    },
    take: 5
  });
  console.log(JSON.stringify(items, null, 2));
}

findCC().catch(console.error);
