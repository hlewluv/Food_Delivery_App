const transactionData = [
  {
    id: 'A123',
    restaurant: {
      name: 'Gà Rán Anh Tuấn 2',
      address: 'Phường Tân, Quận 7, Ho Chi Minh City, 700000'
    },
    customer: {
      name: 'Khách A',
      address: '3 Nguyễn Lương Bằng, P.Tân Phú, Q.7, Ho Chi Minh City, 700000'
    },
    biker: {
      name: 'Muncher A'
    },
    time: '10:00',
    date: '2025-05-13',
    items: [
      {
        id: 'd31df791-fbe8-4e44-b18d-c2bc0e344e8a',
        food_name: 'Gà Viên',
        food_type: 'Chicken',
        price: 55000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507726/khriyj80pgpnoggcbnax.png',
        description: '',
        time: '00:00:05',
        option_menu: []
      },
      {
        id: '773ad024-c9bf-414c-844b-314103f8f594',
        food_name: 'Gà Chiên Xù',
        food_type: 'Chicken',
        price: 45000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507714/ea2rybpeyybnyrocvgze.webp',
        description: '',
        time: '00:00:05',
        option_menu: []
      },
      {
        id: 'ec79fe39-ac15-41f1-bdc1-fbc878249a4c',
        food_name: 'Soda',
        food_type: 'Drink',
        price: 30000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746946439/fyfikmlvr7adh8mqzlh6.jpg',
        description: 'Coca Cola very good',
        time: '00:00:10',
        option_menu: [['Đá', 'Không đá'], ['Lớn', 'Nhỏ']]
      }
    ],
    total: 130000,
    status: 'Hoàn tất',
    paymentMethod: 'Tiền mặt',
    distance: '0.1 km',
    earnings: 23273
  },
  {
    id: 'A124',
    restaurant: {
      name: 'Phở 24',
      address: '123 Lê Lợi, Quận 1, Ho Chi Minh City, 700000'
    },
    customer: {
      name: 'Khách B',
      address: '456 Trần Hưng Đạo, Quận 5, Ho Chi Minh City, 700000'
    },
    biker: {
      name: 'Muncher B'
    },
    time: '11:00',
    date: '2025-04-11',
    items: [
      {
        id: 'd31df791-fbe8-4e44-b18d-c2bc0e344e8a',
        food_name: 'Gà Viên',
        food_type: 'Chicken',
        price: 55000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507726/khriyj80pgpnoggcbnax.png',
        description: '',
        time: '00:00:05',
        option_menu: []
      },
      {
        id: '773ad024-c9bf-414c-844b-314103f8f594',
        food_name: 'Gà Chiên Xù',
        food_type: 'Chicken',
        price: 45000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507714/ea2rybpeyybnyrocvgze.webp',
        description: '',
        time: '00:00:05',
        option_menu: []
      },
      {
        id: 'ec79fe39-ac15-41f1-bdc1-fbc878249a4c',
        food_name: 'Soda',
        food_type: 'Drink',
        price: 30000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746946439/fyfikmlvr7adh8mqzlh6.jpg',
        description: 'Coca Cola very good',
        time: '00:00:10',
        option_menu: [['Đá', 'Không đá'], ['Lớn', 'Nhỏ']]
      }
    ],
    total: 130000,
    status: 'Hoàn tất',
    paymentMethod: 'Thẻ tín dụng',
    distance: '0.5 km',
    earnings: 24500
  },
  {
    id: 'A125',
    restaurant: {
      name: 'Bún Bò Huế',
      address: '789 Hai Bà Trưng, Quận 3, Ho Chi Minh City, 700000'
    },
    customer: {
      name: 'Khách C',
      address: '101 Nguyễn Văn Cừ, Quận 1, Ho Chi Minh City, 700000'
    },
    biker: {
      name: 'Muncher C'
    },
    time: '12:30',
    date: '2025-05-20',
    items: [
      {
        id: 'a1b2c3d4-e5f6-4g7h-i8j9-k0l1m2n3o4p5',
        food_name: 'Bún Bò',
        food_type: 'Noodle',
        price: 60000,
        image: 'http://example.com/bunbo.jpg',
        description: 'Spicy beef noodle soup',
        time: '00:00:15',
        option_menu: [['Ít cay', 'Cay vừa', 'Rất cay']]
      },
      {
        id: 'b2c3d4e5-f6g7-4h8i-j9k0-l1m2n3o4p5q6',
        food_name: 'Trà Đá',
        food_type: 'Drink',
        price: 10000,
        image: 'http://example.com/trada.jpg',
        description: 'Iced tea',
        time: '00:00:03',
        option_menu: [['Đá', 'Không đá']]
      }
    ],
    total: 70000,
    status: 'Hoàn tất',
    paymentMethod: 'Tiền mặt',
    distance: '0.3 km',
    earnings: 15000
  }
];

export default transactionData;