// src/controllers/accesoController.js
const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Función para validar login y mostrar acceso
const validarCodigo = async (req, res) => {
  try {
    const { codigo } = req.body;

    if (!codigo) {
      return res.render('error', { mensaje: 'Debe ingresar un código válido' });
    }

    // Validar token en backend
    const loginResp = await axios.post(`${BACKEND_URL}/login`, { token: codigo });

    if (!loginResp.data.ok) {
      return res.render('error', { mensaje: 'Código inválido' });
    }

    // Token válido, obtener usuarios e historial
    const [usuariosResp, historialResp] = await Promise.all([
      axios.get(`${BACKEND_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${codigo}` }
      }),
      axios.get(`${BACKEND_URL}/historial`, {
        headers: { Authorization: `Bearer ${codigo}` }
      })
    ]);

    res.render('acceso', {
      usuarios: usuariosResp.data || [],
      historial: historialResp.data || [],
      token: codigo // para usarlo en frontend si se necesita
    });

  } catch (error) {
    console.error('Error en /acceder:', error.response?.data || error.message);

    let msg = 'Error conectando con el backend';
    if (error.response?.status === 401) msg = 'Token inválido o expirado';
    if (error.code === 'ECONNREFUSED') msg = 'No se pudo conectar con el servidor remoto';

    res.render('error', { mensaje: msg });
  }
};

module.exports = { validarCodigo };
