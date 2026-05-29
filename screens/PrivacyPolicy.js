import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';

export default function PrivacyPolicy({ onBack }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[globalStyles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={onBack}
          style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8, paddingHorizontal: 14, marginBottom: 12 }}>
          <Text style={{ color: 'white', fontSize: 14 }}>← Retour</Text>
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '300' }}>Politique de confidentialité</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 12, color: colors.textLight, marginBottom: 24 }}>Dernière mise à jour : mai 2026</Text>

        {[
          ['1. Responsable du traitement', 'PawStory est développé par Sandra Brun. Contact : sandrabrun1103@gmail.com'],
          ['2. Données collectées', 'Nous collectons : votre adresse email, les informations de vos animaux (nom, espèce, race, date de naissance, poids, vétérinaire), vos souvenirs (textes et photos), vos rappels santé.'],
          ['3. Utilisation des données', 'Vos données sont utilisées uniquement pour faire fonctionner l\'application PawStory. Elles ne sont jamais vendues ni partagées avec des tiers.'],
          ['4. Stockage', 'Vos données sont stockées de manière sécurisée sur les serveurs Supabase (UE). Les photos sont stockées sur Supabase Storage.'],
          ['5. Vos droits (RGPD)', 'Conformément au RGPD, vous disposez des droits suivants :\n• Droit d\'accès à vos données\n• Droit de rectification\n• Droit à l\'effacement (supprimable depuis votre profil)\n• Droit à la portabilité\n\nPour exercer ces droits : sandrabrun1103@gmail.com'],
          ['6. Suppression du compte', 'Vous pouvez supprimer votre compte et toutes vos données à tout moment depuis l\'écran Profil. La suppression est immédiate et irréversible.'],
          ['7. Cookies', 'L\'application n\'utilise pas de cookies de tracking.'],
          ['8. Contact', 'Pour toute question : sandrabrun1103@gmail.com'],
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
