const userController = require('../Controller/user_controller');
const User = require('../model/user_model');
const { register } = require('../Actions/register_user');
const { login_user } = require('../Actions/login');
const { update_user } = require('../Actions/update_user');
const { get_users } = require('../Actions/get_users');
const { delete_user } = require('../Actions/delete_user');
// Mock de funciones de Actions
jest.mock('../Actions/register_user', () => ({
  register: jest.fn(),
}));
jest.mock('../Actions/login', () => ({
  login_user: jest.fn(),
}));
jest.mock('../Actions/update_user', () => ({
  update_user: jest.fn(),
}));
jest.mock('../Actions/get_users', () => ({
  get_users: jest.fn(),
}));
jest.mock('../Actions/delete_user', () => ({
  delete_user: jest.fn(),
}));

// Mock del modelo User
jest.mock('../model/user_model');

describe('User Controller Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register_controller', () => {
    test('should return 400 if required fields are missing', async () => {
      const req = { body: {} , user: { role: 'admin' }};
      const res = {};
      const result = await userController.register_controller(req, res);
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Faltan datos requeridos');
    });

    test('should return 403 if user role is not admin', async () => {
      const req = { body: { userName: 'u', password: 'p', name: 'n', role: 'r' }, user: { role: 'user' }};
      const res = {};
      const result = await userController.register_controller(req, res);
      expect(result.status).toBe(403);
      expect(result.body.error).toBe('No tienes permiso para registrar usuarios');
    });

    test('should return 201 on successful registration', async () => {
      const req = { body: { userName: 'u', password: 'p', name: 'n', role: 'r' }, user: { role: 'admin' }};
      const res = {};
      register.mockResolvedValueOnce();
      const result = await userController.register_controller(req, res);
      expect(register).toHaveBeenCalledWith(req.body);
      expect(result.status).toBe(201);
      expect(result.body.message).toBe('Usuario registrado exitosamente');
    });

    test('should return 409 if duplicate username error', async () => {
      const req = { body: { userName: 'u', password: 'p', name: 'n', role: 'r' }, user: { role: 'admin' }};
      const res = {};
      const error = new Error();
      error.code = 11000;
      register.mockRejectedValueOnce(error);
      const result = await userController.register_controller(req, res);
      expect(result.status).toBe(409);
      expect(result.body.error).toBe('El nombre de usuario ya existe');
    });

    test('should return 500 on other errors', async () => {
      const req = { body: { userName: 'u', password: 'p', name: 'n', role: 'r' }, user: { role: 'admin' }};
      const res = {};
      register.mockRejectedValueOnce(new Error('fail'));
      const result = await userController.register_controller(req, res);
      expect(result.status).toBe(500);
      expect(result.body.error).toBe('Error interno del servidor');
    });
  });

  describe('login', () => {
    test('should return 401 if user not found', async () => {
      const req = { body: { userName: 'u', password: 'p' } };
      const res = {};
      User.findOne.mockResolvedValue(null);
      const result = await userController.login(req, res);
      expect(result.status).toBe(401);
      expect(result.body.error).toBe('Usuario no encontrado');
    });

    test('should return 401 if password incorrect', async () => {
      const req = { body: { userName: 'u', password: 'p' } };
      const res = {};
      const userMock = { comparePassword: jest.fn().mockResolvedValue(false) };
      User.findOne.mockResolvedValue(userMock);
      const result = await userController.login(req, res);
      expect(result.status).toBe(401);
      expect(result.body.error).toBe('Contraseña incorrecta');
    });

    test('should return status and body from login_user on success', async () => {
      const req = { body: { userName: 'u', password: 'p' } };
      const res = {};
      const userMock = { comparePassword: jest.fn().mockResolvedValue(true) };
      User.findOne.mockResolvedValue(userMock);
      login_user.mockResolvedValue({ status: 200, body: { token: 'abc' } });
      const result = await userController.login(req, res);
      expect(result.status).toBe(200);
      expect(result.body.token).toBe('abc');
    });

    test('should return 500 on error', async () => {
      const req = { body: { userName: 'u', password: 'p' } };
      const res = {};
      const userMock = { comparePassword: jest.fn().mockResolvedValue(true) };
      User.findOne.mockResolvedValue(userMock);
      login_user.mockRejectedValue(new Error('fail'));
      const result = await userController.login(req, res);
      expect(result.status).toBe(500);
      expect(result.body.error).toBe('error interno');
    });
  });
