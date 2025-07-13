import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Header from '../../common/components/Header';
import Footer from '../../common/components/Footer';
import { useProductsStore } from '../../common/store/Products';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';

const defaultProductImage = require('../../images/image/splash.png');

const SearchScreen = ({ navigation }: { navigation: any }) => {
  const allProducts = useProductsStore(state => state.products);
  const productsLoading = useProductsStore(state => state.loading);
  const getProducts = useProductsStore(state => state.actions.getProducts);
  const resetProducts = useProductsStore(state => state.actions.reset);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleProductPress = (product: any) => {
    Keyboard.dismiss();
    setTimeout(() => {
      setSelectedProduct(product);
      setModalVisible(true);
    }, 100);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    resetProducts();
    getProducts();
  }, [getProducts, resetProducts]);

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
      : defaultProductImage;
    return (
      <TouchableOpacity
        onPress={() => handleProductPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.productRow}>
          <Image
            source={imageSource}
            style={styles.productImage}
            resizeMode="contain"
          />
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
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
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          searchQuery.trim() && !productsLoading ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#F2F2F2',
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
      <Footer navigation={navigation} active="Search" />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={300}
        animationOutTiming={300}
      >
        {selectedProduct && (
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <View
              style={{
                width: 48,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#E0E0E0',
                alignSelf: 'center',
                marginBottom: 16,
                marginTop: 4,
              }}
            />

            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 24,
                right: 24,
                zIndex: 2,
              }}
              activeOpacity={0.7}
            >
              <Feather name="heart" size={28} color="#BDBDBD" />
            </TouchableOpacity>
            <Image
              source={
                selectedProduct.img_url
                  ? { uri: selectedProduct.img_url }
                  : defaultProductImage
              }
              style={{
                width: 140,
                height: 140,
                borderRadius: 16,
                marginBottom: 16,
                marginTop: 16,
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
              style={{
                fontWeight: 'bold',
                fontSize: 24,
                marginBottom: 24,
                textAlign: 'center',
              }}
            >
              {selectedProduct.price} AZN
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#76CB4F',
                borderRadius: 8,
                paddingVertical: 14,
                paddingHorizontal: 32,
                minWidth: 220,
                alignItems: 'center',
                marginBottom: 8,
              }}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>
                Səbətə əlavə et
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#F8F8F8',
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
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginRight: 12,
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
});

export default SearchScreen;
