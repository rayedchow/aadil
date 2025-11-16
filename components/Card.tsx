import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Radii, Spacing, ThemeColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'muted' | 'highlight';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = Spacing.cardPadding,
}) => {
  const { colors, shadows } = useTheme();
  const styles = useMemo(() => createStyles(colors, shadows.soft), [colors, shadows]);

  const backgroundColor =
    variant === 'muted'
      ? colors.surfaceMuted
      : variant === 'highlight'
        ? colors.surfaceHighlight
        : colors.surface;

  return (
    <View style={[styles.card, { backgroundColor, padding }, style]}>
      {children}
    </View>
  );
};

const createStyles = (colors: ThemeColors, shadow: Record<string, any>) =>
  StyleSheet.create({
    card: {
      borderRadius: Radii.lg,
      marginBottom: Spacing.sectionGap,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadow,
    },
  });

