interface CartItem {
  item: {
    id: string;
    name: string;
    price: number;
    image?: { uri: string } | null;
    options?: any[];
  };
  quantity: number;
  restaurantId?: string;
}