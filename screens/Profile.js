import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';

export default function Profile({ onBack, onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  if (loading) return <View style={globalStyles.center}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[globalStyles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={onBack}
          style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8, paddingHorizontal: 14, marginBottom: 12 }}>
          <Text style={{ color: 'white', fontSize: 14 }}>← Retour</Text>
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: '300' }}>Mon profil</Text>
      </View>

      <View style={{ padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <Text style={{ fontSize: 18, color: colors.textDark, fontWeight: '500' }}>{user?.email}</Text>
        </View>

        <View style={globalStyles.infoCard}>
          <Text style={{ fontSize: 20 }}>📧</Text>
          <View style={{ marginLeft: 14 }}>
            <Text style={globalStyles.infoLabel}>Email</Text>
            <Text style={globalStyles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        <View style={globalStyles.infoCard}>
          <Text style={{ fontSize: 20 }}>📅</Text>
          <View style={{ marginLeft: 14 }}>
            <Text style={globalStyles.infoLabel}>Membre depuis</Text>
            <Text style={globalStyles.infoValue}>{new Date(user?.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[globalStyles.btn, { backgroundColor: colors.urgent, marginTop: 32 }]}
          onPress={handleLogout}>
          <Text style={globalStyles.btnText}>🚪 Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
