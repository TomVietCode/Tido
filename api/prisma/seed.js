require('dotenv/config')

const bcrypt = require('bcrypt')
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient, Provider, Role, UserStatus } = require('./generated/prisma/client')

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD
const ADMIN_FULL_NAME = process.env.SEED_ADMIN_FULL_NAME || 'Tido Admin'

function generateAvatarUrl(fullName) {
  const encodedName = encodeURIComponent(fullName.trim().replace(/\s+/g, ' '))
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&size=100`
}

async function main() {
  const connectionString = process.env.POSTGRES_URL

  if (!connectionString) {
    throw new Error('Missing POSTGRES_URL environment variable')
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD environment variable',
    )
  }

  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })

  try {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

    const adminUser = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        fullName: ADMIN_FULL_NAME,
        password: hashedPassword,
        role: Role.ADMIN,
        provider: Provider.LOCAL,
        status: UserStatus.ACTIVE,
        googleId: null,
        avatarUrl: generateAvatarUrl(ADMIN_FULL_NAME),
      },
      create: {
        email: ADMIN_EMAIL,
        fullName: ADMIN_FULL_NAME,
        password: hashedPassword,
        role: Role.ADMIN,
        provider: Provider.LOCAL,
        status: UserStatus.ACTIVE,
        avatarUrl: generateAvatarUrl(ADMIN_FULL_NAME),
      },
    })

    console.log(`Admin user is ready: ${adminUser.email}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('Failed to seed admin user')
  console.error(error)
  process.exit(1)
})