import { prisma, pool } from '../src/db';

async function main() {
  console.log('🧹 Cleaning database...')
  await prisma.review.deleteMany({})
  await prisma.stay.deleteMany({})

  console.log('🌱 Seeding database...')
  const stay1 = await prisma.stay.create({
    data: {
      name: 'Transylvania Castle',
      location: 'Bran, Romania',
      price: 450.5,
      description: 'A historic stay with a spooky vibe and great views.',
      reviews: {
        create: [
          { comment: 'Amazing atmosphere, but a bit chilly at night.', rating: 5 },
          { comment: 'I did not see any ghosts, 4/5.', rating: 4 }
        ]
      }
    }
  })

  const stay2 = await prisma.stay.create({
    data: {
      name: 'Azure Villa',
      location: 'Santorini, Greece',
      price: 890.0,
      description: 'Luxury villa with a private pool and sunset views.',
    }
  })

  console.log(`✅ Seeded ${stay1.name} and ${stay2.name}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
