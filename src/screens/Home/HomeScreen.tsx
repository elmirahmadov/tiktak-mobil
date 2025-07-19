import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Header from '../../common/components/Header';
import Footer from '../../common/components/Footer';
import { useCampaignsStore } from '../../common/store/Campaigns';
import { useCategoriesStore } from '../../common/store/Categories';
import { useAuthStore } from '../../common/store/Auth';

interface NavigationProps {
  navigation: any;
}

const HomeScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const campaigns = useCampaignsStore(state => state.campaigns);
  const campaignsLoading = useCampaignsStore(state => state.loading);
  const categories = useCategoriesStore(state => state.categories);
  const categoriesLoading = useCategoriesStore(state => state.loading);
  const accessToken = useAuthStore(state => state.accessToken);
  const user = useAuthStore(state => state.user);
  const address =
    user?.address || user?.adres || user?.location || 'Adres tanımlı değil';

  const dataFetched = useRef(false);
  const currentToken = useRef(accessToken);

  const getCampaigns = useCallback(() => {
    useCampaignsStore.getState().actions.getCampaigns();
  }, []);

  const getCategories = useCallback(() => {
    useCategoriesStore.getState().actions.getCategories();
  }, []);

  useEffect(() => {
    if (!accessToken) {
      dataFetched.current = false;
      currentToken.current = null;
      return;
    }
    if (currentToken.current !== accessToken || !dataFetched.current) {
      currentToken.current = accessToken;
      dataFetched.current = true;
      const timer = setTimeout(() => {
        getCampaigns();
        getCategories();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [accessToken, getCampaigns, getCategories]);

  const latestCampaign = useMemo(() => {
    if (!campaigns || campaigns.length === 0) return null;
    return campaigns.reduce((latest, current) => {
      const latestDate = new Date(
        latest.created_at || latest.start_date || 0,
      ).getTime();
      const currentDate = new Date(
        current.created_at || current.start_date || 0,
      ).getTime();
      return currentDate > latestDate ? current : latest;
    }, campaigns[0]);
  }, [campaigns]);

  const handleCategoryPress = useCallback(
    (item: any) => {
      navigation.navigate('CategoryDetail', { category: item });
    },
    [navigation],
  );

  const renderCategoryItem = useCallback(
    ({ item }: { item: any }) => {
      const imageSource = item.img_url
        ? { uri: item.img_url }
        : item.image
        ? { uri: item.image }
        : null;
      return (
        <TouchableOpacity
          style={styles.productCard}
          onPress={() => handleCategoryPress(item)}
          activeOpacity={0.7}
        >
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.productImage} />
          )}
          <Text style={styles.productName} numberOfLines={1}>
            {item.name || item.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [handleCategoryPress],
  );

  const isLoading =
    (campaignsLoading && (!campaigns || campaigns.length === 0)) ||
    (categoriesLoading && (!categories || categories.length === 0));

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      {isLoading ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>Çatdırılma ünvanı:</Text>
            <Text style={styles.addressText}>{address}</Text>
          </View>
          <View style={styles.campaignBoxWrapper}>
            <View
              style={[
                styles.campaignBox,
                {
                  backgroundColor: '#e0e0e0',
                  minHeight: 110,
                  justifyContent: 'flex-end',
                },
              ]}
            >
              <View
                style={{ flex: 1, padding: 16, justifyContent: 'flex-end' }}
              >
                <View
                  style={{
                    width: '60%',
                    height: 18,
                    backgroundColor: '#ccc',
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />
                <View
                  style={{
                    width: '40%',
                    height: 12,
                    backgroundColor: '#ddd',
                    borderRadius: 6,
                    marginBottom: 6,
                  }}
                />
                <View
                  style={{
                    width: '30%',
                    height: 10,
                    backgroundColor: '#eee',
                    borderRadius: 6,
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                paddingHorizontal: 8,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={styles.productCard}>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: '#e0e0e0',
                      marginBottom: 6,
                    }}
                  />
                  <View
                    style={{
                      width: 50,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: '#e0e0e0',
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.addressBox}>
            <Text style={styles.addressTitle}>Çatdırılma ünvanı:</Text>
            <Text style={styles.addressText}>{address}</Text>
          </View>
          {latestCampaign ? (
            <View style={styles.campaignBoxWrapper}>
              {latestCampaign.img_url ? (
                <ImageBackground
                  source={{ uri: latestCampaign.img_url }}
                  style={styles.campaignBox}
                  imageStyle={styles.campaignImageBg}
                  resizeMode="cover"
                >
                  <View style={styles.campaignOverlay} />
                  <View style={styles.campaignTextBox}>
                    <Text style={styles.campaignTitle} numberOfLines={2}>
                      {latestCampaign.title || latestCampaign.name}
                    </Text>
                    {latestCampaign.description ? (
                      <Text style={styles.campaignSubtitle} numberOfLines={2}>
                        {latestCampaign.description}
                      </Text>
                    ) : null}
                    <Text style={styles.campaignDate}>
                      {latestCampaign.created_at
                        ? new Date(
                            latestCampaign.created_at,
                          ).toLocaleDateString('tr-TR')
                        : ''}
                    </Text>
                  </View>
                </ImageBackground>
              ) : (
                <View style={styles.campaignBox}>
                  <View style={styles.campaignOverlay} />
                  <View style={styles.campaignTextBox}>
                    <Text style={styles.campaignTitle} numberOfLines={2}>
                      {latestCampaign.title || latestCampaign.name}
                    </Text>
                    {latestCampaign.description ? (
                      <Text style={styles.campaignSubtitle} numberOfLines={2}>
                        {latestCampaign.description}
                      </Text>
                    ) : null}
                    <Text style={styles.campaignDate}>
                      {latestCampaign.created_at
                        ? new Date(
                            latestCampaign.created_at,
                          ).toLocaleDateString('tr-TR')
                        : ''}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.noCampaignBox}>
              <Text style={styles.noCampaignText}>
                Aktif kampanya bulunmuyor
              </Text>
            </View>
          )}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            {categories && categories.length > 0 ? (
              <FlatList
                data={categories}
                keyExtractor={item => `category-${item.id}`}
                numColumns={3}
                renderItem={renderCategoryItem}
                contentContainerStyle={styles.productsGrid}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                }}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                initialNumToRender={9}
                maxToRenderPerBatch={6}
                windowSize={10}
                getItemLayout={(data, index) => ({
                  length: 120,
                  offset: 120 * Math.floor(index / 3),
                  index,
                })}
              />
            ) : (
              <View style={styles.noCampaignBox}>
                <Text style={styles.noCampaignText}>Kategori bulunmuyor</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
      <Footer navigation={navigation} active="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  addressBox: {
    backgroundColor: '#F6F8FB',
    borderRadius: 12,
    margin: 16,
    padding: 12,
  },
  addressTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },
  addressText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  campaignBoxWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  campaignBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 110,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 0,
    backgroundColor: '#B89EFF',
  },
  campaignImageBg: {
    borderRadius: 16,
    width: '100%',
    height: '100%',
  },
  campaignOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
  },
  campaignTextBox: {
    flex: 1,
    padding: 16,
  },
  campaignTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  campaignSubtitle: {
    color: '#fff',
    fontSize: 13,
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  campaignDate: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noCampaignBox: {
    backgroundColor: '#F6F8FB',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    alignItems: 'center',
  },
  noCampaignText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  categoriesSection: {
    marginTop: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  productsGrid: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    width: '31%',
    aspectRatio: 1,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  productName: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 100,
  },
  loadingText: {
    marginTop: 8,
    color: '#888',
    fontSize: 14,
  },
});

export default HomeScreen;
