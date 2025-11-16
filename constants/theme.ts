export type ThemeMode = 'light' | 'dark';

export const Fonts = {
  regular: 'Raleway_400Regular',
  medium: 'Raleway_500Medium',
  semiBold: 'Raleway_600SemiBold',
  bold: 'Raleway_700Bold',
};

export const lightColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  surfaceHighlight: '#EEF4FF',
  primary: '#1F64FF',
  primarySoft: '#EDF3FF',
  accentGreen: '#30D158',
  accentOrange: '#FF8A34',
  accentPink: '#F56B92',
  accentPurple: '#AC6CFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  shadow: 'rgba(15, 23, 42, 0.08)',
};

export const darkColors = {
  background: '#0B1120',
  surface: '#151C2C',
  surfaceMuted: '#1E2838',
  surfaceHighlight: '#1F2D44',
  primary: '#5B8CFF',
  primarySoft: '#28365A',
  accentGreen: '#30D158',
  accentOrange: '#FF9F45',
  accentPink: '#FF87B5',
  accentPurple: '#C79BFF',
  text: '#F8FAFF',
  textMuted: '#94A3B8',
  border: '#2A3550',
  shadow: 'rgba(0, 0, 0, 0.7)',
};

export type ThemeColors = typeof lightColors;

export const createShadows = (mode: ThemeMode) => ({
  soft: {
    shadowColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(15, 23, 42, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: mode === 'dark' ? 0.5 : 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});

export const Radii = {
  xl: 28,
  lg: 22,
  md: 18,
  pill: 999,
};

export const Spacing = {
  screenPadding: 20,
  sectionGap: 18,
  cardPadding: 20,
};

