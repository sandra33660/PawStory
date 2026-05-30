import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateFR, toSupabaseDate } from '../utils/dateUtils';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
 
export default function AnimalProfile({ onGuide }) {
  const [tab, setTab] = useState('infos');
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [newAnimal, setNewAnimal] = useState({});
  const [showNewDatePicker, setShowNewDatePicker] = useState(false);
  const [filterPhotos, setFilterPhotos] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editData, setEditData] = useState({});
  const [animal, setAnimal] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => { loadAnimal(); }, []);
 
  const loadAnimal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from('animals').select('*').eq('user_id', user.id).limit(1);
      if (data && data.length > 0) {
        setAnimal(data[0]);
        const { data: journalData } = await supabase.from('journal_entries').select('*').eq('animal_id', data[0].id).order('entry_date', { ascending: false });
        if (journalData) setEntries(journalData);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };
 
  const getAge = (birthdate) => {
    if (!birthdate) return null;
    return Math.floor((Date.now() - new Date(birthdate).getTime()) / (1000 * 60 * 60 * 24 * 365));
  };
 
  const getHumanAge = (birthdate, species) => {
    const age = getAge(birthdate);
    if (!age) return null;
    if (species === 'Chien') return age < 2 ? age * 15 : age < 6 ? 24 + (age - 2) * 5 : 64 + (age - 6) * 4;
    if (species === 'Chat') return age < 2 ? age * 12 : 24 + (age - 2) * 4;
    return null;
  };

if (loading) return (
  <View style={globalStyles.center}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const createAnimal = async () => {
    Alert.alert('Début création', 'Nom: ' + (newAnimal.name || 'vide') + ' Espèce: ' + (newAnimal.species || 'vide'));
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('animals').insert({
        user_id: user.id,
        name: newAnimal.name || 'Mon animal',
        species: newAnimal.species || '',
        breed: newAnimal.breed || '',
        birthdate: newAnimal.birthdate || null,
        weight: newAnimal.weight ? parseFloat(newAnimal.weight) : null,
        vet_name: newAnimal.vet_name || '',
        nickname: newAnimal.nickname || '',
      }).select().single();
      if (error) throw error;
      setAnimal(data);
      setCreateMode(false);
      setNewAnimal({});
    } catch (e) {
      Alert.alert('Erreur création', JSON.stringify(e));
    }
  };

  if (!animal) return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[globalStyles.header, { backgroundColor: colors.primary }]}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '300' }}>Mon compagnon</Text>
      </View>
      {!createMode ? (
        <View style={globalStyles.center}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>🐾</Text>
          <Text style={{ fontSize: 18, color: colors.textDark, marginBottom: 8 }}>Aucun animal ajouté</Text>
          <Text style={{ fontSize: 14, color: colors.textLight, marginBottom: 32, textAlign: 'center' }}>Crée le profil de ton compagnon !</Text>
          <TouchableOpacity style={[globalStyles.btn, { backgroundColor: colors.primary, width: '80%' }]} onPress={() => setCreateMode(true)}>
            <Text style={globalStyles.btnText}>+ Ajouter mon animal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={[globalStyles.sectionTitle, { marginBottom: 16 }]}>PROFIL DE TON ANIMAL</Text>
          {[
            ['Nom *', 'name', "Nom de l'animal"],
            ['Surnom', 'nickname', 'Petit nom...'],
            ['Espèce *', 'species', 'Chien, Chat, Lapin...'],
            ['Race', 'breed', 'Labrador...'],
            ['Poids (kg)', 'weight', '24'],
            ['Vétérinaire', 'vet_name', 'Nom du vétérinaire'],
          ].map(([label, key, placeholder]) => (
            <View key={key} style={{ marginBottom: 12 }}>
              <Text style={globalStyles.infoLabel}>{label}</Text>
              <TextInput
                style={globalStyles.input}
                value={newAnimal[key] || ''}
                onChangeText={v => setNewAnimal(d => ({ ...d, [key]: v }))}
                placeholder={placeholder}
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          ))}
          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.infoLabel}>Date de naissance</Text>
            <TouchableOpacity style={globalStyles.input} onPress={() => setShowNewDatePicker(true)}>
              <Text style={{ color: newAnimal.birthdate ? colors.textDark : colors.textDisabled, fontSize: 15 }}>
                {newAnimal.birthdate ? formatDateFR(newAnimal.birthdate) : 'Sélectionner une date...'}
              </Text>
            </TouchableOpacity>
            {showNewDatePicker && (
              <DateTimePicker
                value={newAnimal.birthdate ? new Date(newAnimal.birthdate) : new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, date) => {
                  setShowNewDatePicker(false);
                  if (date) setNewAnimal(d => ({ ...d, birthdate: toSupabaseDate(date) }));
                }}
              />
            )}
          </View>
          <TouchableOpacity style={[globalStyles.btn, { backgroundColor: colors.primary }]} onPress={createAnimal}>
            <Text style={globalStyles.btnText}>Créer 🐾 TEST</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.btnOutline, { borderColor: colors.primary, marginTop: 8 }]} onPress={() => setCreateMode(false)}>
            <Text style={[globalStyles.btnOutlineText, { color: colors.primary }]}>Annuler</Text>
          </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );

 
  const age = getAge(animal.birthdate);
  const humanAge = getHumanAge(animal.birthdate, animal.species);
 
  const getAnimalEmoji = (species) => {
    const map = { 'Chat': '🐱', 'Lapin': '🐰', 'Oiseau': '🐦' };
    return map[species] || '🐕';
  };

  const infos = [
    ['🐾', 'Espèce', animal.species],
    ['💝', 'Surnom', animal.nickname],
    ['🐕', 'Race', animal.breed],
    ['🎂', 'Naissance', animal.birthdate],
    ['⚖️', 'Poids', animal.weight ? `${animal.weight} kg` : null],
    ['🏥', 'Vétérinaire', animal.vet_name],
    ['📞', 'Téléphone', animal.vet_phone],
    ['⚕️', 'Pathologies', animal.pathologies],
  ].filter(([_, __, val]) => val);
 
  
  const pickAndUploadPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('On a besoin de la permission pour accéder à tes photos 🐾');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) await uploadAnimalPhoto(result.assets[0].uri);
  };
 
