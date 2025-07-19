import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  Platform,
  SafeAreaView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface FooterProps {
  navigation: any;
  active: string;
}

const Footer = ({ navigation, active }: FooterProps) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (isKeyboardVisible) return null;

  return (
    <SafeAreaView style={styles.footer}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Home')}
      >
        <Feather
          name="home"
          size={22}
          color={active === 'Home' ? '#76CB4F' : '#bbb'}
        />
        <Text
          style={[
            styles.tabText,
            { color: active === 'Home' ? '#76CB4F' : '#bbb' },
          ]}
        >
          Əsas
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Search')}
      >
        <Feather
          name="search"
          size={22}
          color={active === 'Search' ? '#76CB4F' : '#bbb'}
        />
        <Text
          style={[
            styles.tabText,
            { color: active === 'Search' ? '#76CB4F' : '#bbb' },
          ]}
        >
          Axtar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Profile')}
      >
        <Feather
          name="user"
          size={22}
          color={active === 'Profile' ? '#76CB4F' : '#bbb'}
        />
        <Text
          style={[
            styles.tabText,
            { color: active === 'Profile' ? '#76CB4F' : '#bbb' },
          ]}
        >
          Hesabım
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#FFFF',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default Footer;
