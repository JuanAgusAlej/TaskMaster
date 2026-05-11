# TaskMaster Local 🚀

**TaskMaster Local** es una aplicación móvil desarrollada en **React Native (Expo)** orientada a la gestión de tareas personales. La app se destaca por funcionar de manera 100% local, utilizando `AsyncStorage` para la persistencia de datos y ofreciendo un sistema inteligente de notificaciones locales.

Este proyecto fue desarrollado como parte de una entrega académica para la materia de Aplicaciones Móviles.

## 🎥 Demo y Descarga
¿Querés ver cómo funciona la aplicación en acción o probarla en tu dispositivo Android?
- [Ver Demo en YouTube](https://www.youtube.com/shorts/WoTBJ5KoH1Q)
- [Descargar APK (Google Drive)](https://drive.google.com/file/d/1GRgzXuatsc8JMsYADYxRoPiHMfr28FcY/view)

## ✨ Características Principales

- **🔐 Autenticación Local:** 
  - Registro e Inicio de sesión simulado y persistido en el dispositivo.
  - Protección de rutas: no se puede acceder a las tareas sin iniciar sesión.
- **📝 Gestión de Tareas (CRUD):** 
  - Listado de tareas activas y completadas.
  - Creación de nuevas tareas con título y descripción.
  - Eliminación y marcado de estado de tareas con animaciones fluidas (esqueletos de carga).
- **⏰ Sistema Híbrido de Recordatorios:**
  - **Temporizador (Hoy):** Permite configurar un recordatorio dinámico en horas, minutos y/o segundos que disparará una notificación push local al cumplirse el tiempo.
  - **Programación (Seleccionar Día):** Permite elegir una fecha y hora futura estricta (usando el calendario del sistema) para el recordatorio.
- **🎨 Interfaz Moderna y Oscura:**
  - Diseño *Dark Mode* premium con acentos en naranja neón (`#FF6B00`).
  - Navegación fluida por pestañas y stack.
  - Totalmente localizada al español.

## 🎨 Diseño UI/UX (Figma)
El diseño base y los prototipos de la aplicación fueron creados en Figma. Podés explorar el archivo de diseño aquí:
[Ver prototipo en Figma](https://www.figma.com/design/RKEVMoeaQyWNyVInNUN1oC/Untitled?m=auto&t=yxImqgsNAjrQ91sM-1)


## 🛠️ Stack Tecnológico

- **Framework:** [React Native](https://reactnative.dev/) mediante [Expo](https://expo.dev/) (Managed Workflow)
- **Lenguaje:** TypeScript
- **Navegación:** React Navigation (Native Stack)
- **Persistencia de Datos:** `@react-native-async-storage/async-storage`
- **Notificaciones Locales:** `expo-notifications`
- **Gestión de Fechas:** `@react-native-community/datetimepicker`
- **Iconografía:** `@expo/vector-icons` (Ionicons)

## 🏗️ Estructura del Proyecto

El proyecto sigue una arquitectura fuertemente modular para asegurar la escalabilidad:

```text
src/
├── components/      # Componentes reutilizables (Botones, Items de Lista, Modales)
├── constants/       # Variables globales (Tema, colores, tipografía)
├── navigation/      # Configuración de React Navigation y protección de rutas
├── screens/         # Pantallas principales (Login, Home, AddTask, etc.)
├── services/        # Lógica de negocio y persistencia (Auth, Tareas, Notificaciones)
└── types/           # Interfaces de TypeScript globales
```

## 🚀 Instalación y Uso Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- La aplicación [Expo Go](https://expo.dev/client) instalada en tu dispositivo iOS o Android.

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone git@github.com:JuanAgusAlej/TaskMaster.git
   cd TaskMaster
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```

4. **Probar la app:**
   - Abre la aplicación **Expo Go** en tu dispositivo físico.
   - Escanea el código QR que aparece en la terminal.
   - *(Opcional)* Si usas un emulador, presiona `a` para Android o `i` para iOS en la terminal de Expo.

---
