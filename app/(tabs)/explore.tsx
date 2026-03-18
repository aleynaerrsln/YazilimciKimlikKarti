import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame, LEVEL_TITLES, xpForLevel } from '../../context/GameContext';

function AchievementCard({ icon, title, description, unlocked, index }: {
  icon: string; title: string; description: string; unlocked: boolean; index: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, delay: index * 60, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[
      styles.achCard,
      { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] },
      !unlocked && styles.achLocked,
    ]}>
      <Text style={styles.achIcon}>{unlocked ? icon : '🔒'}</Text>
      <View style={styles.achInfo}>
        <Text style={[styles.achTitle, !unlocked && { color: '#4a5568' }]}>{title}</Text>
        <Text style={[styles.achDesc, !unlocked && { color: '#2d3748' }]}>{description}</Text>
      </View>
      {unlocked && <Text style={styles.achCheck}>✅</Text>}
    </Animated.View>
  );
}

function StatsSection() {
  const { xp, level, levelTitle, totalHires, totalSwitches } = useGame();
  const stats = [
    { icon: '⭐', label: 'Toplam XP', value: xp.toString() },
    { icon: '📊', label: 'Seviye', value: `${level} - ${levelTitle}` },
    { icon: '🤝', label: 'Toplam İşe Alım', value: totalHires.toString() },
    { icon: '🔄', label: 'Durum Değişikliği', value: totalSwitches.toString() },
  ];

  return (
    <View style={styles.statsBox}>
      {stats.map((s, i) => (
        <View key={i} style={styles.statItem}>
          <Text style={styles.statIcon}>{s.icon}</Text>
          <Text style={styles.statLabel}>{s.label}</Text>
          <Text style={styles.statValue}>{s.value}</Text>
        </View>
      ))}
    </View>
  );
}

function LevelRoadmap() {
  const { level } = useGame();
  return (
    <View style={styles.roadmap}>
      <Text style={styles.sectionTitle}>🗺️ Seviye Yol Haritası</Text>
      {LEVEL_TITLES.map((title, i) => {
        const reached = level >= i;
        const current = level === i;
        return (
          <View key={i} style={[styles.roadItem, current && styles.roadCurrent]}>
            <View style={[styles.roadDot, reached ? styles.dotOn : styles.dotOff]}>
              <Text style={styles.roadNum}>{i}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.roadTitle, reached && { color: '#ccd6f6' }]}>{title}</Text>
              <Text style={styles.roadXP}>{xpForLevel(i)} XP</Text>
            </View>
            {current && <Text style={{ fontSize: 12 }}>📍</Text>}
            {reached && !current && <Text style={{ fontSize: 12 }}>✅</Text>}
          </View>
        );
      })}
    </View>
  );
}

export default function AchievementsScreen() {
  const { achievements } = useGame();
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <LinearGradient colors={['#0a0a1a', '#16213e', '#1a1a2e']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>🏆 Başarımlar</Text>
        <Text style={styles.sub}>{unlocked} / {achievements.length} açıldı</Text>

        {/* Progress */}
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(unlocked / achievements.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressPct}>{Math.round((unlocked / achievements.length) * 100)}%</Text>
        </View>

        <StatsSection />

        <Text style={styles.sectionTitle}>🎖️ Rozetler</Text>
        {achievements.map((a, i) => (
          <AchievementCard key={a.id} icon={a.icon} title={a.title} description={a.description} unlocked={a.unlocked} index={i} />
        ))}

        <LevelRoadmap />
        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { paddingHorizontal: 18, paddingTop: 55 },
  header: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'center' },
  sub: { fontSize: 13, color: '#8892b0', textAlign: 'center', marginTop: 4, marginBottom: 14 },

  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  progressTrack: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#e94560', borderRadius: 4 },
  progressPct: { fontSize: 13, fontWeight: '800', color: '#e94560' },

  statsBox: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 18, gap: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statIcon: { fontSize: 18 },
  statLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: '#8892b0' },
  statValue: { fontSize: 13, fontWeight: '800', color: '#ccd6f6' },

  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 12 },

  achCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14, padding: 14, marginBottom: 8, gap: 12,
  },
  achLocked: { backgroundColor: 'rgba(255,255,255,0.03)' },
  achIcon: { fontSize: 26 },
  achInfo: { flex: 1 },
  achTitle: { fontSize: 14, fontWeight: '700', color: '#ccd6f6' },
  achDesc: { fontSize: 11, color: '#8892b0', marginTop: 2 },
  achCheck: { fontSize: 16 },

  roadmap: { marginTop: 8 },
  roadItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, marginBottom: 4 },
  roadCurrent: { backgroundColor: 'rgba(233,69,96,0.15)' },
  roadDot: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  dotOn: { backgroundColor: '#e94560' },
  dotOff: { backgroundColor: 'rgba(255,255,255,0.1)' },
  roadNum: { fontSize: 12, fontWeight: '800', color: '#fff' },
  roadTitle: { fontSize: 13, fontWeight: '700', color: '#4a5568' },
  roadXP: { fontSize: 10, color: '#4a5568' },
});
