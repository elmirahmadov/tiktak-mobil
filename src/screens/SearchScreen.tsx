import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useProductsStore } from '../common/store/Products';
import Footer from '../common/components/Footer';

const defaultProductImage = require('../images/image/splash.png');

const SearchScreen = ({ navigation }: { navigation: any }) => {
  const allProducts = useProductsStore(state => state.products);
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return [];
    return allProducts.filter(
      (p: any) =>
        p.title?.toLowerCase().includes(s) || p.name?.toLowerCase().includes(s),
    );
  }, [allProducts, search]);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.productRow}>
      <Image
        source={item.img_url ? { uri: item.img_url } : defaultProductImage}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.productTitle}>{item.title || item.name}</Text>
        <Text style={styles.productPrice}>{item.price} AZN</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TIK TAK</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.searchBoxWrapper}>
        <TextInput
          style={styles.searchBox}
          placeholder="Axtar"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#B0B0B0"
        />
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        ListEmptyComponent={
          search.trim() ? (
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
                Axtardığınız məhsul tapılmadı.
              </Text>
            </View>
          ) : null
        }
      />
      <Footer navigation={navigation} active="Search" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#222',
  },
  searchBoxWrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  searchBox: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
    borderWidth: 0,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
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
  emptyText: {
    color: '#D1D1D1',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default SearchScreen;
