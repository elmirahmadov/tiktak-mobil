import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const Footer = ({ navigation, active }) => (
  <View style={styles.footer}>
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
  </View>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#F7F7F7F',
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
