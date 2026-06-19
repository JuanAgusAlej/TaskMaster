# Prompt de Actualización: Migración a Redux Toolkit (RTK)

Copia y pega este prompt en tu herramienta de IA (Antigravity, Cursor, Windsurf, etc.) para refactorizar el manejo de estado de la aplicación.

---

### 🚀 Prompt Maestro: Migración a Redux Toolkit

Actúa como un desarrollador Senior en **React Native y TypeScript**. Necesitamos dar un salto arquitectónico en nuestro proyecto **'TaskMaster Local'**. Vamos a refactorizar el manejo del estado global migrando de `useState`/Context a **Redux Toolkit (RTK)**.

**Instrucciones Técnicas:**

1. **Instalación y Configuración Base:** 
   - Instala `@reduxjs/toolkit` y `react-redux`.
   - Crea un directorio `src/store`.
   - Configura el store principal en `src/store/index.ts`.
   - Crea los hooks tipados `useAppDispatch` y `useAppSelector` en `src/store/hooks.ts` para mantener el tipado estricto de TypeScript en toda la app.

2. **Creación de Slices (Estado Global):** 
   - **`taskSlice`:** Crea un slice para manejar el array de tareas (`Task[]`). Debe incluir acciones (reducers) para: `addTask`, `removeTask` y `updateTask` (ej: para marcar una tarea como completada).
   - **`authSlice`:** Crea un slice para manejar el usuario autenticado (`user` y `isAuthenticated`). Debe incluir acciones para `login` y `logout`.

3. **Integración con AsyncStorage (Persistencia):**
   - El store de Redux debe ser la única fuente de verdad en memoria, pero los datos deben seguir persistiendo.
   - Implementa `createAsyncThunk` (o un middleware simple) para que al despachar acciones como `addTask` o `login`, el estado se actualice en Redux y, simultáneamente, se guarde en `AsyncStorage`. Alternativamente, implementa una acción de inicialización (`loadTasks`, `loadUser`) que lea de AsyncStorage al arrancar la app y pueble el store.

4. **Refactorización de Componentes (Eliminar Prop Drilling):** 
   - **Pantalla Home:** Elimina los estados locales (`useState`) de la lista de tareas. Usa `useAppSelector` para leer el estado de `taskSlice` y renderizar el `FlatList`. Usa `useAppDispatch` para eliminar tareas.
   - **Pantalla Alta de Tarea:** Usa `useAppDispatch` para agregar la nueva tarea al store global.
   - **Navegación (AuthGuard):** Actualiza el `AuthGuard` para que lea el estado de sesión desde el `authSlice` usando `useAppSelector`.
   - Envuelve la aplicación entera con el `<Provider store={store}>` en el `App.tsx` (o archivo raíz).

**Restricciones:** 
El código debe mantener el nivel de Seniority (SSR). No utilices `any`. Aplica el patrón de separación de responsabilidades: los componentes solo despachan acciones y leen selectores, toda la lógica de mutación de datos debe quedar aislada en los reducers/thunks. 

Por favor, genera el código para la configuración del Store, los Slices, los hooks tipados y muestra cómo quedarían refactorizados el componente `Home` y el archivo `App.tsx`.
---
