import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../../common/components/Header';
import { useCategoriesStore } from '../../common/store/Categories';
import { useProductsStore } from '../../common/store/Products';
import { useBasketStore } from '../../common/store/Basket';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

const CARD_HORIZONTAL_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH =
  (Dimensions.get('window').width - CARD_HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const CategoryDetailScreen = ({ navigation }: { navigation: any }) => {
  const route = useRoute<any>();
  const { category: initialCategory } = route.params || {};
  const categories = useCategoriesStore(state => state.categories);
  const categoriesLoading = useCategoriesStore(state => state.loading);
  const getCategories = useCategoriesStore(
    state => state.actions.getCategories,
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || null,
  );

  const allProducts = useProductsStore(state => state.products);
  const productsLoading = useProductsStore(state => state.loading);
  const getProducts = useProductsStore(state => state.actions.getProducts);
  const resetProducts = useProductsStore(state => state.actions.reset);
  const favorites = useProductsStore(state => state.favorites);
  const toggleFavorite = useProductsStore(
    state => state.actions.toggleFavorite,
  );
  const getFavorites = useProductsStore(state => state.actions.getFavorites);

  const basketItemsRaw = useBasketStore(state => state.items);
  const basketItems = React.useMemo(
    () => (Array.isArray(basketItemsRaw) ? basketItemsRaw : []),
    [basketItemsRaw],
  );
  const addToBasket = useBasketStore(state => state.actions.addToBasket);
  const removeFromBasket = useBasketStore(
    state => state.actions.removeFromBasket,
  );

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '65%'], []);

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
        opacity={0.85}
        enableTouchThrough={false}
        pressBehavior="close"
        style={[
          props.style,
          {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
          },
        ]}
      />
    ),
    [],
  );

  const isFavorite = (product: any) => {
    return favorites.includes(product.id);
  };

  useEffect(() => {
    getCategories();
    resetProducts();
    getProducts();
    getFavorites();
  }, [getCategories, getProducts, resetProducts, getFavorites]);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts = React.useMemo(() => {
    if (!selectedCategory) return allProducts;
    const seen = new Set();
    return allProducts.filter(
      (p: any) =>
        (p.category_id === selectedCategory.id ||
          p.category?.id === selectedCategory.id) &&
        !seen.has(p.id) &&
        seen.add(p.id),
    );
  }, [allProducts, selectedCategory]);

  React.useEffect(() => {}, [basketItems]);

  const getProductQuantity = useCallback(
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

  const handleAddToBasket = useCallback(
    (product: any) => {
      addToBasket(product.id, { product_id: product.id, quantity: 1 });
    },
    [addToBasket],
  );

  const handleRemoveFromBasket = useCallback(
    (product: any) => {
      removeFromBasket({ product_id: product.id });
    },
    [removeFromBasket],
  );

  const handleMainCategoriesPress = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const renderProductCard = ({ item }: { item: any }) => {
    const quantity = getProductQuantity(item.id);
    const imageSource = item.img_url
      ? { uri: item.img_url }
      : item.image
      ? { uri: item.image }
      : null;
    const price = Number(item.price);
    const totalPrice = (price * quantity).toFixed(2);
    return (
      <TouchableOpacity
        onPress={() => handleProductPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.productCard}>
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.productImage} />
          )}
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

  const basketCount = basketItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );
  const basketTotal = basketItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0,
  );

  return (
    <View style={styles.headerWrapper}>
      <Header navigation={navigation} />
      <View style={styles.stickyTop}>
        <TouchableOpacity
          style={styles.mainCategoryButton}
          onPress={handleMainCategoriesPress}
          activeOpacity={0.8}
        >
          <Feather
            name="grid"
            size={24}
            color="#fff"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.mainCategoryButtonText}>
            Əsas kateqoriyalara bax
          </Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categoriesLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.categoryPill,
                    { width: 80, height: 32, backgroundColor: '#eee' },
                  ]}
                />
              ))
            : categories.map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryPill,
                    selectedCategory?.id === cat.id &&
                      styles.categoryPillActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      selectedCategory?.id === cat.id &&
                        styles.categoryPillTextActive,
                    ]}
                  >
                    {cat.name || 'Kategori'}
                  </Text>
                </TouchableOpacity>
              ))}
        </ScrollView>
      </View>
      <View style={styles.flexListContainer}>
        {categoriesLoading || productsLoading ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              paddingHorizontal: CARD_HORIZONTAL_PADDING,
              paddingTop: 8,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={styles.skeletonProductCard} />
            ))}
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={item => String(item.id)}
            numColumns={2}
            renderItem={renderProductCard}
            contentContainerStyle={[
              styles.productsGrid,
              { paddingBottom: 110 },
            ]}
            columnWrapperStyle={styles.productRow}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 40,
                }}
              >
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: '#F2F2F2',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Feather name="x" size={64} color="#D1D1D1" />
                </View>
                <Text
                  style={{
                    color: '#D1D1D1',
                    fontSize: 16,
                    marginTop: 8,
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  Bu kateqoriyada məhsul yoxdur
                </Text>
              </View>
            }
            extraData={basketItems}
          />
        )}
      </View>

      {basketCount > 0 && (
        <View style={styles.absoluteOrderBoxWrapper} pointerEvents="box-none">
          {!isBottomSheetOpen && (
            <TouchableOpacity
              style={styles.orderBoxWrapper}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Basket')}
            >
              <View style={styles.orderBox}>
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
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={{ backgroundColor: '#fff' }}>{/* Footer removed */}</View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: '#fff',
        }}
        handleIndicatorStyle={{
          backgroundColor: '#E0E0E0',
        }}
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
                onPress={() => toggleFavorite(selectedProduct.id)}
              >
                <AntDesign
                  name="hearto"
                  size={28}
                  color={isFavorite(selectedProduct) ? '#F44336' : '#BDBDBD'}
                />
              </TouchableOpacity>

              {selectedProduct.img_url || selectedProduct.image ? (
                <Image
                  source={
                    selectedProduct.img_url
                      ? { uri: selectedProduct.img_url }
                      : { uri: selectedProduct.image }
                  }
                  style={styles.productImageLarge}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.productImageLarge} />
              )}

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
  headerWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 0,
  },
  headerBox: {
    backgroundColor: '#E6F4EA',
    margin: 16,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  mainCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#76CB4F',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
    paddingVertical: 18,
    paddingHorizontal: 28,
    minHeight: 54,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mainCategoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  categoryScroll: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  categoryScrollContent: {
    alignItems: 'center',
    paddingRight: 0,
    paddingLeft: 0,
  },
  categoryPill: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginRight: 10,
    minWidth: 90,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryPillActive: {
    backgroundColor: '#76CB4F',
  },
  categoryPillText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '500',
  },
  categoryPillTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productsGrid: {
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    paddingTop: 8,
    paddingBottom: 8,
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
  },
  productImage: {
    width: 110,
    height: 110,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  productImageLarge: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
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
    minWidth: 80,
    minHeight: 36,
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginHorizontal: 2,
  },
  basketBtnMinus: {
    minWidth: 36,
    minHeight: 36,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: '#F29298',
  },
  basketBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 4,
    letterSpacing: 0.2,
    textAlignVertical: 'center',
    textAlign: 'center',
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
  stickyTop: {
    backgroundColor: '#fff',
    paddingBottom: 12,
    paddingTop: 12,
  },
  flexListContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  priceAndButtonArea: {
    minHeight: 80,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  orderBoxWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  absoluteOrderBoxWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    zIndex: 10,
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
  orderBoxBadgeWrapper: {
    position: 'absolute',
    top: -16,
    left: '50%',
    transform: [{ translateX: -16 }],
    zIndex: 2,
  },
  orderBoxBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF4D2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  orderBoxBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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

export default CategoryDetailScreen;
