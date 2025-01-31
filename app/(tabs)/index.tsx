import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Router } from 'react-native-simple-router';
import mqtt from 'mqtt';

// MQTT Configuration
const MQTT_BROKER = 'mqtt://broker.hivemq.com:1883';
const MQTT_TOPIC_SOIL = 'smart_irrigation/soil_data';
const MQTT_TOPIC_IRRIGATION = 'smart_irrigation/control';

// Define the structure of the sensor data
interface SensorData {
  soil_moisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}

// Home Screen Component
const HomeScreen = ({ navigator }: { navigator: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ESP32 Smart Irrigation Monitor</Text>
      <Button
        title="Monitor Parameters"
        onPress={() => navigator.push({ name: 'Monitor' })}
      />
    </View>
  );
};

// Monitor Screen Component
const MonitorScreen = () => {
  const [soilMoisture, setSoilMoisture] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [rainfall, setRainfall] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    // Connect to MQTT broker
    const client: mqtt.Client = mqtt.connect(MQTT_BROKER);

    client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      setConnected(true);
      client.subscribe(MQTT_TOPIC_SOIL, { qos: 0 }, (err: Error | null) => {
        if (!err) {
          console.log('Subscribed to soil data topic');
        } else {
          console.error('Subscription error:', err);
        }
      });
    });

    client.on('message', (topic: string, message: Buffer) => {
      if (topic === MQTT_TOPIC_SOIL) {
        const data: SensorData = JSON.parse(message.toString());
        setSoilMoisture(data.soil_moisture);
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setRainfall(data.rainfall);
      }
    });

    client.on('error', (err: Error) => {
      console.error('MQTT Error:', err);
      setConnected(false);
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ESP32 Sensor Data</Text>
      <Text style={styles.data}>Soil Moisture: {soilMoisture}</Text>
      <Text style={styles.data}>Temperature: {temperature}°C</Text>
      <Text style={styles.data}>Humidity: {humidity}%</Text>
      <Text style={styles.data}>Rainfall: {rainfall}mm</Text>
      <Text style={styles.connectionStatus}>
        {connected ? 'Connected to MQTT Broker' : 'Disconnected'}
      </Text>
    </View>
  );
};

// App Component with React Native Simple Router
const App = () => (
  <Router
    firstRoute={{
      name: 'Home',
      component: HomeScreen,
    }}
    routeStack={{
      Home: {
        name: 'Home',
        component: HomeScreen,
      },
      Monitor: {
        name: 'Monitor',
        component: MonitorScreen,
      },
    }}
  />
);

// Styles
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
    color: 'gray',
  },
});

export default App;