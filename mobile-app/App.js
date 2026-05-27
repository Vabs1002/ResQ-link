import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, StatusBar, Animated, Alert } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { initDB, insertIncident } from './src/database';

export default function App() {
  const [isPressing, setIsPressing] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [pulseValue] = useState(new Animated.Value(1));

  useEffect(() => {
    // Initialize offline secure local storage
    initDB();
  }, []);

  // Pulse animation for the SOS button when idle
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [pulseValue]);

  const handlePressIn = () => {
    setIsPressing(true);
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressing(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const triggerSOS = async (type, desc) => {
    try {
      Alert.alert(`Transmitting ${type.toUpperCase()}`, `Requesting ${type} dispatch...`);
      await fetch('http://10.83.103.40:3000/api/trigger-sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emergencyType: type, description: desc })
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Network Error", "Could not reach State Engine.");
    }
  };

  const handleLongPress = async () => {
    const resultId = await insertIncident("device_x900", "Tier 2 - Critical");
    await triggerSOS("general", "General SOS Signal");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Header Container */}
      <View style={styles.header}>
        <MaterialIcons name="security" size={28} color="#ff3333" />
        <Text style={styles.headerText}>ResqLink</Text>
      </View>

      {/* Main SOS Button Container */}
      <View style={styles.centerContainer}>
        <Animated.View style={[
          styles.sosOuterCircle, 
          { transform: [{ scale: isPressing ? scaleValue : pulseValue }] }
        ]}>
          <Pressable 
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onLongPress={handleLongPress}
            delayLongPress={3000}
            style={({ pressed }) => [
              styles.sosInnerCircle,
              pressed ? styles.sosInnerCirclePressed : null
            ]}
          >
            <Text style={styles.sosText}>SOS</Text>
          </Pressable>
        </Animated.View>
        <Text style={styles.instructionText}>
          {isPressing ? "HOLDING 3 SECONDS..." : "PRESS AND HOLD TO ACTIVATE SOS"}
        </Text>
      </View>

      {/* Detailed Reporting Methods */}
      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionButton} onPress={() => Alert.alert("Camera", "Opening camera for scene classification...")}>
          <View style={styles.iconCircle}>
            <Ionicons name="camera" size={32} color="#ffffff" />
          </View>
          <Text style={styles.actionText}>Take Photo</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => Alert.alert("Audio", "Recording AI4Bharat voice input...")}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="mic" size={32} color="#ffffff" />
          </View>
          <Text style={styles.actionText}>Record Voice</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => Alert.alert("Text", "Opening text chat...")}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="keyboard" size={30} color="#ffffff" />
          </View>
          <Text style={styles.actionText}>Type Text</Text>
        </Pressable>
      </View>

      {/* Action Buttons Container (Emoji Grid) */}
      <View style={styles.emojiGrid}>
        <Pressable style={styles.emojiBtn} onPress={() => triggerSOS('fire', 'blaze structure breach')}>
          <Text style={styles.emojiText}>🔥</Text>
          <Text style={styles.actionText}>Fire</Text>
        </Pressable>
        <Pressable style={styles.emojiBtn} onPress={() => triggerSOS('medical', 'injury vitals alert')}>
          <Text style={styles.emojiText}>🚑</Text>
          <Text style={styles.actionText}>Medical</Text>
        </Pressable>
        <Pressable style={styles.emojiBtn} onPress={() => triggerSOS('police', 'crime alert')}>
          <Text style={styles.emojiText}>🚓</Text>
          <Text style={styles.actionText}>Police</Text>
        </Pressable>
        <Pressable style={styles.emojiBtn} onPress={() => triggerSOS('disaster', 'collapse mass casualty')}>
          <Text style={styles.emojiText}>🏢</Text>
          <Text style={styles.actionText}>Disaster</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Deep charcoal
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50, // Added padding for iOS notch
    padding: 10,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosOuterCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 51, 51, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 51, 51, 0.3)',
    shadowColor: '#ff3333',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  sosInnerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#ff3333', // Vibrant alert red
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  sosInnerCirclePressed: {
    backgroundColor: '#cc0000',
  },
  sosText: {
    color: '#ffffff',
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 4,
  },
  instructionText: {
    color: '#aaaaaa',
    marginTop: 40,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  emojiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  emojiBtn: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 80,
  },
  emojiText: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  }
});
