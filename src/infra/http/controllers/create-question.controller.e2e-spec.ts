import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
describe('create questionController (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    jwt = moduleRef.get<JwtService>(JwtService);
    await app.init();
  });
  test('[POST] /questions - should create a new question', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    });
    const token = jwt.sign({ sub: user.id });
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My Question',
        content: 'My question content',
      });
    expect(response.status).toBe(201);

    const QuestionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'My Question',
      },
    });
    expect(QuestionOnDatabase).toBeTruthy();
  });
});
