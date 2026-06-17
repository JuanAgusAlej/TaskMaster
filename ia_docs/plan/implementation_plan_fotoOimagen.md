# Integración de Imagen/Foto en Tareas (expo-image-picker)

Agregar la funcionalidad de adjuntar una foto a cada tarea, ya sea capturándola con la cámara o seleccionándola desde la galería del dispositivo, usando `expo-image-picker`.

## Propuesta de Cambios

La implementación se divide en **5 fases** que siguen la arquitectura modular SCEP del proyecto (types → services → screens → components).

---

### Fase 1 — Dependencia

#### Instalar `expo-image-picker`

```bash
npx expo install expo-image-picker
```

> [!NOTE]
> Este paquete es parte del ecosistema Expo Managed Workflow, por lo que no requiere configuración nativa adicional. Los permisos de cámara y galería se solicitan en runtime vía la API del paquete.

---

### Fase 2 — Tipado TypeScript

#### [MODIFY] [index.ts](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/types/index.ts)

Agregar el campo opcional `imageUri` a la interfaz `Task`:

```diff
 export interface Task {
   id: string;
   title: string;
   description: string;
   reminderTime: string;
   reminderConfig?: string;
   completed: boolean;
   assignedContact?: AssignedContact;
+  imageUri?: string;
 }
```

> [!IMPORTANT]
> Al ser un campo opcional (`?`), las tareas existentes en AsyncStorage siguen siendo compatibles sin migración de datos.

---

### Fase 3 — Pantalla Alta de Tarea (AddTaskScreen)

#### [MODIFY] [AddTaskScreen.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/AddTaskScreen/AddTaskScreen.tsx)

Cambios concretos:

1. **Imports**: Agregar `Image`, `Alert` desde React Native y `* as ImagePicker` desde `expo-image-picker`.
2. **Estado nuevo**: `const [imageUri, setImageUri] = useState<string | null>(null);`
3. **Carga en modo edición**: Si `task.imageUri` existe, inicializar el estado `imageUri` con su valor.
4. **Funciones de selección de imagen**:
   - `handleTakePhoto()`: Solicita permiso de cámara (`ImagePicker.requestCameraPermissionsAsync()`), si se concede lanza `ImagePicker.launchCameraAsync()` con opciones:
     ```typescript
     {
       mediaTypes: ['images'],
       allowsEditing: true,
       quality: 0.7,
     }
     ```
   - `handlePickFromGallery()`: Solicita permiso de galería (`ImagePicker.requestMediaLibraryPermissionsAsync()`), si se concede lanza `ImagePicker.launchImageLibraryAsync()` con las mismas opciones.
   - Ambas funciones extraen `result.assets[0].uri` y lo setean con `setImageUri()`.
   - Manejo seguro con `try/catch` y `Alert.alert` en caso de permiso denegado.
5. **UI nueva** (debajo de la sección de Responsable y arriba del Recordatorio):
   - Sección `📷 Imagen adjunta:` con dos botones: **"Tomar Foto"** y **"Seleccionar de Galería"**.
   - Si `imageUri` no es null, mostrar una miniatura `<Image>` de previsualización (150×150, borderRadius: 8) con un botón "✕" para eliminarla.
6. **Persistencia**: En `handleSave()`, incluir `imageUri: imageUri ?? undefined` en el objeto de tarea al crear/actualizar.

#### [MODIFY] [style.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/AddTaskScreen/style.tsx)

Agregar estilos nuevos:
- `imageSection`: Contenedor similar a `contactSection` (fondo `COLORS.surface`, borde, borderRadius).
- `imageBtnRow`: `flexDirection: 'row'` para los dos botones lado a lado.
- `imageBtn`: Botón estilizado con fondo `COLORS.background`, borde dashed, flex: 1.
- `imageBtnText`: Texto en `COLORS.accent`, fontWeight 600.
- `imagePreviewContainer`: Contenedor de la miniatura con posición relativa para el botón de eliminar.
- `imagePreview`: `width: '100%'`, `height: 200`, `borderRadius: 8`, `resizeMode: 'cover'`.
- `removeImageBtn`: Botón "✕" posicionado en la esquina superior derecha de la miniatura.
- `removeImageBtnText`: Texto en `COLORS.danger`.

