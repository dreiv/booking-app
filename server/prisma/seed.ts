import { prisma, pool } from '../src/db';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🧹 Cleaning database...')
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.stay.deleteMany({});

  console.log('📖 Reading stays_romania.json...');
  const filePath = path.join(__dirname, 'stays_romania.json');
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const stays = JSON.parse(fileData);

  console.log(`🌱 Seeding ${stays.length} properties...`);
  let count = 0;
  for (const stayData of stays) {
    await prisma.stay.create({ data: stayData });
    count++;
    if (count % 50 === 0) {
      console.log(`⏳ Seeded ${count} properties...`);
    }
  }

  console.log(`✅ Successfully seeded ${stays.length} stays!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool?.end();
  });
