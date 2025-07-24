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
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Header from '../../common/components/Header';
import { useProductsStore } from '../../common/store/Products';
import { useBasketStore } from '../../common/store/Basket';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

const SearchScreen = ({ navigation }: { navigation: any }) => {
  const allProducts = useProductsStore(state => state.products);
  const productsLoading = useProductsStore(state => state.loading);
  const getProducts = useProductsStore(state => state.actions.getProducts);
  const resetProducts = useProductsStore(state => state.actions.reset);
  const favorites = useProductsStore(state => state.favorites);
  const toggleFavorite = useProductsStore(
    state => state.actions.toggleFavorite,
  );
  const addToBasket = useBasketStore(state => state.actions.addToBasket);
  const getFavorites = useProductsStore(state => state.actions.getFavorites);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '65%'], []);

  const handleProductPress = (product: any) => {
    Keyboard.dismiss();
    setTimeout(() => {
      setSelectedProduct(product);
      bottomSheetRef.current?.expand();
    }, 500);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
        style={[props.style, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
      />
    ),
    [],
  );

  useEffect(() => {
    resetProducts();
    getProducts();
    getFavorites();
  }, [getProducts, resetProducts, getFavorites]);

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    const seen = new Set();
    return allProducts.filter((p: any) => {
      const title = (p.title || p.name || '').toLowerCase();
      const description = (p.description || '').toLowerCase();
      const isMatch = title.includes(query) || description.includes(query);
      if (!isMatch) return false;
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [allProducts, searchQuery]);

  const renderProductRow = ({ item }: { item: any }) => {
    const imageSource = item.img_url
      ? { uri: item.img_url }
      : item.image
      ? { uri: item.image }
      : null;
    return (
      <TouchableOpacity
        onPress={() => handleProductPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.productRow}>
          <View style={styles.imageContainer}>
            {imageSource ? (
              <Image
                source={imageSource}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.productImage} />
            )}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.title || item.name}
            </Text>
            <Text style={styles.productPrice}>{item.price} AZN</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Axtar"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) =>
          item && item.id != null
            ? String(item.id) + '-' + index
            : String(index)
        }
        renderItem={renderProductRow}
        contentContainerStyle={[styles.listContent, { paddingBottom: 80 }]}
        style={styles.flatListStyle}
        ListEmptyComponent={
          searchQuery.trim() && !productsLoading ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#FFFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Feather name="x" size={48} color="#D1D1D1" />
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
                Axtarış nəticəsi tapılmadı
              </Text>
            </View>
          ) : null
        }
        keyboardShouldPersistTaps="handled"
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
        backdropComponent={renderBackdrop}
        onClose={() => {
          setSelectedProduct(null);
        }}
        style={styles.bottomSheetContainer}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedProduct && (
            <View style={styles.productDetailContainer}>
              <TouchableOpacity
                style={styles.favoriteButton}
                activeOpacity={0.7}
                onPress={async () => {
                  await toggleFavorite(selectedProduct.id);
                }}
              >
                <AntDesign
                  name="hearto"
                  size={28}
                  color={
                    favorites.includes(Number(selectedProduct.id))
                      ? '#F44336'
                      : '#BDBDBD'
                  }
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

              <Text style={styles.productTitle}>{selectedProduct.title}</Text>
              <Text style={styles.productDescription}>
                {selectedProduct.description}
              </Text>
              <Text style={styles.productPriceLarge}>
                {selectedProduct.price} AZN
              </Text>
              <TouchableOpacity
                style={styles.addToBasketButton}
                onPress={async () => {
                  await addToBasket(selectedProduct.id, {
                    product_id: selectedProduct.id,
                    quantity: 1,
                  });
                  closeModal();
                }}
              >
                <Text style={styles.addToBasketText}>Səbətə əlavə et</Text>
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    backgroundColor: '#F6F5FB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#222',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  flatListStyle: {
    backgroundColor: '#ffffff',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },

  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  productDetailContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    position: 'relative',
    backgroundColor: '#ffffff',
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
  productImageLarge: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
    color: '#222',
  },
  productDescription: {
    color: '#888',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  productPriceLarge: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  addToBasketButton: {
    backgroundColor: '#76CB4F',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 240,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#76CB4F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addToBasketText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default SearchScreen;
