# Integración de Ubicación GPS y Mapa en TaskMaster Local

Agregar la funcionalidad de adjuntar la ubicación actual del dispositivo a una tarea y visualizarla en un mapa interactivo, usando `expo-location` y `react-native-maps`.

## User Review Required

> [!IMPORTANT]
> Se instalarán **2 nuevas dependencias** al proyecto:
> - `expo-location` — Acceso a coordenadas GPS y reverse geocoding.
> - `react-native-maps` — Componente `<MapView>` y `<Marker>` para renderizar el mapa.
>
> Ambas son compatibles con Expo SDK 54 (managed workflow).

> [!WARNING]
> `react-native-maps` requiere que en **Android** se configure una API Key de Google Maps en `app.json`/`app.config.js`. Para **desarrollo local con Expo Go**, se usa el mapa genérico de Android que **no necesita API Key**. Si querés desplegar a producción, se necesitará una key.

## Proposed Changes

### Fase 0 — Dependencias

Instalar las librerías necesarias:

```bash
npx expo install expo-location react-native-maps
```

---

### Fase 1 — Modelo de Datos (TypeScript)

#### [MODIFY] [index.ts](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/types/index.ts)

Agregar la interfaz `LocationData` y el campo opcional `location` a `Task`:

```diff
+export interface LocationData {
+  latitude: number;
+  longitude: number;
+  address?: string;
+}
+
 export interface Task {
   id: string;
   title: string;
   description: string;
   reminderTime: string;
   reminderConfig?: string;
   completed: boolean;
   assignedContact?: AssignedContact;
   imageUri?: string;
+  location?: LocationData;
 }
```

---

### Fase 2 — Captura de Ubicación (Pantalla Alta de Tarea)

#### [MODIFY] [AddTaskScreen.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/AddTaskScreen/AddTaskScreen.tsx)

Cambios puntuales:

1. **Import** de `expo-location` (`* as Location`).
2. **Nuevo state**: `location: LocationData | null` y `loadingLocation: boolean`.
3. **Función `handleGetLocation`**:
   - Invoca `Location.requestForegroundPermissionsAsync()`.
   - Si es concedido → `Location.getCurrentPositionAsync()` para lat/lng.
   - Ejecuta `Location.reverseGeocodeAsync()` para obtener dirección legible.
   - Guarda en state `location`.
   - Maneja denegación de permisos y errores GPS con `try/catch` + `Alert`.
4. **UI**: Nueva sección (entre la sección de imagen y la de contacto) con:
   - Botón **"📍 Obtener Ubicación Actual"** (estilo dashed, igual que el patrón de imagen/contacto).
   - Un `ActivityIndicator` mientras se obtiene la ubicación.
   - Si ya hay ubicación capturada: muestra un "chip" con la dirección y un botón `✕` para quitarla.
5. **`handleSave`**: Incluir `location` en el objeto de tarea al crear/editar.
6. **`loadTask` (modo edición)**: Cargar `location` del task existente al state.

#### [MODIFY] [style.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/AddTaskScreen/style.tsx)

Agregar estilos para la nueva sección de ubicación, reutilizando el patrón visual ya existente de `contactSection` / `imageSection`:

```diff
+  locationSection: {
+    backgroundColor: COLORS.surface,
+    padding: SPACING.md,
+    borderRadius: 8,
+    borderWidth: 1,
+    borderColor: COLORS.accentMuted,
+    marginBottom: SPACING.lg,
+  },
+  locationBtn: {
+    backgroundColor: COLORS.background,
+    padding: SPACING.md,
+    borderRadius: 8,
+    borderWidth: 1,
+    borderColor: COLORS.accentMuted,
+    alignItems: 'center',
+    borderStyle: 'dashed',
+  },
+  locationBtnText: {
+    color: COLORS.accent,
+    ...FONTS.body,
+    fontWeight: '600',
+  },
+  locationChip: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    backgroundColor: COLORS.background,
+    padding: SPACING.sm,
+    borderRadius: 8,
+    borderWidth: 1,
+    borderColor: COLORS.accent,
+  },
+  locationChipText: {
+    flex: 1,
+    ...FONTS.body,
+    color: COLORS.textPrimary,
+    marginLeft: SPACING.xs,
+  },
+  removeLocationBtn: {
+    padding: SPACING.xs,
+    marginLeft: SPACING.sm,
+  },
+  removeLocationBtnText: {
+    color: COLORS.danger,
+    fontSize: 16,
+    fontWeight: '700',
+  },
```

