import { Platform, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';

/**
 * Solicita permisos de lectura y escritura para el calendario nativo.
 */
const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Se necesita acceso al calendario para agendar la tarea. La tarea se guardará sin evento de calendario.'
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error requesting calendar permissions:', error);
    return false;
  }
};

/**
 * Busca un calendario donde se puedan crear y modificar eventos.
 * En iOS utiliza el calendario por defecto del sistema.
 * En Android busca un calendario que permita modificaciones.
 */
const getWritableCalendarId = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'ios') {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      return defaultCalendar ? defaultCalendar.id : null;
    } else {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      console.log(`[CalendarService] Found ${calendars.length} calendars on device`);

      // Filtrar solo calendarios que permiten modificaciones
      const writableCalendars = calendars.filter((cal) => cal.allowsModifications);
      console.log(`[CalendarService] ${writableCalendars.length} writable calendars found`);

      // 1. Prioridad: Calendario principal de cuenta Google (isPrimary + source type com.google)
      const googlePrimary = writableCalendars.find(
        (cal) => cal.isPrimary && cal.source && cal.source.type === 'com.google'
      );
      if (googlePrimary) {
        console.log(`[CalendarService] Using Google primary calendar: "${googlePrimary.title}" (id: ${googlePrimary.id})`);
        return googlePrimary.id;
      }

      // 2. Fallback: Cualquier calendario de Google con permisos OWNER
      const googleOwner = writableCalendars.find(
        (cal) => cal.source && cal.source.type === 'com.google' && cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
      );
      if (googleOwner) {
        console.log(`[CalendarService] Using Google owner calendar: "${googleOwner.title}" (id: ${googleOwner.id})`);
        return googleOwner.id;
      }

      // 3. Fallback: Cualquier calendario de Google escribible
      const googleAny = writableCalendars.find(
        (cal) => cal.source && cal.source.type === 'com.google'
      );
      if (googleAny) {
        console.log(`[CalendarService] Using Google calendar: "${googleAny.title}" (id: ${googleAny.id})`);
        return googleAny.id;
      }

      // 4. Último recurso: Cualquier calendario escribible con OWNER
      const anyOwner = writableCalendars.find(
        (cal) => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
      );
      if (anyOwner) {
        console.log(`[CalendarService] Using fallback owner calendar: "${anyOwner.title}" (id: ${anyOwner.id})`);
        return anyOwner.id;
      }

      // 5. Cualquier calendario escribible
      if (writableCalendars.length > 0) {
        console.log(`[CalendarService] Using first writable calendar: "${writableCalendars[0].title}" (id: ${writableCalendars[0].id})`);
        return writableCalendars[0].id;
      }

      console.log('[CalendarService] No writable calendar found, creating a new one...');
      // Si no existe un calendario modificable en Android, intentamos crear uno local
      const defaultSource = calendars.find((cal) => cal.source)?.source || {
        isLocalAccount: true,
        name: 'TaskMaster Local Source',
        type: Calendar.SourceType.LOCAL,
      };

      const newCalendarId = await Calendar.createCalendarAsync({
        title: 'Calendario TaskMaster',
        color: '#FF6F00',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultSource.id,
        source: defaultSource,
        name: 'TaskMaster Local Calendar',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });

      console.log(`[CalendarService] Created new calendar with id: ${newCalendarId}`);
      return newCalendarId;
    }
  } catch (error) {
    console.error('[CalendarService] Error getting writable calendar ID:', error);
    return null;
  }
};

/**
 * Crea un evento en el calendario nativo del dispositivo.
 * Retorna el ID del evento creado, o null en caso de error o falta de permisos.
 */
const createEvent = async (title: string, reminderTime: string, description?: string): Promise<string | null> => {
  try {
    console.log(`[CalendarService] createEvent called - title: "${title}", time: ${reminderTime}`);
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return null;
    }

    const calendarId = await getWritableCalendarId();
    if (!calendarId) {
      console.warn('[CalendarService] No writable calendar found on device.');
      Alert.alert('Error de Calendario', 'No se encontró un calendario disponible en el dispositivo.');
      return null;
    }

    const startDate = new Date(reminderTime);
    // Asignamos una duración por defecto de 1 hora al evento
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    console.log(`[CalendarService] Creating event in calendar ${calendarId}, start: ${startDate.toISOString()}, end: ${endDate.toISOString()}`);

    const eventId = await Calendar.createEventAsync(calendarId, {
      title,
      notes: description || '',
      startDate,
      endDate,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    });

    console.log(`[CalendarService] Event created successfully with id: ${eventId}`);
    return eventId;
  } catch (error) {
    console.error('[CalendarService] Error creating calendar event:', error);
    return null;
  }
};

/**
 * Modifica un evento existente en el calendario nativo.
 * Retorna true si fue exitoso, false en caso contrario.
 */
const updateEvent = async (eventId: string, title: string, reminderTime: string, description?: string): Promise<boolean> => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return false;
    }

    const startDate = new Date(reminderTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    await Calendar.updateEventAsync(eventId, {
      title,
      notes: description || '',
      startDate,
      endDate,
    });

    console.log(`[CalendarService] Event ${eventId} updated successfully`);
    return true;
  } catch (error) {
    console.error(`[CalendarService] Error updating calendar event with ID ${eventId}:`, error);
    return false;
  }
};

/**
 * Elimina un evento del calendario nativo del dispositivo.
 * Retorna true si fue exitoso, false en caso contrario.
 */
const deleteEvent = async (eventId: string): Promise<boolean> => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return false;
    }

    await Calendar.deleteEventAsync(eventId);
    console.log(`[CalendarService] Event ${eventId} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`[CalendarService] Error deleting calendar event with ID ${eventId}:`, error);
    return false;
  }
};

export const calendarService = {
  requestPermissions,
  getWritableCalendarId,
  createEvent,
  updateEvent,
  deleteEvent,
};