---

### Fase 4 — Visualización en Lista (TaskItem)

#### [MODIFY] [TaskItem.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/components/TaskItem/TaskItem.tsx)

- Agregar `import { Image } from 'react-native'`.
- Debajo del texto de `assignedContact`, si `task.imageUri` existe, renderizar:
  ```tsx
  {task.imageUri && (
    <Image source={{ uri: task.imageUri }} style={taskImage} />
  )}
  ```
  La imagen se mostrará como una miniatura compacta (alto ~60px, ancho 100%, borderRadius: 6).

#### [MODIFY] [style.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/components/TaskItem/style.tsx)

Agregar estilo:
- `taskImage`: `width: '100%'`, `height: 60`, `borderRadius: 6`, `marginTop: 6`, `resizeMode: 'cover'`.

---

### Fase 5 — Visualización en Detalle (TaskDetailScreen)

#### [MODIFY] [TaskDetailScreen.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/TaskDetailScreen/TaskDetailScreen.tsx)

- Agregar `import { Image } from 'react-native'`.
- Después de la sección de `assignedContact` y antes de `statusBox`, si `task.imageUri` existe, renderizar:
  ```tsx
  {task.imageUri && (
    <View style={infoBox}>
      <Text style={infoTitle}>📷 Imagen adjunta:</Text>
      <Image source={{ uri: task.imageUri }} style={detailImage} />
    </View>
  )}
  ```

#### [MODIFY] [style.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/TaskDetailScreen/style.tsx)

Agregar estilo:
- `detailImage`: `width: '100%'`, `height: 250`, `borderRadius: 8`, `marginTop: SPACING.sm`, `resizeMode: 'cover'`.

---

## Archivos Afectados (Resumen)

| Archivo | Acción | Fase |
|---|---|---|
| `package.json` | Dependencia nueva (`expo-image-picker`) | 1 |
| `src/types/index.ts` | Agregar `imageUri?: string` a `Task` | 2 |
| `src/screens/AddTaskScreen/AddTaskScreen.tsx` | Lógica de cámara/galería + UI | 3 |
| `src/screens/AddTaskScreen/style.tsx` | Estilos nuevos para sección de imagen | 3 |
| `src/components/TaskItem/TaskItem.tsx` | Miniatura de imagen en lista | 4 |
| `src/components/TaskItem/style.tsx` | Estilo `taskImage` | 4 |
| `src/screens/TaskDetailScreen/TaskDetailScreen.tsx` | Imagen completa en detalle | 5 |
| `src/screens/TaskDetailScreen/style.tsx` | Estilo `detailImage` | 5 |

> [!NOTE]
> El servicio `taskService.ts` **no necesita cambios** ya que serializa/deserializa el objeto `Task` completo como JSON en AsyncStorage. El nuevo campo `imageUri` se persiste automáticamente.

## Plan de Verificación

### Verificación Automática
```bash
npx tsc --noEmit
```
Confirmar que no hay errores de tipado en todo el proyecto.

### Verificación Manual
- Crear una tarea nueva → tomar foto con cámara → verificar miniatura de previsualización → guardar → verificar que aparece en la lista Home y en el detalle.
- Crear una tarea nueva → seleccionar imagen de galería → mismo flujo.
- Denegar permisos → verificar que la app muestra un Alert y no crashea.
- Editar una tarea existente con imagen → verificar que la imagen cargada se muestra.
- Crear tarea sin imagen → verificar que todo sigue funcionando normalmente.

> [!TIP]
> **Recomendación del prompt**: Probar este flujo con **Expo Go** en un dispositivo físico, ya que los simuladores de PC pueden no emular correctamente la cámara nativa.
