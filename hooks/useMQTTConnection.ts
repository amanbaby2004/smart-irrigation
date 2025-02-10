import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const MQTT_BROKER = 'mqtt://broker.hivemq.com:1883';
const MQTT_TOPIC_SOIL = 'smart_irrigation/soil_data';

interface SensorData {
  soil_moisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}

export function useMQTTConnection() {
  const [connected, setConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    soil_moisture: 0,
    temperature: 0,
    humidity: 0,
    rainfall: 0,
  });

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER);

    client.on('connect', () => {
      console.log('Connected to MQTT Broker');
      setConnected(true);
      client.subscribe(MQTT_TOPIC_SOIL, { qos: 0 });
    });

    client.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC_SOIL) {
        const data: SensorData = JSON.parse(message.toString());
        setSensorData({
          soil_moisture: data.soil_moisture,
          temperature: data.temperature,
          humidity: data.humidity,
          rainfall: data.rainfall,
        });
      }
    });

    client.on('error', (err) => {
      console.error('MQTT Error:', err);
      setConnected(false);
    });

    return () => {
      client.end();
    };
  }, []);

  return { connected, sensorData };
}
