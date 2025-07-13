import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../../common/store/Auth';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import Footer from '../../common/components/Footer';

const AccountInfoScreen = ({ navigation }: { navigation: any }) => {
  const user = useAuthStore(state => state.user);
  const [name, setName] = useState(user?.full_name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const actions = useAuthStore(state => state.actions);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    if ((password || passwordRepeat) && password !== passwordRepeat) {
      Toast.show({ type: 'error', text1: 'Şifrələr eyni deyil!' });
      setLoading(false);
      return;
    }
    const updateData: any = {
      full_name: name,
      phone,
      address: address || user?.address || '',
    };
    if (password && passwordRepeat && password === passwordRepeat) {
      updateData.password = password;
    }
    console.log('Profil update gönderilen veri:', updateData);
    actions.updateProfile(
      updateData,
      async () => {
        await actions.getProfile();
        Toast.show({ type: 'success', text1: 'Profil yeniləndi' });
        navigation.navigate('Profile');
        setLoading(false);
      },
      () => {
        Toast.show({ type: 'error', text1: 'Xəta baş verdi' });
        setLoading(false);
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hesab</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formWrapper}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ad, Soyad"
            placeholderTextColor="#BDBDC7"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Ünvan</Text>
          <TextInput
            style={styles.input}
            placeholder="ünvan"
            placeholderTextColor="#BDBDC7"
            value={address}
            onChangeText={setAddress}
          />
          <Text style={styles.label}>Telefon nömrəsi</Text>
          <TextInput
            style={styles.input}
            placeholder="(+994) _/__/__/__"
            placeholderTextColor="#BDBDC7"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#BDBDC7"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Şifrə</Text>
          <TextInput
            style={styles.input}
            placeholder="Şifrə"
            placeholderTextColor="#BDBDC7"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text style={styles.label}>Şifrənin təkrarı</Text>
          <TextInput
            style={styles.input}
            placeholder="Şifrənin təkrarı"
            placeholderTextColor="#BDBDC7"
            value={passwordRepeat}
            onChangeText={setPasswordRepeat}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveBtnText}>Yadda saxla</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer navigation={navigation} active="Profile" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 24,
    zIndex: 2,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  formWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  label: {
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
    marginTop: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F7F7FB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  saveBtn: {
    backgroundColor: '#76CB4F',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AccountInfoScreen;
