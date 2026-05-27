import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from '../styles/global';
 
const slides = [
  { emoji: '🐾', title: 'Bienvenue sur PawStory', subtitle: "L'app qui accompagne toute la vie de votre compagnon", bg: '#F5EFE6', accent: '#C4956A' },
  { emoji: '📖', title: 'Un journal de vie unique', subtitle: 'Capturez chaque moment précieux', bg: '#EDF2EE', accent: '#7A9E7E' },
  { emoji: '💊', title: 'Santé sous contrôle', subtitle: 'Rappels vaccins et rendez-vous', bg: '#F5EFE6', accent: '#C4956A' },
  { emoji: '✨', title: 'Souvenirs du jour', subtitle: 'Revivez les plus beaux moments', bg: '#EDF2EE', accent: '#7A9E7E' },
];
 
export default function Onboarding({ onFinish, startAt = 0 }) {
  const [current, setCurrent] = useState(startAt);
  const slide = slides[current];
 
  const handleFinish = async (mode) => {
    await AsyncStorage.setItem('onboarding_seen', 'true');
    onFinish(mode);
  };
 
  const handleSkip = async () => {
    await AsyncStorage.setItem('onboarding_seen', 'true');
    onFinish(null);
  };
 
  return (
    <View style={[globalStyles.center, { backgroundColor: slide.bg }]}>
      {current < slides.length - 1 && (
        <TouchableOpacity
          onPress={handleSkip}
          style={{ position: 'absolute', top: 56, right: 24, backgroundColor: `${slide.accent}20`, borderRadius: 12, padding: 10, paddingHorizontal: 16 }}>
          <Text style={{ color: slide.accent, fontSize: 14, fontWeight: '600' }}>Passer →</Text>
        </TouchableOpacity>
      )}
 
      <Text style={globalStyles.bigEmoji}>{slide.emoji}</Text>
      <Text style={globalStyles.title}>{slide.title}</Text>
      <Text style={globalStyles.subtitle}>{slide.subtitle}</Text>
 
      <View style={globalStyles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[globalStyles.dot, { backgroundColor: slide.accent, width: i === current ? 24 : 8, opacity: i === current ? 1 : 0.3 }]} />
        ))}
      </View>
 
      {current < slides.length - 1 ? (
        <TouchableOpacity style={[globalStyles.btn, { backgroundColor: slide.accent }]} onPress={() => setCurrent(current + 1)}>
          <Text style={globalStyles.btnText}>Continuer</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={[globalStyles.btn, { backgroundColor: slide.accent }]} onPress={() => handleFinish('signup')}>
            <Text style={globalStyles.btnText}>Créer mon compte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.btnOutline, { borderColor: slide.accent }]} onPress={() => handleFinish('login')}>
            <Text style={[globalStyles.btnOutlineText, { color: slide.accent }]}>J'ai déjà un compte</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
 