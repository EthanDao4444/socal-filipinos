import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Audio } from "expo-av";

export default function CheckFighter() {
  const [gameState, setGameState] = useState<
    "start" | "waiting" | "ready" | "tooSoon" | "result" | "fail" | "gameOver"
  >("start");

  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [delay, setDelay] = useState(350);
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(3);
  const [roundsWon, setRoundsWon] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  // Audio references
  const preRoundSound = useRef<Audio.Sound | null>(null);
  const loopSound = useRef<Audio.Sound | null>(null);
  const clapSound = useRef<Audio.Sound | null>(null);

  const MAX_ROUNDS = 5;
  const MAX_LIVES = 3;

  // Load sounds once
  useEffect(() => {
    (async () => {
      const pre = new Audio.Sound();
      const loop = new Audio.Sound();
      const clap = new Audio.Sound();
      await pre.loadAsync(require("../../assets/sounds/check-fighter/check-fighter_intro.wav"));
      await loop.loadAsync(require("../../assets/sounds/check-fighter/check-fighter_wind.mp3"));
      await clap.loadAsync(require("../../assets/sounds/check-fighter/check-fighter_clap.mp3"));
      preRoundSound.current = pre;
      loopSound.current = loop;
      clapSound.current = clap;

    })();

    return () => {
      if (preRoundSound.current) preRoundSound.current.unloadAsync();
      if (loopSound.current) loopSound.current.unloadAsync();
      if (clapSound.current) clapSound.current.unloadAsync();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const playPreRoundSound = async () => {
    try {
      if (preRoundSound.current) {
        await preRoundSound.current.replayAsync();
      }
    } catch (err) {
      console.warn("Pre-round sound error:", err);
    }
  };

  const playClapSound = async () => {
    try {
      if (clapSound.current) {
        await clapSound.current.replayAsync();
      }
    } catch(err) {
      console.warn("Clap sound error:", err);
    }
  }

  const startLoopSound = async () => {
    try {
      if (loopSound.current) {
        await loopSound.current.setIsLoopingAsync(true);
        await loopSound.current.playAsync();
      }
    } catch (err) {
      console.warn("Loop sound error:", err);
    }
  };

  const stopLoopSound = async () => {
    try {
      if (loopSound.current) {
        await loopSound.current.stopAsync();
      }
    } catch (err) {
      console.warn("Stop loop error:", err);
    }
  };

  const startRound = async () => {
    setGameState("waiting");
    setReactionTime(null);

    await playPreRoundSound();

    const randomWait = Math.random() * 2000 + 3000; // 3-5s
    await startLoopSound();

    timeoutRef.current = setTimeout(async () => {
      await stopLoopSound();
      await playClapSound();
      setGameState("ready");
      setStartTime(Date.now());
    }, randomWait);
  };

  const handlePress = async () => {
    if (gameState === "start") {
      resetGame();
      startRound();
      return;
    }

    if (gameState === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      await stopLoopSound();
      loseLife("tooSoon");
      return;
    }

    if (gameState === "ready") {
      const time = Date.now() - (startTime ?? 0);
      setReactionTime(time);

      if (time <= delay) {
        setRoundsWon((r) => r + 1);
        setReactionTimes((times) => [...times, time]);
        setGameState("result");

        setTimeout(() => nextRound(), 1500);
      } else {
        loseLife("fail", time);
      }
      return;
    }

    if (["tooSoon", "fail"].includes(gameState)) {
      startRound();
    }

    if (gameState === "gameOver") resetGame();
  };

  const loseLife = (state: "tooSoon" | "fail", time?: number) => {
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
      } else {
        setGameState(state);
        setReactionTime(time ?? null);
      }
      return newLives;
    });
  };

  const nextRound = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (round >= MAX_ROUNDS) {
      endGame();
      return;
    }
    setRound((r) => r + 1);
    setDelay((prev) => Math.max(150, prev - 25));
    startRound();
  };

  const resetGame = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRound(1);
    setLives(MAX_LIVES);
    setRoundsWon(0);
    setDelay(400);
    setReactionTime(null);
    setReactionTimes([]);
    setGameState("waiting");
    startRound();
  };

  const endGame = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGameState("gameOver");
  };

  const averageTime =
    reactionTimes.length > 0
      ? Math.round(
          reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
        )
      : null;

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View className="flex-1 bg-black items-center justify-center px-4">
        <Text className="text-white text-3xl font-bold mb-10">
          Reaction Game
        </Text>

        {gameState === "start" && (
          <View className="items-center">
            <Text className="text-white text-lg mb-5">
              Press anywhere to begin 5 rounds!
            </Text>
            <TouchableOpacity
              className="bg-purple-700 px-10 py-4 rounded-2xl"
              onPress={handlePress}
            >
              <Text className="text-white text-xl font-bold">START</Text>
            </TouchableOpacity>
          </View>
        )}

        {gameState !== "start" && gameState !== "gameOver" && (
          <View className="items-center">
            <Text className="text-gray-300 mb-2">
              Round {round}/{MAX_ROUNDS} | Lives: {lives}
            </Text>
            <Text className="text-gray-400 mb-6">
              Reaction limit: {delay} ms
            </Text>

            {gameState === "waiting" && (
              <Text className="text-white text-lg mb-4">Wait for green...</Text>
            )}
            {gameState === "ready" && (
              <Text className="text-green-400 text-2xl font-bold mb-4">
                TAP NOW!
              </Text>
            )}
            {gameState === "tooSoon" && (
              <Text className="text-red-500 text-lg mb-4">
                Too soon! Lost a life.
              </Text>
            )}
            {gameState === "fail" && (
              <Text className="text-red-500 text-lg mb-4">
                Too slow! Lost a life.
              </Text>
            )}
            {gameState === "result" && (
              <Text className="text-green-300 text-lg mb-4">
                ✅ Cleared Round {round}! ({reactionTime} ms)
              </Text>
            )}
          </View>
        )}

        {gameState === "gameOver" && (
          <View className="items-center">
            <Text className="text-white text-2xl font-bold mb-4">
              Game Over
            </Text>
            <Text className="text-gray-300 mb-2">
              Rounds Cleared: {roundsWon}/{MAX_ROUNDS}
            </Text>
            <Text className="text-gray-300 mb-6">
              Average Reaction: {averageTime ? `${averageTime} ms` : "—"}
            </Text>
            <TouchableOpacity
              className="bg-purple-700 px-10 py-4 rounded-2xl"
              onPress={resetGame}
            >
              <Text className="text-white text-xl font-bold">Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
