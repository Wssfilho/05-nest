import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { createAccountController } from './http/controllers/create-account.controller';
import { envSchema } from '@/infra/env';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './http/controllers/authenticate.controller';
import { CreateQuestionController } from './http/controllers/create-question.controller';
import { FetchRecentQuestionsController } from './http/controllers/fetch-recent-questions.controller';

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
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
