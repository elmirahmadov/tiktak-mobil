import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useBasketStore } from '../common/store/Basket';
import { useAuthStore } from '../common/store/Auth/auth.store';
import { checkout as orderCheckout } from '../common/services/api/order.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutScreen = ({ navigation }: { navigation: any }) => {
  const basketItems = useBasketStore(state => state.items) || [];
  const totalPrice = useBasketStore(state => state.totalPrice) || 0;
  const user: Record<string, any> = useAuthStore(state => state.user) || {};
  const [note, setNote] = useState('');
  const [payment, setPayment] = useState('cash');
  const actions = useBasketStore(state => state.actions);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.summaryRow}>
      <Text style={styles.productSummary}>
        {item.quantity} x {item.product?.title || item.product?.name}
      </Text>
      <Text style={styles.productSummary}>
        {(item.product?.price * item.quantity).toFixed(2)} AZN
      </Text>
    </View>
  );

  const handleOrder = async () => {
    try {
      const payload = {
        paymentMethod: payment === 'cash' ? 'CASH' : 'CARD',
        note,
        address: user.address || user.adres || user.location || '',
        phone: user.phone || '',
      };
      console.log('Checkout payload:', payload);
      if (!payload.paymentMethod || !payload.address || !payload.phone) {
        console.error('Eksik alanlar:', payload);
        Alert.alert('Xəta', 'Bütün alanlar doldurulmalıdır.');
        return;
      }
      await orderCheckout(payload as any);
      actions.reset(); // Səbəti sıfırla
      await AsyncStorage.removeItem('basket-store'); // Persisted səbəti də sil
      // Alert yerine başarı ekranına yönlendir
      navigation.replace('OrderSuccess');
    } catch (e: any) {
      if (e.response) {
        console.error('Backend error:', e.response.data);
      }
      console.error('Order checkout error:', e);
      Alert.alert('Xəta', 'Sifarişi tamamlamaq mümkün olmadı.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sifarişi tamamla</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Adınız</Text>
        <Text style={styles.value}>{user.full_name || '-'}</Text>
        <Text style={styles.label}>Unvanınız</Text>
        <Text style={styles.value}>
          {user.address || user.adres || user.location || '-'}
        </Text>
        <Text style={styles.label}>Telefon</Text>
        <Text style={styles.value}>{user.phone || '-'}</Text>
        <Text style={styles.label}>Əlavə qeydiniz</Text>
        <TextInput
          style={styles.noteInput}
          placeholder=""
          value={note}
          onChangeText={setNote}
          multiline
        />
        <View style={styles.paymentRow}>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setPayment('cash')}
          >
            <View
              style={[
                styles.radioCircle,
                payment === 'cash' && styles.radioCircleActive,
              ]}
            >
              {payment === 'cash' && <View style={styles.radioDot} />}
            </View>
            <Text
              style={[
                styles.radioLabel,
                payment === 'cash' && { color: '#6DD96D' },
              ]}
            >
              Qapıda nağd
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setPayment('card')}
          >
            <View
              style={[
                styles.radioCircle,
                payment === 'card' && styles.radioCircleActive,
              ]}
            >
              {payment === 'card' && <View style={styles.radioDot} />}
            </View>
            <Text
              style={[
                styles.radioLabel,
                payment === 'card' && { color: '#6DD96D' },
              ]}
            >
              Qapıda kart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.summaryBox}>
        <FlatList
          data={basketItems}
          renderItem={renderItem}
          keyExtractor={item => String(item.product_id || item.product?.id)}
        />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ümumi:</Text>
          <Text style={styles.summaryValue}>{totalPrice.toFixed(2)} AZN</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Çatdırılma:</Text>
          <Text style={styles.summaryValue}>Pulsuz</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>
            Yekun məbləğ:
          </Text>
          <Text style={[styles.summaryValue, { fontWeight: 'bold' }]}>
            {totalPrice.toFixed(2)} AZN
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
        <Text style={styles.orderBtnText}>Sifarişi tamamla</Text>
      </TouchableOpacity>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  infoBox: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 2,
  },
  value: {
    color: '#222',
    fontSize: 15,
    fontWeight: 'bold',
  },
  noteInput: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    minHeight: 60,
    marginTop: 6,
    marginBottom: 12,
    padding: 10,
    fontSize: 15,
    color: '#222',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B7EAB7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  radioCircleActive: {
    borderColor: '#6DD96D',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6DD96D',
  },
  radioLabel: {
    fontSize: 15,
    color: '#222',
  },
  summaryBox: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    marginHorizontal: 0,
    marginTop: 10,
    marginBottom: 10,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  productSummary: {
    color: '#222',
    fontSize: 15,
  },
  summaryLabel: {
    color: '#888',
    fontSize: 14,
  },
  summaryValue: {
    color: '#222',
    fontSize: 14,
  },
  orderBtn: {
    backgroundColor: '#A6E6A6',
    borderRadius: 8,
    margin: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  orderBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
