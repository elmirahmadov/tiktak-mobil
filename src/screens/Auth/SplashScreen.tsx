import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../images/image/splash.png')}
          style={styles.image}
        />
      </View>
      <Text style={styles.description}>
        Siza daha əlçatan olması üçün qeydiyyatdan keçərək davam edə bilərsiniz
        🥰
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Qeydiyyat</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    marginBottom: 32,
    width: '200%',
    height: 180,
    position: 'relative',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 90,
    resizeMode: 'cover',
    position: 'absolute',
    left: '38%',
    top: '-10%',
    transform: [{ translateX: -90 }, { translateY: -90 }],
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: '#222',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#6DD96D',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    color: '#222',
    fontSize: 15,
  },
  loginLink: {
    color: '#6DD96D',
    fontWeight: 'bold',
  },
});

export default SplashScreen;
