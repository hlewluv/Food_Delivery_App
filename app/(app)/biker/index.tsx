import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Modal,
  Switch,
  FlatList,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import WebView from 'react-native-webview';

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [balance, setBalance] = useState(3000000);
  const [isConnected, setIsConnected] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const webViewRef = useRef(null);

  // Danh sách địa điểm yêu thích mẫu
  const [favorites, setFavorites] = useState([
    { id: 1, name: 'Nhà riêng', address: '123 Đường ABC, Quận 1' },
    { id: 2, name: 'Công ty', address: '456 Đường XYZ, Quận 3' },
    { id: 3, name: 'Trung tâm mua sắm', address: '789 Đường LMN, Quận 5' },
  ]);

  // Thay YOUR_GOOGLE_MAPS_API_KEY bằng API key của bạn
  const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

  // Hàm định dạng số tiền
  const formatMoney = (amount) => {
    if (amount >= 1000000) {
      const millions = amount / 1000000;
      return millions % 1 === 0 ? `${millions.toFixed(0)}M` : `${millions.toFixed(1)}M`;
    } else if (amount >= 1000) {
      const thousands = amount / 1000;
      return thousands % 1 === 0 ? `${thousands.toFixed(0)}k` : `${thousands.toFixed(1)}k`;
    }
    return amount.toString();
  };

  // Lấy vị trí người dùng
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Quyền truy cập vị trí bị từ chối');
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(loc.coords);

        // Gửi vị trí tới WebView để cập nhật bản đồ
        if (webViewRef.current && loc.coords) {
          webViewRef.current.injectJavaScript(`
            window.centerMap(${loc.coords.latitude}, ${loc.coords.longitude});
            window.addMarker(${loc.coords.latitude}, ${loc.coords.longitude}, 'Vị trí của bạn');
          `);
        }
      } catch (error) {
        setErrorMsg('Không thể lấy vị trí hiện tại');
        console.error(error);
      }
    })();
  }, []);

  // HTML cho WebView để hiển thị Google Map
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places"></script>
        <script>
          let map;
          let markers = [];

          function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: 10.8231, lng: 106.6297 },
              zoom: 15,
            });
          }

          function centerMap(lat, lng) {
            map.setCenter({ lat, lng });
            map.setZoom(15);
          }

          function addMarker(lat, lng, title) {
            // Xóa marker cũ
            markers.forEach(marker => marker.setMap(null));
            markers = [];

            // Thêm marker mới
            const marker = new google.maps.Marker({
              position: { lat, lng },
              map: map,
              title: title,
            });
            markers.push(marker);
          }

          window.onload = initMap;
        </script>
      </head>
      <body>
        <div id="map"></div>
      </body>
    </html>
  `;

  const handleCenterMap = () => {
    if (location && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        window.centerMap(${location.latitude}, ${location.longitude});
      `);
    }
  };

  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      setAutoAccept(false);
    } else {
      setShowConnectionModal(true);
    }
  };

  const confirmConnection = () => {
    setIsConnected(true);
    setShowConnectionModal(false);
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity className="py-3 border-b border-gray-100">
      <Text className="font-medium">{item.name}</Text>
      <Text className="text-gray-500 text-sm">{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* WebView thay cho MapView */}
      <View className="flex-1">
        <WebView
          ref={webViewRef}
          source={{ html: mapHtml }}
          style={StyleSheet.absoluteFillObject}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>

      {/* Overlay khi đang tải hoặc lỗi */}
      {!location && (
        <View className="absolute inset-0 justify-center items-center bg-white/90">
          <View className="bg-white p-6 rounded-xl shadow-lg items-center">
            <Ionicons name="location-outline" size={48} color="#888" className="mb-4" />
            <Text className="text-lg font-semibold text-gray-800">
              {errorMsg || 'Đang tải bản đồ...'}
            </Text>
            {!errorMsg && <Text className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</Text>}
          </View>
        </View>
      )}

      {/* Thanh thông tin trên cùng */}
      <View className="absolute top-6 left-0 right-0 flex-row justify-between px-4">
        <TouchableOpacity
          className="bg-white rounded-full px-4 py-2 flex-row items-center shadow-md"
          onPress={() => router.push('./biker/wallet/income')}
        >
          <View className="flex-row items-baseline">
            <Text className="text-xs text-gray-500 mr-1">VND</Text>
            <Text className="text-base font-medium text-black">{formatMoney(balance)}</Text>
          </View>
          <View className="w-px h-5 bg-gray-300 mx-3" />
          <View className="flex-row items-center">
            <Ionicons name="diamond" size={20} color="#FFD700" />
            <Text className="text-base font-medium text-black ml-1">70</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-full p-1 shadow-md flex-row items-center">
          <Image
            source={{
              uri: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482752rhD/anh-mo-ta.png',
            }}
            className="w-8 h-8 rounded-full"
          />
          <View className="flex-row items-center ml-2 px-2 py-1 bg-yellow-50 rounded-full">
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text className="text-xs font-semibold text-black ml-1">5.0</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Nút điều khiển dưới cùng */}
      <View className="absolute bottom-4 w-full px-4">
        <TouchableOpacity
          className={`rounded-full py-3 px-6 flex-row justify-center items-center shadow-lg mb-4 mx-auto ${
            isConnected ? 'bg-red-500' : 'bg-[#404341]'
          }`}
          activeOpacity={0.8}
          style={{ width: 'auto' }}
          onPress={toggleConnection}
        >
          <Ionicons name="power-outline" size={20} color="#fff" />
          <Text className="text-white font-bold ml-2 text-sm">
            {isConnected ? 'TẮT KẾT NỐI' : 'BẬT KẾT NỐI'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-between bg-white rounded-full px-6 py-3 shadow-md">
          {[
            { icon: 'location-outline', label: 'Lưu vị trí' },
            { icon: 'navigate-outline', label: 'Định vị', action: handleCenterMap },
            { icon: 'information-circle-outline', label: 'Trung tâm' },
            { icon: 'call-outline', label: 'Gọi Now' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="items-center"
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View className="bg-gray-100 p-2 rounded-full">
                <Ionicons name={item.icon} size={20} color="#333" />
              </View>
              <Text className="text-xs mt-1 text-gray-700">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modal kết nối */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showConnectionModal}
        onRequestClose={() => setShowConnectionModal(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPressOut={() => setShowConnectionModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-t-3xl p-6">
              <Text className="text-lg font-bold text-center mb-4">
                Tăng cơ hội nhận cuốc khi bật tự động nhận cuốc
              </Text>

              <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
                <Text className="text-base">Tự động nhận cuốc</Text>
                <Switch
                  value={autoAccept}
                  onValueChange={setAutoAccept}
                  trackColor={{ false: '#e5e7eb', true: '#00b14f' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="flex-row justify-between items-center py-3">
                <Text className="text-base">Điểm đến yêu thích</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => setShowFavoritesModal(true)}
                    className="ml-2"
                  >
                    <Ionicons name="chevron-forward" size={20} color="#00b14f" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                className="bg-[#00b14f] rounded-full py-4 items-center mt-6"
                onPress={confirmConnection}
              >
                <Text className="text-white font-medium">BẬT KẾT NỐI</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal địa điểm yêu thích */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFavoritesModal}
        onRequestClose={() => setShowFavoritesModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-1/2">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Địa điểm yêu thích</Text>
              <TouchableOpacity onPress={() => setShowFavoritesModal(false)}>
                <Ionicons name="close" size={24} color="#00b14f" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={favorites}
              renderItem={renderFavoriteItem}
              keyExtractor={(item) => item.id.toString()}
              className="flex-1"
            />

            <TouchableOpacity
              className="bg-[#00b14f] rounded-full py-3 items-center mt-4 flex-row justify-center"
              onPress={() => {
                // Thêm logic để thêm địa điểm mới
              }}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Thêm địa điểm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default App;