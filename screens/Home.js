import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';
 
export default function Home() {
  const [liked, setLiked] = useState(false);
  const [animal, setAnimal] = useState(null);
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
  loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
 
 
  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: animals } = await supabase.from('animals').select('*').eq('user_id', user.id).limit(1);
      if (animals && animals.length > 0) {
        setAnimal(animals[0]);
        await findMemory(animals[0].id);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };
 
  const findMemory = async (animalId) => {
    const today = new Date();
    const { data: entries } = await supabase.from('journal_entries').select('*').eq('animal_id', animalId);
    if (!entries || entries.length === 0) return;
    const memories = entries.filter(e => {
      const entryDate = new Date(e.entry_date);
      return entryDate.getMonth() + 1 === today.getMonth() + 1 &&
        entryDate.getDate() === today.getDate() &&
        entryDate.getFullYear() < today.getFullYear();
    });
    if (memories.length > 0) {
      const picked = memories[Math.floor(Math.random() * memories.length)];
      setMemory({ ...picked, yearsAgo: today.getFullYear() - new Date(picked.entry_date).getFullYear() });
    }
  };
 
  if (loading) return <View style={globalStyles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
 
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={globalStyles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={globalStyles.headerSub}>Bonjour Sandra 👋</Text>
            <Text style={globalStyles.headerTitle}>Comment va {animal ? animal.name : 'votre compagnon'} ?</Text>
          </View>
          <Text style={{ fontSize: 32 }}>👑</Text>
        </View>
      </View>
 
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 20 }}>
        {memory ? (
          <View style={globalStyles.card}>
            <View style={globalStyles.cardHeader}>
              <Text style={globalStyles.cardHeaderText}>✨ Souvenir du jour — il y a {memory.yearsAgo} an{memory.yearsAgo > 1 ? 's' : ''}</Text>
            </View>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Text style={globalStyles.memoryEmoji}>{memory.emoji || '🐾'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={globalStyles.memoryTitle}>{memory.title}</Text>
                  <Text style={globalStyles.memoryDate}>{memory.entry_date}</Text>
                  {memory.content ? <Text style={globalStyles.memoryText}>{memory.content}</Text> : null}
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <TouchableOpacity style={[globalStyles.actionBtn, { backgroundColor: liked ? colors.urgentLight : colors.background }]} onPress={() => setLiked(!liked)}>
                  <Text style={{ color: liked ? colors.urgent : colors.textLight }}>{liked ? "❤️ J'adore" : "🤍 J'adore"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[globalStyles.actionBtn, { backgroundColor: colors.background }]}>
                  <Text style={{ color: colors.textLight }}>📤 Partager</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20, elevation: 2 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>✨</Text>
            <Text style={{ fontSize: 16, color: colors.textDark, textAlign: 'center', marginBottom: 8 }}>Pas encore de souvenir du jour</Text>
            <Text style={{ fontSize: 13, color: colors.textLight, textAlign: 'center', lineHeight: 20 }}>
              Ajoute des souvenirs dans le journal — dans un an ils réapparaîtront ici comme par magie 🐾
            </Text>
          </View>
        )}
 
        {animal && (
          <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 20, elevation: 2 }}>
            <Text style={{ fontSize: 16, color: colors.textDark, marginBottom: 8, fontWeight: '500' }}>🐾 Bienvenue sur PawStory !</Text>
            <Text style={{ fontSize: 13, color: colors.textMedium, lineHeight: 20 }}>
              Commence à documenter la vie de {animal.name} — chaque souvenir compte. Dans quelques années, tu seras heureuse de les avoir gardés. 🥹
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
 