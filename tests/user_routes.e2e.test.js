const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');
const userRoutes = require('../Routes/user_routes');
const User = require('../model/user_model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

let mongoServer;
let app;
let server;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  app = express();
  app.use(express.json());
  app.use('/api', userRoutes);

  server = app.listen(0); // Puerto aleatorio para pruebas
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

beforeEach(async () => {
  // Limpiar colecciones antes de cada prueba
  await User.deleteMany({});
});

// Función para generar token JWT para pruebas
function generateToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
}

describe('User Routes E2E', () => {
  let adminToken;
  let normalUserToken;

  beforeEach(async () => {
    // Crear usuario admin para pruebas
    const adminUser = new User({ userName: 'admin', password: 'adminpass', name: 'Admin User', role: 'admin' });
    await adminUser.save();
    adminToken = generateToken(adminUser);

    // Crear usuario normal para pruebas
    const normalUser = new User({ userName: 'user', password: 'userpass', name: 'Normal User', role: 'user' });
    await normalUser.save();
    normalUserToken = generateToken(normalUser);
  });

  test('POST /api/register - should register a new user with admin token', async () => {
    const res = await request(app)
      .post('/api/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ userName: 'newuser', password: 'newpass', name: 'New User', role: 'user' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Usuario registrado exitosamente');

    const userInDb = await User.findOne({ userName: 'newuser' });
    expect(userInDb).not.toBeNull();
  });

  test('POST /api/register - should fail without admin token', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ userName: 'failuser', password: 'failpass', name: 'Fail User', role: 'user' });

    expect(res.statusCode).toBe(401); // Unauthorized due to missing token
  });

  test('POST /api/login - should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ userName: 'admin', password: 'adminpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('GET /api/users/ - should get users list', async () => {
  const res = await request(app)
    .get('/api/users/');

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('users');
  expect(Array.isArray(res.body.users)).toBe(true);
  expect(res.body.users.length).toBeGreaterThanOrEqual(2);
});

  test('PUT /api/users/update - should update user with valid token', async () => {
    const res = await request(app)
      .put('/api/users/update')
      .set('Authorization', `Bearer ${normalUserToken}`)
      .send({ userName: 'user', name: 'Updated Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Usuario actualizado correctamente');

    const updatedUser = await User.findOne({ userName: 'user' });
    expect(updatedUser.name).toBe('Updated Name');
  });

  test('PUT /api/users/delete - should disable user with valid token', async () => {
  const res = await request(app)
    .put('/api/users/delete')
    .set('Authorization', `Bearer ${normalUserToken}`)
    .send({ userName: 'user' });

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe('Usuario eliminado correctamente');

  const updatedUser = await User.findOne({ userName: 'user' });
  expect(updatedUser).not.toBeNull();
  expect(updatedUser.enable).toBe(false);
});
});