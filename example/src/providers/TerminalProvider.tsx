import type { SNAP_POINT_TYPE } from '@gorhom/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TerminalBottomSheet } from '../components/views';

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
  const modalRef = useRef<BottomSheetModal>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback(
    (index: number, _position: number, _type: SNAP_POINT_TYPE) =>
      setIsOpen(index >= 0),
    []
  );

  const value = useMemo(
    () => ({
      open: () => modalRef.current?.present(),
      close: () => modalRef.current?.dismiss(),
      isOpen,
    }),
    [isOpen]
  );

  return (
    <TerminalContext.Provider value={value}>
      {children}
      <TerminalBottomSheet ref={modalRef} onChange={handleChange} />
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
