import { useEffect, useState } from 'react';
import { Button, Text, View, Image } from 'react-native';
import { Link, Stack } from 'expo-router';

import React from 'react';
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
const images = [
  require('../../assets/cooking-lola/lumpia-1.jpg'),
  require('../../assets/cooking-lola/lumpia-2.jpg'),
  require('../../assets/cooking-lola/lumpia-3.jpg'),
  require('../../assets/cooking-lola/lumpia-3b.png'),
  require('../../assets/cooking-lola/lumpia-4.jpg'),
  require('../../assets/cooking-lola/lumpia-5.jpg'),
  require('../../assets/cooking-lola/lumpia-6.jpg'),
];

export default function CookingLola() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
  };

  const tap = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      console.log('Tap!');
    });

  const swipeRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd((event) => {
      console.log('Right swipe!');
      if (currentImageIndex === 3) {
        goToNextImage();
      }
    })
    .runOnJS(true);

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd((event) => {
      console.log('Left swipe!');
      if (currentImageIndex === 2) {
        goToNextImage();
      }
    })
    .runOnJS(true);

  const swipeUp = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd((event) => {
      console.log('Up swipe!');
      if (currentImageIndex !== 2 && currentImageIndex !== 3) {
        goToNextImage();
      }
    })
    .runOnJS(true);

  return (
    <GestureHandlerRootView className="flex-1 items-center justify-center">
      <GestureDetector gesture={Gesture.Exclusive(swipeRight, swipeLeft, swipeUp, tap)}>
        <Animated.View className="h-[300px] w-[400px]">
          <Image
            source={images[currentImageIndex]}
            className="flex-1 object-cover h-[300px] w-[400px]"/>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}


/* export default function CookingLola() {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 50;
      const maxTranslateY = height / 2 - 50;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .runOnJS(true);

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[animatedStyles, styles.box]}></Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
} */

