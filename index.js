const express = require('express');
const path = require('path');
const app = express();

// Middleware para parsear formularios y JSON
app.use(express.urlencoded({ extended: true })); // importante para form-urlencoded
app.use(express.json());

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Archivos estáticos
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Rutas
const accesoRoutes = require('./src/routes/accesoRoutes');
app.use('/', accesoRoutes);

// GET / --> renderizar login.ejs
app.get('/', (req, res) => {
  res.render('index'); // tu login
});

// GET /panel --> opcional, si quieres redirigir a un panel
app.get('/panel', (req, res) => {
  res.send('Panel de control'); // reemplaza por acceso.ejs si quieres
});

// Puerto
app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
