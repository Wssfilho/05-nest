import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
describe('fetch recent questionController (E2E)', () => {
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
  test('[GET] /questions - should fetch recent questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    });
    const token = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: 'My Question 1',
          slug: 'my-question-1',
          content: 'My question content 1',
          authorId: user.id,
        },
        {
          title: 'My Question 2',
          slug: 'my-question-2',
          content: 'My question content 2',
          authorId: user.id,
        },
      ],
    });
    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({
          title: 'My Question 1',
        }),
        expect.objectContaining({
          title: 'My Question 2',
        }),
      ],
    });
  });
});
