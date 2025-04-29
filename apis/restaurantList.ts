import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch danh sách nhà hàng khi component được mount
  useEffect(() => {
    axios.get('http://172.20.10.2/user/restaurant_list/') // Thay bằng URL của API Django
      .then((response) => {
        setRestaurants(response.data); // Lưu dữ liệu nhà hàng vào state
        setLoading(false); // Tắt loading sau khi dữ liệu được lấy
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Dù có lỗi cũng phải tắt loading
      });
  }, []);
};

export default RestaurantList;