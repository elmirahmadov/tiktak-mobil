import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthActions, useAuthLoading } from '../../common/store/Auth';
import {
  formatPhoneNumber,
  cleanPhoneNumber,
} from '../../common/utils/phoneUtils';
import Toast from 'react-native-toast-message';

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
        Toast.show({
          type: 'success',
          text1: 'Qeydiyyat uğurlu!',
          text2: 'Artıq hesabınızla daxil ola bilərsiniz.',
        });
        navigation.navigate('Login', { phone: cleanPhoneNumber(phone) });
      },
      err => {
        Toast.show({
          type: 'error',
          text1: 'Qeydiyyat xətası!',
          text2: 'Bir problem baş verdi.',
        });
        console.log('Register error:', err);
      },
    );
  };

  return (
    <View style={styles.container}>
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
            color="#7BC142"
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
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Daxil olun</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
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
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
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
    backgroundColor: '#7BC142',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#7BC142', textAlign: 'center', marginTop: 8 },
});
