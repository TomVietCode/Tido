import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('database.postgres.url')
    if (!connectionString) {
      throw new Error('Database connection string is not configured')
    }
    const adapter = new PrismaPg({ connectionString })
    super({ adapter })
  }
  async onModuleInit() {
    try {
      await this.$connect()
      console.log('PostgreSQL connected successfully')
    } catch (error) {
      console.error('PostgreSQL connection failed')
      console.error(error)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
