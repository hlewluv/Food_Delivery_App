import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (cartItem: {
    item: CartItem['item'];
    restaurantId?: string;
    quantity?: number;
    specialRequest?: string;
    selectedOptions?: FoodOption[];
  }) => void;
  removeItem: (itemId: string, restaurantId: string, specialRequest?: string, selectedOptions?: FoodOption[]) => void;
  updateQuantity: (
    itemId: string,
    restaurantId: string,
    newQuantity: number,
    specialRequest?: string,
    selectedOptions?: FoodOption[]
  ) => void;
  clearCart: (restaurantId?: string) => void;
  getItemsByRestaurant: (restaurantId: string) => CartItem[];
  getRestaurantIdsWithItems: () => string[];
  getTotalItemsByRestaurant: (restaurantId: string) => number;
  getTotalPriceByRestaurant: (restaurantId: string) => number;
  clearExpiredCarts: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: ({ item, restaurantId, quantity = 1, specialRequest = '', selectedOptions = [] }) => {
        set((state) => {
          let updatedItems: CartItem[];
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.item.id === item.id &&
              i.restaurantId === restaurantId &&
              i.specialRequest === specialRequest &&
              JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions)
          );

          if (existingItemIndex >= 0) {
            updatedItems = state.items.map((i, index) =>
              index === existingItemIndex ? { ...i, quantity: i.quantity + quantity } : i
            );
          } else {
            updatedItems = [
              ...state.items,
              { item, quantity, restaurantId, specialRequest, selectedOptions, timestamp: Date.now() },
            ];
          }

          return {
            items: updatedItems,
            restaurantId: state.restaurantId,
          };
        });
      },

      removeItem: (itemId, restaurantId, specialRequest = '', selectedOptions = []) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (i) =>
              !(
                i.item.id === itemId &&
                i.restaurantId === restaurantId &&
                i.specialRequest === specialRequest &&
                JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions)
              )
          );
          return {
            items: updatedItems,
            restaurantId: updatedItems.length === 0 ? null : state.restaurantId,
          };
        });
      },

      updateQuantity: (
        itemId,
        restaurantId,
        newQuantity,
        specialRequest = '',
        selectedOptions = []
      ) => {
        set((state) => {
          const updatedItems = state.items
            .map((i) =>
              i.item.id === itemId &&
              i.restaurantId === restaurantId &&
              i.specialRequest === specialRequest &&
              JSON.stringify(i.selectedOptions) === JSON.stringify(selectedOptions)
                ? { ...i, quantity: newQuantity }
                : i
            )
            .filter((i) => i.quantity > 0);
          return {
            items: updatedItems,
            restaurantId: updatedItems.length === 0 ? null : state.restaurantId,
          };
        });
      },

      clearCart: (restaurantId?: string) => {
        set((state) => ({
          items: restaurantId
            ? state.items.filter((item) => item.restaurantId !== restaurantId)
            : [],
          restaurantId: restaurantId ? state.restaurantId : null,
        }));
      },

      getItemsByRestaurant: (restaurantId: string) => {
        return get().items.filter((item) => item.restaurantId === restaurantId);
      },

      getRestaurantIdsWithItems: () => {
        const restaurantIds = new Set<string>();
        get().items.forEach((item) => {
          if (item.restaurantId) {
            restaurantIds.add(item.restaurantId);
          }
        });
        return Array.from(restaurantIds);
      },

      getTotalItemsByRestaurant: (restaurantId: string) => {
        return get()
          .items.filter((item) => item.restaurantId === restaurantId)
          .reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPriceByRestaurant: (restaurantId: string) => {
        return get()
          .items.filter((item) => item.restaurantId === restaurantId)
          .reduce((sum, item) => {
            const basePrice = item.item.price * item.quantity;
            const optionsPrice = (item.selectedOptions ?? []).reduce(
              (optSum, opt) => optSum + opt.price * item.quantity,
              0
            );
            return sum + basePrice + optionsPrice;
          }, 0);
      },

      clearExpiredCarts: () => {
        set((state) => {
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000;
          const updatedItems = state.items.filter(
            (item) => !item.timestamp || now - item.timestamp < oneDay
          );
          return {
            items: updatedItems,
            restaurantId: updatedItems.length === 0 ? null : state.restaurantId,
          };
        });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);