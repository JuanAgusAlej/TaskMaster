global.IS_REACT_ACT_ENVIRONMENT = true;

// Suprimir advertencias molestas de entorno act() en React 19 y VirtualizedList en pruebas
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (
    message.includes('not configured to support act') ||
    message.includes('inside a test was not wrapped in act') ||
    message.includes('overlapping act() calls') ||
    message.includes('You called act(async () => ...) without await')
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock global de AppState para que addEventListener siempre devuelva una suscripción válida
jest.spyOn(require('react-native').AppState, 'addEventListener').mockImplementation(() => ({
  remove: jest.fn(),
}));

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock de React Native Maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const MockMapView = ({ children, testID, ...props }) => {
    return React.createElement('MapView', { ...props, testID }, children);
  };
  
  const MockMarker = ({ children, testID, ...props }) => {
    return React.createElement('Marker', { ...props, testID }, children);
  };
  
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

// Mock de Expo Contacts
jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(),
  getContactsAsync: jest.fn(),
  Fields: {
    Name: 'name',
    PhoneNumbers: 'phoneNumbers',
  },
  SortTypes: {
    FirstName: 'firstName',
  },
}));

// Mock de Expo Location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  geocodeAsync: jest.fn(),
  Accuracy: {
    Balanced: 2,
  },
}));

// Mock de Expo Notifications
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  AndroidImportance: {
    MAX: 4,
  },
  SchedulableTriggerInputTypes: {
    DATE: 'date',
  },
}));

// Mock de Expo Calendar
jest.mock('expo-calendar', () => ({
  requestCalendarPermissionsAsync: jest.fn(),
  getCalendarsAsync: jest.fn(),
  getDefaultCalendarAsync: jest.fn(),
  createCalendarAsync: jest.fn(),
  createEventAsync: jest.fn(),
  updateEventAsync: jest.fn(),
  deleteEventAsync: jest.fn(),
  EntityTypes: {
    EVENT: 'event',
  },
  AlarmMethod: {
    ALERT: 'alert',
  },
  CalendarAccessLevel: {
    OWNER: 'owner',
  },
  SourceType: {
    LOCAL: 'local',
  },
}));

// Mock de Expo Device
jest.mock('expo-device', () => ({
  isDevice: true,
}));

// Mock de @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name, testID, ...props }) => {
      return React.createElement(Text, { ...props, testID }, name);
    },
  };
});

// Mock de React Native Safe Area Context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 0, height: 0 };
  const SafeAreaInsetsContext = React.createContext(insets);
  const SafeAreaFrameContext = React.createContext(frame);
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children }) => React.createElement(View, null, children),
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: {
      fallback: true,
      frame,
      insets,
    },
  };
});

// Mock de uuid
jest.mock('uuid', () => ({
  v4: () => 'mocked-uuid-1234',
}));

// Mock de react-native-screens
jest.mock('react-native-screens', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    enableScreens: jest.fn(),
    screensEnabled: jest.fn(() => true),
    ScreenContainer: View,
    Screen: View,
    NativeScreen: View,
    NativeScreenContainer: View,
    ScreenStack: View,
    ScreenStackItem: View,
    ScreenFooter: View,
    ScreenStackHeaderConfig: View,
    ScreenStackHeaderSubview: View,
    SearchBar: View,
    isSearchBarAvailableForCurrentPlatform: jest.fn(() => true),
    ScreenStackHeaderBackButtonImage: View,
    ScreenStackHeaderCenterView: View,
    ScreenStackHeaderLeftView: View,
    ScreenStackHeaderRightView: View,
    ScreenStackHeaderSearchBarView: View,
    compatibilityFlags: {
      usesNewAndroidHeaderHeightImplementation: true,
    },
  };
});
