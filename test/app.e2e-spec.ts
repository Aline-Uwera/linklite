import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UrlsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a shortened URL (POST /urls/shorten)', async () => {
    const response = await request(app.getHttpServer())
      .post('/urls/shorten')
      .send({ long_url: 'https://example.com' })
      .expect(201);

    expect(response.body).toHaveProperty('short_code');
    expect(response.body.long_url).toBe('https://example.com');
  });

  it('should redirect a shortened URL (GET /urls/:shortUrl)', async () => {
    // First, create a shortened URL
    const createResponse = await request(app.getHttpServer())
      .post('/urls/shorten')
      .send({ long_url: 'https://example.com' })
      .expect(201);

    const shortCode = createResponse.body.short_code;

    // Then, test redirection
    const redirectResponse = await request(app.getHttpServer())
      .get(`/urls/${shortCode}`)
      .expect(302); // 302 means redirection

    expect(redirectResponse.headers.location).toBe('https://example.com');
  });

  it('should return 404 for a non-existing short URL', async () => {
    await request(app.getHttpServer()).get('/urls/nonexistent123').expect(404);
  });
});
