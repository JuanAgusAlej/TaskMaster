import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateTaskAsync } from '../store/taskSlice';

/**
 * Identifica si una tarea usa temporizador ("hoy") basándose en su reminderConfig.
 * Las tareas de tipo "hoy" contienen "h", "min" o "seg" en el config.
 */
const isTimerTask = (reminderConfig?: string): boolean => {
  if (!reminderConfig) return false;
  return (
    reminderConfig.includes('h') ||
    reminderConfig.includes('min') ||
    reminderConfig.includes('seg')
  );
};

/**
 * Hook que auto-completa las tareas con temporizador ("hoy") cuando su
 * reminderTime ya pasó. Funciona de dos formas:
 *
 * 1. **Escaneo al montar**: revisa todas las tareas pendientes de tipo timer
 *    y marca como completadas aquellas cuyo tiempo ya expiró.
 *
 * 2. **Listener de notificaciones**: cuando llega una notificación local
 *    (el timer se disparó), marca la tarea correspondiente como completada
 *    en tiempo real.
 */
export const useAutoCompleteTimerTasks = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s) => s.tasks.items);
  const processedIds = useRef<Set<string>>(new Set());

  // 1. Escaneo: marcar como completadas las tareas timer cuyo tiempo ya pasó
  useEffect(() => {
    const now = Date.now();

    tasks.forEach((task) => {
      if (
        !task.completed &&
        isTimerTask(task.reminderConfig) &&
        new Date(task.reminderTime).getTime() <= now &&
        !processedIds.current.has(task.id)
      ) {
        processedIds.current.add(task.id);
        dispatch(updateTaskAsync({ ...task, completed: true }));
      }
    });
  }, [tasks, dispatch]);

  // 2. Listener: cuando llega una notificación, completar la tarea asociada
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const taskId = notification.request.content.data?.taskId as
          | string
          | undefined;
        if (!taskId) return;

        const task = tasks.find((t) => t.id === taskId);
        if (
          task &&
          !task.completed &&
          isTimerTask(task.reminderConfig) &&
          !processedIds.current.has(task.id)
        ) {
          processedIds.current.add(task.id);
          dispatch(updateTaskAsync({ ...task, completed: true }));
        }
      }
    );

    return () => subscription.remove();
  }, [tasks, dispatch]);
};
