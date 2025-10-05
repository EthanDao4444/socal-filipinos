// hooks/useGameState.ts
import { useState, useRef, useCallback } from "react";

// Define the type for the audio functions this hook expects
interface AudioControls {
  playPreRoundSound: () => Promise<void>;
  playClapSound: () => Promise<void>;
  startLoopSound: () => Promise<void>;
  stopLoopSound: () => Promise<void>;
}

const MAX_ROUNDS = 5;
const MAX_LIVES = 3;
const INITIAL_DELAY = 300;

export function useGameState(audioControls: AudioControls) {
  const [gameState, setGameState] = useState("start");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [delay, setDelay] = useState(INITIAL_DELAY);
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(MAX_LIVES);
  const [roundsWon, setRoundsWon] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const [winner, setWinner] = useState<"player" | "enemy" | null>(null);
  const { playPreRoundSound, playClapSound, startLoopSound, stopLoopSound } = audioControls;

  const clearCurrentTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const endGame = useCallback(() => {
    clearCurrentTimeout();
    stopLoopSound();
    setGameState("gameOver");
  }, [stopLoopSound]);

  const loseLife = useCallback((state: "tooSoon" | "fail", time?: number) => {
    setLives((prevLives) => {
      const newLives = prevLives - 1;
      if (newLives <= 0) {
        endGame();
      } else {
        setGameState(state);
        setReactionTime(time ?? null);
      }
      return newLives;
    });
  }, [endGame]);

  const startRound = useCallback(async () => {
    clearCurrentTimeout();
    setGameState("waiting");
    setReactionTime(null);
    await playPreRoundSound();
    await startLoopSound();
    
    const randomWait = Math.random() * 2000 + 3000; // 3-5s
    timeoutRef.current = setTimeout(async () => {
      await playClapSound();
      await stopLoopSound();
      setGameState("ready");
      setStartTime(Date.now());
    }, randomWait);
  }, [playPreRoundSound, startLoopSound, playClapSound, stopLoopSound]);

  const nextRound = useCallback(() => {
    clearCurrentTimeout();
    if (round >= MAX_ROUNDS) {
      endGame();
      return;
    }
    setRound((r) => r + 1);
    setDelay((prev) => Math.max(150, prev - 25)); // Decrease delay, with a floor of 150ms
    startRound();
  }, [round, endGame, startRound]);

const handlePress = useCallback(async () => {
  if (gameState !== "ready") {
    if (gameState === "waiting") {
      clearCurrentTimeout();
      await stopLoopSound();
      loseLife("tooSoon");
    } else if (["tooSoon", "fail"].includes(gameState)) {
      startRound();
    }
    return;
  }

  // User pressed during ready
  const time = Date.now() - (startTime ?? Date.now());
  setReactionTime(time);

  // Decide winner immediately
  const didPlayerWin = time <= delay;
  setWinner(didPlayerWin ? "player" : "enemy");

  if (didPlayerWin) {
    setRoundsWon((r) => r + 1);
    setReactionTimes((times) => [...times, time]);
    setGameState("result");
  } else {
    loseLife("fail", time);
  }

  setTimeout(nextRound, 1500);
}, [gameState, startTime, delay, loseLife, startRound, nextRound]);
  
  const resetGame = useCallback(() => {
    clearCurrentTimeout();
    setRound(1);
    setLives(MAX_LIVES);
    setRoundsWon(0);
    setDelay(INITIAL_DELAY + 50); // Reset delay, maybe with a small buffer
    setReactionTime(null);
    setReactionTimes([]);
    startRound();
  }, [startRound]);
  
  const averageTime =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : null;

  return {
    gameState, reactionTime, round, lives, delay, roundsWon, averageTime,
    MAX_ROUNDS,
    handlePress,
    resetGame,
    winner,
  };
}