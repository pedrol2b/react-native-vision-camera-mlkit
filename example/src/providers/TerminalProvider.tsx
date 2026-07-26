import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { TerminalBottomSheet } from '../components/views';

const CLOSED_INDEX = 0;
const OPEN_INDEX = 1;

type TerminalContextType = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const TerminalContext = createContext<TerminalContextType | null>(null);

type TerminalProviderProps = {
  children: ReactNode;
};

export const TerminalProvider = ({ children }: TerminalProviderProps) => {
  const [index, setIndex] = useState(CLOSED_INDEX);

  const open = useCallback(() => setIndex(OPEN_INDEX), []);
  const close = useCallback(() => setIndex(CLOSED_INDEX), []);

  const value = useMemo(
    () => ({ open, close, isOpen: index > CLOSED_INDEX }),
    [open, close, index]
  );

  return (
    <TerminalContext.Provider value={value}>
      {children}
      <TerminalBottomSheet index={index} onIndexChange={setIndex} />
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);

  if (!context) {
    throw new Error('useTerminal must be used within TerminalProvider');
  }

  return context;
};
