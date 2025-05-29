import React, { useState, useEffect, useCallback } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  Image, 
  BackHandler,
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types
type Location = {
  latitude: number;
  longitude: number;
};

type OrderItem = {
  id: string;
  food_name: string;
  food_type: string;
  description?: string;
  option_menu: string[][];
  price: number;
};

type Customer = {
  name: string;
  address: string;
  phone?: string;
};

type Restaurant = {
  name: string;
  address: string;
  phone?: string;
};

type Order = {
  id: string;
  restaurant: Restaurant;
  customer: Customer;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  distance?: string;
  earnings?: number;
};

type LocationDetailsProps = {
  title: string;
  name: string;
  address: string;
  isRestaurant: boolean;
  onCall: () => void;
  location: Location;
  onAction: () => void;
  actionText: string;
  setRouteDestination: (location: Location) => void;
  onMinimize: () => void;
  children?: React.ReactNode;
};

type RestaurantDetailsProps = {
  order: Order;
  onArrived: () => void;
  restaurantLocation: Location;
  setRouteDestination: (location: Location) => void;
  onMinimize: () => void;
};

type CustomerDetailsProps = {
  order: Order;
  onComplete: () => void;
  customerLocation: Location;
  setRouteDestination: (location: Location) => void;
  onMinimize: () => void;
};

type DeliverySuccessScreenProps = {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
};

type OrderDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
  setShowFloatingButton: (show: boolean) => void;
  restaurantLocation: Location;
  customerLocation: Location;
  setRouteDestination: (location: Location) => void;
};

// Helper function to format price
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ';
};

// Reusable component for displaying location details
const LocationDetails: React.FC<LocationDetailsProps> = ({
  title,
  name,
  address,
  isRestaurant,
  onCall,
  location,
  onAction,
  actionText,
  setRouteDestination,
  onMinimize,
  children,
}) => {
  const handleNavigate = useCallback(() => {
    console.log(`Navigating to ${isRestaurant ? 'restaurant' : 'customer'}...`);
    setRouteDestination(location);
    onMinimize();
  }, [isRestaurant, location, setRouteDestination, onMinimize]);

  return (
    <View style={styles.locationContainer}>
      <View style={styles.locationHeader}>
        <View style={[styles.locationIndicator, isRestaurant ? styles.restaurantIndicator : styles.customerIndicator]} />
        <Text style={styles.locationTitle}>{title}</Text>
      </View>
      <Text style={styles.locationName}>{name}</Text>
      <Text style={styles.locationAddress}>{address}</Text>
      <View style={styles.locationActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onCall}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>
            {isRestaurant ? 'Gọi nhà hàng' : 'Gọi khách'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleNavigate}>
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionText}>Chỉ đường</Text>
        </TouchableOpacity>
      </View>
      {children}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onAction}>
        <Text style={styles.primaryButtonText}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Reusable component for displaying order items
const OrderItemsList: React.FC<{ items: OrderItem[] }> = ({ items }) => (
  <View style={styles.orderItemsContainer}>
    <Text style={styles.sectionTitle}>Danh sách món ăn</Text>
    {items.map(item => (
      <View key={item.id} style={styles.orderItem}>
        <View style={styles.orderItemDetails}>
          <Text style={styles.orderItemName}>
            {item.food_name} ({item.food_type})
          </Text>
          {item.description && (
            <Text style={styles.orderItemDescription}>{item.description}</Text>
          )}
          {item.option_menu.length > 0 && (
            <Text style={styles.orderItemOptions}>
              Tùy chọn: {item.option_menu.map(opt => opt.join('/')).join(', ')}
            </Text>
          )}
        </View>
        <Text style={styles.orderItemPrice}>{formatPrice(item.price)}</Text>
      </View>
    ))}
  </View>
);

// Reusable component for order summary
const OrderSummary: React.FC<{ total: number; paymentMethod: string }> = ({ total, paymentMethod }) => (
  <View style={styles.orderSummary}>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Tổng cộng:</Text>
      <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
    </View>
    <Text style={styles.paymentMethod}>
      Phương thức thanh toán: {paymentMethod}
    </Text>
  </View>
);

// Restaurant Details Component
const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  order,
  onArrived,
  restaurantLocation,
  setRouteDestination,
  onMinimize,
}) => {
  return (
    <LocationDetails
      title="Nhà hàng"
      name={`${order.restaurant.name} – ${order.restaurant.address.split(',')[0]}`}
      address={order.restaurant.address}
      isRestaurant={true}
      onCall={() => console.log('Calling restaurant...')}
      location={restaurantLocation}
      setRouteDestination={setRouteDestination}
      onMinimize={onMinimize}
      onAction={onArrived}
      actionText="Đã đến"
    >
      <OrderItemsList items={order.items} />
      <OrderSummary total={order.total} paymentMethod={order.paymentMethod} />
    </LocationDetails>
  );
};

