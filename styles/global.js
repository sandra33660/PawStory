import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
 
export default StyleSheet.create({
  // Layouts
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  
  // Typographie
  bigEmoji: { fontSize: 80, marginBottom: 40 },
  title: { fontSize: 28, textAlign: 'center', color: colors.textDark, marginBottom: 16, fontWeight: '300' },
  subtitle: { fontSize: 16, textAlign: 'center', color: colors.textMedium, lineHeight: 24, marginBottom: 48 },
  sectionTitle: { fontSize: 11, color: colors.textLight, fontWeight: '600', letterSpacing: 1, marginBottom: 10, marginTop: 4 },
 
  // Boutons
  btn: { width: '100%', padding: 18, borderRadius: 20, alignItems: 'center', marginBottom: 12 },
  btnText: { color: 'white', fontSize: 17 },
  btnOutline: { width: '100%', padding: 18, borderRadius: 20, alignItems: 'center', borderWidth: 1.5 },
  btnOutlineText: { fontSize: 17 },
 
  // Inputs
  input: { backgroundColor: colors.card, borderRadius: 16, padding: 16, fontSize: 15, color: colors.textDark, marginBottom: 16, elevation: 2, width: '100%' },
 
  // Cards
  card: { backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 3 },
  infoCard: { backgroundColor: colors.card, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 2 },
  journalCard: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 10, elevation: 2 },
  reminderCard: { backgroundColor: colors.card, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderLeftWidth: 3, elevation: 2 },
 
  // Header
  header: { backgroundColor: colors.primary, padding: 24, paddingTop: 56 },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '300' },
 
  // Misc
  errorText: { color: colors.urgent, marginBottom: 12, textAlign: 'center' },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  dot: { height: 8, borderRadius: 4 },
  checkbox: { width: 32, height: 32, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  urgentBadge: { backgroundColor: colors.urgentLight, borderRadius: 8, padding: 4, paddingHorizontal: 10 },
  urgentText: { color: colors.urgent, fontSize: 11, fontWeight: '600' },
  photoZone: { backgroundColor: colors.card, borderRadius: 20, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed' },
  emojiBtn: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  backBtn: { alignSelf: 'flex-start', backgroundColor: colors.backgroundDark, borderRadius: 12, padding: 10, paddingHorizontal: 16, marginBottom: 8 },
  backBtnText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  animalAvatar: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  ageBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginTop: 6 },
  statsBar: { backgroundColor: colors.card, margin: 16, marginTop: -20, borderRadius: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-around', elevation: 4 },
  statVal: { fontSize: 20, color: colors.textDark, fontWeight: 'bold', textAlign: 'center' },
  statLabel: { fontSize: 11, color: colors.textLight, textAlign: 'center' },
  statPill: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 10, alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  tabBar: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, backgroundColor: colors.backgroundDark, borderRadius: 16, padding: 4, gap: 4 },
  tabBtn: { flex: 1, padding: 10, borderRadius: 13, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.card },
  tabLabel: { fontSize: 12, fontWeight: '500' },
  infoLabel: { fontSize: 11, color: colors.textLight, marginBottom: 2 },
  infoValue: { fontSize: 15, color: colors.textDark },
  journalEmoji: { fontSize: 28, backgroundColor: colors.background, borderRadius: 12, padding: 8 },
  entryTitle: { fontSize: 14, color: colors.textDark, fontWeight: '600' },
  entryDate: { fontSize: 12, color: colors.textLight },
  memoryEmoji: { fontSize: 36, backgroundColor: colors.background, borderRadius: 14, padding: 10 },
  memoryTitle: { fontSize: 16, color: colors.textDark, marginBottom: 2 },
  memoryDate: { fontSize: 12, color: colors.textLight, marginBottom: 6 },
  memoryText: { fontSize: 13, color: colors.textMedium, lineHeight: 20 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 12, alignItems: 'center' },
  cardHeader: { backgroundColor: colors.backgroundDark, padding: 12 },
  cardHeaderText: { color: colors.textMedium, fontSize: 13, fontWeight: '600' },
  reminderTitle: { fontSize: 14, color: colors.textDark },
  reminderDate: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  navItem: { alignItems: 'center', gap: 2 },
  navLabel: { fontSize: 10 },
});
 