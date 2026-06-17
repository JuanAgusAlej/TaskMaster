Prompt Maestro: Feature de Calendario

> Actúa como un desarrollador Senior en **React Native y TypeScript**. Necesitamos iterar sobre nuestro proyecto **'TaskMaster Local'** para agregar una nueva funcionalidad: **Vincular la tarea creada con un evento en el calendario nativo del dispositivo**.
>
> **Instrucciones Técnicas:**
>
> 1. **Módulo Nativo:** 
>    - Usa `expo-calendar` para interactuar con los calendarios del dispositivo.
>
> 2. **Tipado (TypeScript):** 
>    - Actualiza la interfaz `Task` para incluir un campo opcional `calendarEventId` que guardará el ID del evento nativo generado:
>    ```typescript
>    interface Task {
>      // ... campos anteriores
>      calendarEventId?: string; 
>    }
>    ```
>
> 3. **Flujo de Permisos y Lógica (Pantalla Alta de Tarea):**
>    - Agrega un Switch o Checkbox en el formulario con el texto: *"Añadir al Calendario del Dispositivo"*.
>    - Al momento de guardar la tarea (si la opción está activa), invoca `Calendar.requestCalendarPermissionsAsync()`.
>    - Si el permiso es concedido, implementa una lógica para obtener el calendario por defecto (`Calendar.getDefaultCalendarAsync` en iOS o iterando sobre `Calendar.getCalendarsAsync` en Android).
>    - Utiliza `Calendar.createEventAsync(calendarId, details)` para crear el evento. Pasa el título de la tarea como `title` del evento y usa el tiempo de recordatorio configurado para definir `startDate` y `endDate`.
>    - Captura el ID devuelto por la creación del evento.
>
> 4. **Persistencia (AsyncStorage):** 
>    - Asegúrate de que el `calendarEventId` se asigne a la tarea y se guarde correctamente en el array persistido de `AsyncStorage`.
>
> 5. **Visualización (Pantalla Home / Detalle):** 
>    - Modifica el componente reutilizable `TaskItem`.
>    - Si la tarea tiene un `calendarEventId` asociado, muestra un pequeño indicador visual (ej: un ícono de calendario o el texto *"Agendado en Calendario"*) para que el usuario sepa que está sincronizado.
>
> **Restricciones:** 
> El manejo de calendarios varía entre iOS y Android (Android no siempre tiene un "default calendar"). Asegúrate de que implementes una función robusta para encontrar un calendario escribible (`allowsModifications: true`). Maneja los rechazos de permisos con `try/catch` sin bloquear la creación de la tarea local. Mantén el tipado estricto sin usar `any`.
>
> Por favor, genera el código modificado para la interfaz de tipos, el servicio de calendario (si lo abstraes), la pantalla de Alta de Tarea y el componente visual.

---

### 💡 Tip para el Vibe Coding:
Te recomiendo que le pidas a la herramienta de IA que primero abstraiga toda la lógica de `expo-calendar` en un archivo dentro de `src/services/calendarService.ts`. De esta forma, mantenés la arquitectura limpia que armamos al principio y la pantalla de Alta de Tarea no se llena de líneas de código buscando calendarios.