---

### Fase 3 — Persistencia (AsyncStorage)

#### Sin cambios en [taskService.ts](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/services/taskService.ts)

El servicio usa `JSON.stringify` / `JSON.parse` genérico sobre el array de `Task`. Al agregar el campo `location?: LocationData` a la interfaz, el campo se serializa/deserializa automáticamente. **No se requieren cambios en el servicio.**

---

### Fase 4 — Visualización con Mapa (Pantalla de Detalle)

#### [MODIFY] [TaskDetailScreen.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/TaskDetailScreen/TaskDetailScreen.tsx)

1. **Import** de `react-native-maps` (`MapView`, `Marker`).
2. **Renderizado condicional**: Si `task.location` existe:
   - Renderizar un `<View style={infoBox}>` con título `📍 Ubicación:`.
   - Mostrar la dirección en texto (`task.location.address`).
   - Renderizar un `<MapView>` con dimensiones fijas (width 100%, height 200) centrado en `{ latitude, longitude }`.
   - Colocar un `<Marker>` en las coordenadas exactas.

#### [MODIFY] [style.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/TaskDetailScreen/style.tsx)

Agregar estilos para el mapa:

```diff
+  mapContainer: {
+    width: '100%',
+    height: 200,
+    borderRadius: 8,
+    overflow: 'hidden',
+    marginTop: SPACING.sm,
+  },
+  map: {
+    width: '100%',
+    height: '100%',
+  },
+  locationAddress: {
+    ...FONTS.body,
+    color: COLORS.textPrimary,
+    marginBottom: SPACING.xs,
+  },
```

---

### Fase 5 — Indicador en TaskItem (Home)

#### [MODIFY] [TaskItem.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/components/TaskItem/TaskItem.tsx)

Agregar un indicador sutil de ubicación (similar al de contacto asignado):

```diff
   {task.assignedContact && (
     <Text style={assignedText} numberOfLines={1}>👤 {task.assignedContact.name}</Text>
   )}
+  {task.location && (
+    <Text style={assignedText} numberOfLines={1}>📍 {task.location.address || 'Ubicación adjunta'}</Text>
+  )}
   {task.imageUri && (
     <Image source={{ uri: task.imageUri }} style={taskImage} />
   )}
```

No se necesitan estilos nuevos — reutiliza `assignedText` que ya existe.

---

## Resumen de Archivos Afectados

| Archivo | Acción | Descripción |
|---|---|---|
| `package.json` | MODIFY | Nuevas dependencias (`expo-location`, `react-native-maps`) |
| `src/types/index.ts` | MODIFY | Nueva interfaz `LocationData` + campo `location` en `Task` |
| `src/screens/AddTaskScreen/AddTaskScreen.tsx` | MODIFY | Lógica de permisos, GPS, reverse geocode, UI de captura |
| `src/screens/AddTaskScreen/style.tsx` | MODIFY | Estilos de la sección de ubicación |
| `src/screens/TaskDetailScreen/TaskDetailScreen.tsx` | MODIFY | `<MapView>` + `<Marker>` condicional |
| `src/screens/TaskDetailScreen/style.tsx` | MODIFY | Estilos del mapa |
| `src/components/TaskItem/TaskItem.tsx` | MODIFY | Indicador `📍` en el listado |

## Verification Plan

### Automated Tests
```bash
npx tsc --noEmit
```
Verificar que el proyecto compila sin errores de TypeScript.

### Manual Verification
1. Abrir la app en Expo Go.
2. Crear una tarea nueva → presionar "Obtener Ubicación Actual" → verificar que pide permiso y muestra la dirección.
3. Guardar la tarea → en Home verificar que aparece el ícono `📍` con la dirección.
4. Abrir el detalle de la tarea → verificar que el mapa se renderiza correctamente con el marcador.
5. Editar la tarea → verificar que la ubicación se mantiene cargada.
6. Probar caso denegación de permisos → verificar que muestra un `Alert` informativo sin crash.
