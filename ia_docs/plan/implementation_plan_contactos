# Integración con Contactos Nativos del Dispositivo

Agregar la funcionalidad de **asignar un responsable** a una tarea desde los contactos del celular, usando `expo-contacts`. El contacto seleccionado se persiste con la tarea en AsyncStorage y se muestra en la UI (Home, Detalle, Alta/Edición).

## Propuesta de Cambios

### 1. Dependencia — Instalar `expo-contacts`

```bash
npx expo install expo-contacts
```

> [!NOTE]
> `expo-contacts` es un módulo nativo del ecosistema Expo que ya soporta el Managed Workflow del proyecto. No requiere eject ni configuración adicional.

---

### 2. Tipos — Actualizar la interfaz `Task`

#### [MODIFY] [index.ts](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/types/index.ts)

Agregar la interfaz `AssignedContact` y el campo opcional `assignedContact` en `Task`:

```diff
+export interface AssignedContact {
+  id: string;
+  name: string;
+  phoneNumber?: string;
+}
+
 export interface Task {
   id: string;
   title: string;
   description: string;
   reminderTime: string;
   reminderConfig?: string;
   completed: boolean;
+  assignedContact?: AssignedContact;
 }
```

> [!IMPORTANT]
> El campo es **opcional** (`?`) para mantener retrocompatibilidad con las tareas ya guardadas en AsyncStorage.

---

### 3. Nuevo Componente — `ContactPickerModal`

#### [NEW] `src/components/ContactPickerModal/ContactPickerModal.tsx`
#### [NEW] `src/components/ContactPickerModal/style.tsx`
#### [NEW] `src/components/ContactPickerModal/types.ts`

Un modal reutilizable que:
1. Solicita permisos de contactos (`Contacts.requestPermissionsAsync()`).
2. Si es concedido: carga la lista de contactos con `Contacts.getContactsAsync()` (campos: `name`, `phoneNumbers`).
3. Muestra los contactos en un `FlatList` con buscador (`TextInput`) para filtrar por nombre.
4. Al seleccionar un contacto, invoca un callback `onSelect(contact: AssignedContact)` y cierra el modal.
5. Si el permiso es denegado: muestra un `Alert` informativo y cierra el modal sin romper la app.

**Props (types.ts):**
```typescript
import { AssignedContact } from '../../types';

export interface ContactPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (contact: AssignedContact) => void;
}
```

---

### 4. Pantalla Alta/Edición — Integrar selector de contacto

#### [MODIFY] [AddTaskScreen.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/AddTaskScreen/AddTaskScreen.tsx)

**Cambios funcionales:**
- Nuevo estado: `const [assignedContact, setAssignedContact] = useState<AssignedContact | null>(null);`
- En modo edición (`useEffect`): cargar `task.assignedContact` si existe.
- En la UI (debajo de la descripción, antes del recordatorio): renderizar una sección nueva:
  - Si **no hay contacto**: botón `"👤 Seleccionar Responsable"` → abre `ContactPickerModal`.
  - Si **hay contacto**: chip/badge con el nombre + botón `✕` para quitar la asignación.
- En `handleSave`: incluir `assignedContact` (o `undefined`) en el objeto de tarea que se guarda.

#### [MODIFY] [style.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/AddTaskScreen/style.tsx)

Agregar estilos para la sección de responsable: `contactSection`, `contactChip`, `contactChipText`, `removeContactBtn`.

---

### 5. Componente TaskItem — Mostrar responsable en Home

#### [MODIFY] [TaskItem.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/components/TaskItem/TaskItem.tsx)

Agregar, debajo de la descripción, una línea condicional:
```tsx
{task.assignedContact && (
  <Text style={assignedText}>👤 {task.assignedContact.name}</Text>
)}
```

#### [MODIFY] [style.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/components/TaskItem/style.tsx)

Agregar estilo `assignedText` con color `COLORS.accent` y `FONTS.caption`.

---

### 6. Pantalla Detalle — Mostrar responsable

#### [MODIFY] [TaskDetailScreen.tsx](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/screens/TaskDetailScreen/TaskDetailScreen.tsx)

Agregar, debajo del bloque de Recordatorio (`infoBox`), una nueva sección condicional:
```tsx
{task.assignedContact && (
  <View style={infoBox}>
    <Text style={infoTitle}>👤 Responsable:</Text>
    <Text style={infoText}>{task.assignedContact.name}</Text>
    {task.assignedContact.phoneNumber && (
      <Text style={infoText}>📞 {task.assignedContact.phoneNumber}</Text>
    )}
  </View>
)}
```

---

### 7. Servicio de Tareas — Sin cambios requeridos

[taskService.ts](file:///g:/Facultad/Aplicaciones%20movile/gestor-de-tareas/src/services/taskService.ts) ya trabaja con el tipo `Task` genérico y `Omit<Task, 'id'>`. Como `assignedContact` es un campo opcional en la interfaz, las funciones `addTask`, `updateTask`, `getTasks`, etc. lo persistirán/leerán automáticamente sin modificaciones.

---

## Resumen de Archivos Afectados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `package.json` | MODIFY | Dependencia `expo-contacts` (vía `npx expo install`) |
| `src/types/index.ts` | MODIFY | Nueva interfaz `AssignedContact` + campo en `Task` |
| `src/components/ContactPickerModal/*` | **NEW** (3 archivos) | Modal de selección de contactos |
| `src/screens/AddTaskScreen/AddTaskScreen.tsx` | MODIFY | Estado, UI y lógica de guardado |
| `src/screens/AddTaskScreen/style.tsx` | MODIFY | Estilos de la sección responsable |
| `src/components/TaskItem/TaskItem.tsx` | MODIFY | Mostrar nombre del responsable |
| `src/components/TaskItem/style.tsx` | MODIFY | Estilo `assignedText` |
| `src/screens/TaskDetailScreen/TaskDetailScreen.tsx` | MODIFY | Sección responsable en detalle |

## Plan de Verificación

### Verificación Automática
```bash
npx tsc --noEmit
```
Compilación TypeScript sin errores para validar tipado estricto (sin `any`).

### Verificación Manual
- Crear tarea con responsable asignado → verificar que aparece en Home y Detalle.
- Crear tarea **sin** responsable → verificar que no se rompe nada (retrocompatibilidad).
- Denegar permisos de contactos → verificar que la app muestra alerta y no crashea.
- Editar tarea existente → verificar que se carga y puede modificarse el responsable.
