import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { authService } from '../../services/authService';
import { COLORS } from '../../constants/theme';
import { styles } from './style';

import { NavigationProp } from './types';

export const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const { container, inner, logoContainer, logoText, formContainer, input, passwordContainer, passwordInput, eyeButton, loginButton, registerContainer, registerText, registerLink } = styles;

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor ingresá usuario y contraseña');
      return;
    }
    
    setLoading(true);
    const success = await authService.loginUser(username, password);
    setLoading(false);
    
    if (!success) {
      Alert.alert('Error', 'Credenciales inválidas');
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

            <CustomButton
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              style={loginButton}
            />

            <View style={registerContainer}>
              <Text style={registerText}>¿No tenés cuenta? </Text>
              <Text 
                style={registerLink} 
                onPress={() => navigation.navigate('Register')}
              >
                Registrate
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
