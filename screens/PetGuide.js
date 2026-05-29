import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';
import { guideData } from '../utils/guideData';

export default function PetGuide({ onBack }) {
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);

  const species = Object.keys(guideData);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[globalStyles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={selectedAge ? () => setSelectedAge(null) : selectedSpecies ? () => setSelectedSpecies(null) : onBack}
          style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8, paddingHorizontal: 14, marginBottom: 12 }}>
          <Text style={{ color: 'white', fontSize: 14 }}>← Retour</Text>
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '300' }}>
          {selectedAge ? selectedAge.age : selectedSpecies ? selectedSpecies : '📚 Guide par espèce'}
        </Text>
        {selectedSpecies && !selectedAge && (
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 }}>Choisissez une tranche d\'âge</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Choix espèce */}
        {!selectedSpecies && (
          <>
            <Text style={[globalStyles.sectionTitle, { marginBottom: 16 }]}>CHOISISSEZ UNE ESPÈCE</Text>
            {species.map(s => (
              <TouchableOpacity key={s} onPress={() => setSelectedSpecies(s)}
                style={[globalStyles.card, { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
                <Text style={{ fontSize: 40 }}>{guideData[s].emoji}</Text>
                <Text style={{ fontSize: 20, color: colors.textDark, fontWeight: '300' }}>{s.split(' ')[1]}</Text>
                <Text style={{ marginLeft: 'auto', color: colors.textLight }}>→</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Choix tranche d'âge */}
        {selectedSpecies && !selectedAge && (
          <>
            <Text style={[globalStyles.sectionTitle, { marginBottom: 16 }]}>TRANCHE D'ÂGE</Text>
            {guideData[selectedSpecies].tranches.map((t, i) => (
              <TouchableOpacity key={i} onPress={() => setSelectedAge(t)}
                style={[globalStyles.card, { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
                <Text style={{ fontSize: 32 }}>{t.emoji}</Text>
                <Text style={{ fontSize: 16, color: colors.textDark }}>{t.age}</Text>
                <Text style={{ marginLeft: 'auto', color: colors.textLight }}>→</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Contenu guide */}
        {selectedAge && (
          <>
            {Object.entries(selectedAge.sections).map(([title, text]) => (
              <View key={title} style={[globalStyles.card, { padding: 16, marginBottom: 12 }]}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primary, marginBottom: 8 }}>{title}</Text>
                <Text style={{ fontSize: 13, color: colors.textMedium, lineHeight: 22 }}>{text}</Text>
              </View>
            ))}
            <View style={{ backgroundColor: colors.primaryLight, borderRadius: 16, padding: 16, marginTop: 8 }}>
              <Text style={{ fontSize: 12, color: colors.textMedium, textAlign: 'center', lineHeight: 18 }}>
                ⚠️ Ces informations sont données à titre indicatif. Consultez toujours votre vétérinaire pour un suivi personnalisé.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