describe('update_user_controller', () => {
  test('should return 400 if userName is missing', async () => {
    const req = { body: {}, user: { id: '1', role: 'admin' } };
    const res = {};
    const result = await userController.update_user_controller(req, res);
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Falta el nombre de usuario');
  });

  test('should return 404 if user not found', async () => {
    const req = { body: { userName: 'nonexistent' }, user: { id: '1', role: 'admin' } };
    const res = {};
    User.findOne.mockResolvedValue(null);
    const result = await userController.update_user_controller(req, res);
    expect(result.status).toBe(404);
    expect(result.body.error).toBe('Usuario no encontrado');
  });

  test('should return 403 if user is not admin and not the same user', async () => {
    const req = { body: { userName: 'otheruser' }, user: { id: '1', role: 'user' } };
    const res = {};
    const userMock = { _id: '2' };
    User.findOne.mockResolvedValue(userMock);
    const result = await userController.update_user_controller(req, res);
    expect(result.status).toBe(403);
    expect(result.body.error).toBe('No tienes permiso para actualizar este usuario');
  });

  test('should delete role field if user is not admin', async () => {
    const req = { body: { userName: 'user1', role: 'admin' }, user: { id: '1', role: 'user' } };
    const res = {};
    const userMock = { _id: '1' };
    User.findOne.mockResolvedValue(userMock);
    update_user.mockResolvedValue({ status: 200, body: { message: 'User updated' } });
    const result = await userController.update_user_controller(req, res);
    expect(req.body.role).toBeUndefined();
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('User updated');
  });

  test('should return 200 on successful update by admin', async () => {
    const req = { body: { userName: 'user1', role: 'user' }, user: { id: 'adminid', role: 'admin' } };
    const res = {};
    const userMock = { _id: '1' };
    User.findOne.mockResolvedValue(userMock);
    update_user.mockResolvedValue({ status: 200, body: { message: 'User updated' } });
    const result = await userController.update_user_controller(req, res);
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('User updated');
  });

  test('should return 500 on error', async () => {
    const req = { body: { userName: 'user1' }, user: { id: 'adminid', role: 'admin' } };
    const res = {};
    User.findOne.mockResolvedValue({ _id: '1' });
    update_user.mockRejectedValue(new Error('fail'));
    const result = await userController.update_user_controller(req, res);
    expect(result.status).toBe(500);
    expect(result.body.error).toBe('Error interno del servidor');
  });
});

describe('delete_use_controller', () => {
  test('should return 400 if userName is missing', async () => {
    const req = { body: {}, user: { id: '1', role: 'admin' } };
    const res = {};
    const result = await userController.delete_use_controller(req, res);
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Falta el nombre de usuario');
  });

  test('should return 404 if user not found', async () => {
    const req = { body: { userName: 'nonexistent' }, user: { id: '1', role: 'admin' } };
    const res = {};
    User.findOne.mockResolvedValue(null);
    const result = await userController.delete_use_controller(req, res);
    expect(result.status).toBe(404);
    expect(result.body.error).toBe('Usuario no encontrado');
  });

  test('should return 403 if user is not admin and not the same user', async () => {
    const req = { body: { userName: 'otheruser' }, user: { id: '1', role: 'user' } };
    const res = {};
    const userMock = { _id: '2' };
    User.findOne.mockResolvedValue(userMock);
    const result = await userController.delete_use_controller(req, res);
    expect(result.status).toBe(403);
    expect(result.body.error).toBe('No tienes permiso para borrar este usuario');
  });

  test('should return 200 on successful delete', async () => {
    const req = { body: { userName: 'user1' }, user: { id: 'adminid', role: 'admin' } };
    const res = {};
    User.findOne.mockResolvedValue({ _id: '1' });
    delete_user.mockResolvedValue({ status: 200, body: { message: 'User deleted' } });
    const result = await userController.delete_use_controller(req, res);
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('User deleted');
  });

  test('should return 500 on error', async () => {
    const req = { body: { userName: 'user1' }, user: { id: 'adminid', role: 'admin' } };
    const res = {};
    User.findOne.mockResolvedValue({ _id: '1' });
    delete_user.mockRejectedValue(new Error('fail'));
    const result = await userController.delete_use_controller(req, res);
    expect(result.status).toBe(500);
    expect(result.body.error).toBe('Error interno del servidor');
  });
});

describe('get_users_controller', () => {
  test('should return 200 and users list on success', async () => {
    const req = { query: {} };
    const res = {};
    get_users.mockResolvedValue({ status: 200, body: [{ id: 1, name: 'Test User' }] });
    const result = await userController.get_users_controller(req, res);
    expect(result.status).toBe(200);
    expect(Array.isArray(result.body)).toBe(true);
    expect(result.body[0]).toHaveProperty('name', 'Test User');
  });

  test('should return 500 on error', async () => {
    const req = { query: {} };
    const res = {};
    get_users.mockRejectedValue(new Error('fail'));
    const result = await userController.get_users_controller(req, res);
    expect(result.status).toBe(500);
    expect(result.body.error).toBe('Error interno del servidor');
  });
});
  // Similar tests pueden hacerse para update_user_controller, delete_use_controller y get_users_controller
});