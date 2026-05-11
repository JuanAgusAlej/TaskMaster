import React from 'react';
import { Modal, View, Text } from 'react-native';
import { CustomButton } from '../CustomButton/CustomButton';
import { styles } from './style';
import { ConfirmModalProps } from './types';

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Sí',
  cancelText = 'No'
}) => {

  const {button,buttonContainer,styleMessage,modalContainer,overlay,styleTitle} = styles

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={overlay}>
        <View style={modalContainer}>
          {title && <Text style={styleTitle}>{title}</Text>}
          <Text style={styleMessage}>{message}</Text>
          <View style={buttonContainer}>
            <CustomButton
              title={confirmText}
              onPress={onConfirm}
              variant="outline"
              style={button}
            />
            <CustomButton
              title={cancelText}
              onPress={onCancel}
              variant="outline"
              style={button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

