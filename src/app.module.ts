import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { createAccountController } from './controllers/create-account.controller';

@Module({
  controllers: [createAccountController],
  providers: [PrismaService],
})
export class AppModule {}
