# Software Concept & Execution Plan (SCEP): Gestor de Tareas

## 1. Visión General del Proyecto
* **Nombre del Proyecto**: TaskMaster Local.
* [cite_start]**Objetivo**: Desarrollar una aplicación móvil funcional en React Native para la gestión de tareas, aplicando componentes, navegación y persistencia local[cite: 9].
* [cite_start]**Tecnología Principal**: React Native - Expo[cite: 4].
* [cite_start]**Fecha Límite Técnica**: 12/05/2026[cite: 6].

## 2. Stack Tecnológico & Calidad de Código
* [cite_start]**Framework**: React Native con Expo (Managed Workflow)[cite: 4].
* **Lenguaje**: **TypeScript** (para asegurar robustez y tipado en el modelo de tareas).
* **Linter**: **ESLint** (estándares de código limpio para nivel SSR).
* [cite_start]**UI Components**: View, Text, TextInput, Button, TouchableOpacity[cite: 28].
* [cite_start]**Estilos**: StyleSheet[cite: 30].
* [cite_start]**Navegación**: React Navigation (Stack Navigation)[cite: 37].
* [cite_start]**Persistencia**: AsyncStorage para usuarios y tareas[cite: 54, 56].
* [cite_start]**Notificaciones**: Expo Notifications para alertas de tareas[cite: 71].

## 3. Arquitectura y Estructura (Nivel SSR)
* **`/src/types`**: Definición de interfaces de TypeScript para `Task` y `User`.
* [cite_start]**`/src/components`**: Implementación de al menos 1 componente reutilizable (ej: ítem de lista o botón personalizado)[cite: 32].
* [cite_start]**`/src/screens`**: Estructura de pantallas obligatorias: Login, Registro, Home y Alta[cite: 39, 40, 41, 42].
* **`/src/services`**: Módulos para AsyncStorage (CRUD de tareas) y lógica de notificaciones.

## 4. Lógica de Pantallas y Funcionalidad

### P1 & P2: Autenticación Local
* [cite_start]**Registro**: Captura de Usuario y Contraseña, guardándolos en AsyncStorage[cite: 46, 47, 48].
* **Login**: Validación de datos contra el storage. [cite_start]Bloqueo de acceso al Home sin sesión activa[cite: 49, 50].
* [cite_start]**Seguridad**: No se requiere backend ni cifrado avanzado[cite: 52, 53].

### P3: Home (Gestor de Tareas)
* [cite_start]**Visualización**: Renderizado de una lista de tareas con título y recordatorio recuperadas de AsyncStorage[cite: 67, 87].
* [cite_start]**Acciones**: Permitir la eliminación de al menos un elemento de la lista[cite: 68].

### P4: Alta de Tarea
* [cite_start]**Campos**: Entrada de texto para el título de la tarea y configuración de recordatorio[cite: 87].
* [cite_start]**Persistencia**: Los datos deben mantenerse al cerrar y volver a abrir la aplicación[cite: 69].
* [cite_start]**Notificación**: Programar una notificación simple que se dispare correctamente al cumplirse el recordatorio definido[cite: 71, 81, 84].