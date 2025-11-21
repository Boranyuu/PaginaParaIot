const express = require('express');
const path = require('path');
const app = express();

// Middleware para parsear formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Archivos estáticos
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Middleware de autenticación simple
function authMiddleware(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['authorization'];
  if (!token) return res.redirect('/'); // si no hay token, redirige al login
  req.token = token; // guardamos el token en la request
  next();
}

// Rutas
const accesoRoutes = require('./src/routes/accesoRoutes');
app.use('/', accesoRoutes);

// GET / --> login
app.get('/', (req, res) => {
  res.render('index'); 
});

// GET /dashboard --> ejemplo de ruta protegida
app.get('/dashboard', authMiddleware, (req, res) => {
  // Aquí podrías usar req.token para validar con tu backend
  res.render('acceso', { token: req.token });
});

// Puerto
app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
