import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useBasketStore } from '../../common/store/Basket';
import { StackNavigationProp } from '@react-navigation/stack';
import SafeAreaWrapper from '../../common/components/SafeAreaWrapper';

export type BasketItem = {
  product_id: number;
  quantity: number;
  product?: {
    img_url?: string;
    title?: string;
    name?: string;
    price?: number;
    id?: number;
  };
};

export type BasketScreenProps = {
  navigation: StackNavigationProp<any>;
};

const defaultProductImage = require('../../images/image/splash.png');

const BasketScreen: React.FC<BasketScreenProps> = ({ navigation }) => {
  const basketItems = useBasketStore(state => state.items) || [];
  const totalPrice = useBasketStore(state => state.totalPrice) || 0;
  const actions = useBasketStore(state => state.actions);

  const getProductId = (item: BasketItem) =>
    item.product_id ?? item.product?.id;

  const handleIncrement = async (item: BasketItem) => {
    const pid = getProductId(item);
    if (!pid) return;
    await actions.addToBasket(pid, { product_id: pid });
  };

  const handleDecrement = async (item: BasketItem) => {
    const pid = getProductId(item);
    if (!pid) return;
    await actions.removeFromBasket({ product_id: pid });
  };

  const sortedBasketItems = [...basketItems].sort((a, b) => {
    const aid = getProductId(a);
    const bid = getProductId(b);
    if (aid && bid) return aid - bid;
    return 0;
  });

  const renderItem = ({ item }: { item: BasketItem }) => (
    <View style={styles.itemRow}>
      <Image
        source={
          item.product?.img_url
            ? { uri: item.product.img_url }
            : defaultProductImage
        }
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.productTitle}>
          {item.product?.title || item.product?.name}
        </Text>
        <Text style={styles.productPrice}>{item.product?.price} AZN</Text>
      </View>
      <View style={styles.counterBox}>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() => handleDecrement(item)}
        >
          <MaterialCommunityIcons name="minus" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.counterText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.counterBtn}
          onPress={() => handleIncrement(item)}
        >
          <MaterialCommunityIcons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaWrapper>
      <View style={styles.headerRowCentered}>
        <View style={{ width: 32, alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#222" />
          </TouchableOpacity>
        </View>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={styles.headerTitle}>Səbətim</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {sortedBasketItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrapper}>
            <Feather name="x" size={64} color="#D1D1D1" />
          </View>
          <Text style={styles.emptyText}>Səbətinizdə məhsul yoxdur</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={sortedBasketItems}
            renderItem={renderItem}
            keyExtractor={item => String(getProductId(item))}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ümumi:</Text>
              <Text style={styles.summaryValue}>
                {totalPrice.toFixed(2)} AZN
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Çatdırılma:</Text>
              <Text style={styles.summaryValue}>Pulsuz</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>
                Yekun məbləğ:
              </Text>
              <Text style={[styles.summaryValue, { fontWeight: 'bold' }]}>
                {totalPrice.toFixed(2)} AZN
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.orderBtn}
            onPress={() => {
              navigation.navigate('Checkout');
            }}
          >
            <Text style={styles.orderBtnText}>Sifarişi tamamla</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: '#D1D1D1',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f2f2f2',
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  productPrice: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#92D871',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 10,
    minWidth: 120,
    justifyContent: 'center',
  },
  counterBtn: {
    backgroundColor: '#FFFFFF6B',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 2,
  },
  counterText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },

  summaryBox: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    color: '#222',
    fontSize: 14,
  },
  summaryValue: {
    color: '#222',
    fontSize: 14,
  },

  orderBtn: {
    backgroundColor: '#92D871',
    borderRadius: 8,
    margin: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BasketScreen;
