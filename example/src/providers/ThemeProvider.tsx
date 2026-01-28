import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme } from '../styles/themes';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const deviceColorScheme = useColorScheme();
  const [userPreference, setUserPreference] = useState<'light' | 'dark' | null>(
    null
  );

  const isDark = useMemo(() => {
    if (userPreference !== null) {
      return userPreference === 'dark';
    }
    return deviceColorScheme === 'dark';
  }, [userPreference, deviceColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setUserPreference(isDark ? 'light' : 'dark');

  const value = useMemo(
    () => ({ theme, isDark, toggleTheme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
