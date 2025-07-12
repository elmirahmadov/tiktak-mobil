import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useBasketStore } from '../store/Basket';

const Header = ({ navigation }: { navigation?: any }) => {
  const basketItems = useBasketStore(state => state.items);
  const getBasket = useBasketStore(state => state.actions.getBasket);
  const hasFetched = useRef(false);

  const totalCount = Array.isArray(basketItems)
    ? basketItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getBasket();
    }
  }, [getBasket]);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>TIK TAK</Text>
      <TouchableOpacity
        onPress={() =>
          navigation && navigation.navigate && navigation.navigate('Basket')
        }
      >
        <View style={{ position: 'relative' }}>
          <Feather name="shopping-cart" size={24} color="#222" />
          {totalCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{totalCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#222',
  },
  badgeContainer: {
    position: 'absolute',
    right: -10,
    top: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Header;
