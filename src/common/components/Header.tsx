import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>TIK TAK</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() =>
              navigation && navigation.navigate && navigation.navigate('Basket')
            }
            style={styles.actionButton}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
  },
  badgeContainer: {
    position: 'absolute',
    right: -8,
    top: -3,
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
    fontSize: 10,
    textAlign: 'center',
  },
});

export default Header;
