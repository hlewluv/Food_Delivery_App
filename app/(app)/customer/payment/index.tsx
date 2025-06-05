import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';

const PaymentWebView = () => {
  const { url } = useLocalSearchParams<{ url: string }>();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<'qr' | 'webview' | null>(null);

  if (!url) {
    Alert.alert('Lỗi', 'Không tìm thấy URL thanh toán');
    return null;
  }

  const renderSelectionScreen = () => (
    <Animated.View entering={FadeIn.duration(600)} style={styles.selectionContainer}>
      <Text style={styles.header}>Chọn phương thức thanh toán</Text>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setSelectedOption('qr')}
      >
        <Ionicons name="qr-code-outline" size={32} color="#1a1a1a" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Quét mã QR</Text>
          <Text style={styles.optionDescription}>
            Sử dụng ứng dụng ZaloPay để quét mã QR
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setSelectedOption('webview')}
      >
        <Ionicons name="globe-outline" size={32} color="#1a1a1a" />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Thanh toán trực tiếp</Text>
          <Text style={styles.optionDescription}>
            Thanh toán ngay trên trình duyệt
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderQRCodeScreen = () => (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.qrContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setSelectedOption(null)} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.qrLabel}>Quét mã QR để thanh toán</Text>
      </View>
      <View style={styles.qrWrapper}>
        <QRCode
          value={url}
          size={220}
          color="#000"
          backgroundColor="#fff"
        />
      </View>
      <Text style={styles.qrHint}>Sử dụng ứng dụng ZaloPay để quét mã</Text>
    </Animated.View>
  );

  const renderWebViewScreen = () => (
    <Animated.View entering={FadeIn.duration(600)} style={styles.webviewContainer}>
      <View style={styles.webviewHeader}>
        <TouchableOpacity onPress={() => setSelectedOption(null)} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.webviewLabel}>Thanh toán trực tiếp</Text>
      </View>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes('payment-success')) {
            // router.push('/(app)/customer/payment-success');
          } else if (navState.url.includes('payment-failure')) {
            // router.push('/(app)/customer/payment-failure');
          }
        }}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {selectedOption === null && renderSelectionScreen()}
      {selectedOption === 'qr' && renderQRCodeScreen()}
      {selectedOption === 'webview' && renderWebViewScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 16,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  optionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  qrContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  backIcon: {
    padding: 8,
  },
  qrLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  qrHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  webviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  webviewLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  webview: {
    flex: 1,
  },
});

export default PaymentWebView;