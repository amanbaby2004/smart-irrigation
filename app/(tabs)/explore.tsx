import React from 'react'; // Add this import
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useMQTTConnection } from '../../hooks/useMQTTConnection';

interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}

export default function MonitorScreen() {
  const [connected, setConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    rainfall: 0,
  });

  // Temporary mock data until MQTT is set up
  useEffect(() => {
    const timer = setInterval(() => {
      setSensorData({
        soilMoisture: Math.random() * 100,
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 30,
        rainfall: Math.random() * 5,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ESP32 Sensor Data</Text>
      <Text style={styles.data}>Soil Moisture: {sensorData.soilMoisture.toFixed(1)}%</Text>
      <Text style={styles.data}>Temperature: {sensorData.temperature.toFixed(1)}°C</Text>
      <Text style={styles.data}>Humidity: {sensorData.humidity.toFixed(1)}%</Text>
      <Text style={styles.data}>Rainfall: {sensorData.rainfall.toFixed(1)}mm</Text>
      <Text style={[styles.connectionStatus, connected ? styles.connected : styles.disconnected]}>
        {connected ? 'Connected to MQTT Broker' : 'Disconnected'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  data: {
    fontSize: 18,
    marginVertical: 5,
  },
  connectionStatus: {
    fontSize: 16,
    marginTop: 20,
  },
  connected: {
    color: '#4CAF50',
  },
  disconnected: {
    color: '#f44336',
  },
});