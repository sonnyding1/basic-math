import { create } from 'zustand';

interface NumberSolved {
    numberSolved: number;
    incrementNumberSolved: () => void;
    setNumberSolved: (amount: number) => void;
}

export const useNumberSolved = create<NumberSolved>()((set) => ({
    numberSolved: 0,
    incrementNumberSolved: () => set((state) => ({ numberSolved: state.numberSolved + 1 })),
    setNumberSolved: (amount) => set((state) => ({ numberSolved: amount })),
}));