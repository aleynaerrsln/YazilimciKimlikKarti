import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame, xpForLevel } from '../../context/GameContext';

// ─── Geliştirici Verileri ─────────────────────────────
interface Developer {
  id: number;
  ad: string;
  uzmanlik: string;
  seviye: string;
  avatar: string;
  renk: [string, string];
  teknolojiler: string[];
}

const DEVELOPERS: Developer[] = [
  { id: 1, ad: 'Aleyna Arslan', uzmanlik: 'Mobile Developer', seviye: 'Junior', avatar: '👩‍💻', renk: ['#e94560', '#0f3460'], teknolojiler: ['React Native', 'TypeScript', 'Expo'] },
  { id: 2, ad: 'Ahmet Yılmaz', uzmanlik: 'Backend Developer', seviye: 'Mid-Level', avatar: '👨‍💻', renk: ['#00b4d8', '#0077b6'], teknolojiler: ['Node.js', 'Python', 'PostgreSQL'] },
  { id: 3, ad: 'Elif Kaya', uzmanlik: 'Frontend Developer', seviye: 'Senior', avatar: '👩‍🎨', renk: ['#f72585', '#7209b7'], teknolojiler: ['React', 'Vue.js', 'Tailwind CSS'] },
  { id: 4, ad: 'Can Demir', uzmanlik: 'DevOps Engineer', seviye: 'Lead', avatar: '🧑‍🔧', renk: ['#06d6a0', '#118ab2'], teknolojiler: ['Docker', 'Kubernetes', 'AWS'] },
  { id: 5, ad: 'Zeynep Aydın', uzmanlik: 'AI/ML Engineer', seviye: 'Senior', avatar: '🧑‍🔬', renk: ['#ff6b6b', '#ffa502'], teknolojiler: ['Python', 'TensorFlow', 'PyTorch'] },
];

// ─── Başarım Popup ────────────────────────────────────
function AchievementPopup() {
  const { newAchievement, clearNewAchievement } = useGame();
  const slide = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!newAchievement) return;
    Animated.parallel([
      Animated.spring(slide, { toValue: 0, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slide, { toValue: -120, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => clearNewAchievement());
    }, 2500);
    return () => clearTimeout(t);
  }, [newAchievement]);

  if (!newAchievement) return null;
  return (
    <Animated.View style={[styles.popup, { transform: [{ translateY: slide }], opacity }]}>
      <LinearGradient colors={['#fdcb6e', '#e17055']} style={styles.popupInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={styles.popupEmoji}>{newAchievement.icon}</Text>
        <View>
          <Text style={styles.popupLabel}>Başarım Açıldı!</Text>
          <Text style={styles.popupTitle}>{newAchievement.title}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── XP Bar ───────────────────────────────────────────
function XPBar() {
  const { xp, level, levelTitle } = useGame();
  const nextXP = xpForLevel(level + 1);
  const currentXP = xpForLevel(level);
  const progress = Math.min(((xp - currentXP) / (nextXP - currentXP)) * 100, 100);
  const animW = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animW, { toValue: progress, friction: 8, useNativeDriver: false }).start();
  }, [progress]);

  return (
    <View style={styles.xpBar}>
      <View style={styles.xpRow}>
        <LinearGradient colors={['#e94560', '#c23152']} style={styles.lvlBadge}>
          <Text style={styles.lvlNum}>{level}</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.lvlTitle}>{levelTitle}</Text>
          <View style={styles.xpTrack}>
            <Animated.View style={[styles.xpFill, { width: animW.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]}>
              <LinearGradient colors={['#e94560', '#f39c12']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 4 }} />
            </Animated.View>
          </View>
        </View>
        <Text style={styles.xpNum}>{xp} XP</Text>
      </View>
    </View>
  );
}

