import React from 'react';
import { Text, View, Pressable, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function BattleJeepney() {
  return (
    <ImageBackground
      source={require('../../assets/images/philippines_map.jpg')}
      resizeMode="cover"
      style={{ flex: 1 }}
    >

    <View className="flex-1">
      {/* Button 1 - top left */}
      <Link href="/games/check-fighter" asChild>
        <Pressable
          className="bg-blue-500 rounded-lg p-2 absolute"
          style={{ top: 290, left: 40, width: 120 }}
        >
          <Text className="text-white text-center text-sm font-bold">
            Check Fighter
          </Text>
        </Pressable>
      </Link>

      {/* Button 2 - center */}
      <Link href="/games/word_guesser" asChild>
        <Pressable
          className="bg-green-500 rounded-lg p-2 absolute"
          style={{ bottom: 170, right: 5, width: 100 }}
        >
          <Text className="text-white text-center text-sm font-bold">
            Word
          </Text>
        </Pressable>
      </Link>

      {/* Button 3 - bottom right */}
      <Link href="/games/buko-catcher" asChild>
        <Pressable
          className="bg-red-500 rounded-lg p-2 absolute"
          style={{ bottom: 220, right: 130, width: 140 }}
        >
          <Text className="text-white text-center text-sm font-bold">
            Buko Catcher
          </Text>
        </Pressable>
      </Link>
    </View>
    </ImageBackground>
  );
}
