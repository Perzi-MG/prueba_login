## Información del Proyecto

**Nombre**: Sistema de gestión de préstamo de material de laboratorio de redes

**Maestro:** Eduardo Carvajal

**Personas involucradas:** José Antonio Araiza Cortez, Miguel Angel García Mejía

## Objetivo General

Se quiere hacer un sistema para poder digitalizar el manejo de préstamos del material del laboratorio de redes. El objetivo es el de optimizar y mejorar el proceso de préstamos y dejar de usar el sistema actual que es llenar una hoja física con los datos del préstamo.

## Objetivos específicos

- Crear una plataforma digital para el laboratorio de redes
- Optimizar el préstamo de material del laboratorio de redes
- Automatizar la generación de reportes del material para identificar requisitos del material

## Usuarios

Se planea para 3 tipos de usuarios

| **Rol**           | **Descripción**                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Administrador** | Responsable global del laboratorio. Gestiona inventarios, supervisores y accede a analíticas avanzadas. |
| **Supervisor**    | Encargado en turno del laboratorio. Gestiona la entrega, recepción y reporte de daños del material.     |
| **Alumno**        | Usuario final que solicita el material mediante su número de expediente.                                |

## Requerimientos Funcionales

### Alumno

- El alumno deberá ingresar únicamente su **expediente** para obtener la siguiente información:
   - **Nombre** del alumno
   - **Expediente** del alumno
   - **Fecha** de solicitud
   - **Carrera** del alumno
- Posteriormente deberá rellenar los campos de la solicitud
   - **Materia** en la que se utilizarán
   - **Profesor** con el que se utilizarán
   - Seleccionar de la **lista** el **material** solicitado
   - **Cantidad** del **material** solicitado
   - **Salón** en el que se tiene la clase
- Presionará el botón de **enviar solicitud** y deberá esperar a que le entreguen el material.

Si el alumno tiene una solicitud abierta y vuelve a ingresar su expediente, le permitirá añadir materiales a su solicitud

### Supervisor

- **Lista de solicitudes**

   El sistema mostrará los datos de la solicitud y la ubicación de los materiales solicitados en la pantalla del supervisor para facilitar su recolección.

- **Claves**

   Llenar la clave de los materiales que se le dan al alumno.

- **Entrega de materiales**

   Marcar que se entregaron los materiales solicitados por los estudiantes.

- **Edición de materiales**

   Pueda cambiar materiales mediante una checklist de la lista del alumno (devolver, cambiar o añadir).

- **Reporte de materiales**

   Si un material está defectuoso, poder hacer un reporte mediante su clave y quitar su disponibilidad del inventario (en tiempo real).

- **Devolución de materiales**

   Marcar como devuelto, incompleto o dañado el material y liberar la solicitud del alumno para que pueda volver a pedir material o no.

### Administrador

- **Permisos**

   Debe tener permisos tanto de administrador como de supervisor, en caso de que él sea el que esté prestando el material.

- **Dashboard**

   Tendrá acceso a un dashboard con datos de cantidad de prestamos activos y un historial, gráficas y métricas con distintos datos relevantes para el mantenimiento del laboratorio.

- Podrá **añadir** o **eliminar** **materiales** al inventario.
- Podrá **crear** o **eliminar** usuarios de **supervisor**.

### Sistema

- Generar un reporte semestral de material faltante o necesario de cambiar.
- Que el selector de cantidad de material no te permita solicitar más cantidad de lo que hay en stock pero deberá mostrar una alerta de material insuficiente.
- El sistema debe mostrar imágenes de referencia para cada articulo.

## Requerimientos no Funcionales

- Barra de búsquedas con autocompletado para facilitar a los alumnos la búsqueda de su material.
- La interfaz del alumno debe ser responsiva para facilitar el registro desde su teléfono en el laboratorio.
- La búsqueda con autocompletado de materiales debe mostrar resultados conforme el usuario escribe la consulta, y no solo cuando termine.
- Solo el rol Administrador podrá realizar el borrado lógico de supervisores y materiales del inventario.
- Cualquier cambio en el estado del material (prestado/devuelto) debe reflejarse en tiempo real para todos los usuarios.

## Stack Tecnológico Propuesto

- **Frontend:** React.js con Next.js.
- **Backend:** NestJS.
- **Base de Datos:** MongoDB.
- **Autenticación:** Integración con la base de datos de alumnos activos (Mtro. Martín).