import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  bio: string;
  deneyim: string;
  proje: number;
  maas: number;
  rating: number;
  skills: { name: string; level: number }[];
}

const DEVELOPERS: Developer[] = [
  { id: 1, ad: 'Aleyna Erarslan', uzmanlik: 'Mobile Developer', seviye: 'Junior', avatar: '👩‍💻', renk: ['#e94560', '#0f3460'], teknolojiler: ['React Native', 'TypeScript', 'Expo'], bio: 'Mobil uygulama geliştirmeye tutkulu, yeni teknolojileri keşfetmeyi seviyor.', deneyim: '1 yıl', proje: 4, maas: 45000, rating: 4.2, skills: [{ name: 'React Native', level: 75 }, { name: 'TypeScript', level: 60 }, { name: 'UI/UX', level: 50 }] },
  { id: 2, ad: 'Ahmet Yılmaz', uzmanlik: 'Backend Developer', seviye: 'Mid-Level', avatar: '👨‍💻', renk: ['#00b4d8', '#0077b6'], teknolojiler: ['Node.js', 'Python', 'PostgreSQL'], bio: 'Ölçeklenebilir API mimarileri tasarlıyor, mikroservis uzmanı.', deneyim: '3 yıl', proje: 12, maas: 65000, rating: 4.5, skills: [{ name: 'Node.js', level: 85 }, { name: 'Python', level: 70 }, { name: 'Database', level: 80 }] },
  { id: 3, ad: 'Elif Kaya', uzmanlik: 'Frontend Developer', seviye: 'Senior', avatar: '👩‍🎨', renk: ['#f72585', '#7209b7'], teknolojiler: ['React', 'Vue.js', 'Tailwind CSS'], bio: 'Kullanıcı deneyimi odaklı, pixel-perfect arayüzler oluşturuyor.', deneyim: '5 yıl', proje: 28, maas: 85000, rating: 4.8, skills: [{ name: 'React', level: 95 }, { name: 'CSS', level: 90 }, { name: 'Vue.js', level: 75 }] },
  { id: 4, ad: 'Can Demir', uzmanlik: 'DevOps Engineer', seviye: 'Lead', avatar: '🧑‍🔧', renk: ['#06d6a0', '#118ab2'], teknolojiler: ['Docker', 'Kubernetes', 'AWS'], bio: 'CI/CD pipeline uzmanı, bulut altyapı mimarı.', deneyim: '7 yıl', proje: 35, maas: 110000, rating: 4.9, skills: [{ name: 'AWS', level: 95 }, { name: 'Docker', level: 90 }, { name: 'K8s', level: 85 }] },
  { id: 5, ad: 'Zeynep Aydın', uzmanlik: 'AI/ML Engineer', seviye: 'Senior', avatar: '🧑‍🔬', renk: ['#ff6b6b', '#ffa502'], teknolojiler: ['Python', 'TensorFlow', 'PyTorch'], bio: 'Derin öğrenme ve NLP alanında araştırmacı, yapay zeka tutkunu.', deneyim: '4 yıl', proje: 15, maas: 95000, rating: 4.7, skills: [{ name: 'Python', level: 92 }, { name: 'ML', level: 88 }, { name: 'NLP', level: 80 }] },
  { id: 6, ad: 'Burak Şahin', uzmanlik: 'Fullstack Developer', seviye: 'Mid-Level', avatar: '🧑‍💻', renk: ['#845ec2', '#d65db1'], teknolojiler: ['Next.js', 'GraphQL', 'MongoDB'], bio: 'Hem frontend hem backend ile haşır neşir, tam yığın savaşçı.', deneyim: '2 yıl', proje: 8, maas: 55000, rating: 4.3, skills: [{ name: 'Next.js', level: 78 }, { name: 'GraphQL', level: 65 }, { name: 'MongoDB', level: 70 }] },
  { id: 7, ad: 'Selin Yıldız', uzmanlik: 'UI/UX Designer', seviye: 'Senior', avatar: '👩‍🎤', renk: ['#ff8a5c', '#ea5455'], teknolojiler: ['Figma', 'Adobe XD', 'Prototyping'], bio: 'Kullanıcı araştırması ve tasarım sistemi oluşturma konusunda uzman.', deneyim: '6 yıl', proje: 42, maas: 80000, rating: 4.6, skills: [{ name: 'Figma', level: 95 }, { name: 'Research', level: 85 }, { name: 'Prototyping', level: 88 }] },
];

