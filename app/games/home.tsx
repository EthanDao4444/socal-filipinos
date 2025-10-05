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
      <View className="absolute inset-0 bg-black/40" />

      <View className="flex-1 items-center justify-center p-8">
        <View className="w-full max-w-sm">
          <Link href="/games/check-fighter" asChild>
            <Pressable className="bg-blue-500 rounded-lg shadow-md p-4 mb-6 flex-row items-center justify-between active:bg-blue-600">
              <View>
                <Text className="text-white font-bold text-xl">Reaction Challenge</Text>
                <Text className="text-white text-sm">Test your reflexes!</Text>
              </View>
              <FontAwesome5 name="bolt" size={24} color="white" />
            </Pressable>
          </Link>

          {/* Word Guesser */}
          <Link href="/games/word_guesser" asChild>
            <Pressable className="bg-blue-500 rounded-lg shadow-md p-4 mb-6 flex-row items-center justify-between active:bg-blue-600">
              <View>
                <Text className="text-white font-bold text-xl">Word Guesser</Text>
                <Text className="text-white text-sm">Learn Tagalog vocab!</Text>
              </View>
              <FontAwesome5 name="book" size={24} color="white" />
            </Pressable>
          </Link>

          {/* Buko Catcher */}
          <Link href="/games/buko-catcher" asChild>
            <Pressable className="bg-green-600 rounded-lg shadow-md p-4 mb-6 flex-row items-center justify-between active:bg-purple-600">
              <View>
                <Text className="text-white font-bold text-xl">Buko Catcher</Text>
                <Text className="text-white text-sm">Catch all of the coconuts!</Text>
              </View>
              <FontAwesome5 name="brain" size={24} color="white" />
            </Pressable>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}
