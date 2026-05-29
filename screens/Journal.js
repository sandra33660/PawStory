import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Image, Share, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { formatDateFR } from '../utils/dateUtils';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';
import BackHeader from '../components/BackHeader';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { useRef } from 'react';
import { decode } from 'base64-arraybuffer';
 
const emojis = ['🐾', '🌲', '🎂', '☀️', '🌊', '❤️', '🏠', '✈️', '🎉', '💊'];
 
const MemoryCard = ({ entry, onCapture }) => {
  const cardRef = useRef(null);
  return (
    <ViewShot ref={cardRef} options={{ format: 'jpg', quality: 0.9 }}
      style={{ position: 'absolute', left: -9999, backgroundColor: 'white', width: 340, borderRadius: 16, overflow: 'hidden' }}>
      {entry.photo_url && <Image source={{ uri: entry.photo_url }} style={{ width: '100%', height: 200 }} />}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 28, marginBottom: 8 }}>{entry.emoji || '🐾'}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3A2E26', marginBottom: 4 }}>{entry.title}</Text>
        <Text style={{ fontSize: 12, color: '#A08060', marginBottom: 8 }}>{entry.entry_date}</Text>
        {entry.content ? <Text style={{ fontSize: 14, color: '#7A6651', lineHeight: 20 }}>{entry.content}</Text> : null}
        <Text style={{ fontSize: 11, color: '#C4956A', marginTop: 12, textAlign: 'right' }}>🐾 PawStory</Text>
      </View>
    </ViewShot>
  );
};

