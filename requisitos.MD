# 🐄 Sistema DOGMA - Backend

Este repositorio contiene el backend del sistema **DOGMA** (Documentación Operativa de Gestión de Mercancía y Almacén), desarrollado en Node.js y Express, con conexión a MySQL.

## 🛠️ Tecnologías utilizadas

- Node.js
- Express.js
- MySQL
- dotenv
- express-validator
- bcrypt
- jsonwebtoken
- cors

---

## 📦 Estructura del proyecto

```
/dogma-backend
├── controllers/
│   ├── productosController.js
│   ├── separacionController.js
│   ├── despachoController.js
│   ├── inventarioController.js
├── routes/
│   ├── productosRoutes.js
│   ├── separacionRoutes.js
│   ├── despachoRoutes.js
│   ├── inventarioRoutes.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── validationMiddleware.js
├── config/
│   └── db.js
├── .env
├── app.js
└── index.js
```

---

## 📘 Casos de uso y archivos

### `productosController.js` + `productosRoutes.js`

1. **Registrar producto entrante**
   - `POST /productos/entrantes`
   - Tabla: `entradas`

2. **Confirmación de producto y especificaciones**
   - `POST /productos/confirmacion`
   - Tabla: `confirmaciones`

3. **Registrar producto en retorno**
   - `POST /productos/retorno`
   - Tabla: `devoluciones`

4. **Documentar producto en mal estado**
   - `POST /productos/danados`
   - Tabla: `productos_danados`

---

### `separacionController.js` + `separacionRoutes.js`

5. **Generar consolidado de separación**
   - `POST /separacion/consolidado`
   - Tabla: `separaciones`

---

### `despachoController.js` + `despachoRoutes.js`

6. **Generar consolidado de despacho**
   - `POST /despacho/consolidado`
   - Tabla: `despachos`

---

### `inventarioController.js` + `inventarioRoutes.js`

7. **Cruce de inventario físico y digital**
   - `POST /inventario/cruce`
   - Tabla: `conteos_fisicos`

8. **Consulta de historial por producto**
   - `GET /inventario/:codigoProducto`
   - Tabla: `historial_movimientos`

---

## 🔐 Autenticación y roles

- Se utiliza **JWT** para autenticación.
- Roles disponibles:
  - `colaborador`
  - `líder`
  - `admin`

---

## 🧪 Pruebas

Todos los endpoints deben probarse con **Postman**. La colección se guardará en `/postman`.

---

## ✨ Autor

Proyecto desarrollado por Johan Bohorquez como parte del sistema DOGMA.
