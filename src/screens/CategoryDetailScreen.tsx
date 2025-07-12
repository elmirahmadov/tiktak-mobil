import React, { useEffect, useState, useCallback } from 'react';
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
import Header from '../common/components/Header';
import Footer from '../common/components/Footer';
import { useCategoriesStore } from '../common/store/Categories';
import { useProductsStore } from '../common/store/Products';
import { useBasketStore } from '../common/store/Basket';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

const defaultProductImage = require('../images/image/splash.png');

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
  const [isModalVisible, setModalVisible] = useState(false);

  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    getCategories();
    resetProducts();
    getProducts();
  }, [getCategories, getProducts, resetProducts]);

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

  React.useEffect(() => {
    console.log('[BasketItems] Güncel sepet:', basketItems);
  }, [basketItems]);

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

  const getUnitLabel = (type: string) => {
    if (!type) return '';
    if (type === 'litre') return 'kq';
    if (type === 'piece') return 'əd';
    if (type === 'packet') return 'paket';
    if (type === 'box') return 'box';
    return type;
  };

  const handleAddToBasket = useCallback(
    (product: any) => {
      console.log('[AddToBasket] Ürün ekleniyor:', product);
      addToBasket(product.id, { product_id: product.id, quantity: 1 });
    },
    [addToBasket],
  );

  const handleRemoveFromBasket = useCallback(
    (product: any) => {
      console.log('[RemoveFromBasket] Ürün çıkarılıyor:', product);
      removeFromBasket({ product_id: product.id });
    },
    [removeFromBasket],
  );

  const handleMainCategoriesPress = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const renderProductCard = ({ item }: { item: any }) => {
    const quantity = getProductQuantity(item.id);
    const unit = getUnitLabel(item.type);
    const imageSource = item.img_url
      ? { uri: item.img_url }
      : item.image
      ? { uri: item.image }
      : defaultProductImage;
    const price = Number(item.price);
    const totalPrice = (price * quantity).toFixed(2);
    return (
      <TouchableOpacity
        onPress={() => handleProductPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.productCard}>
          <Image
            source={imageSource}
            style={styles.productImage}
            resizeMode="contain"
          />
          <Text style={styles.productName} numberOfLines={2}>
            {item.title || item.name}
          </Text>
          <Text style={styles.productUnit}>{item.unit || `1 ${unit}`}</Text>
          <View style={styles.priceAndButtonArea}>
            {quantity > 0 ? (
              <Text style={styles.productPriceRow}>
                <Text style={styles.productQtyRed}>
                  {quantity} {unit} ={' '}
                </Text>
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
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
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
              justifyContent: 'center',
              padding: 16,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <View
                key={i}
                style={[styles.productCard, { backgroundColor: '#eee' }]}
              />
            ))}
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={item => String(item.id)}
            numColumns={2}
            renderItem={renderProductCard}
            contentContainerStyle={styles.productsGrid}
            columnWrapperStyle={styles.productRow}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Bu kateqoriyada məhsul yoxdur.
              </Text>
            }
            extraData={basketItems}
          />
        )}
      </View>
      <View style={{ backgroundColor: '#fff' }}>
        <Footer navigation={navigation} active="Home" />
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        {selectedProduct && (
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              alignItems: 'center',
            }}
          >
            <Image
              source={
                selectedProduct.img_url
                  ? { uri: selectedProduct.img_url }
                  : defaultProductImage
              }
              style={{
                width: 120,
                height: 120,
                borderRadius: 16,
                marginBottom: 16,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              {selectedProduct.title || selectedProduct.name}{' '}
              {selectedProduct.unit ? selectedProduct.unit : ''}
            </Text>
            <Text
              style={{
                color: '#888',
                fontSize: 15,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              {selectedProduct.description ||
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
            </Text>
            <Text
              style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 16 }}
            >
              {selectedProduct.price} AZN
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#76CB4F',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 32,
                minWidth: 180,
                alignItems: 'center',
              }}
              onPress={() => {
                handleAddToBasket(selectedProduct);
                closeModal();
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>
                Səbətə əlavə et
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
    borderRadius: 12,
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
    paddingRight: 8,
    paddingLeft: 0,
  },
  categoryPill: {
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
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
    zIndex: 2,
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
});

export default CategoryDetailScreen;
