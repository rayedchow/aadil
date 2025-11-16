import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode, lightColors, darkColors, ThemeColors, createShadows } from '../constants/theme';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  shadows: ReturnType<typeof createShadows>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  colors: lightColors,
  shadows: createShadows('light'),
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const initialMode: ThemeMode = systemScheme === 'dark' ? 'dark' : 'light';
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const colors = mode === 'dark' ? darkColors : lightColors;
  const shadows = useMemo(() => createShadows(mode), [mode]);

  const value = useMemo(
    () => ({
      mode,
      colors,
      shadows,
      toggleTheme: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode, colors, shadows],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

