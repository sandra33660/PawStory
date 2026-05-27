import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';
 
// Screens
import Onboarding from './screens/Onboarding.js';
import Welcome from './screens/Welcome.js';
import Auth from './screens/Auth.js';
import Home from './screens/Home.js';
import Journal from './screens/Journal.js';
import Health from './screens/Health.js';
import AnimalProfile from './screens/AnimalProfile.js';
 
// Components
import BottomNav from './components/BottomNav.js';
 
// Styles
import { colors } from './constants/colors';
 
export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [authMode, setAuthMode] = useState('signup');
  const [tab, setTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [fromAuth, setFromAuth] = useState(false);
 
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setScreen('main');
      } else {
        const seen = await AsyncStorage.getItem('onboarding_seen');
        if (seen) setScreen('welcome');
      }
      setLoading(false);
    };
    init();
 
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setScreen('main');
    });
  }, []);
 
  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
 
  if (screen === 'onboarding') return (
    <Onboarding
      onFinish={(mode) => {
        if (mode) { setAuthMode(mode); setScreen('auth'); }
        else setScreen('welcome');
      }}
      startAt={fromAuth ? 3 : 0}
    />
  );
 
  if (screen === 'welcome') return (
    <Welcome
      onChoice={(mode) => { setAuthMode(mode); setScreen('auth'); }}
      onBack={() => setScreen('onboarding')}
    />
  );
 
  if (screen === 'auth') return (
    <Auth
      mode={authMode}
      onSuccess={() => setScreen('main')}
      onBack={() => { setFromAuth(true); setScreen('welcome'); }}
    />
  );
 
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {tab === 'home' && <Home />}
        {tab === 'animal' && <AnimalProfile />}
        {tab === 'journal' && <Journal />}
        {tab === 'health' && <Health />}
      </View>
      <BottomNav activeTab={tab} onTabChange={setTab} />
    </View>
  );
}