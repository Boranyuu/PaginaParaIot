const express = require('express');
const path = require('path');
const axios = require('axios');
const config = require('./src/config/env');

const app = express();

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================= EJS =================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// ================= ESTÁTICOS =================
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// ================= AUTH SIMPLE =================
function authMiddleware(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['authorization'];
  if (!token) return res.redirect('/');
  req.token = token.replace('Bearer ', '');
  next();
}

// ================= RUTAS BASE =================
const accesoRoutes = require('./src/routes/accesoRoutes');
app.use('/', accesoRoutes);

// ================= LOGIN =================
app.get('/', (req, res) => {
  res.render('index');
});

// ================= DASHBOARD =================
app.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const token = req.token;

    // Ejemplo: aquí deberías traer usuarios e historial desde backend
    const usuarios = [];
    const historial = [];

    res.render('acceso', {
      token,
      apiUrl: config.API_URL,
      usuarios,
      historial
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// ================= SERVIDOR =================
app.listen(config.PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${config.PORT}`);
});
