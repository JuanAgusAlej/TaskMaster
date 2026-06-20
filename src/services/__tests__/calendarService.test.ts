import { Platform, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import { calendarService } from '../calendarService';

describe('calendarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPermissions', () => {
    it('should return true if status is granted', async () => {
      (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
      const result = await calendarService.requestPermissions();
      expect(result).toBe(true);
    });

    it('should return false and alert if status is not granted', async () => {
      (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

      const result = await calendarService.requestPermissions();
      expect(result).toBe(false);
      expect(alertSpy).toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should return false if request permissions throws an error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockRejectedValue(new Error('Permission error'));

      const result = await calendarService.requestPermissions();
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getWritableCalendarId', () => {
    const originalOS = Platform.OS;

    afterEach(() => {
      Platform.OS = originalOS;
    });

    it('should return default calendar id on iOS', async () => {
      Platform.OS = 'ios';
      (Calendar.getDefaultCalendarAsync as jest.Mock).mockResolvedValue({ id: 'ios-default-id' });

      const result = await calendarService.getWritableCalendarId();
      expect(result).toBe('ios-default-id');
      expect(Calendar.getDefaultCalendarAsync).toHaveBeenCalled();
    });

    it('should return null on iOS if default calendar is not found', async () => {
      Platform.OS = 'ios';
      (Calendar.getDefaultCalendarAsync as jest.Mock).mockResolvedValue(null);

      const result = await calendarService.getWritableCalendarId();
      expect(result).toBeNull();
    });

    describe('Android priority checks', () => {
      beforeEach(() => {
        Platform.OS = 'android';
      });

      it('should pick googlePrimary calendar (google primary source)', async () => {
        const calendars = [
          { id: '1', title: 'Google Primary', isPrimary: true, allowsModifications: true, source: { type: 'com.google' } },
          { id: '2', title: 'Local', allowsModifications: true, accessLevel: 'owner' },
        ];
        (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue(calendars);

        const result = await calendarService.getWritableCalendarId();
        expect(result).toBe('1');
      });

      it('should pick googleOwner calendar (google source + owner access level) if primary google is not found', async () => {
        const calendars = [
          { id: '1', title: 'Google Regular', allowsModifications: true, source: { type: 'com.google' }, accessLevel: 'owner' },
          { id: '2', title: 'Local', allowsModifications: true },
        ];
        (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue(calendars);

        const result = await calendarService.getWritableCalendarId();
        expect(result).toBe('1');
      });

      it('should pick googleAny calendar (google source) if primary or owner google are not found', async () => {
        const calendars = [
          { id: '1', title: 'Google Guest', allowsModifications: true, source: { type: 'com.google' }, accessLevel: 'read' },
          { id: '2', title: 'Local', allowsModifications: true },
        ];
        (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue(calendars);

        const result = await calendarService.getWritableCalendarId();
        expect(result).toBe('1');
      });

      it('should pick anyOwner calendar if no Google calendar is writable', async () => {
        const calendars = [
          { id: '1', title: 'Local Custom', allowsModifications: true, accessLevel: 'owner', source: { type: 'local' } },
        ];
        (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue(calendars);

        const result = await calendarService.getWritableCalendarId();
        expect(result).toBe('1');
      });

      it('should pick first writable calendar if no owner or google is found', async () => {
        const calendars = [
          { id: '1', title: 'Local Read Only', allowsModifications: false },
          { id: '2', title: 'Writable Guest', allowsModifications: true, accessLevel: 'read', source: { type: 'other' } },
        ];
        (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue(calendars);

        const result = await calendarService.getWritableCalendarId();
        expect(result).toBe('2');
      });

      it('should create a local calendar if no writable calendars exist', async () => {
        (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([
          { id: '1', title: 'Read-only', allowsModifications: false, source: { id: 'source-123', type: 'local' } }
        ]);
        (Calendar.createCalendarAsync as jest.Mock).mockResolvedValue('new-local-cal-id');

        const result = await calendarService.getWritableCalendarId();
        expect(result).toBe('new-local-cal-id');
        expect(Calendar.createCalendarAsync).toHaveBeenCalled();
      });

      it('should return null if an error occurs', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        (Calendar.getCalendarsAsync as jest.Mock).mockRejectedValue(new Error('Fetch calendars error'));

        const result = await calendarService.getWritableCalendarId();
        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe('createEvent', () => {
    beforeEach(() => {
      (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    });

    it('should return null if requestPermissions returns false', async () => {
      (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

      const result = await calendarService.createEvent('Title', '2026-06-19T14:00:00Z');
      expect(result).toBeNull();
      alertSpy.mockRestore();
    });

    it('should return null and Alert if getWritableCalendarId returns null', async () => {
      (Calendar.getDefaultCalendarAsync as jest.Mock).mockResolvedValue(null);
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

      const result = await calendarService.createEvent('Title', '2026-06-19T14:00:00Z');
      expect(result).toBeNull();
      expect(alertSpy).toHaveBeenCalledWith('Error de Calendario', 'No se encontró un calendario disponible en el dispositivo.');
      alertSpy.mockRestore();
    });

    it('should create event successfully', async () => {
      (Calendar.getDefaultCalendarAsync as jest.Mock).mockResolvedValue({ id: 'calendar-id' });
      (Calendar.createEventAsync as jest.Mock).mockResolvedValue('event-123');

      const result = await calendarService.createEvent('Title', '2026-06-19T14:00:00Z', 'Notes');
      expect(result).toBe('event-123');
      expect(Calendar.createEventAsync).toHaveBeenCalledWith('calendar-id', expect.objectContaining({
        title: 'Title',
        notes: 'Notes',
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      }));
    });

    it('should return null and log error if createEventAsync throws', async () => {
      (Calendar.getDefaultCalendarAsync as jest.Mock).mockResolvedValue({ id: 'calendar-id' });
      (Calendar.createEventAsync as jest.Mock).mockRejectedValue(new Error('Create error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await calendarService.createEvent('Title', '2026-06-19T14:00:00Z');
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateEvent', () => {
    beforeEach(() => {
      (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    });

    it('should return false if permission is denied', async () => {
      (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

      const result = await calendarService.updateEvent('event-123', 'Title', '2026-06-19T14:00:00Z');
      expect(result).toBe(false);
      alertSpy.mockRestore();
    });

    it('should update event successfully', async () => {
      (Calendar.updateEventAsync as jest.Mock).mockResolvedValue(undefined);

      const result = await calendarService.updateEvent('event-123', 'Title', '2026-06-19T14:00:00Z', 'Notes');
      expect(result).toBe(true);
      expect(Calendar.updateEventAsync).toHaveBeenCalledWith('event-123', expect.objectContaining({
        title: 'Title',
        notes: 'Notes',
      }));
    });

    it('should return false and log error if updateEventAsync throws', async () => {
      (Calendar.updateEventAsync as jest.Mock).mockRejectedValue(new Error('Update error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await calendarService.updateEvent('event-123', 'Title', '2026-06-19T14:00:00Z');
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('deleteEvent', () => {
    beforeEach(() => {
      (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    });

    it('should return false if permission is denied', async () => {
      (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

      const result = await calendarService.deleteEvent('event-123');
      expect(result).toBe(false);
      alertSpy.mockRestore();
    });

    it('should delete event successfully', async () => {
      (Calendar.deleteEventAsync as jest.Mock).mockResolvedValue(undefined);

      const result = await calendarService.deleteEvent('event-123');
      expect(result).toBe(true);
      expect(Calendar.deleteEventAsync).toHaveBeenCalledWith('event-123');
    });

    it('should return false and log error if deleteEventAsync throws', async () => {
      (Calendar.deleteEventAsync as jest.Mock).mockRejectedValue(new Error('Delete error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await calendarService.deleteEvent('event-123');
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
