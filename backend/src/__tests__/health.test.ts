import request from 'supertest';

import app from '../app';

describe('GET /health', () => {
  it('responds 200 with status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('linguistbridge-api');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('requestId');
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('includes x-request-id in the response header', async () => {
    const customId = 'test-request-id-123';
    const res = await request(app).get('/health').set('x-request-id', customId);

    expect(res.headers['x-request-id']).toBe(customId);
    expect(res.body.requestId).toBe(customId);
  });
});

describe('Unknown routes', () => {
  it('returns 404 for undefined routes', async () => {
    const res = await request(app).get('/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.code).toBe('NOT_FOUND');
  });
});
