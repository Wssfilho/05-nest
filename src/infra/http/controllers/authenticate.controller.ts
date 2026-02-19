import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { z } from 'zod';

const autheticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type autheticateBodySchema = z.infer<typeof autheticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(autheticateBodySchema))
  async handle(@Body() body: autheticateBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('Email or password invalid');
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const accessToken = this.jwt.sign(
      {
        sub: user.id,
      },
      {
        algorithm: 'RS256',
      },
    );

    return {
      access_token: accessToken,
    };
    // Authentication logic will go here
  }
}
