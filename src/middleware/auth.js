const axios = require('axios');
const BACKEND_URL = 'https://iot-backend-production-4413.up.railway.app';

async function authMiddleware(req, res, next) {
  try {
    const token = req.body.token || req.query.token || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) return res.redirect('/'); // sin token

    // Consultar backend para validar token
    await axios.get(`${BACKEND_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Token válido, lo adjuntamos a req para usarlo en rutas
    req.token = token;
    next();
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.redirect('/'); // token inválido
  }
}

module.exports = authMiddleware;
