import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';
 
export default function Welcome({ onChoice, onBack }) {
  return (
    <View style={[globalStyles.center, { backgroundColor: colors.background }]}>
      <Text style={globalStyles.bigEmoji}>🐾</Text>
      <Text style={globalStyles.title}>Bienvenue sur PawStory</Text>
      <Text style={globalStyles.subtitle}>Connecte-toi ou crée ton compte pour accéder à l'app</Text>
 
      <TouchableOpacity style={[globalStyles.btn, { backgroundColor: colors.primary }]} onPress={() => onChoice('signup')}>
        <Text style={globalStyles.btnText}>Créer mon compte</Text>
      </TouchableOpacity>
 
      <TouchableOpacity style={[globalStyles.btnOutline, { borderColor: colors.primary }]} onPress={() => onChoice('login')}>
        <Text style={[globalStyles.btnOutlineText, { color: colors.primary }]}>J'ai déjà un compte</Text>
      </TouchableOpacity>
 
      <TouchableOpacity onPress={onBack} style={{ marginTop: 24 }}>
        <Text style={{ color: colors.textLight, fontSize: 14 }}>← Voir l'onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}
 