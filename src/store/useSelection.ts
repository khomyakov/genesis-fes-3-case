import { create } from 'zustand';

interface State {
  mode: boolean; // true = selection mode
  selected: Set<string>; // ids of checked rows
  toggleMode(on?: boolean): void;
  toggle(id: string): void;
  selectAll(ids: string[]): void;
  clear(): void;
}

export const useSelection = create<State>((set) => ({
  mode: false,
  selected: new Set(),

  toggleMode: (on) =>
    set((s) => ({
      mode: on ?? !s.mode,
      selected: on === false ? new Set() : s.selected,
    })),

  toggle: (id) =>
    set((s) => {
      const next = new Set(s.selected);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selected: next };
    }),

  selectAll: (ids) => set(() => ({ selected: new Set(ids) })),

  clear: () => set({ mode: false, selected: new Set() }),
}));
