# TaskMaster Local 🚀

**TaskMaster Local** es una aplicación móvil desarrollada en **React Native (Expo)** orientada a la gestión de tareas personales. La app se destaca por funcionar de manera 100% local y ofrecer un sistema inteligente de notificaciones, integración con funcionalidades nativas del dispositivo y una arquitectura robusta apoyada por herramientas de Inteligencia Artificial.

Este proyecto fue desarrollado como parte de una entrega académica para la materia de Aplicaciones Móviles.

## 🎥 Demo y Descarga
¿Querés ver cómo funciona la aplicación en acción o probarla en tu dispositivo Android?
- [Ver Demo en YouTube PARTE 1](https://www.youtube.com/shorts/WoTBJ5KoH1Q)
- [Ver Demo en YouTube PARTE 2]([https://www.youtube.com/shorts/kptR_iH5eZU](https://youtube.com/shorts/kptR_iH5eZU))
- [Descargar APK (Google Drive)](https://drive.google.com/file/d/1Rejfa1c72vQmo-_kBQ0tVXfous53hHqh/view?usp=sharing)

## ✨ Características Principales

- **🔐 Autenticación Local:** 
  - Registro e Inicio de sesión simulado y persistido en el dispositivo.
  - Protección de rutas: no se puede acceder a las tareas sin iniciar sesión.
- **📝 Gestión de Tareas Avanzada (CRUD):** 
  - Listado de tareas activas y completadas.
  - Creación de tareas con título, descripción y validación de formularios.
  - Asignación de **Contactos** del dispositivo a las tareas.
  - Adjuntar **Imágenes o Fotos** desde la cámara o galería.
  - Registro de **Ubicación** asociada a la tarea visible mediante mapas.
  - Eliminación y marcado de estado de tareas con animaciones fluidas (esqueletos de carga).
- **⏰ Sistema Híbrido de Recordatorios:**
  - **Temporizador (Hoy):** Configuración de un recordatorio dinámico en horas, minutos y/o segundos (notificación push local).
  - **Programación (Seleccionar Día):** Selección de fecha y hora futura estricta con integración directa al **Calendario Nativo** del sistema.
- **🎨 Interfaz Moderna y Oscura:**
  - Diseño *Dark Mode* premium con acentos en naranja neón (`#FF6B00`).
  - Navegación fluida por pestañas y stack.
  - Totalmente localizada al español.

## 🤖 Asistencia de Inteligencia Artificial (IA)

Durante el ciclo de vida de desarrollo de **TaskMaster**, se utilizaron herramientas de Inteligencia Artificial para asistir en la programación, arquitectura y diseño.

- **Asistente**: Antigravity (Google DeepMind Agentic Coding Assistant)
- **Rol**: Pair Programmer / Desarrollador Full-Stack React Native
- **Metodología**: Se siguió el enfoque **Software Concept & Execution Plan (SCEP)**, donde el desarrollador principal establecía los requerimientos de negocio y arquitectura, y la IA planificaba la implementación técnica, solicitaba aprobación y ejecutaba el código correspondiente.
- **Historial y Planificación**: Todos los planes de implementación y los prompts específicos utilizados para guiar el desarrollo de cada módulo pueden ser consultados en las carpetas correspondientes de `ia_docs/` (`ia_docs/plan/` e `ia_docs/Prompt/` respectivamente).

### Principales Contribuciones de la IA
1. **Estructura y Arquitectura**: Refactorización de la aplicación hacia un modelo altamente modular, migración de la gestión de estado a **Redux Toolkit** y desarrollo de tests unitarios con **Jest**.
2. **Desarrollo de UI/UX**: Creación de esqueletos de carga animados (*Skeletons*) y la integración de íconos nativos (`@expo/vector-icons`).
3. **Lógica de Negocio e Integraciones**: Implementación de la compleja integración de módulos nativos (Cámara/Galería, Contactos, Ubicación y Calendario).
4. **Recursos Visuales**: Generación del logotipo minimalista de la app y la pantalla de carga (*Splash Screen*) mediante modelos de generación de imágenes por prompt.

> **Prompt utilizado para generar esta documentación:**
> *"Analiza el estado actual del proyecto y actualiza el archivo README.md de forma completa. Agrega un apartado específico detallando el uso de Inteligencia Artificial, incorporando la información de la documentación ubicada en la carpeta `ia_docs`. Además, incluye este mismo prompt redactado de una manera más clara, profesional y descriptiva."*

## 🎨 Diseño UI/UX (Figma)
El diseño base y los prototipos de la aplicación fueron creados en Figma. Podés explorar el archivo de diseño aquí:
[Ver prototipo en Figma](https://www.figma.com/design/RKEVMoeaQyWNyVInNUN1oC/Untitled?m=auto&t=yxImqgsNAjrQ91sM-1)

## 🛠️ Stack Tecnológico

- **Framework:** [React Native](https://reactnative.dev/) mediante [Expo](https://expo.dev/) (Managed Workflow)
- **Lenguaje:** TypeScript
- **Navegación:** React Navigation (Native Stack)
- **Gestión de Estado:** Redux Toolkit
- **Persistencia de Datos:** `@react-native-async-storage/async-storage`
- **Integraciones Nativas:** 
  - `expo-notifications` (Notificaciones locales)
  - `expo-image-picker` (Cámara y Galería)
  - `expo-contacts` (Contactos del dispositivo)
  - `expo-location` y `react-native-maps` (Geolocalización)
  - `expo-calendar` (Calendario del sistema)
- **Testing:** Jest
- **Iconografía:** `@expo/vector-icons` (Ionicons)

## 🏗️ Estructura del Proyecto

El proyecto sigue una arquitectura fuertemente modular para asegurar la escalabilidad:

```text
src/
├── components/      # Componentes reutilizables (Botones, Items de Lista, Modales)
├── constants/       # Variables globales (Tema, colores, tipografía)
├── hooks/           # Custom hooks para lógica reutilizable
├── navigation/      # Configuración de React Navigation y protección de rutas
├── screens/         # Pantallas principales (Login, Home, AddTask, etc.)
├── services/        # Lógica de negocio (Auth, Tareas, Notificaciones, etc.)
├── store/           # Configuración de Redux Toolkit (Slices, Store)
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

## 🧪 Testing y Cobertura (Coverage)

La aplicación cuenta con una suite de pruebas unitarias y de integración desarrolladas con **Jest** y **React Native Testing Library** para asegurar la estabilidad y el correcto funcionamiento del software.

### Ejecutar Pruebas
Para correr los tests en tu entorno local:

- **Ejecutar todos los tests:**
  ```bash
  npm run test
  ```
- **Ejecutar en modo interactivo (watch):**
  ```bash
  npm run test:watch
  ```
- **Generar reporte de cobertura:**
  ```bash
  npm run test:coverage
  ```

### Reporte de Cobertura Actual (Coverage)

El proyecto cuenta con una cobertura global muy alta, superando el **90%** en líneas de código:

| Módulo / Carpeta | % Sentencias (Stmts) | % Ramas (Branch) | % Funciones (Funcs) | % Líneas |
| :--- | :---: | :---: | :---: | :---: |
| **Total del Proyecto** | **89.60%** | **79.66%** | **88.55%** | **90.40%** |
| `components/ConfirmModal` | 100% | 100% | 100% | 100% |
| `components/ContactPickerModal` | 93.33% | 82.35% | 100% | 93.18% |
| `components/CustomButton` | 70.58% | 76.00% | 100% | 70.58% |
| `components/LocationPickerModal` | 76.82% | 69.44% | 77.77% | 77.77% |
| `components/TabSelector` | 100% | 100% | 100% | 100% |
| `components/TaskItem` | 100% | 81.48% | 100% | 100% |
| `components/TaskItemSkeleton` | 100% | 100% | 100% | 100% |
| `hooks/` | 92.59% | 89.47% | 100% | 100% |
| `navigation/` | 100% | 100% | 100% | 100% |
| `screens/AddTaskScreen` | 74.73% | 70.86% | 46.42% | 75.84% |
| `screens/HomeScreen` | 96.66% | 80.00% | 95.23% | 98.18% |
| `screens/LoginScreen` | 100% | 87.50% | 100% | 100% |
| `screens/RegisterScreen` | 100% | 93.33% | 100% | 100% |
| `screens/TaskDetailScreen` | 94.73% | 71.87% | 100% | 100% |
| `services/` | 99.49% | 93.05% | 96.77% | 99.47% |
| `store/` | 100% | 62.50% | 100% | 100% |

- **Estadísticas de ejecución:** 148 pruebas aprobadas (20 suites de test completadas con éxito).

---
