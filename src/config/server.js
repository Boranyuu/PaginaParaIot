const express = require('express');
const path = require('path');
const app = express();

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware para leer formularios
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../../public')));

// Rutas
const accesoRoutes = require('../routes/accesoRoutes');
app.use('/', accesoRoutes);

module.exports = { app };