const FILTER_OPTIONS = ['Tümü', 'Junior', 'Mid-Level', 'Senior', 'Lead'];

// ─── Konfeti ──────────────────────────────────────────
function Confetti({ show }: { show: boolean }) {
  const particles = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(0), y: new Animated.Value(0), opacity: new Animated.Value(0), rotate: new Animated.Value(0),
      color: ['#e94560', '#fdcb6e', '#00b894', '#6c5ce7', '#00cec9', '#f39c12', '#ff6b6b', '#a29bfe'][Math.floor(Math.random() * 8)],
      startX: Math.random() * 340 - 170, size: Math.random() * 8 + 4,
    }))
  ).current;

  useEffect(() => {
    if (!show) return;
    particles.forEach((p) => {
      p.x.setValue(0); p.y.setValue(0); p.opacity.setValue(1); p.rotate.setValue(0);
      Animated.parallel([
        Animated.timing(p.x, { toValue: p.startX, duration: 2000, useNativeDriver: true }),
        Animated.timing(p.y, { toValue: Math.random() * 500 + 200, duration: 2000, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.timing(p.rotate, { toValue: Math.random() * 10, duration: 2000, useNativeDriver: true }),
        Animated.sequence([Animated.delay(1400), Animated.timing(p.opacity, { toValue: 0, duration: 600, useNativeDriver: true })]),
      ]).start();
    });
  }, [show]);

  if (!show) return null;
  return (
    <View style={styles.confettiContainer} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View key={i} style={[styles.confettiPiece, {
          width: p.size, height: p.size, borderRadius: p.size / 2,
          backgroundColor: p.color, opacity: p.opacity,
          transform: [{ translateX: p.x }, { translateY: p.y }, { rotate: p.rotate.interpolate({ inputRange: [0, 10], outputRange: ['0deg', '720deg'] }) }],
        }]} />
      ))}
    </View>
  );
}

// ─── Başarım Popup ────────────────────────────────────
function AchievementPopup() {
  const { newAchievement, clearNewAchievement } = useGame();
  const slide = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!newAchievement) return;
    Animated.parallel([
      Animated.spring(slide, { toValue: 0, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.loop(Animated.sequence([
        Animated.timing(shine, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(shine, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])),
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
        <Animated.Text style={[styles.popupEmoji, { transform: [{ scale: shine.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }] }]}>{newAchievement.icon}</Animated.Text>
        <View>
          <Text style={styles.popupLabel}>Başarım Açıldı!</Text>
          <Text style={styles.popupTitle}>{newAchievement.title}</Text>
        </View>
        <Text style={styles.popupXP}>+20 XP</Text>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── Toplam Maaş Paneli ──────────────────────────────
function SalaryPanel({ hiredIds, developers }: { hiredIds: Set<number>; developers: Developer[] }) {
  const total = developers.filter(d => hiredIds.has(d.id)).reduce((sum, d) => sum + d.maas, 0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (total > 0) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 200, useNativeDriver: true }),
        Animated.spring(pulseAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();
    }
  }, [total]);

  return (
    <Animated.View style={[styles.salaryPanel, { transform: [{ scale: pulseAnim }] }]}>
      <Text style={styles.salaryIcon}>💰</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.salaryLabel}>Toplam Maaş Bütçesi</Text>
        <Text style={styles.salaryValue}>₺{total.toLocaleString('tr-TR')}</Text>
      </View>
      <Text style={styles.salaryPer}>/ay</Text>
    </Animated.View>
  );
}

// ─── Takım Paneli ─────────────────────────────────────
function TeamPanel({ hiredCount, total }: { hiredCount: number; total: number }) {
  const animW = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(animW, { toValue: (hiredCount / total) * 100, friction: 8, useNativeDriver: false }).start();
  }, [hiredCount]);

  return (
    <View style={styles.teamPanel}>
      <View style={styles.teamRow}>
        <Text style={styles.teamIcon}>👥</Text>
        <Text style={styles.teamLabel}>Ekip Durumu</Text>
        <Text style={styles.teamCount}>{hiredCount} / {total}</Text>
      </View>
      <View style={styles.teamTrack}>
        <Animated.View style={[styles.teamFill, { width: animW.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]}>
          <LinearGradient colors={['#00b894', '#00cec9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 4 }} />
        </Animated.View>
      </View>
      {hiredCount === total && <Text style={styles.teamComplete}>🎉 Tam kadro! Ekip hazır!</Text>}
    </View>
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

// ─── Yıldız Rating ────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }, (_, i) => (
        <Text key={i} style={[styles.star, { opacity: i < full ? 1 : i === full && half ? 0.6 : 0.2 }]}>★</Text>
      ))}
      <Text style={styles.ratingNum}>{rating}</Text>
    </View>
  );
}