const saveEdit = async () => {
    try {
      await supabase.from('animals').update({
        name: editData.name,
        species: editData.species,
        breed: editData.breed,
        birthdate: editData.birthdate,
        weight: editData.weight ? parseFloat(editData.weight) : null,
        vet_name: editData.vet_name,
        vet_phone: editData.vet_phone,
        pathologies: editData.pathologies,
        nickname: editData.nickname,
      }).eq('id', animal.id);
      setAnimal({ ...animal, ...editData, weight: editData.weight ? parseFloat(editData.weight) : null });
      setEditMode(false);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder');
    }
  };

const uploadAnimalPhoto = async (uri) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const filename = `${user.id}/animal_${animal.id}.jpg`;
 
    // Supprimer l'ancienne photo si elle existe
    await supabase.storage.from('photos').remove([filename]);
 
    // Uploader la nouvelle
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });
    const { error } = await supabase.storage.from('photos').upload(filename, decode(base64), {
      contentType: 'image/jpeg',
      upsert: true,
    });
 
    if (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload : ' + error.message);
      return;
    }
 
    // Ajouter un timestamp pour forcer le rechargement
    const { data } = supabase.storage.from('photos').getPublicUrl(filename);
    const photoUrlWithTimestamp = `${data.publicUrl}?t=${Date.now()}`;
 
    await supabase.from('animals').update({ photo_url: photoUrlWithTimestamp }).eq('id', animal.id);
    setAnimal({ ...animal, photo_url: photoUrlWithTimestamp });
 
  } catch (e) {
    console.error('Error:', e);
    alert('Une erreur est survenue');
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[globalStyles.header, { paddingBottom: 28 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 16 }}>
          {/* Photo cliquable */}
          <TouchableOpacity onPress={pickAndUploadPhoto} style={globalStyles.animalAvatar}>
            {animal.photo_url ? (
              <Image
                source={{ uri: animal.photo_url }}
                style={{ width: 80, height: 80, borderRadius: 24 }}
              />
            ) : (
              <>
                <Text style={{ fontSize: 44 }}>{getAnimalEmoji(animal.species)}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>
                  Modifier
                </Text>
              </>
            )}
          </TouchableOpacity>
 
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: 'white', fontSize: 28, fontWeight: '300' }}>{animal.name}</Text>
              <TouchableOpacity onPress={() => { setEditData({ ...animal, weight: animal.weight?.toString() }); setEditMode(true); }}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 8 }}>
                <Text style={{ fontSize: 20 }}>✏️</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.whiteAlpha80, fontSize: 14 }}>
              {animal.breed || animal.species}{age ? ` · ${age} ans` : ''}
            </Text>
            {humanAge && (
              <View style={globalStyles.ageBadge}>
                <Text style={{ color: 'white', fontSize: 12 }}>🧬 Âge humain : {humanAge} ans</Text>
              </View>
            )}
          </View>
        </View>
      </View>
 
      {/* Stats */}
      <View style={globalStyles.statsBar}>
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { setTab('journal'); setFilterPhotos(true); }}>
          <Text style={{ fontSize: 18 }}>📷</Text>
          <Text style={globalStyles.statVal}>{entries.filter(e => e.photo_url).length}</Text>
          <Text style={globalStyles.statLabel}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { setTab('journal'); setFilterPhotos(false); }}>
          <Text style={{ fontSize: 18 }}>📖</Text>
          <Text style={globalStyles.statVal}>{entries.length}</Text>
          <Text style={globalStyles.statLabel}>Souvenirs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={onGuide}>
          <Text style={{ fontSize: 18 }}>🐾</Text>
          <Text style={globalStyles.statVal}>{age ? age.toString() : '?'}</Text>
          <Text style={globalStyles.statLabel}>Années</Text>
        </TouchableOpacity>
      </View>
 
      {/* Tabs */}
      <View style={globalStyles.tabBar}>
        {[['infos', '📋 Infos'], ['journal', '📖 Journal']].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[globalStyles.tabBtn, tab === key && globalStyles.tabBtnActive]}
            onPress={() => setTab(key)}
          >
            <Text style={[globalStyles.tabLabel, { color: tab === key ? colors.primary : colors.textLight }]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
 
      {/* Formulaire modification */}
      {editMode && (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={[globalStyles.sectionTitle, { marginBottom: 16 }]}>MODIFIER LA FICHE</Text>
          {[
            ['Nom', 'name', "Nom de l'animal"],
            ['Surnom', 'nickname', 'Petit nom affectueux...'],
            ['Espèce', 'species', 'Chien, Chat...'],
            ['Race', 'breed', 'Labrador...'],
            ['Poids (kg)', 'weight', '24'],
            ['Vétérinaire', 'vet_name', 'Nom du vétérinaire'],
            ['Téléphone véto', 'vet_phone', '06...'],
            ['Pathologies', 'pathologies', 'Aucune...'],
          ].map(([label, key, placeholder]) => (
            <View key={key} style={{ marginBottom: 12 }}>
              <Text style={globalStyles.infoLabel}>{label}</Text>
              <TextInput
                style={globalStyles.input}
                value={editData[key] || ''}
                onChangeText={v => setEditData(d => ({ ...d, [key]: v }))}
                placeholder={placeholder}
                placeholderTextColor={colors.textDisabled}
              />
            </View>
          ))}

          <View style={{ marginBottom: 12 }}>
            <Text style={globalStyles.infoLabel}>Date de naissance</Text>
            <TouchableOpacity style={globalStyles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: editData.birthdate ? colors.textDark : colors.textDisabled, fontSize: 15 }}>
                {editData.birthdate ? formatDateFR(editData.birthdate) : "Sélectionner une date..."}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={editData.birthdate ? new Date(editData.birthdate) : new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setEditData(d => ({ ...d, birthdate: toSupabaseDate(date) }));
                }}
              />
            )}
          </View>
          ))}
          <TouchableOpacity style={[globalStyles.btn, { backgroundColor: colors.primary }]} onPress={saveEdit}>
            <Text style={globalStyles.btnText}>💾 Enregistrer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.btnOutline, { borderColor: colors.primary }]} onPress={() => setEditMode(false)}>
            <Text style={[globalStyles.btnOutlineText, { color: colors.primary }]}>Annuler</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Contenu */}
      {!editMode && <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 20 }}>
        {tab === 'infos' && infos.map(([icon, label, value], i) => (
          <View key={i} style={globalStyles.infoCard}>
            <Text style={{ fontSize: 20 }}>{icon}</Text>
            <View style={{ marginLeft: 14 }}>
              <Text style={globalStyles.infoLabel}>{label}</Text>
              <Text style={globalStyles.infoValue}>{value}</Text>
            </View>
          </View>
        ))}
 
        {tab === 'journal' && (
          (filterPhotos ? entries.filter(e => e.photo_url) : entries).length === 0 ? (
            <Text style={{ textAlign: 'center', color: colors.textLight, marginTop: 40 }}>
              Aucun souvenir pour le moment
            </Text>
          ) : (filterPhotos ? entries.filter(e => e.photo_url) : entries).map((e, i) => (
            <View key={i} style={globalStyles.journalCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Text style={globalStyles.journalEmoji}>{e.emoji || '🐾'}</Text>
                <View>
                  <Text style={globalStyles.entryTitle}>{e.title}</Text>
                  <Text style={globalStyles.entryDate}>{e.entry_date}</Text>
                </View>
              </View>
              {e.content ? <Text style={globalStyles.memoryText}>{e.content}</Text> : null}
            </View>
          ))
        )}
      </ScrollView>}
    </View>
  );
}
 