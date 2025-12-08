
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('database.postgres.url');
    if (!connectionString) {
      throw new Error('Database connection string is not configured');
    }
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
}
