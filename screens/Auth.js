import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import globalStyles from '../styles/global';
import { colors } from '../constants/colors';
 
export default function Auth({ mode, onSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onSuccess();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };
 
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 32 }}>
        <TouchableOpacity onPress={onBack} style={globalStyles.backBtn}>
          <Text style={globalStyles.backBtnText}>← Retour</Text>
        </TouchableOpacity>
 
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
          <Text style={globalStyles.bigEmoji}>🐾</Text>
          <Text style={globalStyles.title}>{mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}</Text>
          {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
 
          <TextInput style={globalStyles.input} placeholder="Email" placeholderTextColor={colors.textDisabled} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={globalStyles.input} placeholder="Mot de passe" placeholderTextColor={colors.textDisabled} value={password} onChangeText={setPassword} secureTextEntry />
 
          <TouchableOpacity style={[globalStyles.btn, { backgroundColor: colors.primary }]} onPress={handleAuth} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={globalStyles.btnText}>{mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 