export default function Journal() {
  const [selectedEmoji, setSelectedEmoji] = useState('🐾');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animalName, setAnimalName] = useState('votre animal');
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formKey, setFormKey] = useState(0);
 
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('On a besoin de la permission pour accéder à tes photos 🐾');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };
 
  const uploadPhoto = async (uri) => {
    const { data: { user } } = await supabase.auth.getUser();
    const filename = `${user.id}/${Date.now()}.jpg`;
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    const { error } = await supabase.storage.from('photos').upload(filename, decode(base64), {
      contentType: 'image/jpeg',
    });
    if (error) throw error;
    const { data } = supabase.storage.from('photos').getPublicUrl(filename);
    return data.publicUrl;
  };
 
  useEffect(() => { loadEntries(); }, []);
 
  const loadEntries = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: animals } = await supabase.from('animals').select('id, name').eq('user_id', user.id).limit(1);
      if (animals && animals.length > 0) {
        setAnimalName(animals[0].name);
        const { data } = await supabase.from('journal_entries').select('*').eq('animal_id', animals[0].id).order('entry_date', { ascending: false });
        if (data) setEntries(data);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };
 
  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: animals } = await supabase.from('animals').select('id').eq('user_id', user.id).limit(1);
      if (animals && animals.length > 0) {
        let photoUrl = null;
        if (photo) {
          setUploading(true);
          photoUrl = await uploadPhoto(photo);
          setUploading(false);
        }
        await supabase.from('journal_entries').insert({
          animal_id: animals[0].id,
          title,
          content: text,
          emoji: selectedEmoji,
          photo_url: photoUrl,
          entry_date: new Date().toISOString().split('T')[0],
        });
        setTitle('');
        setText('');
        setSelectedEmoji('🐾');
        setPhoto(null);
        setShowForm(false);
        loadEntries();
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };
 
  const cardRefs = useRef({});

  const shareEntry = async (entry) => {
    try {
      const ref = cardRefs.current[entry.id];
      if (ref) {
        const uri = await captureRef(ref, { format: 'jpg', quality: 0.9 });
        await Sharing.shareAsync(uri, { mimeType: 'image/jpeg', dialogTitle: entry.title });
      } else {
        const message = `${entry.emoji || '🐾'} ${entry.title}\n${entry.entry_date}${entry.content ? '\n\n' + entry.content : ''}`;
        await Share.share({ message });
      }
    } catch (e) {
      console.error('Share error:', e);
    }
  };

  const deleteEntry = async (entry) => {
    Alert.alert(
      'Supprimer ce souvenir ?',
      `"${entry.title}" sera définitivement supprimé.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: async () => {
          if (entry.photo_url) {
            const filename = entry.photo_url.split('/photos/')[1]?.split('?')[0];
            if (filename) await supabase.storage.from('photos').remove([filename]);
          }
          await supabase.from('journal_entries').delete().eq('id', entry.id);
          setEntries(entries.filter(e => e.id !== entry.id));
        }},
      ]
    );
  };

  if (showForm) return (
    <KeyboardAvoidingView key={formKey} style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <BackHeader
        title="Nouveau souvenir"
        subtitle={`${animalName} 👑 · ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
        color={colors.journal}
        onBack={() => {
          setShowForm(false);
          setTitle('');
          setText('');
          setSelectedEmoji('🐾');
          setPhoto(null);
        }}
        backLabel="✕ Annuler"
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 20, backgroundColor: colors.background }}>
        <TouchableOpacity style={globalStyles.photoZone} onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={{ width: '100%', height: '100%', borderRadius: 18 }} />
          ) : (
            <>
              <Text style={{ fontSize: 36 }}>📷</Text>
              <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '600', marginTop: 8 }}>
                {uploading ? 'Upload en cours...' : 'Ajouter une photo'}
              </Text>
            </>
          )}
        </TouchableOpacity>
 
        <Text style={globalStyles.sectionTitle}>HUMEUR DU MOMENT</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {emojis.map((e, i) => (
            <TouchableOpacity key={i} onPress={() => setSelectedEmoji(e)}
              style={[globalStyles.emojiBtn, { backgroundColor: selectedEmoji === e ? colors.primary : colors.card }]}>
              <Text style={{ fontSize: 22 }}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
 
        <Text style={globalStyles.sectionTitle}>TITRE</Text>
        <TextInput style={globalStyles.input} placeholder="Ex : Première balade en forêt..." placeholderTextColor={colors.textDisabled} value={title} onChangeText={setTitle} />
 
        <Text style={globalStyles.sectionTitle}>RACONTE CE MOMENT</Text>
        <TextInput style={[globalStyles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Décris ce souvenir..." placeholderTextColor={colors.textDisabled} value={text} onChangeText={setText} multiline />
 
        <TouchableOpacity style={[globalStyles.btn, { backgroundColor: colors.journal }]} onPress={handleSave} disabled={saving || uploading}>
          {saving ? <ActivityIndicator color="white" /> : <Text style={globalStyles.btnText}>{selectedEmoji} Enregistrer</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
 
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[globalStyles.header, { backgroundColor: colors.journal }]}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '300' }}>Journal de {animalName} 📖</Text>
        <Text style={{ color: colors.whiteAlpha80, fontSize: 13, marginTop: 4 }}>{entries.length} souvenir{entries.length > 1 ? 's' : ''}</Text>
      </View>
 
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : entries.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 60, marginBottom: 16 }}>📖</Text>
            <Text style={{ fontSize: 18, color: colors.textDark, marginBottom: 8 }}>Aucun souvenir pour le moment</Text>
            <Text style={{ fontSize: 14, color: colors.textLight, textAlign: 'center' }}>Commence à écrire les premiers moments !</Text>
          </View>
        ) : entries.map((e, i) => (
          <View key={i} style={globalStyles.journalCard}>
            <ViewShot ref={ref => { if (ref) cardRefs.current[e.id] = ref; }} 
              options={{ format: 'jpg', quality: 0.9 }}
              style={{ position: 'absolute', left: -9999, backgroundColor: 'white', width: 340, borderRadius: 16, overflow: 'hidden' }}>
              {e.photo_url && <Image source={{ uri: e.photo_url }} style={{ width: '100%', height: 200 }} />}
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 28, marginBottom: 8 }}>{e.emoji || '🐾'}</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3A2E26', marginBottom: 4 }}>{e.title}</Text>
                <Text style={{ fontSize: 12, color: '#A08060', marginBottom: 8 }}>{e.entry_date}</Text>
                {e.content ? <Text style={{ fontSize: 14, color: '#7A6651', lineHeight: 20 }}>{e.content}</Text> : null}
                <Text style={{ fontSize: 11, color: '#C4956A', marginTop: 12, textAlign: 'right' }}>🐾 PawStory</Text>
              </View>
            </ViewShot>
            {e.photo_url && (
              <Image source={{ uri: e.photo_url }} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }} />
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Text style={globalStyles.journalEmoji}>{e.emoji || '🐾'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.entryTitle}>{e.title}</Text>
                <Text style={globalStyles.entryDate}>{formatDateFR(e.entry_date)}</Text>
              </View>
            </View>
            {e.content ? <Text style={globalStyles.memoryText}>{e.content}</Text> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => shareEntry(e)}
                style={{ backgroundColor: '#f0f0f0', borderRadius: 10, padding: 8, paddingHorizontal: 14 }}>
                <Text style={{ fontSize: 13, color: '#666' }}>📤 Partager</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteEntry(e)}
                style={{ backgroundColor: '#FFE8E8', borderRadius: 10, padding: 8, paddingHorizontal: 14 }}>
                <Text style={{ fontSize: 13, color: '#E07A5F' }}>🗑️ Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
 

      </ScrollView>
      <TouchableOpacity
        onPress={() => { setFormKey(k => k + 1); setShowForm(true); }}
        style={{ position: 'absolute', bottom: 24, right: 24, backgroundColor: colors.journal, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
        <Text style={{ color: 'white', fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
 