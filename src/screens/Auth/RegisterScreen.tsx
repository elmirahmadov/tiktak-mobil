import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthActions, useAuthLoading } from '../../common/store/Auth';
import {
  formatPhoneNumber,
  cleanPhoneNumber,
} from '../../common/utils/phoneUtils';

export default function RegisterScreen({ navigation }: any) {
  const loading = useAuthLoading();
  const actions = useAuthActions();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhoneNumber(value));
  };

  const handleRegister = async () => {
    await actions.signup(
      { full_name: name, phone: cleanPhoneNumber(phone), password },
      () => {
        navigation.replace('Login', { phone: cleanPhoneNumber(phone) });
      },
      _err => {},
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Qeydiyyatdan keç</Text>
        <TextInput
          style={styles.input}
          placeholder="Ad, soyad"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefon"
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          onFocus={() => {
            if (!phone) setPhone('(+994) ');
          }}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputInner}
            placeholder="Parol"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setShowPassword(v => !v)}
            activeOpacity={0.7}
          >
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#76CB4F"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Qeydiyyat...' : 'Qeydiyyat'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Hesabınız varsa{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Daxil olun
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#232A36',
    backgroundColor: '#F6F5FB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#F6F5FB',
  },
  inputInner: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#232A36',
    paddingRight: 40,
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    padding: 8,
    zIndex: 2,
  },
  button: {
    backgroundColor: '#76CB4F',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  loginText: {
    color: '#222',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 15,
  },
  loginLink: {
    color: '#76CB4F',
    fontWeight: 'bold',
  },
});
