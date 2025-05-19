# 🎥 Api-Insyde

![Node.js](https://img.shields.io/badge/Node.js-1.0.0-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19.1-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.5.0-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?logo=json-web-tokens&logoColor=white)

## 📋 Descripción

Api-Insyde es un backend desarrollado en Node.js que proporciona una API RESTful para la gestión de contenido multimedia (videos e imágenes). Diseñada para trabajar con sistemas de reproducción de contenido digital en múltiples dispositivos, esta API ofrece funcionalidades completas para administrar archivos, playlists, calendarios de eventos y players.

## ✨ Características principales

- **Gestión de archivos multimedia**:
  - Subida y almacenamiento de videos e imágenes
  - Metadatos detallados para cada archivo (duración, título, descripción)
  - Asociación de archivos con playlists

- **Sistema de playlists**:
  - Creación y administración de listas de reproducción
  - Asignación de archivos a playlists específicas
  - Control de duración y orden de reproducción

- **Gestión de players (reproductores)**:
  - Registro y administración de dispositivos de reproducción
  - Asignación de playlists a players específicos
  - Estado y monitoreo de reproductores

- **Calendario de eventos**:
  - Programación de contenido por fechas
  - Asignación de eventos a players y playlists
  - Gestión temporal de la reproducción

- **Autenticación y seguridad**:
  - Sistema de login con JWT
  - Protección de rutas privadas
  - Manejo de roles y permisos

## 🛠️ Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en servidor
- **Express**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT (JSON Web Token)**: Autenticación y autorización segura
- **Cloudinary**: Almacenamiento en la nube para archivos multimedia
- **Express-fileupload**: Gestión de subida de archivos
- **bcryptjs**: Encriptación de contraseñas
- **CORS**: Control de acceso a recursos desde distintos dominios
- **Zod**: Validación de datos y esquemas

## 🚀 Instalación y uso

### Requisitos previos
- Node.js (versión 14 o superior)
- MongoDB (local o Atlas)
- Cuenta en Cloudinary (para almacenamiento de archivos)

### Variables de entorno
Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:

```
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta_jwt
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Pasos para instalar

1. Clona el repositorio:
```bash
git clone https://github.com/PeterManga/Api-Insyde.git
```

2. Navega al directorio del proyecto:
```bash
cd Api-Insyde
```

3. Instala las dependencias:
```bash
npm install
```

4. Inicia el servidor:
```bash
npm start
```

5. El servidor estará disponible en: http://localhost:3000

## 📡 Endpoints principales

### Autenticación
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario

### Archivos
- `GET /api/files` - Obtener todos los archivos
- `POST /api/files` - Subir un nuevo archivo
- `GET /api/files/:id` - Obtener un archivo específico
- `PUT /api/files/:id` - Actualizar un archivo
- `DELETE /api/files/:id` - Eliminar un archivo

### Playlists
- `GET /api/playlists` - Obtener todas las playlists
- `POST /api/playlists` - Crear una nueva playlist
- `GET /api/playlists/:id` - Obtener una playlist específica
- `PUT /api/playlists/:id` - Actualizar una playlist
- `DELETE /api/playlists/:id` - Eliminar una playlist

### Players
- `GET /api/players` - Obtener todos los players
- `POST /api/players` - Registrar un nuevo player
- `GET /api/players/:id` - Obtener un player específico
- `PUT /api/players/:id` - Actualizar un player
- `DELETE /api/players/:id` - Eliminar un player

### Calendario
- `GET /api/calendar` - Obtener todos los eventos
- `POST /api/calendar` - Crear un nuevo evento
- `GET /api/calendar/:id` - Obtener un evento específico
- `PUT /api/calendar/:id` - Actualizar un evento
- `DELETE /api/calendar/:id` - Eliminar un evento

## 🔌 Integración con frontend

Esta API está diseñada para funcionar con el frontend [CRUD-API-INSYDE](https://github.com/PeterManga/CRUD-API-INSYDE), que proporciona una interfaz gráfica para administrar todos los recursos.

## 🔒 CORS y seguridad

La API implementa CORS para permitir solicitudes desde dominios específicos:
- https://crud-insyde.vercel.app
- http://localhost:5173
- video-player-gules-phi.vercel.app

## 💾 Almacenamiento de archivos

Los archivos subidos se procesan y almacenan en Cloudinary para garantizar un acceso rápido y optimizado.

## 🤝 Contribuir

Si deseas contribuir a este proyecto, por favor:

1. Haz un fork del repositorio
2. Crea una rama para tu función (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Añadir una función increíble'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 📞 Contacto

Pedro Manga - GitHub: [PeterManga](https://github.com/PeterManga)

Enlace del proyecto: [https://github.com/PeterManga/Api-Insyde](https://github.com/PeterManga/Api-Insyde)
