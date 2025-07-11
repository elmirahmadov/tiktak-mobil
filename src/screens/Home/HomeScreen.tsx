import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import Header from '../../common/components/Header';
import Footer from '../../common/components/Footer';

const address = '55 Zərifə Əliyeva, Bakı, Azərbaycan ...';

const campaignImage = require('../../images/image/splash.png'); // Kendi görselini ekle
const productImage = require('../../images/image/splash.png'); // Kendi görselini ekle

const products = Array(15).fill({ name: 'Tərəvəz', image: productImage });

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Header />
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.addressBox}>
        <Text style={styles.addressTitle}>Çatdırılma ünvanı:</Text>
        <Text style={styles.addressText}>{address}</Text>
      </View>
      <View style={styles.campaignBox}>
        <Image source={campaignImage} style={styles.campaignImage} />
        <View style={styles.campaignTextBox}>
          <Text style={styles.campaignTitle}>MEYVƏLƏRƏ</Text>
          <Text style={styles.campaignSubtitle}>HƏFTƏ SONUNA KİMİ</Text>
          <Text style={styles.campaignDiscount}>20% ENDİRİM</Text>
        </View>
      </View>
      <FlatList
        data={products}
        keyExtractor={(_, i) => i.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.productsGrid}
        scrollEnabled={false}
      />
    </ScrollView>
    <Footer navigation={navigation} active="Home" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 80 },
  addressBox: {
    backgroundColor: '#F6F8FB',
    borderRadius: 12,
    margin: 16,
    padding: 12,
  },
  addressTitle: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  addressText: { fontSize: 13, color: '#888', marginTop: 2 },
  campaignBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B89EFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
  },
  campaignImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
  },
  campaignTextBox: { marginLeft: 16, flex: 1 },
  campaignTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  campaignSubtitle: { color: '#fff', fontSize: 13, marginTop: 2 },
  campaignDiscount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  productsGrid: { paddingHorizontal: 8 },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    flex: 1,
    minWidth: 100,
    maxWidth: 120,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 6 },
  productName: { fontSize: 15, color: '#222', fontWeight: '500' },
});

export default HomeScreen;
