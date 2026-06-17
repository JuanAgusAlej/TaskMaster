### 🚀 Prompt Feature de Cámara y Galería

> Actúa como un desarrollador Senior en **React Native y TypeScript**. Necesitamos iterar sobre nuestro proyecto **'TaskMaster Local'** para agregar una nueva funcionalidad clave: **Permitir al usuario adjuntar una foto a la tarea, ya sea tomándola con la cámara o seleccionándola desde la galería**.
>
> **Instrucciones Técnicas:**
>
> 1. **Módulo Nativo:** 
>    - Usa `expo-image-picker` para manejar tanto el acceso a la galería como la captura con la cámara de forma unificada y eficiente.
>
> 2. **Tipado (TypeScript):** 
>    - Actualiza la interfaz `Task` para incluir un campo opcional `imageUri` (string) que almacenará la ruta local de la imagen:
>    ```typescript
>    interface Task {
>      // ... campos anteriores (id, title, reminderTime, completed, assignedContact)
>      imageUri?: string; 
>    }
>    ```
>
> 3. **Flujo de Permisos y UI (Pantalla Alta de Tareas):**
>    - Agrega controles en el formulario que ofrezcan las opciones: *"Tomar Foto"* y *"Seleccionar de la Galería"*.
>    - **Para la Cámara:** Invoca `ImagePicker.requestCameraPermissionsAsync()`. Si el permiso es concedido, lanza `ImagePicker.launchCameraAsync()`.
>    - **Para la Galería:** Invoca `ImagePicker.requestMediaLibraryPermissionsAsync()`. Si el permiso es concedido, lanza `ImagePicker.launchImageLibraryAsync()`.
>    - Configura el picker con `mediaTypes: ['images']`, `allowsEditing: true` y `quality: 0.7` para optimizar el peso de la imagen.
>    - Si el usuario captura o selecciona una foto con éxito, muestra una miniatura (`Image`) de previsualización en el formulario antes de confirmar el guardado.
>
> 4. **Persistencia (AsyncStorage):** 
>    - Asegúrate de que la URI local de la imagen (`result.assets[0].uri`) se almacene correctamente dentro del objeto de la tarea en `AsyncStorage`.
>
> 5. **Visualización (Pantalla Home / Ítem de Tarea):** 
>    - Modifica el componente reutilizable `TaskItem`. Si la tarea contiene una `imageUri`, renderiza la imagen asociada utilizando el componente `Image` de React Native de forma clara, ordenada y fácil de usar.
>
> **Restricciones:** 
> Maneja de manera segura los casos donde el usuario cancela la acción o deniega los permisos usando bloques `try/catch`. Asegúrate de aplicar tipado estricto en los payloads devueltos por el picker sin recurrir a `any`.
>
> Por favor, genera el código modificado para la interfaz de tipos, la pantalla de Alta de Tarea y el componente visual de la lista.

---

### 💡 Consejos para la ejecución en Vibe Coding:
* **Simuladores vs Real:** Recordá que en los simuladores de PC (como Android Studio o Xcode), la cámara nativa a veces emula una escena estática o puede fallar si no tiene una cámara física asignada. Te sugiero probar este flujo abriendo el proyecto con **Expo Go** en tu dispositivo físico para asegurar que tanto el almacenamiento local de las URIs temporales como los permisos respondan al instante.

¡Con este prompt, Antigravity te va a dejar el sistema de adjuntos cerrado y listo para la entrega!