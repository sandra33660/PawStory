import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';
 
const tabs = [
  { key: 'home', icon: '🏠', label: 'Accueil' },
  { key: 'animal', icon: '🐾', label: 'Animaux' },
  { key: 'journal', icon: '📖', label: 'Journal' },
  { key: 'health', icon: '💊', label: 'Santé' },
];
 
export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <View style={{ backgroundColor: colors.card, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, paddingBottom: 24, borderTopWidth: 1, borderTopColor: colors.border }}>
      {tabs.map(t => (
        <TouchableOpacity key={t.key} style={globalStyles.navItem} onPress={() => onTabChange(t.key)}>
          <Text style={{ fontSize: 24 }}>{t.icon}</Text>
          <Text style={[globalStyles.navLabel, { color: activeTab === t.key ? colors.primary : '#B0A090', fontWeight: activeTab === t.key ? '600' : '400' }]}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
 