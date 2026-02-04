import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { authAPI } from '../services/api';
import { saveToken, saveUser } from '../storage/authStorage';

const AdminLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Resetar erros
    setEmailError('');
    setPasswordError('');

    // Validação
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Email inválido');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setLoading(true);

    try {
      // Chamar API de login
      const response = await authAPI.login(email, password);

      if (response && response.token) {
        // Salvar token e dados do usuário
        await saveToken(response.token);
        if (response.user) {
          await saveUser(response.user);
        }

        // Limpar campos
        setEmail('');
        setPassword('');

        // Navegar para Dashboard
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Erro', 'Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro no login:', error);

      let errorMessage = 'Erro ao fazer login';

      if (error.response?.status === 401) {
        errorMessage = 'Email ou senha inválidos';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Dados inválidos';
      } else if (error.response?.status === 500) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde';
      } else if (error.message === 'Network Error') {
        errorMessage = 'Erro de conexão. Verifique sua internet';
      }

      Alert.alert('Erro de Autenticação', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Gestfy Admin</Text>
            <Text style={styles.subtitle}>Login do Administrador</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="seu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                placeholder="Digite sua senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                secureTextEntry={true}
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Gestfy © 2026 - Sistema de Gestão
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fadbd8',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default AdminLoginScreen;
