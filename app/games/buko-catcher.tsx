import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  PanResponder,
  Animated,
} from 'react-native';

interface Buko {
  x: number;
  y: number;
  radius: number;
  speed: number;
  id: number;
}

export default function BukoCatcher() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const cartWidth = 120;
  const cartHeight = 80;
  const cartY = screenHeight - 80;

  const [bukos, setBukos] = useState<Buko[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const bukoId = useRef(0);
  const cartX = useRef(new Animated.Value(screenWidth / 2 - cartWidth / 2)).current;
  const cartXValue = useRef(screenWidth / 2 - cartWidth / 2);

  useEffect(() => {
    const sub = cartX.addListener(({ value }) => {
      cartXValue.current = value;
    });
    return () => cartX.removeListener(sub);
  }, [cartX]);

  // Spawn bukos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        setBukos(prev => [
          ...prev,
          {
            id: bukoId.current++,
            x: Math.random() * (screenWidth - 120) + 60,
            y: -30,
            radius: 15,
            speed: 1 + Math.random() * 2,
          },
        ]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    const loop = setInterval(() => {
      if (gameOver) return;

      setBukos(prev =>
        prev
          .map(buko => ({ ...buko, y: buko.y + buko.speed }))
          .filter(buko => {
            const bukoLeft = buko.x;
            const bukoRight = buko.x + buko.radius * 2;
            const bukoTop = buko.y;
            const bukoBottom = buko.y + buko.radius * 2;

            const cartLeft = cartXValue.current;
            const cartRight = cartLeft + cartWidth;
            const cartTop = cartY;
            const cartBottom = cartY + cartHeight;

            const isColliding =
              bukoLeft >= cartLeft &&
              bukoRight <= cartRight &&
              bukoTop <= cartBottom &&
              bukoBottom >= (cartTop - 140)

            if (isColliding) {
              setScore(s => s + 1);
              return false;
            }

            if (buko.y - buko.radius > screenHeight) {
              setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) setGameOver(true);
                return newLives;
              });
              return false;
            }

            return true;
          })
      );
    }, 16);

    return () => clearInterval(loop);
  }, [gameOver]);

  // Pan responder (imperative movement)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newX = gesture.moveX - cartWidth / 2;
        newX = Math.max(0, Math.min(screenWidth - cartWidth, newX));
        cartX.setValue(newX); 
        cartXValue.current = newX;
      },
    })
  ).current;

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setBukos([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hud}>🥥 Score: {score} | ❤️ {lives}</Text>

      {/* Falling Bukos */}
      {bukos.map(buko => (
        <View
          key={buko.id}
          style={{
            position: 'absolute',
            top: buko.y,
            left: buko.x,
            width: buko.radius * 2,
            height: buko.radius * 2,
            borderRadius: buko.radius,
            backgroundColor: 'green',
          }}
        />
      ))}

      {/* Cart */}
      <View
        {...panResponder.panHandlers}
        style={{ position: 'absolute', bottom: 0, height: 200, width: '100%' }}
      >
        <Animated.Image
          source={require('../../assets/images/derek_ethan_vincent.jpg')}
          style={{
            position: 'absolute',
            bottom: 80,
            transform: [{ translateX: cartX }],
            width: cartWidth,
            height: cartHeight,
            resizeMode: 'contain',
          }}
        />
      </View>

      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>GAME OVER 🥥</Text>
          <Text style={styles.finalScore}>Score: {score}</Text>
          <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
            <Text style={styles.restartText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87ceeb',
    alignItems: 'center',
  },
  hud: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0,
    right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  finalScore: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 10,
  },
  restartButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  restartText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
