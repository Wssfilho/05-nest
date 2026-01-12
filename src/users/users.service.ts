import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<User[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.prisma.user.findMany();
  }
}
