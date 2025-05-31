const jwt = require('jsonwebtoken');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload = { id: '...', role: 'admin'/'estudiante'/... }

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { authenticate };