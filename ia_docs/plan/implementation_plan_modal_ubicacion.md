# Rediseño de Captura de Ubicación con Modal Interactivo (LocationPickerModal)

Cambiar el flujo de captura de ubicación para que, al presionar "Obtener Ubicación Actual" (o "Editar Ubicación"), se abra un modal interactivo. Este modal mostrará:
1. Un **Buscador (TextInput)** en la parte superior para ingresar una dirección de texto.
2. Un botón para buscar esa dirección usando `Location.geocodeAsync`, re-centrando el mapa y actualizando el marcador.
3. Un **Mapa interactivo (`MapView`)** abajo donde:
   - Se muestra el marcador actual.
   - El usuario puede tocar cualquier punto del mapa para mover el marcador, lo cual realiza un reverse geocode (`Location.reverseGeocodeAsync`) para actualizar el texto del buscador.
4. Un botón de **"Confirmar"** y **"Cancelar"** para guardar o descartar los cambios.

## User Review Required

> [!IMPORTANT]
> El modal usará `expo-location` para resolver direcciones de texto (`geocodeAsync`) y coordenadas a dirección (`reverseGeocodeAsync`).
> El mapa de abajo tendrá controles de zoom y movimiento libres habilitados para que el usuario navegue con comodidad.

## Proposed Changes

### Componente: LocationPickerModal

Crearemos un nuevo componente modular dentro de `src/components/LocationPickerModal` siguiendo la arquitectura limpia del proyecto:

#### [NEW] [types.ts](file:///g:/Facultad/Aplicaciones%20movile%20gestor-de-tareas/src/components/LocationPickerModal/types.ts)
Definición de las propiedades del modal.

#### [NEW] [style.tsx](file:///g:/Facultad/Aplicaciones%20movile%20gestor-de-tareas/src/components/LocationPickerModal/style.tsx)
Estilos específicos del modal, alineados con el tema oscuro/naranja del proyecto.

#### [NEW] [LocationPickerModal.tsx](file:///g:/Facultad/Aplicaciones%20movile%20gestor-de-tareas/src/components/LocationPickerModal/LocationPickerModal.tsx)
Implementación lógica del buscador + mapa interactivo + reverse/forward geocoding.

---

### Integración en AddTaskScreen

#### [MODIFY] [AddTaskScreen.tsx](file:///g:/Facultad/Aplicaciones%20movile%20gestor-de-tareas/src/screens/AddTaskScreen/AddTaskScreen.tsx)
1. Reemplazar la lógica directa de `handleGetLocation` para que simplemente abra el modal.
2. Mostrar el modal `LocationPickerModal` pasándole el state `location` como `initialLocation`.
3. Al confirmar en el modal, actualizar el state local de `location` con los nuevos datos.
4. Cambiar el texto del botón cuando ya hay una ubicación de: "Obtener Ubicación Actual" a "Editar Ubicación" (u optimizar el chip para que siga mostrando la dirección actual y permita volver a abrir el modal al tocarla).

---

## Detalle del Flujo de Interacción del Modal

1. **Carga Inicial**:
   - Si ya existe una ubicación en la tarea, se centra el mapa y marcador en ella.
   - Si no existe, se solicita permiso de GPS y se obtiene la ubicación actual del dispositivo para centrar el mapa allí.
2. **Búsqueda por Texto**:
   - El usuario escribe una dirección (ej: "Av. 9 de Julio y Corrientes") y presiona "Buscar".
   - Se llama a `Location.geocodeAsync`. Si hay resultados, el mapa y el marcador se trasladan a esa coordenada.
3. **Selección Manual (Tapping)**:
   - El usuario presiona cualquier parte del mapa.
   - El marcador se mueve a esa coordenada.
   - Se realiza un `Location.reverseGeocodeAsync` para actualizar el input de texto de arriba con la dirección física encontrada.
4. **Confirmación**:
   - Al presionar "Confirmar", se envía `{ latitude, longitude, address }` al formulario principal y se cierra el modal.

---

## Verification Plan

### Automated Tests
- Ejecutar el compilador TypeScript para verificar la tipación:
  ```bash
  npx tsc --noEmit
  ```

### Manual Verification
1. Presionar "Obtener Ubicación Actual" en la pantalla de alta de tareas.
2. Comprobar que se abre el modal y muestra el mapa centrado en la ubicación actual (con indicador de carga si está buscando la posición).
3. Escribir una dirección en el buscador de arriba, presionar el botón de búsqueda y verificar que el mapa se desplaza a las nuevas coordenadas.
4. Tocar el mapa en un punto diferente y comprobar que el marcador se mueve allí y la dirección de texto cambia automáticamente.
5. Presionar "Confirmar" y verificar que el chip de ubicación en el formulario de alta muestra la dirección elegida.
6. Guardar la tarea, abrir el detalle y validar que el mapa en el detalle muestra exactamente la ubicación seleccionada.
