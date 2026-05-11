import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { authService } from '../../services/authService';
import { COLORS } from '../../constants/theme';
import { styles } from './style';

import { NavigationProp } from './types';

export const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const { container, inner, logoContainer, logoText, formContainer, input, passwordContainer, passwordInput, eyeButton, registerButton, loginContainer, loginText, loginLink } = styles;

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completá todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    const success = await authService.registerUser({ username, password });
    setLoading(false);
    
    if (success) {
      Alert.alert('Éxito', 'Cuenta creada exitosamente', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      Alert.alert('Error', 'El usuario ya existe');
    }
  };

  return (
    <KeyboardAvoidingView
      style={container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={inner}>
          <View style={logoContainer}>
            <Text style={logoText}>Task</Text>
            <Text style={logoText}>Master</Text>
          </View>

          <View style={formContainer}>
            <TextInput
              style={input}
              placeholder="Usuario"
              placeholderTextColor={COLORS.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <View style={passwordContainer}>
              <TextInput
                style={passwordInput}
                placeholder="Contraseña"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={eyeButton} onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color={COLORS.accent} />
              </TouchableOpacity>
            </View>

            <View style={passwordContainer}>
              <TextInput
                style={passwordInput}
                placeholder="Confirmar Password"
                placeholderTextColor={COLORS.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity style={eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)} activeOpacity={0.7}>
                <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color={COLORS.accent} />
              </TouchableOpacity>
            </View>

            <CustomButton
              title="Crear Cuenta"
              onPress={handleRegister}
              loading={loading}
              style={registerButton}
            />

            <View style={loginContainer}>
              <Text style={loginText}>¿Ya tenés cuenta? </Text>
              <Text 
                style={loginLink} 
                onPress={() => navigation.navigate('Login')}
              >
                Iniciá sesión
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
