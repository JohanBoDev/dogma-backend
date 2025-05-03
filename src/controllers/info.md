# 📦 Endpoints - productosController.js

Este documento describe de forma clara y sencilla los endpoints incluidos en `productosController.js` para el sistema DOGMA.

---

## 1️⃣ Registrar producto entrante

- **Método:** POST  
- **Ruta:** `/productos/entrantes`  
- **Tabla:** `entradas`

### 📝 Parámetros esperados (en `req.body`):
```json
{
  "producto_id": 1,
  "cantidad": 100,
  "fecha_vencimiento": "2025-12-31",
  "lote": "L12345",
  "planta_id": 2,
  "numero_transporte": "NT-4567",
  "colaborador_id": 4
}
```

### ✅ Validaciones clave:
- `cantidad` debe ser mayor que 0
- `fecha_vencimiento` debe ser una fecha válida (y no pasada)
- `producto_id`, `planta_id` y `colaborador_id` deben existir en la BD

---

## 2️⃣ Confirmación de producto y especificaciones

- **Método:** POST  
- **Ruta:** `/productos/confirmacion`  
- **Tabla:** `confirmaciones`

### 📝 Parámetros esperados:
```json
{
  "producto_id": 1,
  "lote": "L12345",
  "cantidad": 80,
  "estacion_id": 3,
  "colaborador_id": 4
}
```

### 🔔 Notas:
- Se debe verificar si la fecha de vencimiento ya pasó (puede emitir alerta)
- `cantidad` confirmada no puede exceder lo disponible

---

## 3️⃣ Registrar producto en retorno

- **Método:** POST  
- **Ruta:** `/productos/retorno`  
- **Tabla:** `devoluciones`

### 📝 Parámetros esperados:
```json
{
  "producto_id": 1,
  "lote": "L12345",
  "cantidad": 5,
  "estado_retorno": "Bueno",
  "colaborador_id": 4
}
```

### 📌 Notas:
- Si `estado_retorno` es `"Bueno"` el producto puede volver al inventario.
- Si es `"Malo"`, se registra pero no vuelve al stock.

---

## 4️⃣ Documentar producto en mal estado

- **Método:** POST  
- **Ruta:** `/productos/danados`  
- **Tabla:** `productos_danados`

### 📝 Parámetros esperados:
```json
{
  "producto_id": 1,
  "lote": "L12345",
  "cantidad": 3,
  "motivo": "Daño",
  "proceso_afectado": "Despacho",
  "colaborador_id": 4
}
```

### 🔎 Motivos permitidos:
- `"Daño"`
- `"Calidad"`
- `"Consumo"`

### 📌 Notas:
- Se debe descontar del inventario
- Se puede especificar el proceso donde ocurrió el daño

---

Cada uno de estos endpoints será implementado dentro de `productosController.js` y gestionado desde `productosRoutes.js`. Asegúrate de incluir validaciones y control de errores apropiados.
