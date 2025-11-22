# Página IoT - Frontend

Sistema de gestión de usuarios e historial para IoT con integración a API backend.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install
```

## ⚙️ Configuración

1. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` y configura las variables según tu entorno:

```env
# URL de la API backend
API_URL=http://localhost:8000

# Puerto del servidor frontend
PORT=3000
```

### Variables de Entorno

- **API_URL**: URL completa de tu API backend (sin slash final)
- **PORT**: Puerto donde se ejecutará el servidor frontend

## 🏃 Ejecución

```bash
# Iniciar el servidor
npm start
```

El servidor estará disponible en `http://localhost:3000` (o el puerto configurado en `.env`).

## 📁 Estructura del Proyecto

```
├── public/
│   ├── css/          # Estilos
│   ├── js/           # Scripts del cliente
│   └── assets/       # Imágenes y recursos
├── src/
│   ├── config/       # Configuración (env)
│   ├── controllers/  # Controladores
│   ├── middleware/   # Middlewares
│   ├── routes/       # Rutas
│   └── views/        # Vistas EJS
├── .env              # Variables de entorno (NO subir a Git)
├── .env.example      # Plantilla de variables de entorno
└── index.js          # Punto de entrada

```

## 🔐 Autenticación

El sistema utiliza tokens Bearer para la autenticación. El token se valida contra la API backend configurada en `API_URL`.

## 🛠️ Tecnologías

- **Express**: Framework web
- **EJS**: Motor de plantillas
- **Axios**: Cliente HTTP
- **dotenv**: Gestión de variables de entorno

