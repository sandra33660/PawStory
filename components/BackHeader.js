import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/global';
 
export default function BackHeader({ title, subtitle, color, onBack, backLabel = '← Retour' }) {
  return (
    <View style={[globalStyles.header, { backgroundColor: color }]}>
      <TouchableOpacity onPress={onBack} style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8, paddingHorizontal: 14, marginBottom: 12 }}>
        <Text style={{ color: 'white', fontSize: 14 }}>{backLabel}</Text>
      </TouchableOpacity>
      <Text style={{ color: 'white', fontSize: 22, fontWeight: '300' }}>{title}</Text>
      {subtitle && <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>{subtitle}</Text>}
    </View>
  );
}
 