// CheckFighter.tsx
import React from "react";
import { Text, View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { useGameState } from "@/hooks/check-fighter/useGameState";
import { useGameAudio } from "@/hooks/check-fighter/useGameAudio";
import FighterHands from "@/components/check-fighter/FighterHands";
// --- UI Components ---

const StartScreen = ({ onStart }) => (
  <View className="items-center">
    <Text className="text-white text-3xl font-bold mb-5">Reaction Game</Text>
    <Text className="text-white text-lg mb-8 text-center">
      Grab the check before your relatives do!
    </Text>
    <Text className="text-white text-lg mb-8 text-center">
      Tap when you hear the clap and see the check in the middle.
    </Text>
    <TouchableOpacity
      className="bg-purple-700 px-10 py-4 rounded-2xl"
      onPress={onStart}
    >
      <Text className="text-white text-xl font-bold">START</Text>
    </TouchableOpacity>
  </View>
);

const GameOverScreen = ({ roundsWon, averageTime, onPlayAgain, maxRounds }) => (
  <View className="items-center absolute">
    <Text className="text-white text-2xl font-bold mb-4 bg-black">Game Over</Text>
    <Text className="text-gray-300 mb-2">
      Rounds Cleared: {roundsWon}/{maxRounds}
    </Text>
    <Text className="text-gray-300 mb-6">
      Average Reaction: {averageTime ? `${averageTime} ms` : "—"}
    </Text>
    <TouchableOpacity
      className="bg-purple-700 px-10 py-4 rounded-2xl"
      onPress={onPlayAgain}
    >
      <Text className="text-white text-xl font-bold">Play Again</Text>
    </TouchableOpacity>
  </View>
);

const GameScreen = ({ round, maxRounds, lives, delay, gameState, reactionTime }) => {
  const getStatusMessage = () => {
    switch (gameState) {
      case "waiting":
        return <Text className="text-white text-lg">Wait for the clap...</Text>;
      case "ready":
        return <Text className="text-green-400 text-2xl font-bold">TAP NOW!</Text>;
      case "tooSoon":
        return <Text className="text-red-500 text-lg">Too soon! Tap to continue.</Text>;
      case "fail":
        return <Text className="text-red-500 text-lg">Too slow! Tap to continue.</Text>;
      case "result":
        return <Text className="text-green-300 text-lg">✅ Nice! ({reactionTime} ms)</Text>;
      default:
        return null;
    }
  };

  return (
    <View className="items-center bg-black rounded-2xl p-4">
      <Text className="text-gray-300 mb-2 font-actor">
        Round {round}/{maxRounds} | Lives: {lives}
      </Text>
      <View className="h-10 justify-center items-center font-interBold">{getStatusMessage()}</View>
    </View>
  );
};

// --- Main Component ---

export default function CheckFighter() {
  const audioControls = useGameAudio();
  const {
    gameState,
    reactionTime,
    round,
    lives,
    delay,
    roundsWon,
    averageTime,
    MAX_ROUNDS,
    handlePress,
    resetGame,
    winner
  } = useGameState(audioControls);

  // Determine which UI to show based on the game state
  const renderContent = () => {
    if (gameState === "start") {
      return <StartScreen onStart={resetGame} />;
    }
    if (gameState === "gameOver") {
      return (
        <GameOverScreen
          roundsWon={roundsWon}
          averageTime={averageTime}
          onPlayAgain={resetGame}
          maxRounds={MAX_ROUNDS}
        />
      );
    }
    // All other states are part of the active game screen
    return (
      <View className="absolute">
        <GameScreen
          round={round}
          maxRounds={MAX_ROUNDS}
          lives={lives}
          delay={delay}
          gameState={gameState}
          reactionTime={reactionTime}
        />
      </View>
    );
  };
  
  // The main Touchable should only handle presses during an active game
  const activeGamePress = ["waiting", "ready", "tooSoon", "fail"].includes(gameState)
    ? handlePress
    : () => {};

  return (
    <TouchableWithoutFeedback onPress={activeGamePress}>
      <View className="flex-1 bg-black items-center justify-center px-4">
        <FighterHands gameState={gameState} winner={winner} reactionTime={reactionTime}/>
        {renderContent()}
      </View>
    </TouchableWithoutFeedback>
  );
}