import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { createAccountController } from './controllers/create-account.controller';
import { envSchema } from 'env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        return envSchema.parse(env);
      },
      isGlobal: true,
    }),
  ],
  controllers: [createAccountController],
  providers: [PrismaService],
})
export class AppModule {}
