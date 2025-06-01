const express = require('express');
const request = require('supertest');
const router = require('../Routes/user_routes');

// Mock de controladores
jest.mock('../Controller/user_controller', () => ({
  register_controller: jest.fn(async () => ({ status: 201, body: { message: 'User registered' } })),
  login: jest.fn(async () => ({ status: 200, body: { token: 'fake-token' } })),
  update_user_controller: jest.fn(async () => ({ status: 200, body: { message: 'User updated' } })),
  delete_use_controller: jest.fn(async () => ({ status: 200, body: { message: 'User deleted' } })),
  get_users_controller: jest.fn(async () => ({ status: 200, body: [{ id: 1, name: 'Test User' }] })),
}));

// Mock del middleware authenticate para que siempre pase
jest.mock('../middlewares/authenticate', () => ({
  authenticate: (req, res, next) => next(),
}));

describe('User Routes with mocks', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', router);
  });

  test('POST /api/register should return 201 and success message', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'test', password: '1234' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ message: 'User registered' });
  });

  test('POST /api/login should return 200 and token', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'test', password: '1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token', 'fake-token');
  });

  test('PUT /api/users/update should return 200 and update message', async () => {
    const res = await request(app)
      .put('/api/users/update')
      .send({ name: 'new name' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'User updated' });
  });

  test('GET /api/users/ should return 200 and users array', async () => {
    const res = await request(app).get('/api/users/');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name', 'Test User');
  });

  test('PUT /api/users/delete should return 200 and delete message', async () => {
    const res = await request(app)
      .put('/api/users/delete')
      .send({ id: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'User deleted' });
  });
});