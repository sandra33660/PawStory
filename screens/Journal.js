import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';
import BackHeader from '../components/BackHeader';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
 
const emojis = ['🐾', '🌲', '🎂', '☀️', '🌊', '❤️', '🏠', '✈️', '🎉', '💊'];
 
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
 
  if (showForm) return (
    <KeyboardAvoidingView key={formKey} style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <BackHeader
        title="Nouveau souvenir"
        subtitle={`${animalName} 👑 · Aujourd'hui`}
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
            {e.photo_url && (
              <Image source={{ uri: e.photo_url }} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }} />
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Text style={globalStyles.journalEmoji}>{e.emoji || '🐾'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.entryTitle}>{e.title}</Text>
                <Text style={globalStyles.entryDate}>{e.entry_date}</Text>
              </View>
            </View>
            {e.content ? <Text style={globalStyles.memoryText}>{e.content}</Text> : null}
          </View>
        ))}
 
        <TouchableOpacity style={[globalStyles.btn, { backgroundColor: colors.journal, marginTop: 16 }]} onPress={() => {
          setFormKey(k => k + 1);
          setShowForm(true);
        }}>
          <Text style={globalStyles.btnText}>+ Nouveau souvenir</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
 