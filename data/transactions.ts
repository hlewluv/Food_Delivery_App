const transactionData = [
  {
    id: 'A123',
    customer: 'Khách A',
    biker: 'Muncher A',
    time: '10:00',
    date: '2025-05-13',
    items: [
      {
        id: 'd31df791-fbe8-4e44-b18d-c2bc0e344e8a',
        food_name: 'Ga Vien',
        food_type: 'Chicken',
        price: 55000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507726/khriyj80pgpnoggcbnax.png',
        description: '',
        option_menu: [],
        time: '',
      },
      {
        id: '773ad024-c9bf-414c-844b-314103f8f594',
        food_name: 'Ga chien xu',
        food_type: 'Chicken',
        price: 45000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507714/ea2rybpeyybnyrocvgze.webp',
        description: '',
        option_menu: [],
        time: '',
      },
      {
        id: 'ec79fe39-ac15-41f1-bdc1-fbc878249a4c',
        food_name: 'Soda',
        food_type: 'Drink',
        price: 30000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746946439/fyfikmlvr7adh8mqzlh6.jpg',
        description: 'Coca Cola very good',
        option_menu: [[], []],
        time: '00:00:10',
      },
    ],
    status: 'Hoàn tất',
    paymentMethod: 'Tiền mặt',
  },
  // Thêm các giao dịch khác từ transactions và invoices
  {
    id: 'A124',
    customer: 'Khách B',
    biker: 'Muncher B',
    time: '11:00',
    date: '2025-04-11',
        items: [
      {
        id: 'd31df791-fbe8-4e44-b18d-c2bc0e344e8a',
        food_name: 'Ga Vien',
        food_type: 'Chicken',
        price: 55000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507726/khriyj80pgpnoggcbnax.png',
        description: '',
        option_menu: [],
        time: '',
      },
      {
        id: '773ad024-c9bf-414c-844b-314103f8f594',
        food_name: 'Ga chien xu',
        food_type: 'Chicken',
        price: 45000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746507714/ea2rybpeyybnyrocvgze.webp',
        description: '',
        option_menu: [],
        time: '',
      },
      {
        id: 'ec79fe39-ac15-41f1-bdc1-fbc878249a4c',
        food_name: 'Soda',
        food_type: 'Drink',
        price: 30000,
        image: 'http://res.cloudinary.com/dlxnanybw/image/upload/v1746946439/fyfikmlvr7adh8mqzlh6.jpg',
        description: 'Coca Cola very good',
        option_menu: [[], []],
        time: '00:00:10',
      },
    ],

    status: 'Hoàn tất',
    paymentMethod: 'Thẻ tín dụng',
  },
  // ...các giao dịch khác
];

export default transactionData;