import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from './style';
import { TabSelectorProps } from './types';

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {

  const { container, tab, styleActiveTab, styleTabText, activeTabText } = styles

  return (
    <View style={container}>
      <TouchableOpacity
        style={[tab, activeTab === 'in_progress' && styleActiveTab]}
        onPress={() => onTabChange('in_progress')}
        activeOpacity={0.8}
      >
        <Text style={[styleTabText, activeTab === 'in_progress' && activeTabText]}>
          En Progreso
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[tab, activeTab === 'completed' && styleActiveTab]}
        onPress={() => onTabChange('completed')}
        activeOpacity={0.8}
      >
        <Text style={[styleTabText, activeTab === 'completed' && activeTabText]}>
          Completadas
        </Text>
      </TouchableOpacity>
    </View>
  );
};


