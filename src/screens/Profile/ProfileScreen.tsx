import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../common/store/Auth';
import { useUploadStore } from '../../common/store/Upload';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Footer from '../../common/components/Footer';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ navigation: _navigation }: { navigation: any }) => {
  const user = useAuthStore(state => state.user);
  const name = user?.full_name;
  const phone = user?.phone;
  const actions = useAuthStore(state => state.actions);
  const { uploadImage, isLoading: uploadLoading } = useUploadStore();

  const handleAvatarPress = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo' });
      if (result.assets && result.assets.length > 0) {
        const photo = result.assets[0];

        const img_url = await uploadImage({
          uri: photo.uri || '',
          type: photo.type || 'image/jpeg',
          name: photo.fileName || 'image.jpg',
        });

        if (!img_url) throw new Error('Resim yüklenemedi');

        await actions.updateProfile(
          {
            img_url,
            full_name: user?.full_name || '',
            address: user?.address || '',
          },
          async () => {
            await actions.getProfile();
          },
          err => {
            console.error('updateProfile error:', err);
          },
        );
      }
    } catch (e) {
      console.error('handleAvatarPress error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Hesabım</Text>
        <View style={styles.avatarWrapper}>
          <TouchableOpacity
            onPress={handleAvatarPress}
            disabled={uploadLoading}
            activeOpacity={0.7}
          >
            <View style={styles.avatarCircle}>
              {user?.img_url ? (
                <Image
                  source={{ uri: user.img_url }}
                  style={{ width: 120, height: 120, borderRadius: 60 }}
                />
              ) : (
                <Feather name="user" size={80} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => _navigation.navigate('Favorite')}
          >
            <Feather
              name="heart"
              size={22}
              color="#2D3651"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Siyahılarım</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => _navigation.navigate('OrderHistory')}
          >
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
              await actions.logout();
              _navigation.replace('Login');
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
