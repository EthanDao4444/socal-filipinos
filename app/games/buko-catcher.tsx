import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, Image, PanResponder} from 'react-native';

interface Buko {
  x: number;
  y: number;
  radius: number;
  speed: number;
  id: number;
}

export default function BukoCatcher() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const [cartX, setCartX] = useState(screenWidth / 2 - 25);
  const [bukos, setBukos] = useState<Buko[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const bukoId = useRef(0);

  const cartWidth = 120;
  const cartHeight = 80;


  // Spawn bukos every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        setBukos(prev => [
          ...prev,
          {
            id: bukoId.current++,
            x: Math.random() * (screenWidth - 30),
            y: -30,
            radius: 15,
            speed: 2 + Math.random() * 2,
          },
        ]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Game loop
  useEffect(() => {
    const loop = setInterval(() => {
      if (gameOver) return;

      setBukos(prev =>
        prev
          .map(buko => ({ ...buko, y: buko.y + buko.speed }))
          .filter(buko => {
            // Catch check
            if (
                buko.y + buko.radius >= screenHeight - 80 && // cart y
                buko.y - buko.radius <= screenHeight - 80 + cartHeight &&
                buko.x >= cartX &&
                buko.x <= cartX + cartWidth
              ) {
                setScore(s => s + 1);
                return false;
            }
            // Miss check
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
    }, 16); // ~60fps

    return () => clearInterval(loop);
  }, [cartX, gameOver]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.moveX - cartWidth / 2;
        newX = Math.max(0, Math.min(screenWidth - cartWidth, newX));
        setCartX(newX);
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
      {/* Score */}
      <Text style={styles.hud}>🥥 Score: {score} | ❤️ {lives}</Text>

      {/* Bukos */}
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
        <Image
            source={require('../../assets/images/derek_ethan_vincent.jpg')}
            style={{
            position: 'absolute',
            bottom: 80,
            left: cartX,
            width: cartWidth,
            height: cartHeight,
            resizeMode: 'contain',
            }}
        />
      </View>
      {/* Game Over */}
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
    justifyContent: 'flex-start',
  },
  hud: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  controls: {
    position: 'absolute',
    bottom: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  btnText: {
    fontSize: 24,
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
