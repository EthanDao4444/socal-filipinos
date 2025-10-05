import { useEffect, useState } from 'react';
import { Button, Text, View, Image } from 'react-native';
import { Link, Stack } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';
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
  require('../../assets/cooking-lola/lumpia-1-anno.jpg'),
  require('../../assets/cooking-lola/lumpia-2-anno.jpg'),
  require('../../assets/cooking-lola/lumpia-3-anno.jpg'),
  require('../../assets/cooking-lola/lumpia-3b-anno.png'),
  require('../../assets/cooking-lola/lumpia-4-anno.jpg'),
  require('../../assets/cooking-lola/lumpia-5-anno.jpg'),
  require('../../assets/cooking-lola/lumpia-6-anno.jpg'),
];

export default function CookingLola() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const goToNextImage = () => {
    if (currentImageIndex + 1 === images.length) {
      setScore(score + 1);
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(currentImageIndex + 1);
    }
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

  useEffect(() => {
    if (secondsLeft <= 0) return; // Stop the timer when it reaches zero

    const interval = setInterval(() => {
      setSecondsLeft(prevSeconds => prevSeconds - 1);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clean up the interval on unmount or re-render
  }, [secondsLeft]); // Re-run effect when secondsLeft changes

  return (
    <GestureHandlerRootView className="flex-col items-center justify-between">
      <View className="h-1/3 w-full bg-white p-3 justify-between items-center">
        <View className="flex-row w-1/3 justify-center border-black border-4 rounded-lg p-1 pt-2">
          <Ionicons name="time" size={34}/>
          <Text className="text-5xl px-1 font-bold">
            {secondsLeft}
          </Text>
        </View>
        <View className="flex-col justify-start items-center">
          <Text className="text-sm px-1">
            SCORE
          </Text>
          <Text className="text-5xl p-1 font-bold">
            {score}
          </Text>
        </View>
        <View className="flex-col justify-start items-center">
          <Text className="text-sm px-1">
            HIGH SCORE
          </Text>
          <Text className="text-5xl p-1 font-bold">
            {Math.max(67, score)}
          </Text>
        </View>
      </View>
      <View className="flex-1 bg-white p-5">
        <GestureDetector gesture={Gesture.Exclusive(swipeRight, swipeLeft, swipeUp, tap)}>
          <Animated.View className="h-[500px] w-[600px]">
            <Image
              source={images[currentImageIndex]}
              className="flex-1 object-cover h-[500px] w-[600px]"/>
          </Animated.View>
        </GestureDetector>
      </View>
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

