export type ThemeMode = 'light' | 'dark';

export const lightColors = {
  background: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F9FAFF',
  surfaceHighlight: '#EEF4FF',
  primary: '#1F64FF',
  primarySoft: '#EDF3FF',
  accentGreen: '#30D158',
  accentOrange: '#FF8A34',
  accentPink: '#F56B92',
  accentPurple: '#AC6CFF',
  text: '#0F172A',
  textMuted: '#6B7280',
  border: '#E2E8F0',
  shadow: 'rgba(15, 23, 42, 0.08)',
};

export const darkColors = {
  background: '#0B1220',
  surface: '#151C2C',
  surfaceMuted: '#1E263B',
  surfaceHighlight: '#202C44',
  primary: '#5B8CFF',
  primarySoft: '#28365A',
  accentGreen: '#30D158',
  accentOrange: '#FF9F45',
  accentPink: '#FF87B5',
  accentPurple: '#C79BFF',
  text: '#F8FAFF',
  textMuted: '#A5B1D1',
  border: '#2A3550',
  shadow: 'rgba(0, 0, 0, 0.7)',
};

export type ThemeColors = typeof lightColors;

export const createShadows = (mode: ThemeMode) => ({
  soft: {
    shadowColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.65)' : 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: mode === 'dark' ? 0.45 : 0.12,
    shadowRadius: 16,
    elevation: 6,
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

