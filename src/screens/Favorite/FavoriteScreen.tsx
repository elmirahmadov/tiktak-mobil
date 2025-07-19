import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useProductsStore } from '../../common/store/Products';
import { useBasketStore } from '../../common/store/Basket';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

const defaultProductImage = require('../../images/image/splash.png');
const CARD_GAP = 12;
const CARD_HORIZONTAL_PADDING = 16;
const CARD_WIDTH =
  (Dimensions.get('window').width - CARD_HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const SiyahilarimScreen = ({ navigation }: { navigation: any }) => {
  const actions = useProductsStore(state => state.actions);
  const favorites = useProductsStore(state => state.favorites);
  const toggleFavorite = useProductsStore(
    state => state.actions.toggleFavorite,
  );
  const [loading, setLoading] = React.useState(true);
  const [favoriteProducts, setFavoriteProducts] = React.useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '65%'], []);

  const basketItemsRaw = useBasketStore(state => state.items);
  const basketItems = React.useMemo(
    () => (Array.isArray(basketItemsRaw) ? basketItemsRaw : []),
    [basketItemsRaw],
  );
  const addToBasket = useBasketStore(state => state.actions.addToBasket);
  const removeFromBasket = useBasketStore(
    state => state.actions.removeFromBasket,
  );

  React.useEffect(() => {
    setLoading(true);
    actions.getFavorites(
      (data: any) => {
        if (Array.isArray(data)) {
          setFavoriteProducts(data);
        }
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, [actions]);

  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsBottomSheetOpen(false);
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const isFavorite = (product: any) => {
    return favorites.includes(product.id);
  };

  const getProductQuantity = React.useCallback(
    (productId: any) => {
      const item = basketItems.find(
        i =>
          String(i.product_id) === String(productId) ||
          (i.product && String(i.product.id) === String(productId)),
      );
      return item ? item.quantity : 0;
    },
    [basketItems],
  );

  const handleAddToBasket = React.useCallback(
    (product: any) => {
      addToBasket(product.id, { product_id: product.id, quantity: 1 });
    },
    [addToBasket],
  );

  const handleRemoveFromBasket = React.useCallback(
    (product: any) => {
      removeFromBasket({ product_id: product.id });
    },
    [removeFromBasket],
  );

  const handleToggleFavorite = async (productId: any) => {
    await toggleFavorite(productId);
    actions.getFavorites(
      (data: any) => {
        if (Array.isArray(data)) {
          setFavoriteProducts(data);
          if (
            selectedProduct &&
            !data.some((p: any) => p.id === selectedProduct.id)
          ) {
            closeModal();
          }
        }
      },
      () => {},
    );
  };

  const basketCount = basketItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );
  const basketTotal = basketItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0,
  );

  const renderProductCard = ({ item }: { item: any }) => {
    const quantity = getProductQuantity(item.id);
    const price = Number(item.price);
    const totalPrice = (price * quantity).toFixed(2);
    return (
      <TouchableOpacity
        onPress={() => handleProductPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.productCard}>
          <Image
            source={item.img_url ? { uri: item.img_url } : defaultProductImage}
            style={styles.productImage}
            resizeMode="contain"
          />
          <Text style={styles.productName} numberOfLines={2}>
            {item.title || item.name}
          </Text>
          <Text style={styles.productUnit}>{item.unit || '1 kq'}</Text>
          {quantity > 0 ? (
            <Text style={styles.productPriceRow}>
              <Text style={styles.productQtyRed}>{quantity} kq = </Text>
              <Text style={styles.productPrice}>{totalPrice} AZN</Text>
            </Text>
          ) : (
            <Text style={styles.productPrice}>{item.price} AZN</Text>
          )}
          {quantity > 0 ? (
            <View style={styles.basketControlsRow}>
              <TouchableOpacity
                style={[styles.basketBtn, styles.basketBtnMinus]}
                onPress={() => handleRemoveFromBasket(item)}
              >
                <MaterialCommunityIcons name="minus" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.basketBtn, { backgroundColor: '#76CB4F' }]}
                onPress={() => handleAddToBasket(item)}
              >
                <MaterialCommunityIcons name="plus" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addToBasketBtn}
              onPress={() => handleAddToBasket(item)}
            >
              <Text style={styles.addToBasketText}>Səbətə əlavə et</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRowCentered}>
        <View style={{ width: 32, alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#222" />
          </TouchableOpacity>
        </View>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={styles.headerTitle}>Siyahılarım</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>
      {loading ? (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: CARD_HORIZONTAL_PADDING,
            paddingTop: 8,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.skeletonProductCard} />
          ))}
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          renderItem={renderProductCard}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Siyahınız boşdur</Text>
            </View>
          }
        />
      )}
      {basketCount > 0 && (
        <View style={styles.orderBoxWrapper} pointerEvents="box-none">
          {!isBottomSheetOpen && (
            <TouchableOpacity
              style={styles.orderBox}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Basket')}
            >
              <View style={styles.orderBoxLeft}>
                <View style={styles.orderBoxCircle}>
                  <Text style={styles.orderBoxCircleText}>{basketCount}</Text>
                </View>
                <Text style={styles.orderBoxLabel}>Sifarişlər</Text>
              </View>
              <View style={styles.orderBoxRight}>
                <Text style={styles.orderBoxPrice}>
                  ₼ {basketTotal.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        onClose={() => {
          setSelectedProduct(null);
          setIsBottomSheetOpen(false);
        }}
        onAnimate={(fromIndex, toIndex) => {
          if (toIndex === -1) {
            setIsBottomSheetOpen(false);
          }
        }}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedProduct && (
            <View style={styles.productDetailContainer}>
              <TouchableOpacity
                style={styles.favoriteButton}
                activeOpacity={0.7}
                onPress={() => handleToggleFavorite(selectedProduct.id)}
              >
                <AntDesign
                  name="hearto"
                  size={28}
                  color={isFavorite(selectedProduct) ? '#F44336' : '#BDBDBD'}
                />
              </TouchableOpacity>

              <Image
                source={
                  selectedProduct.img_url
                    ? { uri: selectedProduct.img_url }
                    : defaultProductImage
                }
                style={styles.productImageLarge}
                resizeMode="contain"
              />

              <Text style={styles.productTitle}>
                {selectedProduct.title || selectedProduct.name}{' '}
                {selectedProduct.unit ? selectedProduct.unit : ''}
              </Text>
              <Text style={styles.productDescription}>
                {selectedProduct.description ||
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
              </Text>
              <Text style={styles.productPriceLarge}>
                {selectedProduct.price} AZN
              </Text>
              <TouchableOpacity
                style={styles.addToBasketButton}
                onPress={() => {
                  handleAddToBasket(selectedProduct);
                  closeModal();
                }}
              >
                <Text style={styles.addToBasketTextLarge}>Səbətə əlavə et</Text>
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  productsGrid: {
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 120,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
    columnGap: 12,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: CARD_WIDTH,
    marginBottom: 12,
    minHeight: 280,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 110,
    height: 110,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#f2f2f2',
  },
  productImageLarge: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
  },
  productName: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    minHeight: 22,
    maxWidth: 150,
    lineHeight: 20,
  },
  productUnit: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  productPriceRow: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
  },
  productQtyRed: {
    color: '#F44336',
    fontWeight: 'bold',
    fontSize: 15,
  },
  productPrice: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginLeft: 4,
    minHeight: 24,
  },
  productPriceLarge: {
    fontSize: 24,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 16,
    minHeight: 30,
  },
  addToBasketBtn: {
    backgroundColor: '#76CB4F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 10,
    alignSelf: 'center',
    minWidth: 120,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToBasketText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  addToBasketTextLarge: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  basketControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
    gap: 10,
  },
  basketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    minWidth: 36,
    minHeight: 36,
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginHorizontal: 2,
  },
  basketBtnMinus: {
    backgroundColor: '#F29298',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#D1D1D1',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  orderBoxWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    zIndex: 20,
    alignItems: 'center',
  },
  orderBox: {
    backgroundColor: '#76CB4F',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: 'relative',
    width: '90%',
  },
  orderBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderBoxCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  orderBoxCircleText: {
    color: '#76CB4F',
    fontWeight: 'bold',
    fontSize: 18,
  },
  orderBoxLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  orderBoxRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderBoxPrice: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  skeletonProductCard: {
    backgroundColor: '#eee',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: CARD_WIDTH,
    marginBottom: 12,
    minHeight: 280,
  },
  bottomSheetContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productDetailContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    position: 'relative',
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 2,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  productDescription: {
    color: '#888',
    fontSize: 15,
    marginBottom: 16,
    textAlign: 'center',
  },
  addToBasketButton: {
    backgroundColor: '#76CB4F',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 220,
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default SiyahilarimScreen;
