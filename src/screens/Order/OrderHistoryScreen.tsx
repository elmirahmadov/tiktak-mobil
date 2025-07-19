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
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Footer from '../../common/components/Footer';
import { getOrders } from '../../common/services/api/order.api';
import { getOrderDetail } from '../../common/services/api/order.api';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

const OrderHistoryScreen = ({ navigation }: { navigation: any }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '65%'], []);

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

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOrders();
        setOrders(res.data || []);
      } catch (e: any) {
        setError('Sifarişlər alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const address =
      item.address ||
      item.shipping_address ||
      item.adres ||
      item.location ||
      'Çatdırılma ünvanı yoxdur';
    return (
      <TouchableOpacity
        style={styles.itemRow}
        activeOpacity={0.7}
        onPress={() => {
          setSelectedOrderId(item.id);
          bottomSheetRef.current?.expand();
        }}
      >
        <View style={styles.leftCol}>
          <Text style={styles.noLabel}>No</Text>
          <Text style={styles.noValue}>
            {item.orderNumber ? item.orderNumber : `#${item.id}`}
          </Text>
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.addressLabel}>Çatdırılma ünvanı</Text>
          <Text style={styles.addressValue} numberOfLines={1}>
            {address}
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color="#222"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sifariş tarixçəsi</Text>
        <View style={{ width: 24 }} />
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#76CB4F" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={{ color: '#888' }}>Sifariş tapılmadı</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item, index) => `order_${item.id}_${index}`}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Footer navigation={navigation} active="Profile" />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        onClose={() => {
          setSelectedOrderId(null);
        }}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedOrderId && (
            <OrderDetailModal
              orderId={selectedOrderId}
              onClose={() => {
                setSelectedOrderId(null);
                bottomSheetRef.current?.close();
              }}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const OrderDetailModal = ({
  orderId,
}: {
  orderId: number;
  onClose: () => void;
}) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOrder(null);
    setError(null);
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOrderDetail(orderId);
        if (res && res.data) {
          setOrder(res.data);
        } else if (res && !res.data) {
          setOrder(res);
        } else {
          setError('Sifariş məlumatı tapılmadı');
        }
      } catch (e) {
        setError('Sifariş detayı alınamadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.modalLoading}>
        <ActivityIndicator size="large" color="#76CB4F" />
        <Text style={styles.loadingText}>Sifariş yüklənir...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.modalLoading}>
        <Feather name="alert-circle" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
        >
          <Text style={styles.retryButtonText}>Yenidən cəhd et</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.modalLoading}>
        <Feather name="package" size={48} color="#ccc" />
        <Text style={styles.errorText}>Sifariş tapılmadı</Text>
      </View>
    );
  }

  const summaryRows = [
    [
      {
        label: 'Tarix',
        value: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString('tr-TR')
          : 'N/A',
      },
      {
        label: 'No',
        value: order.orderNumber ? `#${order.orderNumber}` : `#${order.id}`,
      },
    ],
    [
      { label: 'Məhsul sayı', value: order.items?.length?.toString() || '0' },
      {
        label: 'Çatdırılma ünvanı',
        value: order.address || 'N/A',
        multiline: true,
      },
    ],
    [
      {
        label: 'Status',
        value:
          order.status === 'PENDING'
            ? 'Gözləmədə'
            : order.status === 'ACCEPTED'
            ? 'Sifariş qəbul edilib'
            : order.status,
      },
      {
        label: 'Subtotal/Çatdırılma',
        value: `${order.subtotal || order.total || '0'}m/${
          order.deliveryFee === 0 || order.deliveryFee === '0'
            ? 'pulsuz'
            : `${order.deliveryFee}m`
        }`,
      },
    ],
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Sifariş Detayı</Text>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryGridCustom}>
          {summaryRows.map((row, idx) => (
            <View key={idx} style={styles.summaryRowCustom}>
              <View style={styles.summaryColCustom}>
                <Text style={styles.summaryLabelCustom}>{row[0].label}</Text>
                <Text style={styles.summaryValueCustom}>{row[0].value}</Text>
              </View>

              <View style={styles.summaryColCustom}>
                <Text style={styles.summaryLabelCustom}>{row[1].label}</Text>
                <Text
                  style={styles.summaryValueCustom}
                  numberOfLines={row[1].multiline ? 2 : 1}
                  ellipsizeMode="tail"
                >
                  {row[1].value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {order.items &&
          Array.isArray(order.items) &&
          order.items.length > 0 && (
            <View style={{ marginTop: 12 }}>
              {order.items.map((item: any, idx: number) => (
                <View
                  key={`item_${item.id}_${idx}`}
                  style={styles.productRowCustomNew}
                >
                  <Image
                    source={
                      item.product?.img_url
                        ? { uri: item.product.img_url }
                        : undefined
                    }
                    style={styles.productImageCustomLarge}
                    resizeMode="cover"
                  />
                  <View style={styles.productInfoStack}>
                    <Text style={styles.productNameStack} numberOfLines={1}>
                      {item.product?.title ||
                        item.product?.name ||
                        'Məhsul adı yoxdur'}
                    </Text>
                    <Text style={styles.productPriceStack}>
                      {item.product?.price || '0'} ₼
                    </Text>
                    <Text style={styles.productQtyStack}>
                      {item.quantity || 1} {item.product?.unit || 'əd'}
                    </Text>
                  </View>
                  <View style={styles.productTotalStackBox}>
                    <Text style={styles.productTotalStack}>
                      {item.total_price ||
                        item.quantity * (item.product?.price || 0) ||
                        '0'}{' '}
                      ₼
                    </Text>
                  </View>
                </View>
              ))}

              <View style={styles.totalSumRow}>
                <Text style={styles.totalSumLabel}>Total:</Text>
                <Text style={styles.totalSumValue}>{order.total || '0'} ₼</Text>
              </View>
            </View>
          )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  leftCol: {
    minWidth: 60,
    marginRight: 12,
  },
  rightCol: {
    flex: 1,
    justifyContent: 'center',
  },
  noLabel: {
    fontSize: 12,
    color: '#5B6583',
    marginBottom: 2,
  },
  noValue: {
    fontSize: 14,
    color: '#2D3651',
    fontWeight: '500',
  },
  addressLabel: {
    fontSize: 12,
    color: '#5B6583',
    marginBottom: 2,
  },
  addressValue: {
    fontSize: 14,
    color: '#2D3651',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 0,
    minHeight: 420,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#76CB4F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  summaryItem: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  productImageContainer: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  productImageSmall: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  productInfoSimple: {
    flex: 1,
  },
  productNameSimple: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    marginBottom: 4,
  },
  productPriceSimple: {
    fontSize: 13,
    color: '#666',
  },
  noProductsContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  noProductsText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  base64Text: {
    fontSize: 8,
    color: '#999',
    marginTop: 2,
  },
  debugText: {
    marginTop: 8,
    color: '#aaa',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    minWidth: 70,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#222',
    marginLeft: 8,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D3651',
    marginBottom: 8,
  },
  infoDetail: {
    fontSize: 13,
    color: '#222',
    marginBottom: 4,
  },
  totalText: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginTop: 8,
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3651',
    marginTop: 12,
    marginBottom: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 1,
  },
  productTotal: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'bold',
    marginTop: 2,
  },
  summaryGridCustom: {
    marginBottom: 16,
  },
  summaryRowCustom: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryColCustom: {
    flex: 1,
    paddingRight: 8,
  },
  summaryLabelCustom: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  summaryValueCustom: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  productRowCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 2,
  },
  productImageCustom: {
    width: 54,
    height: 54,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  productInfoCustom: {
    flex: 1,
    justifyContent: 'center',
  },
  productNameCustom: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productMetaCustom: {
    fontSize: 13,
    color: '#666',
  },
  productMetaRowCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 12,
  },
  productTotalCustom: {
    fontSize: 14,
    color: '#2D3651',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  productInfoCustomRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  productNameCustomRight: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'right',
  },
  productMetaCustomRight: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
    textAlign: 'right',
  },
  productTotalCustomRight: {
    fontSize: 14,
    color: '#2D3651',
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'right',
  },
  productImageCustomLarge: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 20,
    backgroundColor: '#f0f0f0',
  },
  productInfoCustomLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  productNameCustomLeft: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'left',
  },
  productTotalCustomLeft: {
    fontSize: 15,
    color: '#2D3651',
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'left',
  },
  productRowCustomNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 2,
  },
  productInfoStack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 2,
  },
  productNameStack: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'left',
  },
  productPriceStack: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    textAlign: 'left',
  },
  productQtyStack: {
    fontSize: 13,
    color: '#888',
    textAlign: 'left',
  },
  productTotalStackBox: {
    minWidth: 70,
    alignItems: 'flex-end',
  },
  productTotalStack: {
    fontSize: 16,
    color: '#2D3651',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalSumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
    gap: 8,
  },
  totalSumLabel: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
    marginRight: 6,
  },
  totalSumValue: {
    fontSize: 18,
    color: '#76CB4F',
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
});

export default OrderHistoryScreen;
