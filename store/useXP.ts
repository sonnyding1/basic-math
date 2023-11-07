import { create } from 'zustand';

interface XP {
    xp: number;
    incrementXP: (amount: number) => void;
    setXP: (amount: number) => void;
}

export const useXP = create<XP>()((set) => ({
    xp: 0,
    incrementXP: (amount) => set((state) => ({ xp: state.xp + amount })),
    setXP: (amount) => set((state) => ({ xp: amount })),
}));