// ─── Skill Bar ────────────────────────────────────────
function SkillBar({ name, level }: { name: string; level: number }) {
  const animW = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animW, { toValue: level, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: false }).start();
  }, []);

  const color = level > 85 ? '#00b894' : level > 65 ? '#0984e3' : '#fdcb6e';
  return (
    <View style={styles.skillRow}>
      <Text style={styles.skillName}>{name}</Text>
      <View style={styles.skillTrack}>
        <Animated.View style={[styles.skillFill, { width: animW.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }), backgroundColor: color }]} />
      </View>
      <Text style={styles.skillPct}>{level}%</Text>
    </View>
  );
}

// ─── Kimlik Kartı ─────────────────────────────────────
function KimlikKarti({ dev, onHireChange }: { dev: Developer; onHireChange: (hired: boolean) => void }) {
  const [musaitMi, setMusaitMi] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;
  const favAnim = useRef(new Animated.Value(1)).current;
  const game = useGame();

  useEffect(() => {
    Animated.timing(cardAnim, { toValue: 1, duration: 600, delay: dev.id * 80, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }).start();
  }, []);

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    Animated.spring(expandAnim, { toValue: next ? 1 : 0, friction: 8, useNativeDriver: false }).start();
  };

  const toggleFav = () => {
    setFavorited(!favorited);
    Animated.sequence([
      Animated.timing(favAnim, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.spring(favAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const toggleStatus = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    const newStatus = !musaitMi;
    setMusaitMi(newStatus);
    game.recordSwitch();
    onHireChange(!newStatus);
    if (!newStatus) game.recordHire(); else game.recordFire();
  };

  const seviyeRenk: Record<string, string> = { 'Junior': '#00b894', 'Mid-Level': '#0984e3', 'Senior': '#e17055', 'Lead': '#6c5ce7' };
  const expandHeight = expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 180] });

  return (
    <Animated.View style={{
      opacity: cardAnim,
      transform: [{ scale: scaleAnim }, { translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
    }}>
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.95}>
        <LinearGradient colors={dev.renk} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <View style={styles.cardTop}>
            <View style={[styles.avatarCircle, !musaitMi && styles.avatarHired]}>
              <Text style={styles.avatar}>{dev.avatar}</Text>
              {!musaitMi && <View style={styles.hiredBadge}><Text style={styles.hiredBadgeText}>✓</Text></View>}
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{dev.ad}</Text>
              <Text style={styles.cardRole}>{dev.uzmanlik}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.seviyeBadge, { backgroundColor: seviyeRenk[dev.seviye] || '#636e72' }]}>
                  <Text style={styles.seviyeText}>{dev.seviye}</Text>
                </View>
                <StarRating rating={dev.rating} />
              </View>
            </View>
            <TouchableOpacity onPress={toggleFav} style={styles.favBtn}>
              <Animated.Text style={[styles.favIcon, { transform: [{ scale: favAnim }] }]}>{favorited ? '❤️' : '🤍'}</Animated.Text>
            </TouchableOpacity>
          </View>

          <View style={styles.techRow}>
            {dev.teknolojiler.map((tech, i) => (
              <View key={i} style={styles.techBadge}><Text style={styles.techText}>{tech}</Text></View>
            ))}
          </View>

          {/* Mini istatistikler */}
          <View style={styles.miniStats}>
            <View style={styles.miniItem}><Text style={styles.miniIcon}>⏱️</Text><Text style={styles.miniValue}>{dev.deneyim}</Text></View>
            <View style={styles.miniItem}><Text style={styles.miniIcon}>📁</Text><Text style={styles.miniValue}>{dev.proje} proje</Text></View>
            <View style={styles.miniItem}><Text style={styles.miniIcon}>💰</Text><Text style={styles.miniValue}>₺{(dev.maas / 1000).toFixed(0)}K</Text></View>
          </View>

          {/* Genişleyen Detay */}
          <Animated.View style={[styles.expandArea, { height: expandHeight, opacity: expandAnim }]}>
            <Text style={styles.bioText}>{dev.bio}</Text>
            <Text style={styles.skillTitle}>Yetenekler</Text>
            {dev.skills.map((s, i) => <SkillBar key={i} name={s.name} level={s.level} />)}
          </Animated.View>

          <View style={styles.cardBottom}>
            <View style={[styles.statusDot, { backgroundColor: musaitMi ? '#00b894' : '#e17055' }]} />
            <Text style={styles.statusText}>{musaitMi ? 'Müsait' : 'Projelerde Çalışıyor'}</Text>
            <Text style={styles.expandHint}>{expanded ? '▲ Kapat' : '▼ Detay'}</Text>
          </View>

          <TouchableOpacity onPress={toggleStatus} activeOpacity={0.8}>
            <LinearGradient
              colors={musaitMi ? ['#00b894', '#00cec9'] : ['#636e72', '#b2bec3']}
              style={styles.hireBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.hireBtnIcon}>{musaitMi ? '✅' : '💼'}</Text>
              <Text style={styles.hireBtnText}>{musaitMi ? 'İşe Al' : 'Projelerde Çalışıyor'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Filtre ───────────────────────────────────────────
function FilterBar({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
      {FILTER_OPTIONS.map(opt => (
        <TouchableOpacity key={opt} onPress={() => onSelect(opt)} activeOpacity={0.7}>
          <View style={[styles.filterChip, selected === opt && styles.filterChipActive]}>
            <Text style={[styles.filterText, selected === opt && styles.filterTextActive]}>{opt}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Ana Ekran ────────────────────────────────────────
export default function HomeScreen() {
  const [filter, setFilter] = useState('Tümü');
  const [hiredSet, setHiredSet] = useState<Set<number>>(new Set());
  const game = useGame();

  const filtered = filter === 'Tümü' ? DEVELOPERS : DEVELOPERS.filter(d => d.seviye === filter);
  const hiredCount = hiredSet.size;
  const showConfetti = hiredCount === DEVELOPERS.length;

  useEffect(() => { game.checkAllHired(hiredCount === DEVELOPERS.length); }, [hiredCount]);

  const handleHireChange = useCallback((devId: number, hired: boolean) => {
    setHiredSet(prev => {
      const next = new Set(prev);
      if (hired) next.add(devId); else next.delete(devId);
      return next;
    });
  }, []);

  const hireAll = () => {
    const allIds = new Set(DEVELOPERS.map(d => d.id));
    setHiredSet(allIds);
    DEVELOPERS.forEach(() => { game.recordHire(); game.recordSwitch(); });
  };

  return (
    <LinearGradient colors={['#0a0a1a', '#16213e', '#1a1a2e']} style={styles.gradient}>
      <Confetti show={showConfetti} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AchievementPopup />

        <Text style={styles.header}>🪪 Yazılımcı Kimlik Kartları</Text>
        <Text style={styles.subheader}>Geliştiricileri keşfet ve hayalindeki ekibi kur</Text>

        <XPBar />
        <TeamPanel hiredCount={hiredCount} total={DEVELOPERS.length} />
        <SalaryPanel hiredIds={hiredSet} developers={DEVELOPERS} />

        {/* Aksiyon Butonları */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={hireAll} activeOpacity={0.8} style={{ flex: 1 }}>
            <LinearGradient colors={['#6c5ce7', '#a29bfe']} style={styles.actionBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.actionBtnIcon}>🚀</Text>
              <Text style={styles.actionBtnText}>Hepsini İşe Al</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setHiredSet(new Set())} activeOpacity={0.8} style={{ flex: 1 }}>
            <LinearGradient colors={['#636e72', '#b2bec3']} style={styles.actionBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.actionBtnIcon}>🔄</Text>
              <Text style={styles.actionBtnText}>Sıfırla</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <FilterBar selected={filter} onSelect={setFilter} />

        {filtered.map(dev => (
          <KimlikKarti key={dev.id} dev={dev} onHireChange={(hired) => handleHireChange(dev.id, hired)} />
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>Bu seviyede geliştirici bulunamadı</Text>
          </View>
        )}

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

  confettiContainer: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center', zIndex: 200 },
  confettiPiece: { position: 'absolute' },

  // Maaş
  salaryPanel: { backgroundColor: 'rgba(253,203,110,0.1)', borderRadius: 14, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(253,203,110,0.2)' },
  salaryIcon: { fontSize: 24 },
  salaryLabel: { fontSize: 11, color: '#fdcb6e', fontWeight: '600' },
  salaryValue: { fontSize: 18, color: '#fdcb6e', fontWeight: '900' },
  salaryPer: { fontSize: 12, color: 'rgba(253,203,110,0.6)', fontWeight: '600' },

  // Takım
  teamPanel: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 12, marginBottom: 12 },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  teamIcon: { fontSize: 18 },
  teamLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: '#ccd6f6' },
  teamCount: { fontSize: 14, fontWeight: '900', color: '#00b894' },
  teamTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  teamFill: { height: '100%', borderRadius: 3, overflow: 'hidden' },
  teamComplete: { fontSize: 13, fontWeight: '700', color: '#00b894', textAlign: 'center', marginTop: 8 },

  // Aksiyon butonları
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 14, gap: 6 },
  actionBtnIcon: { fontSize: 16 },
  actionBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  // XP
  xpBar: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: 12, marginBottom: 12 },
  xpRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lvlBadge: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  lvlNum: { color: '#fff', fontSize: 16, fontWeight: '900' },
  lvlTitle: { fontSize: 12, fontWeight: '700', color: '#ccd6f6', marginBottom: 4 },
  xpTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 3, overflow: 'hidden' },
  xpNum: { fontSize: 12, fontWeight: '800', color: '#e94560' },

  // Filtre
  filterScroll: { marginBottom: 14 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterChip: { backgroundColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterChipActive: { backgroundColor: '#e94560' },
  filterText: { fontSize: 12, fontWeight: '700', color: '#8892b0' },
  filterTextActive: { color: '#fff' },

  // Kart
  card: { borderRadius: 20, padding: 18, marginBottom: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  decorCircle1: { position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.08)' },
  decorCircle2: { position: 'absolute', bottom: -30, left: -10, width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.05)' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatarCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  avatarHired: { borderColor: '#00b894', borderWidth: 3 },
  hiredBadge: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#00b894', justifyContent: 'center', alignItems: 'center' },
  hiredBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  avatar: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 17, fontWeight: '800', color: '#fff' },
  cardRole: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  seviyeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  seviyeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  favBtn: { padding: 4 },
  favIcon: { fontSize: 20 },

  // Stars
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  star: { fontSize: 12, color: '#fdcb6e' },
  ratingNum: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '700', marginLeft: 4 },

  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 8 },
  techBadge: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  techText: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },

  // Mini stats
  miniStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 10, paddingVertical: 8 },
  miniItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniIcon: { fontSize: 12 },
  miniValue: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '700' },

  // Detay
  expandArea: { overflow: 'hidden', marginBottom: 6 },
  bioText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 18, marginBottom: 8 },
  skillTitle: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: 6 },
  skillRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  skillName: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)', width: 60 },
  skillTrack: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  skillFill: { height: '100%', borderRadius: 3 },
  skillPct: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.6)', width: 30, textAlign: 'right' },

  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.85)', flex: 1 },
  expandHint: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },

  hireBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 14, gap: 8 },
  hireBtnIcon: { fontSize: 16 },
  hireBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },

  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#8892b0', fontWeight: '600' },

  popup: { position: 'absolute', top: 50, left: 18, right: 18, zIndex: 100 },
  popupInner: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, gap: 12, elevation: 10 },
  popupEmoji: { fontSize: 30 },
  popupLabel: { fontSize: 10, fontWeight: '600', color: '#fff', opacity: 0.9 },
  popupTitle: { fontSize: 15, fontWeight: '900', color: '#fff' },
  popupXP: { marginLeft: 'auto', fontSize: 13, fontWeight: '900', color: '#fff', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
});
