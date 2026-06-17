# Plan de Implementación: Integración de Calendario Nativo

Este plan detalla los pasos para agregar la funcionalidad de sincronización de tareas con el calendario nativo del dispositivo utilizando `expo-calendar` en el proyecto **TaskMaster Local**, siguiendo las pautas de arquitectura del SCEP y el reporte del archivo de integración de calendario.

## Resumen del Objetivo
Permitir que al crear o editar una tarea, el usuario pueda elegir agendarla en el calendario nativo del dispositivo. Esto requiere solicitar permisos de manera dinámica, encontrar un calendario con permisos de escritura, crear el evento nativo, guardar el ID resultante en el modelo de la tarea, e indicar visualmente si la tarea está sincronizada en la lista de tareas.

---

## Cambios Propuestos

### 1. Dependencias del Proyecto
Necesitamos instalar el módulo oficial `expo-calendar` compatible con la versión actual de Expo (v54).

#### Comando a ejecutar:
`npx expo install expo-calendar`

---

### 2. Capa de Modelos (Tipado TypeScript)

#### [MODIFY] [index.ts](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/types/index.ts)
* Agregar un campo opcional `calendarEventId?: string` en la interfaz `Task`.

```typescript
export interface Task {
  id: string;
  title: string;
  description: string;
  reminderTime: string;
  reminderConfig?: string;
  completed: boolean;
  assignedContact?: AssignedContact;
  imageUri?: string;
  location?: LocationData;
  calendarEventId?: string; // ID del evento nativo de calendario
}
```

---

### 3. Capa de Servicios

#### [NEW] [calendarService.ts](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/services/calendarService.ts)
Crear un servicio dedicado a abstraer la complejidad de `expo-calendar` para Android y iOS.

**Lógica principal:**
* **`requestPermissions`**: Solicitar permisos del calendario y de la app de calendario nativa (`Calendar.requestCalendarPermissionsAsync()`).
* **`getWritableCalendarId`**: Obtener el calendario por defecto en iOS (`Calendar.getDefaultCalendarAsync()`) u obtener la lista de calendarios en Android (`Calendar.getCalendarsAsync()`) buscando uno que tenga `allowsModifications: true`.
* **`createEvent`**: Crear el evento de calendario nativo usando el título de la tarea, fecha de recordatorio (como hora de inicio) y duración por defecto de 1 hora. Retornar el ID del evento creado.
* **`updateEvent`**: Actualizar un evento existente si se edita la tarea (cambio de título o fecha).
* **`deleteEvent`**: Eliminar el evento del calendario si se elimina la tarea o si el usuario decide desvincularla.

---

### 4. Capa de Presentación (UI/UX)

#### [MODIFY] [AddTaskScreen.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/AddTaskScreen/AddTaskScreen.tsx)
* Importar `calendarService`.
* Agregar un estado `addToCalendar` (boolean) y vincularlo a un control `Switch` en el formulario con el label *"Añadir al Calendario del Dispositivo"*.
* En `useEffect`, si estamos en modo edición y la tarea cargada tiene `calendarEventId`, inicializar `addToCalendar` en `true`.
* Modificar la lógica de `handleSave`:
  * Si `addToCalendar` está activo:
    * Si la tarea ya tiene un `calendarEventId` registrado, actualizar el evento nativo con `calendarService.updateEvent`.
    * Si no tiene `calendarEventId`, solicitar permisos y crear el evento mediante `calendarService.createEvent`. Capturar su ID y guardarlo en la tarea.
  * Si `addToCalendar` está inactivo y la tarea tiene un `calendarEventId` previo, eliminar el evento nativo usando `calendarService.deleteEvent` y remover `calendarEventId` de la tarea.
* Todo bloque envuelto en `try/catch` para que los errores de calendario no bloqueen el almacenamiento local de la tarea.

#### [MODIFY] [style.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/AddTaskScreen/style.tsx)
* Agregar estilos para la sección de sincronización de calendario: `calendarSection` y `calendarText` consistentes con la estética oscura y acentuada de la app.

#### [MODIFY] [TaskItem.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/components/TaskItem/TaskItem.tsx)
* Si `task.calendarEventId` existe, renderizar un indicador de estado con el icono `📅` y el texto *"Agendado en Calendario"* para dar feedback visual al usuario.

---

## Plan de Verificación

### Pruebas Automatizadas
* Comprobar la compilación y tipado estricto de TypeScript:
  `npx tsc --noEmit`

### Verificación Manual
1. **Instalar Dependencias**: Ejecutar la instalación de `expo-calendar`.
2. **Crear Tarea con Calendario**:
   * Habilitar la opción "Añadir al Calendario del Dispositivo" al crear una nueva tarea.
   * Conceder permisos de calendario en el popup del sistema.
   * Verificar que la tarea se cree exitosamente y que en la lista se muestre el indicador visual `📅 Agendado en Calendario`.
3. **Verificar Calendario del Dispositivo**:
   * Abrir la aplicación de calendario nativa del simulador/dispositivo.
   * Confirmar que el evento existe con el título correcto en la fecha/hora del recordatorio.
4. **Editar Tarea (Sincronización)**:
   * Cambiar la fecha o título de una tarea vinculada al calendario.
   * Verificar que se actualice correspondientemente en la app nativa de calendario.
   * Desmarcar la opción de calendario y guardar, validando que el evento sea eliminado del calendario nativo.
5. **Eliminar Tarea**:
   * Eliminar una tarea que tiene un evento asignado y verificar que se elimine también del calendario nativo.
