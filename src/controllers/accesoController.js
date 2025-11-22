const axios = require('axios');
const config = require('../config/env');
const BACKEND_URL = config.API_URL;

const validarCodigo = async (req, res) => {
  try {
    const { codigo } = req.body;

    if (!codigo) return res.render('error', { mensaje: 'Debe ingresar un código válido' });

    // Validar token consultando backend
    const [usuariosResp, historialResp] = await Promise.all([
      axios.get(`${BACKEND_URL}/usuarios`, { headers: { Authorization: `Bearer ${codigo}` } }),
      axios.get(`${BACKEND_URL}/historial`, { headers: { Authorization: `Bearer ${codigo}` } })
    ]);

    res.render('acceso', {
      usuarios: usuariosResp.data || [],
      historial: historialResp.data || [],
      token: codigo,
      apiUrl: BACKEND_URL
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    let msg = 'Error conectando con el backend';
    if (error.response?.status === 401) msg = 'Token inválido o expirado';
    if (error.response?.status === 404) msg = 'Recursos no encontrados';
    res.render('error', { mensaje: msg });
  }
};

module.exports = { validarCodigo };
