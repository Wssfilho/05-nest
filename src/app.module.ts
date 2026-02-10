import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { createAccountController } from './controllers/create-account.controller';
import { envSchema } from 'env';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateQuestionController } from './controllers/create-question.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        return envSchema.parse(env);
      },
      isGlobal: true,
    }),
    AuthModule,
  ],

  controllers: [
    createAccountController,
    AuthenticateController,
    CreateQuestionController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
