// components/check-fighter/FighterHands.tsx
import React from "react";
import { View, Image } from "react-native";

interface FighterHandsProps {
  gameState: string;
  winner: "player" | "enemy" | null;
}

export default function FighterHands({ gameState, winner }: FighterHandsProps) {
  const getHandImage = (side: "player" | "enemy") => {
    // Reset hands at start or new round
    if (gameState === "waiting" || gameState === "ready") {
      return require("../../assets/images/check-fighter/hand_short.png");
    }

    // Show grab success for winner
    if (winner === side) {
      return require("../../assets/images/check-fighter/hand_grab_success.png");
    }

    // Show long hand for the loser if fail
    if (gameState === "fail" && side !== winner) {
      return require("../../assets/images/check-fighter/hand_long.png");
    }

    // Default
    return require("../../assets/images/check-fighter/hand_short.png");
  };

  return (
    <View className="flex-1 w-full items-center justify-center">
      {/* Enemy hand (top) */}
      <Image
        source={getHandImage("enemy")}
        className="w-[50%] h-[50%] absolute top-0"
        style={{ transform: [{ scaleY: -1 }, { scaleX: -1 }] }}
        resizeMode="contain"
      />

      {/* Check image in the middle */}
      {["ready", "result", "fail"].includes(gameState) && (
        <Image
          source={require("../../assets/images/check-fighter/check.png")}
          className="w-[50%] h-[50%]"
          resizeMode="contain"
        />
      )}

      {/* Player hand (bottom) */}
      <Image
        source={getHandImage("player")}
        className="w-[50%] h-[50%] absolute bottom-0"
        resizeMode="contain"
      />
    </View>
  );
}
