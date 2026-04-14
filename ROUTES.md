## 1. Materiales

| **Método** | **Endpoint**      | **Descripción**                                              | Estado |
| ---------- | ----------------- | ------------------------------------------------------------ | ------ |
| **GET**    | `/materiales`     | Obtener todo el catálogo. (Para todos los usuarios)          | Listo  |
| **GET**    | `/materiales/:id` | Detalle de un material específico. (Para todos los usuarios) | Listo  |
| **POST**   | `/materiales`     | Crear un nuevo tipo de material (Admin).                     | Listo  |
| **PATCH**  | `/materiales/:id` | Editar nombre, categoría, modelo (Admin, Supervisor)         | Listo  |
| **DELETE** | `/materiales/:id` | Borrar material del catálogo.                                | Listo  |

## 2. Productos

| **Método** | Estado | **Endpoint**                     | **Descripción**                                                    |
| ---------- | ------ | -------------------------------- | ------------------------------------------------------------------ |
| **GET**    | Listo  | `/products`                      | Lista de todas las unidades físicas. (Todos)                       |
| **GET**    | Listo  | `/products/available`            | Filtrar solo lo que se puede prestar ahora. (Todos)                |
| **GET**    | Listo  | `/products/material/:materialId` | Ver todas las unidades de un mismo tipo. (Todos)                   |
| **POST**   | Listo  | `/products`                      | Registrar un equipo nuevo (Admin y Supervisor)                     |
| **PATCH**  | Listo  | `/products/:id`                  | Cambiar ubicación o reportar si es funcional. (Admin y Supervisor) |
| GET        | Listo  | `/products/:id`                  | Ver un producto en especifico (Todos)                              |
| DELETE     | Listo  | `/products/:id`                  | Eliminar un producto en especifico (Admin)                         |

---

## 3. Préstamos

| **Método** | Estado | **Endpoint**                | **Descripción**                                             |
| ---------- | ------ | --------------------------- | ----------------------------------------------------------- |
| **POST**   |        | `/prestamos`                | **Crear préstamo:** Recibe expediente y array de productos. |
| **GET**    |        | `/prestamos`                | Historial completo de préstamos.                            |
| **GET**    |        | `/prestamos/activos`        | Ver qué materiales están fuera actualmente.                 |
| **GET**    |        | `/prestamos/expediente/:id` | Buscar préstamos de un alumno específico.                   |
| **PATCH**  |        | `/prestamos/:id/devolucion` | **Procesar devolución:** Marca ítems como entregados.       |
| **GET**    |        | `/prestamos/atrasados`      | Lista de materiales que ya pasaron su fecha límite.         |

---

## 4. Usuarios y Autenticación

Para los administradores y supervisores que operarán el sistema.

| **Método** | Estado | **Endpoint**                  | **Descripción**                             |
| ---------- | ------ | ----------------------------- | ------------------------------------------- |
| **POST**   | Listo  | `/auth/login`                 | Iniciar sesión y recibir el JWT.            |
| **GET**    | Listo  | `auth/users/profile`          | Obtener datos del admin logueado.           |
| **POST**   | Listo  | `auth/users`                  | Registrar un nuevo supervisor (Solo Admin). |
| **GET**    | Listo  | `auth/users/supervisors`      | Listado de personal del laboratorio.        |
| **DELETE** | Listo  | auth/users/supervisors/userId | Borrar supervisor por id (Solo Admin)       |