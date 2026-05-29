import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';

export default function LegalNotice({ onBack }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[globalStyles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={onBack}
          style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8, paddingHorizontal: 14, marginBottom: 12 }}>
          <Text style={{ color: 'white', fontSize: 14 }}>← Retour</Text>
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '300' }}>Mentions légales</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {[
          ['Éditeur', 'PawStory\nSandra Brun\nEmail : sandrabrun1103@gmail.com'],
          ['Hébergement', 'Supabase Inc.\n970 Toa Payoh North, Singapour\nhttps://supabase.com'],
          ['Propriété intellectuelle', 'L\'application PawStory et son contenu sont la propriété exclusive de Sandra Brun. Toute reproduction est interdite sans autorisation.'],
          ['Responsabilité', 'Les informations fournies par l\'assistant santé sont données à titre indicatif et ne remplacent en aucun cas l\'avis d\'un vétérinaire professionnel.'],
          ['Droit applicable', 'Les présentes mentions légales sont soumises au droit français.'],
        ].map(([title, text]) => (
          <View key={title} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textDark, marginBottom: 6 }}>{title}</Text>
            <Text style={{ fontSize: 13, color: colors.textMedium, lineHeight: 20 }}>{text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
