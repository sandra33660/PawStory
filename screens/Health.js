import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateFR, toSupabaseDate } from '../utils/dateUtils';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';
import BackHeader from '../components/BackHeader';
 
const types = ['Vaccin', 'Médicament', 'Vermifuge', 'Anti-puces', 'Rdv véto', 'Autre'];
const typeIcons = { 'Vaccin': '💉', 'Médicament': '💊', 'Vermifuge': '🐛', 'Anti-puces': '🦟', 'Rdv véto': '🏥', 'Autre': '📋' };
 
export default function Health() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Vaccin');
  const [dueDate, setDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [repeat, setRepeat] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState([]);
  const [animalName, setAnimalName] = useState('votre animal');
 
  useEffect(() => { loadReminders(); }, []);
 
  const loadReminders = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: animals } = await supabase.from('animals').select('id, name').eq('user_id', user.id).limit(1);
      if (animals && animals.length > 0) {
        setAnimalName(animals[0].name);
        const { data } = await supabase.from('health_reminders').select('*').eq('animal_id', animals[0].id).order('due_date', { ascending: true });
        if (data) setReminders(data);
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
        await supabase.from('health_reminders').insert({
          animal_id: animals[0].id,
          title: title.trim(),
          type,
          due_date: dueDate ? toSupabaseDate(dueDate) : null,
          repeat_every_days: repeat ? parseInt(repeat) : null,
        });
        setTitle(''); setDueDate(null); setRepeat('');
        setShowForm(false);
        loadReminders();
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };
 
  const toggleDone = (id) => setDone(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const isUrgent = (due_date) => {
    if (!due_date) return false;
    return new Date(due_date) - new Date() < 1000 * 60 * 60 * 24 * 3;
  };
 
  if (showForm) return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <BackHeader title="Nouveau rappel" color={colors.health} onBack={() => setShowForm(false)} backLabel="✕ Annuler" />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40, backgroundColor: colors.background }}>
        <Text style={globalStyles.sectionTitle}>TYPE</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {types.map((t) => (
            <TouchableOpacity key={t} onPress={() => setType(t)}
              style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: type === t ? colors.health : colors.card, elevation: 2 }}>
              <Text style={{ color: type === t ? 'white' : colors.textLight, fontWeight: '500' }}>{typeIcons[t]} {t}</Text>
            </TouchableOpacity>
          ))}
        </View>
 
        <Text style={globalStyles.sectionTitle}>TITRE</Text>
        <TextInput style={globalStyles.input} placeholder="Ex : Vaccin rage..." placeholderTextColor={colors.textDisabled} value={title} onChangeText={setTitle} />
 
        <Text style={globalStyles.sectionTitle}>DATE D'ÉCHÉANCE</Text>
        <TouchableOpacity style={globalStyles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: dueDate ? colors.textDark : colors.textDisabled, fontSize: 15 }}>
            {dueDate ? formatDateFR(toSupabaseDate(dueDate)) : 'Sélectionner une date...'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setDueDate(date);
            }}
          />
        )}
 
        <Text style={globalStyles.sectionTitle}>RÉPÉTER TOUS LES (jours)</Text>
        <TextInput style={globalStyles.input} placeholder="Ex : 90 pour tous les 3 mois" placeholderTextColor={colors.textDisabled} value={repeat} onChangeText={setRepeat} keyboardType="numeric" />
 
        <TouchableOpacity style={[globalStyles.btn, { backgroundColor: colors.health }]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="white" /> : <Text style={globalStyles.btnText}>💊 Enregistrer le rappel</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
 
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[globalStyles.header, { backgroundColor: colors.health }]}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '300' }}>Santé de {animalName}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          {[['À faire', reminders.filter(r => !done.includes(r.id)).length], ['Faits', done.length], ['Total', reminders.length]].map(([label, val], i) => (
            <View key={i} style={globalStyles.statPill}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{val}</Text>
              <Text style={{ color: colors.whiteAlpha80, fontSize: 11 }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
 
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.health} style={{ marginTop: 40 }} />
        ) : reminders.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 60, marginBottom: 16 }}>💊</Text>
            <Text style={{ fontSize: 18, color: colors.textDark, marginBottom: 8 }}>Aucun rappel</Text>
            <Text style={{ fontSize: 14, color: colors.textLight, textAlign: 'center' }}>Ajoute les vaccins et médicaments !</Text>
          </View>
        ) : reminders.map(r => {
          const isDone = done.includes(r.id);
          const urgent = isUrgent(r.due_date);
          return (
            <View key={r.id} style={[globalStyles.reminderCard, {
              borderLeftColor: isDone ? '#C8DBC9' : urgent ? colors.urgent : colors.health,
              opacity: isDone ? 0.6 : 1,
              backgroundColor: isDone ? colors.backgroundDark : colors.card,
            }]}>
              <Text style={{ fontSize: 26 }}>{typeIcons[r.type] || '💊'}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[globalStyles.reminderTitle, { textDecorationLine: isDone ? 'line-through' : 'none' }]}>{r.title}</Text>
                {r.repeat_every_days && <Text style={{ fontSize: 11, color: colors.textLight }}>🔁 Tous les {r.repeat_every_days} jours</Text>}
                <Text style={[globalStyles.reminderDate, { color: isDone ? '#C8DBC9' : urgent ? colors.urgent : colors.health }]}>
                  {isDone ? '✓ Fait' : r.due_date ? formatDateFR(r.due_date) : 'Pas de date'}
                </Text>
              </View>
              {urgent && !isDone && <View style={globalStyles.urgentBadge}><Text style={globalStyles.urgentText}>Urgent</Text></View>}
              <TouchableOpacity onPress={() => toggleDone(r.id)}
                style={[globalStyles.checkbox, { borderColor: urgent ? colors.urgent : colors.health, backgroundColor: isDone ? colors.health : 'transparent', marginLeft: 8 }]}>
                {isDone && <Text style={{ color: 'white' }}>✓</Text>}
              </TouchableOpacity>
            </View>
          );
        })}
 
        <TouchableOpacity style={[globalStyles.btn, { backgroundColor: colors.health, marginTop: 16 }]} onPress={() => setShowForm(true)}>
          <Text style={globalStyles.btnText}>+ Ajouter un rappel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
 