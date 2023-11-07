import { create } from 'zustand';

interface Level {
    level: number;
    incrementLevel: (amount: number) => void;
    setLevel: (amount: number) => void;
}

export const useLevel = create<Level>()((set) => ({
    level: 1,
    incrementLevel: (amount) => set((state) => ({ level: state.level + amount })),
    setLevel: (amount) => set((state) => ({ level: amount })),
}));