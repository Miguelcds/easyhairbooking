# Easy Hair Project

Sistema web de gestión y reserva de citas para una peluquería con múltiples empleados, aunque esta pensada para poder adaptarse a varios modelos de negocio. Permite a los clientes consultar disponibilidad, reservar y gestionar sus citas de forma autónoma, mientras el equipo administrador controla la agenda, los empleados y los horarios desde un panel dedicado.

---

## Demo

> Despliegue en proceso. Repositorio disponible en: [github.com/Miguelcds/easyhairbooking](https://github.com/Miguelcds/easyhairbooking)

---

## Características principales

## Cliente

- Registro y autenticación segura con JWT almacenado en httpOnly cookies
- Selección de peluquero, fecha y franja horaria disponible
- Reserva de cita con selección de servicios y estimación de precio en tiempo real
- Panel personal con historial de citas activas y cancelación

## Administrador

- Panel de agenda diaria con citas agrupadas por peluquero y ordenadas por hora
- Confirmación y cancelación de reservas
- Creación, edición y baja lógica de empleados
- Generación automática de slots horarios por franja y empleado

## Sistema

- Autenticación con roles (`client` / `admin`)
- Reserva atómica con transacciones MongoDB para evitar dobles reservas
- Índice único compuesto en slots `{employee_id, date, hour}`
- Actualización automática del panel admin mediante polling cada 30 segundos

---

## Tecnologías utilizadas

### Frontend

| Tecnología | Uso |
| --- | --- |
| React 18 | Biblioteca de UI |
| Vite | Bundler y entorno de desarrollo |
| React Router v6 | Enrutamiento y rutas protegidas |
| React Hook Form | Gestión y validación de formularios |
| Axios | Cliente HTTP con soporte de cookies |
| CSS Variables | Sistema de diseño propio sin frameworks |

### Backend

| Tecnología | Uso |
| --- | --- |
| Node.js | Entorno de ejecución |
| Express | Framework web y API REST |
| MongoDB | Base de datos documental |
| Mongoose | ODM y definición de esquemas |
| bcrypt | Hash de contraseñas |
| jsonwebtoken | Generación y verificación de JWT |
| cookie-parser | Lectura de httpOnly cookies |

---

## Instalación y uso

### Requisitos previos

- Node.js >= 18
- MongoDB Atlas o instancia local
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/Miguelcds/easyhairbooking.git
cd easyhairbooking
```

### 2. Configurar el backend

```bash
cd Backend
npm install
```

Crear el archivo `.env` en la raíz del backend:

```env
PORT=3000
DB_URL=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/easyhairbooking
JWT_SECRET=tu_clave_secreta_aqui
FRONTEND_URL=http://localhost:5173
```

Iniciar el servidor:

```bash
npm run dev
```

### 3. Configurar el frontend

```bash
cd ../Frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### 4. Crear el primer administrador

El primer usuario administrador debe crearse manualmente modificando el campo `role` a `"admin"` directamente en MongoDB Atlas o Compass, ya que el registro público asigna el rol `client` por defecto.

---

## Estructura del proyecto

```
EasyHairBooking/
├── Backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── employee.controller.js
│   │   │   │   ├── slot.controller.js
│   │   │   │   └── appointment.controller.js
│   │   │   ├── models/
│   │   │   │   ├── user.model.js
│   │   │   │   ├── employee.model.js
│   │   │   │   ├── slot.model.js
│   │   │   │   └── appointment.model.js
│   │   │   └── routes/
│   │   │       ├── auth.routes.js
│   │   │       ├── employee.routes.js
│   │   │       ├── slot.routes.js
│   │   │       └── appointments.routes.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   └── utils/
│   │       └── token.js
│   ├── app.js
│   └── package.json
│
└── Frontend/
    └── src/
        ├── assets/
        ├── components/
        │   ├── Nav.jsx
        │   └── Footer.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── data/
        │   └── homeData.js
        ├── hooks/
        │   └── useEmployees.js
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Employees.jsx
        │   ├── Slots.jsx
        │   ├── Book.jsx
        │   ├── Admin.jsx
        │   ├── AdminEmployees.jsx
        │   └── AdminSlots.jsx
        ├── services/
        │   ├── axios.config.js
        │   ├── auth.service.js
        │   ├── employee.service.js
        │   ├── slot.service.js
        │   └── appointment.service.js
        ├── styles/
        │   └── global.css
        ├── App.jsx
        └── main.jsx
```

---

## Endpoints de la API

### Autenticación

| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Público |
| POST | `/api/v1/auth/login` | Público |
| POST | `/api/v1/auth/logout` | Autenticado |
| GET | `/api/v1/auth/me` | Autenticado |

### Empleados

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/v1/employee` | Autenticado |
| GET | `/api/v1/employee/all` | Admin |
| POST | `/api/v1/employee` | Admin |
| PUT | `/api/v1/employee/:id` | Admin |
| PATCH | `/api/v1/employee/:id` | Admin |

### Slots

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/v1/slot?employee=&date=` | Autenticado |
| POST | `/api/v1/slot` | Admin |
| POST | `/api/v1/slot/autoCreate` | Admin |

### Citas

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/v1/appointment/my` | Cliente |
| GET | `/api/v1/appointment` | Admin |
| POST | `/api/v1/appointment` | Cliente |
| PATCH | `/api/v1/appointment/:id` | Autenticado |

---

## Aprendizajes y retos

**Transacciones atómicas en MongoDB**
El mayor reto técnico fue implementar la reserva de citas sin posibilidad de dobles reservas simultáneas. Se resolvió usando sesiones y transacciones de Mongoose, que garantizan que la comprobación de disponibilidad y la creación del appointment ocurran como una operación atómica.

**Autenticación con httpOnly cookies**
Se optó por almacenar el JWT en una httpOnly cookie en lugar de localStorage, lo que elimina la superficie de ataque XSS sobre el token. Requirió configurar correctamente CORS con `credentials: true` tanto en Express como en Axios.

**Arquitectura de roles en frontend y backend**
Las rutas protegidas se implementan en dos capas: el middleware `isAuth` en el backend verifica el token y el rol en cada petición, mientras que `PrivateRoute` y `PublicRoute` en React gestionan la navegación según el estado de sesión.

**Generación automática de slots**
El endpoint `autoCreate` recibe franjas horarias en formato `HH:mm` y las convierte a minutos para iterar y generar los slots. Se utilizó `insertMany` para reducir las operaciones a la base de datos a una sola llamada.

---

## Futuras mejoras

- Notificaciones por email al confirmar o cancelar una cita
- Sustitución del polling por WebSockets para actualizaciones en tiempo real en el panel admin
- Vista de agenda diaria para cada barbero
- Plataforma multi-negocio con subdominios por barbería
- Integración con pasarela de pago
- Aplicación móvil nativa con React Native

---

## Autor

### Joao Miguel Costa Da Silva

[github.com/Miguelcds](https://github.com/Miguelcds)