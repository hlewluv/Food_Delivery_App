// src/data/restaurants.ts
import { images } from '@/constant/images'

// Định nghĩa kiểu dữ liệu
export interface Restaurant {
  id: string
  name: string
  image: any
  discount?: string
  rating: number
  time: string
  category: string
  categoryId: string
  isRecommended?: boolean
  description?: string
  deliveryTime?: string
  menuItems?: Array<{
    id: string
    category: string
    items: Array<{
      id: string
      name: string
      restaurant: string
      price: string
      description?: string
      image: any // Bắt buộc phải có ảnh cho mỗi món ăn
    }>
  }>
}

// Danh sách nhà hàng
export const restaurantsData: Restaurant[] = [
  {
    id: '1',
    name: "McDonald's",
    image: images.banh,
    discount: '50%',
    rating: 4.5,
    time: '15-20 min',
    category: 'Đồ ăn nhanh',
    categoryId: '1',
    isRecommended: true,
    description: 'Thức ăn nhanh chất lượng cao với hương vị đặc trưng',
    deliveryTime: '15-20 phút',
    menuItems: [
      {
        id: '1-1',
        category: 'Burgers',
        items: [
          {
            id: '1-1-1',
            name: 'Big Mac',
            restaurant: "McDonald's",
            price: '49.000đ',
            description: 'Bánh burger với 2 miếng thịt bò, sốt đặc biệt, rau sống tươi ngon',
            image: images.banh // Thêm ảnh cho từng món
          },
          {
            id: '1-1-2',
            name: 'Cheeseburger',
            restaurant: "McDonald's",
            price: '29.000đ',
            description: 'Bánh burger phô mai cổ điển',
            image: images.banh
          }
        ]
      },
      {
        id: '1-2',
        category: 'Đồ uống',
        items: [
          {
            id: '1-2-1',
            name: 'Coca-Cola',
            restaurant: "McDonald's",
            price: '20.000đ',
            image: images.thitnuong
          },
          {
            id: '1-2-2',
            name: 'Sprite',
            restaurant: "McDonald's",
            price: '20.000đ',
            image: images.thitnuong
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'KFC',
    image: images.myquang2,
    discount: '30%',
    rating: 4.2,
    time: '20-25 min',
    category: 'Đồ ăn nhanh',
    categoryId: '1',
    isRecommended: true,
    description: 'Gà rán thương hiệu nổi tiếng thế giới',
    deliveryTime: '20-25 phút',
    menuItems: [
      {
        id: '2-1',
        category: 'Gà rán',
        items: [
          {
            id: '2-1-1',
            name: 'Gà rán truyền thống (3 miếng)',
            restaurant: 'KFC',
            price: '89.000đ',
            image: images.thitnuong
          },
          {
            id: '2-1-2',
            name: 'Gà giòn cay (2 miếng)',
            restaurant: 'KFC',
            price: '69.000đ',
            image: images.thitnuong
          }
        ]
      },
      {
        id: '2-2',
        category: 'Combo',
        items: [
          {
            id: '2-2-1',
            name: 'Combo 1 người',
            restaurant: 'KFC',
            price: '119.000đ',
            description: '1 gà rán + 1 khoai tây chiên + 1 nước ngọt',
            image: images.banh
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Coffee House',
    image: images.hacao,
    discount: '20%',
    rating: 4.8,
    time: '10-15 min',
    category: 'Cafe & Trà sữa',
    categoryId: '3',
    isRecommended: true,
    description: 'Không gian cà phê sang trọng, đẳng cấp',
    menuItems: [
      {
        id: '3-1',
        category: 'Cà phê',
        items: [
          {
            id: '3-1-1',
            name: 'Cà phê đen',
            restaurant: 'Coffee House',
            price: '25.000đ',
            image: images.banh
          },
          {
            id: '3-1-2',
            name: 'Cà phê sữa',
            restaurant: 'Coffee House',
            price: '29.000đ',
            image: images.banh
          }
        ]
      },
      {
        id: '3-2',
        category: 'Trà sữa',
        items: [
          {
            id: '3-2-1',
            name: 'Trà sữa trân châu',
            restaurant: 'Coffee House',
            price: '45.000đ',
            image: images.banh
          }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Pizza Hut',
    image: images.myquang,
    discount: '25%',
    rating: 4.3,
    time: '25-30 min',
    category: 'Pizza & Mỳ Ý',
    categoryId: '6',
    isRecommended: true,
    description: 'Pizza ngon chuẩn vị Ý',
    menuItems: [
      {
        id: '4-1',
        category: 'Pizza',
        items: [
          {
            id: '4-1-1',
            name: 'Pizza hải sản',
            restaurant: 'Pizza Hut',
            price: '199.000đ',
            description: 'Size L, đế dày',
            image: images.ruou
          },
          {
            id: '4-1-2',
            name: 'Pizza bò Ý',
            restaurant: 'Pizza Hut',
            price: '179.000đ',
            image: images.banh
          }
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'Phở Hà Nội',
    image: images.myquang,
    rating: 4.7,
    time: '15-20 min',
    category: 'Món Việt',
    categoryId: '2',
    isRecommended: true,
    description: 'Phở ngon chuẩn vị Hà Nội',
    menuItems: [
      {
        id: '5-1',
        category: 'Phở',
        items: [
          {
            id: '5-1-1',
            name: 'Phở bò',
            restaurant: 'Phở Hà Nội',
            price: '50.000đ',
            image: images.trungcut
          },
          {
            id: '5-1-2',
            name: 'Phở gà',
            restaurant: 'Phở Hà Nội',
            price: '45.000đ',
            image: images.trungcut
          }
        ]
      }
    ]
  },
  {
    id: '6',
    name: 'Bún Bò Huế',
    image: images.myquang,
    discount: '25%',
    rating: 4.7,
    time: '15-20 min',
    category: 'Món Việt',
    categoryId: '2',
    isRecommended: true,
    description: 'Bún bò Huế đậm đà hương vị xứ Huế',
    menuItems: [
      {
        id: '6-1',
        category: 'Bún',
        items: [
          {
            id: '6-1-1',
            name: 'Bún bò Huế',
            restaurant: 'Bún Bò Huế',
            price: '45.000đ',
            image: images.thitnuong
          },
          {
            id: '6-1-2',
            name: 'Bún bò giò heo',
            restaurant: 'Bún Bò Huế',
            price: '55.000đ',
            image: images.cahoi
          }
        ]
      }
    ]
  },
  {
    id: '7',
    name: 'Beefsteak House',
    image: images.trungcut,
    rating: 4.4,
    time: '20-25 min',
    category: 'Beefsteak',
    categoryId: '4',
    isRecommended: true,
    description: 'Bò bít tết cao cấp nhập khẩu',
    menuItems: [
      {
        id: '7-1',
        category: 'Steak',
        items: [
          {
            id: '7-1-1',
            name: 'Bò bít tết Úc',
            restaurant: 'Beefsteak House',
            price: '299.000đ',
            image: images.cahoi
          },
          {
            id: '7-1-2',
            name: 'Bò Wagyu',
            restaurant: 'Beefsteak House',
            price: '499.000đ',
            image: images.thitnuong
          }
        ]
      }
    ]
  },
  {
    id: '8',
    name: 'Milk Tea Shop',
    image: images.yen,
    rating: 4.7,
    time: '10-15 min',
    category: 'Đồ uống',
    categoryId: '2',
    isRecommended: true,
    description: 'Trà sữa Đài Loan chính hiệu',
    menuItems: [
      {
        id: '8-1',
        category: 'Trà sữa',
        items: [
          {
            id: '8-1-1',
            name: 'Trà sữa trân châu đường đen',
            restaurant: 'Milk Tea Shop',
            price: '45.000đ',
            image: images.ruou
          },
          {
            id: '8-1-2',
            name: 'Trà đào cam sả',
            restaurant: 'Milk Tea Shop',
            price: '40.000đ',
            image: images.ruou
          }
        ]
      }
    ]
  }
]

export const getRestaurantsByCategoryId = (categoryId: string) => {
  return restaurantsData.filter(r => r.categoryId === categoryId);
}

export const getDiscountRestaurants = (categoryId?: string) => {
  const withDiscount = restaurantsData.filter(r => r.discount);
  return categoryId ? withDiscount.filter(r => r.categoryId === categoryId) : withDiscount;
}

export const getRecommendedRestaurants = (categoryId?: string) => {
  const recommended = restaurantsData.filter(r => r.isRecommended);
  return categoryId ? recommended.filter(r => r.categoryId === categoryId) : recommended;
}

export function filterRestaurantsByFoodId(restaurants: Restaurant[], foodId: string): Restaurant[] {
  return restaurants.filter(restaurant =>
    restaurant.menuItems?.some(section => section.items.some(item => item.id === foodId))
  )
}

export const getRestaurantById = (id: string) => {
  return restaurantsData.find(r => r.id === id)
}

export const getUniqueCategories = () => {
  const categories = restaurantsData.map(r => ({
    id: r.categoryId,
    name: r.category
  }))
  return [...new Map(categories.map(item => [item.id, item]))].map(([_, value]) => value)
}

