// hooks/useGameAudio.ts
import { useRef, useEffect, useCallback } from "react";
import { Audio } from "expo-av";

export function useGameAudio() {
  const preRoundSound = useRef<Audio.Sound | null>(null);
  const loopSound = useRef<Audio.Sound | null>(null);
  const clapSound = useRef<Audio.Sound | null>(null);

  // Load and unload sounds
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const pre = new Audio.Sound();
        const loop = new Audio.Sound();
        const clap = new Audio.Sound();
        
        await pre.loadAsync(require("../../assets/sounds/check-fighter/check-fighter_intro.wav"));
        await loop.loadAsync(require("../../assets/sounds/check-fighter/check-fighter_wind.mp3"));
        await clap.loadAsync(require("../../assets/sounds/check-fighter/check-fighter_clap.mp3"));

        preRoundSound.current = pre;
        loopSound.current = loop;
        clapSound.current = clap;
      } catch (error) {
        console.warn("Failed to load sounds", error);
      }
    };

    loadSounds();

    // Cleanup function
    return () => {
      preRoundSound.current?.unloadAsync();
      loopSound.current?.unloadAsync();
      clapSound.current?.unloadAsync();
    };
  }, []);

  // Memoized audio control functions
  const playPreRoundSound = useCallback(async () => {
    try { await preRoundSound.current?.replayAsync(); } 
    catch (err) { console.warn("Pre-round sound error:", err); }
  }, []);

  const playClapSound = useCallback(async () => {
    try { await clapSound.current?.replayAsync(); } 
    catch (err) { console.warn("Clap sound error:", err); }
  }, []);

  const startLoopSound = useCallback(async () => {
    try {
      await loopSound.current?.setIsLoopingAsync(true);
      await loopSound.current?.playAsync();
    } catch (err) { console.warn("Loop sound error:", err); }
  }, []);

  const stopLoopSound = useCallback(async () => {
    try { await loopSound.current?.stopAsync(); } 
    catch (err) { console.warn("Stop loop error:", err); }
  }, []);

  return { playPreRoundSound, playClapSound, startLoopSound, stopLoopSound };
}