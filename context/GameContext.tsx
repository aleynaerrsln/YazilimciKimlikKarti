import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_hire', icon: '🤝', title: 'İlk Teklif', description: 'İlk kez işe al', unlocked: false },
  { id: 'first_fire', icon: '👋', title: 'Serbest Bırak', description: 'İlk kez serbest bırak', unlocked: false },
  { id: 'hire_5', icon: '🏢', title: 'Takım Kurucu', description: '5 kez işe al', unlocked: false },
  { id: 'hire_10', icon: '🏗️', title: 'CEO', description: '10 kez işe al', unlocked: false },
  { id: 'level_3', icon: '🥉', title: 'Bronz HR', description: 'Seviye 3', unlocked: false },
  { id: 'level_5', icon: '🥈', title: 'Gümüş HR', description: 'Seviye 5', unlocked: false },
  { id: 'level_10', icon: '🥇', title: 'Altın HR', description: 'Seviye 10', unlocked: false },
  { id: 'xp_200', icon: '⭐', title: 'Yıldız', description: '200 XP topla', unlocked: false },
  { id: 'xp_500', icon: '💎', title: 'Elmas', description: '500 XP topla', unlocked: false },
  { id: 'all_hired', icon: '🌟', title: 'Tam Kadro', description: 'Tüm geliştiricileri işe al', unlocked: false },
  { id: 'switch_5', icon: '🔄', title: 'Kararsız', description: '5 kez durum değiştir', unlocked: false },
  { id: 'theme_change', icon: '🎨', title: 'Tasarımcı', description: 'Tema değiştir', unlocked: false },
];

export const LEVEL_TITLES = [
  'Stajyer HR', 'Junior HR', 'HR Asistanı', 'HR Uzmanı', 'Kıdemli HR',
  'HR Müdürü', 'HR Direktörü', 'VP of People', 'CHRO', 'HR Efsanesi', 'İK Tanrısı',
];

export const xpForLevel = (level: number) => level * 80;

interface GameState {
  xp: number;
  level: number;
  levelTitle: string;
  totalHires: number;
  totalSwitches: number;
  achievements: Achievement[];
  newAchievement: Achievement | null;
  addXP: (amount: number) => void;
  recordHire: () => void;
  recordFire: () => void;
  recordSwitch: () => void;
  recordThemeChange: () => void;
  checkAllHired: (allHired: boolean) => void;
  clearNewAchievement: () => void;
}

const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalHires, setTotalHires] = useState(0);
  const [totalFires, setTotalFires] = useState(0);
  const [totalSwitches, setTotalSwitches] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const levelTitle = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];

  const unlock = useCallback((id: string) => {
    setAchievements(prev => {
      const a = prev.find(x => x.id === id);
      if (!a || a.unlocked) return prev;
      const updated = prev.map(x => x.id === id ? { ...x, unlocked: true } : x);
      setNewAchievement(updated.find(x => x.id === id)!);
      return updated;
    });
  }, []);

  const addXP = useCallback((amount: number) => {
    setXP(prev => {
      const newXP = prev + amount;
      let newLevel = level;
      while (newXP >= xpForLevel(newLevel + 1)) newLevel++;
      if (newLevel !== level) setLevel(newLevel);
      if (newLevel >= 3) unlock('level_3');
      if (newLevel >= 5) unlock('level_5');
      if (newLevel >= 10) unlock('level_10');
      if (newXP >= 200) unlock('xp_200');
      if (newXP >= 500) unlock('xp_500');
      return newXP;
    });
  }, [level, unlock]);

  const recordHire = useCallback(() => {
    setTotalHires(prev => {
      const n = prev + 1;
      if (n === 1) unlock('first_hire');
      if (n >= 5) unlock('hire_5');
      if (n >= 10) unlock('hire_10');
      return n;
    });
    addXP(20);
  }, [addXP, unlock]);

  const recordFire = useCallback(() => {
    setTotalFires(prev => {
      const n = prev + 1;
      if (n === 1) unlock('first_fire');
      return n;
    });
    addXP(5);
  }, [addXP, unlock]);

  const recordSwitch = useCallback(() => {
    setTotalSwitches(prev => {
      const n = prev + 1;
      if (n >= 5) unlock('switch_5');
      return n;
    });
  }, [unlock]);

  const recordThemeChange = useCallback(() => {
    unlock('theme_change');
    addXP(10);
  }, [unlock, addXP]);

  const checkAllHired = useCallback((allHired: boolean) => {
    if (allHired) unlock('all_hired');
  }, [unlock]);

  const clearNewAchievement = useCallback(() => setNewAchievement(null), []);

  return (
    <GameContext.Provider value={{
      xp, level, levelTitle, totalHires, totalSwitches,
      achievements, newAchievement,
      addXP, recordHire, recordFire, recordSwitch, recordThemeChange, checkAllHired, clearNewAchievement,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
