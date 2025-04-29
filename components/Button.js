import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  size = 'medium',    // 'small' | 'medium' | 'large'
  style = {},
  textStyle = {},
  disabled = false,
}) => {
  // Base style
  const baseStyle = {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: '#FFFFFF', // blue-500
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: '#ef4444', // red-500
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#d1d5db', // gray-300
    },
  };

  // Size styles
  const sizeStyles = {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
  };

  // Text styles
  const textStyles = {
    primary: {
      color: '#00b14f',
      fontSize: 16,
      fontWeight: '600',
    },
    secondary: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    outline: {
      color: '#1f2937', // gray-800
      fontSize: 16,
      fontWeight: '600',
    },
  };

  // Disabled style
  const disabledStyle = {
    opacity: 0.6,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        baseStyle,
        variantStyles[variant],
        sizeStyles[size],
        disabled && disabledStyle,
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text style={[textStyles[variant], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;