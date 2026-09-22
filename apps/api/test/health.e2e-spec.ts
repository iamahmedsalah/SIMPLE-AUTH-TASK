import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthController } from '../src/modules/health/health.controller';

describe('Health endpoint (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ controllers: [HealthController] }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => app.close());

  it('GET /api/v1/health', async () => {
    await request(app.getHttpServer()).get('/api/v1/health').expect(200).expect({ status: 'ok' });
  });
});
