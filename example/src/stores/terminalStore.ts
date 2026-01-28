import { create } from 'zustand';

type TerminalEntry = {
  id: string;
  ts: number;
  source: string;
  data: unknown;
};

type TerminalState = {
  entries: TerminalEntry[];
  addEntry: (data: unknown, source: string) => void;
  clear: () => void;
};

let entryCounter = 0;

const createEntryId = () => {
  entryCounter += 1;
  return `${Date.now()}-${entryCounter}`;
};

export const useTerminalStore = create<TerminalState>((set) => ({
  entries: [],
  addEntry: (data: unknown, source: string) =>
    set((state) => ({
      entries: [
        {
          id: createEntryId(),
          ts: Date.now(),
          source,
          data,
        },
        ...state.entries,
      ],
    })),
  clear: () => set({ entries: [] }),
}));

export type { TerminalEntry };
