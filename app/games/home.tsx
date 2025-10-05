import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

// The Supabase and user state logic has been removed to resolve a build error.
// It was not being used and can be added back when you implement a leaderboard feature.

export default function BattleJeepney() {
  return (
    <>
      <View className="flex-1 items-center justify-center bg-gray-100 p-8">
        <View className="items-center mb-12">
          <Text className="font-adlam text-5xl text-gray-800">LARO TAYO!</Text>
          <Text className="text-lg text-gray-500 mt-2">Choose a game to play</Text>
        </View>

        {/* check fighters */}
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
          <Link href="/games/word_guesser" asChild>
            <Pressable className="bg-blue-500 rounded-lg shadow-md p-4 mb-6 flex-row items-center justify-between active:bg-blue-600">
              <View>
                  <Text className="text-white font-bold text-xl">Word guesser</Text>
                  <Text className="text-white text-sm">Learn Tagalog vocabulog!</Text>
              </View>
              <FontAwesome5 name="bolt" size={24} color="white" />
            </Pressable>
          </Link>
          <Link href="/games/cooking-lola" asChild>
            <Pressable className="bg-orange-600 rounded-lg shadow-md p-4 mb-6 flex-row items-center justify-between active:bg-purple-600">
              <View>
                  <Text className="text-white font-bold text-xl">Cooking Lola</Text>
                  <Text className="text-white text-sm">Prove you're a Lumpia Legend.</Text>
              </View>
              <FontAwesome5 name="brain" size={24} color="white" />
            </Pressable>
          </Link>
          {/* Link to a second game
          <Link href="/games/memory-game" asChild>
            <Pressable className="bg-purple-500 rounded-lg shadow-md p-4 mb-6 flex-row items-center justify-between active:bg-purple-600">

          <Link href="/games/cooking-lola" asChild>
            <Pressable className="bg-orange-600 rounded-lg shadow-md p-4 mb-6 flex-row items-center justify-between active:bg-purple-600">
              <View>
                  <Text className="text-white font-bold text-xl">Cooking Lola</Text>
                  <Text className="text-white text-sm">Prove you're a Lumpia Legend.</Text>
              </View>
              <FontAwesome5 name="brain" size={24} color="white" />
            </Pressable>
          </Link>
          
          {/* Buko catcher */ }
          <Link href="/games/buko-catcher" asChild>
            <Pressable className="bg-green-600 rounded-lg shadow-md p-4 mb-6 flex-row items-center justify-between active:bg-purple-600">
              <View>
                  <Text className="text-white font-bold text-xl">Buko Catcher</Text>
                  <Text className="text-white text-sm">Catch all of the coconuts!</Text>
              </View>
              <FontAwesome5 name="brain" size={24} color="white" />
            </Pressable>
          </Link>

          {/* link to 3rd game}
          <Pressable className="bg-gray-400 rounded-lg p-4 flex-row items-center justify-between opacity-60">
            <View>
                  <Text className="text-white font-bold text-xl">Puzzle Mania</Text>
                  <Text className="text-white text-sm">Coming soon...</Text>
              </View>
              <FontAwesome5 name="puzzle-piece" size={24} color="white" />
          </Pressable> */}
        </View>
      </View>
    </>
  );
}

