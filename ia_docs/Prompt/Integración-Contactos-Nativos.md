Prompt de Actualización: Integración con Contactos Nativos
Actúa como un desarrollador Senior en React Native y TypeScript. Necesitamos iterar sobre nuestro proyecto 'TaskMaster Local' para agregar una nueva funcionalidad: Asignar un responsable a la tarea desde los contactos del celular.

Instrucciones Técnicas:

Módulo Nativo: Usa expo-contacts para interactuar con la agenda del dispositivo.

Tipado (TypeScript): Actualiza la interfaz Task para incluir un campo opcional assignedContact:

TypeScript
interface AssignedContact {
  id: string;
  name: string;
  phoneNumber?: string;
}
Flujo de Permisos y UI (Pantalla Alta de Tarea):

Agrega un botón "Seleccionar Responsable" en el formulario de creación.

Al presionarlo, solicita los permisos nativos de contactos empleando Contacts.requestPermissionsAsync().

Si el permiso es concedido, despliega un modal simple o un selector que liste los contactos del celular para que el usuario elija uno.

Muestra el nombre del contacto seleccionado en la interfaz antes de guardar.

Persistencia (AsyncStorage): Asegúrate de que al guardar la tarea, el objeto del contacto asignado se almacene correctamente dentro del array de tareas.

Visualización (Pantalla Home): Modifica el componente reutilizable TaskItem para que, si una tarea tiene un responsable asignado, muestre su nombre de forma clara y ordenada (ej: "Responsable: Juan Pérez").

Restricciones:
Mantén el código limpio, maneja los casos donde el usuario deniegue los permisos sin romper la aplicación y asegúrate de aplicar el tipado estricto de TypeScript sin usar any.

Por favor, genera las modificaciones necesarias en los archivos de tipos, el servicio de almacenamiento (si aplica) y las pantallas de Alta y Home.