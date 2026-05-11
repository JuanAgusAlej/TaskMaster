import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { styles } from './style';
import { CustomButtonProps } from './types';

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {

  const {primaryButton,outlineButton,dangerButton,iconButton,disabledButton,primaryText,outlineText,dangerText,iconText,button} = styles

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return primaryButton;
      case 'outline':
        return outlineButton;
      case 'danger':
        return dangerButton;
      case 'icon':
        return iconButton;
      default:
        return primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return primaryText;
      case 'outline':
        return outlineText;
      case 'danger':
        return dangerText;
      case 'icon':
        return iconText;
      default:
        return primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        button,
        getButtonStyle(),
        disabled && disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? COLORS.background : COLORS.accent} />
      ) : (
        <>
          {icon}
          {title && (
             <Text style={[getTextStyle(), textStyle, icon ? { marginLeft: SPACING.sm } : null]}>
               {title}
             </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

