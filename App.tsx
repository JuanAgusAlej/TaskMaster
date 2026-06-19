import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/theme';
import { View, LogBox } from 'react-native';

// Ignorar el error de Expo Go sobre notificaciones remotas en Android (SDK 53+)
// ya que nosotros solo usamos notificaciones locales para el recordatorio de 10 segs.
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
]);

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar style="light" backgroundColor={COLORS.background} />
        <AppNavigator />
      </View>
    </Provider>
  );
}
