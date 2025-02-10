import React from 'react'; // Add this line
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
};

export function TabBarIcon({ name, color }: Props) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
}