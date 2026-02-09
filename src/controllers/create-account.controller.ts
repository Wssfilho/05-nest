import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type createAccountBodySchema = z.infer<typeof createAccountBodySchema>;
@Controller('/accounts')
export class createAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  async handle(@Body() body: createAccountBodySchema) {
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userWithSameEmail) {
      throw new ConflictException('User with same email adress alrady exists');
    }
    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
