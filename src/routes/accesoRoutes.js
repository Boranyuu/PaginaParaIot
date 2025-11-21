const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/acceder', async (req, res) => {
  const codigo = req.body.codigo?.trim();
  if (!codigo) return res.render('error', { mensaje: 'Debe ingresar un código válido.' });

  try {
    // Validar token con tu backend Railway
    const usuariosResp = await axios.get('https://iot-backend-production-4413.up.railway.app/usuarios', {
      headers: { Authorization: `Bearer ${codigo}` }
    });

    const historialResp = await axios.get('https://iot-backend-production-4413.up.railway.app/historial', {
      headers: { Authorization: `Bearer ${codigo}` }
    });

    // Token válido, renderiza la página de acceso
    res.render('acceso', {
      token: codigo,
      usuarios: usuariosResp.data || [],
      historial: historialResp.data || []
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    let mensaje = 'Error conectando con el backend';
    if (error.response?.status === 401) mensaje = 'Token inválido o expirado';
    else if (error.response?.status === 404) mensaje = 'Recursos no encontrados';
    res.render('error', { mensaje });
  }
});

module.exports = router;