// Customer Details Component
const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  order,
  onComplete,
  customerLocation,
  setRouteDestination,
  onMinimize,
}) => {
  return (
    <LocationDetails
      title="Khách hàng"
      name={order.customer.name}
      address={order.customer.address}
      isRestaurant={false}
      onCall={() => console.log('Calling customer...')}
      location={customerLocation}
      setRouteDestination={setRouteDestination}
      onMinimize={onMinimize}
      onAction={onComplete}
      actionText="Hoàn tất"
    >
      <OrderItemsList items={order.items} />
      <OrderSummary total={order.total} paymentMethod={order.paymentMethod} />
    </LocationDetails>
  );
};

// Delivery Success Screen Component
const DeliverySuccessScreen: React.FC<DeliverySuccessScreenProps> = ({
  visible,
  onClose,
  order,
}) => {
  if (!visible || !order) return null;

  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * (2 / 3);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.successModal, { height: modalHeight }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Giao hàng thành công</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollContainer}>
            <Image
              source={{
                uri: 'https://vieclamshipper.com/wp-content/uploads/2024/01/giao-hang-tiet-kiem-mo-rong-quy-mo-tuyen-dung-part-time.jpg',
              }}
              style={styles.successImage}
            />
            <View style={styles.deliveryInfo}>
              <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoText}>Thời gian: {new Date().toLocaleTimeString()}</Text>
                <Text style={styles.infoText}>Khoảng cách: {order.distance || '520 m'}</Text>
              </View>
              <View style={styles.earningsRow}>
                <Text style={styles.earningsText}>
                  Thu nhập: {formatPrice(order.earnings || 15)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onClose}
              >
                <Text style={styles.primaryButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Main OrderDetailsModal Component
const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  visible,
  onClose,
  order,
  setShowFloatingButton,
  restaurantLocation,
  customerLocation,
  setRouteDestination,
}) => {
  const [phase, setPhase] = useState<'restaurant' | 'customer'>('restaurant');
  const [isSuccess, setIsSuccess] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible && !isSuccess && !minimized) {
        handleMinimize();
        return true;
      }
      if (minimized) {
        handleCloseModal();
        return true;
      }
      if (isSuccess) {
        handleCloseSuccess();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [visible, isSuccess, minimized]);

  const handleArrived = useCallback(() => {
    setPhase('customer');
  }, []);

  const handleComplete = useCallback(() => {
    setIsSuccess(true);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setIsSuccess(false);
    setPhase('restaurant');
    setMinimized(false);
    setShowFloatingButton(true);
    onClose();
  }, [onClose, setShowFloatingButton]);

  const handleCloseModal = useCallback(() => {
    setMinimized(false);
    setShowFloatingButton(true);
    onClose();
  }, [onClose, setShowFloatingButton]);

  const handleMinimize = useCallback(() => {
    setMinimized(true);
    setShowFloatingButton(false);
  }, [setShowFloatingButton]);

  const handleRestore = useCallback(() => {
    setMinimized(false);
  }, []);

  if (!order) {
    return null;
  }

  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * (2 / 3);

  return (
    <>
      <Modal
        transparent
        visible={visible && !isSuccess && !minimized}
        animationType="slide"
        onRequestClose={handleMinimize}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.mainModal, { height: modalHeight }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hóa đơn chi tiết</Text>
              <TouchableOpacity onPress={handleMinimize} style={styles.minimizeButton}>
                <Text style={styles.minimizeIcon}>↓</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollContainer}>
              {phase === 'restaurant' ? (
                <RestaurantDetails
                  order={order}
                  onArrived={handleArrived}
                  restaurantLocation={restaurantLocation}
                  setRouteDestination={setRouteDestination}
                  onMinimize={handleMinimize}
                />
              ) : (
                <CustomerDetails
                  order={order}
                  onComplete={handleComplete}
                  customerLocation={customerLocation}
                  setRouteDestination={setRouteDestination}
                  onMinimize={handleMinimize}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {minimized && !isSuccess && (
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
        >
          <Ionicons name="document" size={24} color="white" />
        </TouchableOpacity>
      )}
      <DeliverySuccessScreen 
        visible={isSuccess} 
        onClose={handleCloseSuccess} 
        order={order} 
      />
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mainModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  successModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContainer: {
    maxHeight: 400,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  minimizeButton: {
    padding: 8,
  },
  minimizeIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantIndicator: {
    backgroundColor: '#10B981',
  },
  customerIndicator: {
    backgroundColor: '#9CA3AF',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationAddress: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 4,
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
    color: '#4B5563',
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#4B5563',
  },
  primaryButton: {
    backgroundColor: '#00B14F',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  orderItemsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    color: '#1F2937',
  },
  orderItemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderItemOptions: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderItemPrice: {
    fontSize: 16,
    color: '#1F2937',
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  paymentMethod: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  successImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  deliveryInfo: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#4B5563',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  restoreButton: {
    position: 'absolute',
    bottom: 105,
    right: 40,
    backgroundColor: '#00B14F',
    borderRadius: 999,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default OrderDetailsModal;