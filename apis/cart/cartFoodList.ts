import apiClient from '../config/apiClient';

// Hàm giả lập để lấy userId, thay bằng logic xác thực thực tế
const getCurrentUserId = () => 'user-id'; // Ví dụ: từ auth context hoặc AsyncStorage

interface FoodOption {
  id: string;
  option_name: string;
  price: number;
}

interface CartItem {
  item: {
    id: string;
    name: string;
    price: number;
    image?: { uri: string } | null;
    options?: FoodOption[];
  };
  quantity: number;
  restaurantId?: string;
  specialRequest?: string;
  selectedOptions?: FoodOption[];
  timestamp?: number;
}

interface ServerCartItem {
  food: string; // ID của món ăn
  quantity: number;
  extra_data?: {
    specialRequest?: string;
    selectedOptions?: FoodOption[];
  };
}

interface ServerCart {
  restaurant: string; // ID của nhà hàng
  customer: string; // ID của khách hàng
  created_at: string;
  updated_at: string;
  items: ServerCartItem[];
}

export const syncCartWithServer = async (cartItems: CartItem[], retries = 3) => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User ID not found');
  }

  if (!cartItems[0]?.restaurantId) {
    throw new Error('Restaurant ID not found');
  }

  // Chuyển đổi cartItems sang định dạng server mong đợi
  const serverCart: Partial<ServerCart> = {
    restaurant: cartItems[0].restaurantId,
    customer: userId,
    items: cartItems.map((item) => ({
      food: item.item.id,
      quantity: item.quantity,
      extra_data: {
        specialRequest: item.specialRequest,
        selectedOptions: item.selectedOptions,
      },
    })),
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await apiClient.post(`/sync/`, serverCart);
      return response.data;
    } catch (error) {
      if (i === retries - 1) {
        console.error('Failed to sync cart after retries:', error);
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export const fetchCartFromServer = async (retries = 3) => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('User ID not found');
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await apiClient.get(`/addcart/`, {
        params: { customer: userId },
      });
      const serverCarts: ServerCart[] = response.data;

      // Chuyển đổi dữ liệu server thành định dạng CartItem của ứng dụng
      const cartItems: CartItem[] = serverCarts.flatMap((cart) =>
        cart.items.map((serverItem) => ({
          item: {
            id: serverItem.food,
            name: `Food ${serverItem.food}`, // Cần API món ăn để lấy name, price, image
            price: 0, // Cần ánh xạ từ API món ăn
            image: null,
            options: serverItem.extra_data?.selectedOptions,
          },
          quantity: serverItem.quantity,
          restaurantId: cart.restaurant,
          specialRequest: serverItem.extra_data?.specialRequest,
          selectedOptions: serverItem.extra_data?.selectedOptions,
          timestamp: new Date(cart.updated_at).getTime(),
        }))
      );

      return cartItems;
    } catch (error) {
      if (i === retries - 1) {
        console.error('Failed to fetch cart after retries:', error);
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};