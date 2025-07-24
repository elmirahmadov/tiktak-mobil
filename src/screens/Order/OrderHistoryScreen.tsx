import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { getOrders } from '../../common/services/api/order.api';
import { getOrderDetail } from '../../common/services/api/order.api';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

const OrderHistoryScreen = ({ navigation }: { navigation: any }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);

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

    const getStatusText = (status: string) => {
      switch (status) {
        case 'PENDING':
          return 'Gözləmədə';
        case 'ACCEPTED':
          return 'Sifariş qəbul edilib';
        case 'PROCESSING':
          return 'Hazırlanır';
        case 'SHIPPED':
          return 'Göndərilib';
        case 'DELIVERED':
          return 'Çatdırılıb';
        case 'CANCELLED':
          return 'Ləğv edilib';
        default:
          return status || 'Bilinmir';
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'PENDING':
          return '#FFA500';
        case 'ACCEPTED':
          return '#76CB4F';
        case 'PROCESSING':
          return '#2196F3';
        case 'SHIPPED':
          return '#9C27B0';
        case 'DELIVERED':
          return '#4CAF50';
        case 'CANCELLED':
          return '#F44336';
        default:
          return '#888';
      }
    };

    return (
      <TouchableOpacity
        style={styles.itemRow}
        activeOpacity={0.7}
        onPress={() => {
          setSelectedOrderId(item.id);
          setSelectedOrder(item);
          bottomSheetRef.current?.expand();
        }}
      >
        <View style={styles.leftCol}>
          <Text style={styles.noValue}>
            {item.orderNumber ? item.orderNumber : `#${item.id}`}
          </Text>
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusText(item.status)}
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
    <View style={{ flex: 1 }}>
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

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={
          selectedOrder && selectedOrder.items
            ? selectedOrder.items.length === 1
              ? ['65%']
              : selectedOrder.items.length === 2
              ? ['75%']
              : ['85%']
            : ['65%']
        }
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        backdropComponent={renderBackdrop}
        onClose={() => {
          setSelectedOrderId(null);
          setSelectedOrder(null);
        }}
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        style={{ flex: 1 }}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          {selectedOrderId && selectedOrder && (
            <OrderDetailModal
              orderId={selectedOrderId}
              initialOrder={selectedOrder}
              onClose={() => {
                setSelectedOrderId(null);
                setSelectedOrder(null);
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
  initialOrder,
  onClose: _onClose,
}: {
  orderId: number;
  initialOrder: any;
  onClose: () => void;
}) => {
  const [order, setOrder] = useState<any>(initialOrder);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    const fetchDetail = async () => {
      try {
        const res = await getOrderDetail(orderId);
        if (res && res.data) {
          setOrder(res.data);
        } else if (
          res &&
          typeof res === 'object' &&
          Object.keys(res).length > 0
        ) {
          setOrder(res);
        } else {
          setError('Sifariş məlumatı tapılmadı');
        }
      } catch (e) {
        setError('Sifariş detayı alınamadı.');
      }
    };
    fetchDetail();
  }, [orderId]);

  if (error) {
    return (
      <View style={styles.modalLoading}>
        <Feather name="alert-circle" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!order) {
    return null;
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
        value:
          order.address ||
          order.shipping_address ||
          order.adres ||
          order.location ||
          'N/A',
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
        value: `${order.subtotal || order.total || '0'}₼/${
          order.deliveryFee === 0 || order.deliveryFee === '0'
            ? 'pulsuz'
            : `${order.deliveryFee}₼`
        }`,
      },
    ],
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Gözləmədə';
      case 'ACCEPTED':
        return 'Sifariş qəbul edilib';
      case 'PROCESSING':
        return 'Hazırlanır';
      case 'SHIPPED':
        return 'Göndərilib';
      case 'DELIVERED':
        return 'Çatdırılıb';
      case 'CANCELLED':
        return 'Ləğv edilib';
      default:
        return status || 'Bilinmir';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#FFA500';
      case 'ACCEPTED':
        return '#76CB4F';
      case 'PROCESSING':
        return '#2196F3';
      case 'SHIPPED':
        return '#9C27B0';
      case 'DELIVERED':
        return '#4CAF50';
      case 'CANCELLED':
        return '#F44336';
      default:
        return '#888';
    }
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <View style={styles.productRowCustomNew}>
      {item.product?.img_url ? (
        <Image
          source={{ uri: item.product.img_url }}
          style={styles.productImageCustomLarge}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.productImageCustomLarge, styles.placeholderImage]}>
          <Feather name="package" size={24} color="#ccc" />
        </View>
      )}
      <View style={styles.productInfoStack}>
        <Text style={styles.productNameStack} numberOfLines={2}>
          {item.product?.title || item.product?.name || 'Məhsul adı yoxdur'}
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
  );

  const hasProducts =
    order.items && Array.isArray(order.items) && order.items.length > 0;

  return (
    <View style={styles.modalContentContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Sifariş Detayı</Text>
        <TouchableOpacity onPress={_onClose} style={styles.closeButton}>
          <Feather name="x" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        alwaysBounceVertical={false}
      >
        <View style={styles.summaryGridCustom}>
          {summaryRows.map((row, idx) => (
            <View key={idx} style={styles.summaryRowCustom}>
              <View style={styles.summaryColCustom}>
                <Text style={styles.summaryLabelCustom}>{row[0].label}</Text>
                {row[0].label === 'Status' ? (
                  <Text
                    style={[
                      styles.summaryValueCustom,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {getStatusText(order.status)}
                  </Text>
                ) : (
                  <Text style={styles.summaryValueCustom}>{row[0].value}</Text>
                )}
              </View>
              <View style={styles.summaryColCustom}>
                <Text style={styles.summaryLabelCustom}>{row[1].label}</Text>
                <Text
                  style={styles.summaryValueCustom}
                  numberOfLines={row[1].multiline ? 3 : 1}
                  ellipsizeMode="tail"
                >
                  {row[1].value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {hasProducts && (
          <View style={styles.productsContainer}>
            <Text style={styles.productsTitle}>
              Məhsullar ({order.items.length})
            </Text>
            <View style={{ maxHeight: 240 }}>
              <ScrollView showsVerticalScrollIndicator={true}>
                {order.items.map((item: any, idx: number) => (
                  <View key={`product_${item.id}_${idx}`}>
                    {renderProductItem({ item })}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        <View style={styles.totalSumRow}>
          <Text style={styles.totalSumLabel}>Total:</Text>
          <Text style={styles.totalSumValue}>{order.total || '0'} ₼</Text>
        </View>

        <View style={{ height: 30 }} />
      </BottomSheetScrollView>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  noValue: {
    fontSize: 14,
    color: '#2D3651',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
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

  bottomSheetContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalContentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  closeButton: {
    padding: 4,
  },

  summaryGridCustom: {
    marginBottom: 16,
    marginTop: 16,
  },
  summaryRowCustom: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryColCustom: {
    flex: 1,
    paddingRight: 8,
  },
  summaryLabelCustom: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValueCustom: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },

  productsContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3651',
    marginBottom: 12,
  },
  productsScrollView: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 8,
  },
  productRowCustomNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImageCustomLarge: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f8f8f8',
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfoStack: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  productNameStack: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
    marginBottom: 4,
  },
  productPriceStack: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  productQtyStack: {
    fontSize: 12,
    color: '#888',
  },
  productTotalStackBox: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  productTotalStack: {
    fontSize: 15,
    color: '#2D3651',
    fontWeight: 'bold',
  },

  totalSumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  totalSumLabel: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
  },
  totalSumValue: {
    fontSize: 18,
    color: '#76CB4F',
    fontWeight: 'bold',
  },
});

export default OrderHistoryScreen;
