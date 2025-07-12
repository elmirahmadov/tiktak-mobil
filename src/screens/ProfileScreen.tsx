import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../common/store/Auth';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Footer from '../common/components/Footer';

const ProfileScreen = ({ navigation: _navigation }: { navigation: any }) => {
  const user = useAuthStore(state => state.user);
  const name = user?.full_name;
  const phone = user?.phone;
  const actions = useAuthStore(state => state.actions);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Hesabım</Text>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={80} color="#fff" />
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
        <View style={styles.menuWrapper}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => _navigation.navigate('AccountInfo')}
          >
            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={22}
              color="#2D3651"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Hesab məlumatlarım</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather
              name="heart"
              size={22}
              color="#2D3651"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Siyahılarım</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather
              name="clock"
              size={22}
              color="#2D3651"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Sifariş tarixçəsi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={async () => {
              await actions.logout(() => _navigation.navigate('Login'));
            }}
          >
            <Feather
              name="log-out"
              size={22}
              color="#2D3651"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Çıxış</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer navigation={_navigation} active="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5B6583',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3651',
    marginBottom: 4,
    textAlign: 'center',
  },
  phone: {
    fontSize: 15,
    color: '#5B6583',
    textAlign: 'center',
  },
  menuWrapper: {
    width: '90%',
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#2D3651',
    fontWeight: '500',
  },
});

export default ProfileScreen;
