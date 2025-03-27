import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ImageBackground, StyleSheet, Switch } from 'react-native';
import SoundManager from '@/app/utils/SoundManager'; // Import the SoundManager
import { useSettings } from '../context/SettingsContext';

export default function PomodoroScreen() {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isTesting, setIsTesting] = useState(false); // Toggle for testing mode
  const { selectedSound, volume } = useSettings();


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (isRunning) return;

    setIsRunning(true);
    const intervalTimer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalTimer);
          setIsRunning(false);

          // Play the saved sound
          SoundManager.playSound(selectedSound, volume);

          // Show the alert and stop the sound when "OK" is pressed
          Alert.alert(
            'Pomodoro Complete!',
            'Your work session is over.',
            [
              {
                text: 'OK',
                onPress: () => {
                  SoundManager.stopSound(); // Stop the sound when "OK" is pressed
                },
              },
            ]
          );

          return isTesting ? 5 : 25 * 60; // Reset the timer based on mode
        }
        return prev - 1;
      });
    }, 1000);

    setTimer(intervalTimer);
  };

  const resetTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
    setIsRunning(false);
    setTimeRemaining(isTesting ? 5 : 25 * 60); // Reset based on mode
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  return (
    <ImageBackground
      source={require('@/assets/images/zen.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isRunning && styles.disabledButton]}
            onPress={startTimer}
            disabled={isRunning}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={resetTimer}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Toggle for testing mode */}
        <View style={styles.testingContainer}>
          <Text style={styles.testingText}>Testing Mode</Text>
          <Switch
            value={isTesting}
            onValueChange={(value) => {
              setIsTesting(value);
              setTimeRemaining(value ? 5 : 25 * 60); // Update timer immediately
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testingContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  testingText: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
});