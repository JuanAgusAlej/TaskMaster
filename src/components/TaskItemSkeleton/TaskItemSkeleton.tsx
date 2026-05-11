import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { styles } from './style';

export const TaskItemSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [fadeAnim]);

  const { container, mainContent, checkboxSkeleton, textContainer, titleSkeleton, bodySkeleton } = styles;

  return (
    <Animated.View style={[container, { opacity: fadeAnim }]}>
      <View style={mainContent}>
        <View style={checkboxSkeleton} />
        <View style={textContainer}>
          <View style={titleSkeleton} />
          <View style={bodySkeleton} />
        </View>
      </View>
    </Animated.View>
  );
};
