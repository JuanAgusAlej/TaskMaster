# Documentación de Inteligencia Artificial (IA)

Este directorio contiene la información sobre el uso de herramientas de Inteligencia Artificial (IA) como asistencia durante el ciclo de vida de desarrollo de la aplicación **TaskMaster**.

## Asistente de IA Utilizado
- **Asistente**: Antigravity (Google DeepMind Agentic Coding Assistant)
- **Rol**: Pair Programmer / Desarrollador Full-Stack React Native
- **Herramientas empleadas**: Generación de código, refactorización de arquitectura, edición de archivos, resolución de errores (debugging), generación de assets visuales (imágenes) y ejecución de comandos de terminal (TypeScript checking, instalación de dependencias).

## Principales Contribuciones de la IA

Durante el desarrollo de **TaskMaster**, la IA asistió en los siguientes hitos:

1. **Estructura y Arquitectura del Proyecto**:
   - Refactorización de la arquitectura de la aplicación hacia un modelo altamente modular, separando pantallas (`src/screens`) y componentes (`src/components`) en carpetas propias con sus respectivos archivos `style.tsx` (estilos) y `types.ts` (interfaces TypeScript).
   
2. **Desarrollo de Interfaz de Usuario (UI) y Experiencia (UX)**:
   - Creación de componentes reutilizables como `CustomButton`, `TaskItem`, `ConfirmModal`, y `TabSelector`.
   - Implementación de un **Esqueleto de Carga Animado** (`TaskItemSkeleton`) para mejorar la fluidez visual al cambiar entre las pestañas de tareas en progreso y completadas, reemplazando los típicos *spinners* de carga.
   - Integración nativa de íconos mediante `@expo/vector-icons` (`Ionicons`), incluyendo la lógica interactiva de mostrar/ocultar contraseñas.

3. **Lógica de Negocio y Funcionalidades Core**:
   - Implementación de un sistema de recordatorios de doble formato: "Hoy" (temporizador/cuenta regresiva que ignora ceros innecesarios) y "Seleccionar día" (validación estricta de fechas futuras).
   - Manipulación y formateo de cadenas de texto y fechas en tiempo real (ej. conversión de `"1h 30min"` o despliegue de fechas locales absolutas).

4. **Traducción y Localización**:
   - Búsqueda (`grep_search`) y reemplazo de cadenas de texto en inglés para localizar íntegramente la aplicación al español latinoamericano.

5. **Generación de Recursos Visuales (Assets)**:
   - **App Icon**: Generación de un logotipo minimalista y moderno con fondo oscuro y un *checkmark* naranja a través de un modelo de generación de imágenes por prompt.
   - **Splash Screen**: Generación de una pantalla de carga plana ajustada a los colores corporativos de la aplicación (`#121212`) para un inicio fluido en Expo y dispositivos nativos.

## Metodología de Interacción (Prompts)
El desarrollo siguió un enfoque de **Software Concept & Execution Plan (SCEP)**, donde el usuario (desarrollador principal) establecía los requerimientos de negocio y arquitectura (ej. uso de `AsyncStorage`, `React Navigation`, validaciones), y la IA se encargaba de planificar la implementación técnica mediante *Implementation Plans*, solicitar aprobación, y posteriormente ejecutar las escrituras en código y verificar la compilación mediante `npx tsc`.
