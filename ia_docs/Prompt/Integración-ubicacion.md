### 🚀 Prompt Maestro: Feature de Ubicación y Mapa (GPS)

> Actúa como un desarrollador Senior en **React Native y TypeScript**. Necesitamos iterar sobre nuestro proyecto **'TaskMaster Local'** para agregar una nueva funcionalidad: **Adjuntar la ubicación actual del dispositivo a la tarea y visualizarla en un mapa interactivo**.
>
> **Instrucciones Técnicas:**
>
> 1. **Módulos Nativos:** 
>    - Usa `expo-location` para obtener las coordenadas GPS del dispositivo.
>    - Usa `react-native-maps` para la visualización gráfica de la ubicación.
>
> 2. **Tipado (TypeScript):** 
>    - Actualiza la interfaz `Task` para incluir un campo opcional `location`:
>    ```typescript
>    interface LocationData {
>      latitude: number;
>      longitude: number;
>      address?: string;
>    }
>    
>    interface Task {
>      // ... campos anteriores
>      location?: LocationData; 
>    }
>    ```
>
> 3. **Flujo de Permisos y UI (Pantalla Alta de Tarea):**
>    - Agrega un botón *"Obtener Ubicación Actual"* en el formulario.
>    - Al presionarlo, invoca `Location.requestForegroundPermissionsAsync()`.
>    - Si el permiso es concedido, usa `Location.getCurrentPositionAsync()` para obtener las coordenadas.
>    - Implementa `Location.reverseGeocodeAsync()` para intentar traducir esas coordenadas a una dirección aproximada.
>    - Muestra un indicador en la UI de que la ubicación fue capturada con éxito (ej: mostrando la calle) antes de confirmar el guardado.
>
> 4. **Persistencia (AsyncStorage):** 
>    - Asegúrate de que el objeto `location` se guarde correctamente dentro de la tarea en el array persistido de `AsyncStorage`.
>
> 5. **Visualización (Pantalla Home / Detalle):** 
>    - Modifica el componente de detalle de la tarea o el `TaskItem`.
>    - Si la tarea tiene una `location` asociada, renderiza un componente `<MapView>` de `react-native-maps` centrado en esas coordenadas (`latitude` y `longitude`).
>    - Agrega un `<Marker>` en el mapa señalando el punto exacto.
>    - Muestra también la dirección en formato texto por encima o por debajo del mapa.
>
> **Restricciones:** 
> Maneja de manera segura los casos donde el usuario deniega los permisos de ubicación o el GPS está desactivado, usando bloques `try/catch` y mostrando un `Alert` amigable. Asegúrate de configurar un alto y ancho fijo para el `MapView` para que no rompa el layout, y mantén el tipado estricto en TypeScript sin usar `any`.
>
> Por favor, genera el código modificado para la interfaz de tipos, la pantalla de Alta de Tarea y el componente visual con el mapa.