// ─── Kimlik Kartı ─────────────────────────────────────
function KimlikKarti({ dev }: { dev: Developer }) {
  const [musaitMi, setMusaitMi] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const game = useGame();

  useEffect(() => {
    Animated.timing(cardAnim, { toValue: 1, duration: 600, delay: dev.id * 100, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }).start();
  }, []);

  const toggleStatus = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    const newStatus = !musaitMi;
    setMusaitMi(newStatus);
    game.recordSwitch();

    if (!newStatus) {
      game.recordHire();
    } else {
      game.recordFire();
    }
  };

  const seviyeRenk = {
    'Junior': '#00b894',
    'Mid-Level': '#0984e3',
    'Senior': '#e17055',
    'Lead': '#6c5ce7',
  }[dev.seviye] || '#636e72';

  return (
    <Animated.View style={{
      opacity: cardAnim,
      transform: [{ scale: scaleAnim }, { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
    }}>
      <LinearGradient colors={dev.renk} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {/* Dekoratif daireler */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        {/* Üst kısım: Avatar + Bilgiler */}
        <View style={styles.cardTop}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatar}>{dev.avatar}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{dev.ad}</Text>
            <Text style={styles.cardRole}>{dev.uzmanlik}</Text>
            <View style={[styles.seviyeBadge, { backgroundColor: seviyeRenk }]}>
              <Text style={styles.seviyeText}>{dev.seviye}</Text>
            </View>
          </View>
        </View>

        {/* Teknolojiler */}
        <View style={styles.techRow}>
          {dev.teknolojiler.map((tech, i) => (
            <View key={i} style={styles.techBadge}>
              <Text style={styles.techText}>{tech}</Text>
            </View>
          ))}
        </View>

        {/* Durum + Buton */}
        <View style={styles.cardBottom}>
          <View style={[styles.statusDot, { backgroundColor: musaitMi ? '#00b894' : '#e17055' }]} />
          <Text style={styles.statusText}>{musaitMi ? 'Müsait' : 'Projelerde Çalışıyor'}</Text>
        </View>

        <TouchableOpacity onPress={toggleStatus} activeOpacity={0.8}>
          <LinearGradient
            colors={musaitMi ? ['#00b894', '#00cec9'] : ['#636e72', '#b2bec3']}
            style={styles.hireBtn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={styles.hireBtnIcon}>{musaitMi ? '✅' : '🔄'}</Text>
            <Text style={styles.hireBtnText}>{musaitMi ? 'İşe Al' : 'Serbest Bırak'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Ana Ekran ────────────────────────────────────────
export default function HomeScreen() {
  return (
    <LinearGradient colors={['#0a0a1a', '#16213e', '#1a1a2e']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AchievementPopup />

        <Text style={styles.header}>🪪 Yazılımcı Kimlik Kartları</Text>
        <Text style={styles.subheader}>Geliştiricileri keşfet ve ekibini kur</Text>

        <XPBar />

        {DEVELOPERS.map(dev => (
          <KimlikKarti key={dev.id} dev={dev} />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 55 },
  header: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'center' },
  subheader: { fontSize: 13, color: '#8892b0', textAlign: 'center', marginBottom: 14, marginTop: 4 },

  // XP
  xpBar: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 12, marginBottom: 16 },
  xpRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lvlBadge: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  lvlNum: { color: '#fff', fontSize: 16, fontWeight: '900' },
  lvlTitle: { fontSize: 12, fontWeight: '700', color: '#ccd6f6', marginBottom: 4 },
  xpTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 3, overflow: 'hidden' },
  xpNum: { fontSize: 12, fontWeight: '800', color: '#e94560' },

  // Kart
  card: {
    borderRadius: 20, padding: 18, marginBottom: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  decorCircle1: {
    position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorCircle2: {
    position: 'absolute', bottom: -30, left: -10, width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  avatarCircle: {
    width: 58, height: 58, borderRadius: 29, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatar: { fontSize: 30 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 18, fontWeight: '800', color: '#fff' },
  cardRole: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  seviyeBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, marginTop: 4 },
  seviyeText: { fontSize: 11, fontWeight: '800', color: '#fff' },

  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  techBadge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  techText: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },

  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.85)' },

  hireBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 14, gap: 8,
  },
  hireBtnIcon: { fontSize: 16 },
  hireBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  // Popup
  popup: { position: 'absolute', top: 50, left: 18, right: 18, zIndex: 100 },
  popupInner: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, gap: 12, elevation: 10 },
  popupEmoji: { fontSize: 30 },
  popupLabel: { fontSize: 10, fontWeight: '600', color: '#fff', opacity: 0.9 },
  popupTitle: { fontSize: 15, fontWeight: '900', color: '#fff' },
});
