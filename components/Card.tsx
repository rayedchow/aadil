import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radii, Shadows, Spacing } from '../constants/theme';

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
  const backgroundColor =
    variant === 'muted'
      ? Colors.surfaceMuted
      : variant === 'highlight'
        ? Colors.surfaceHighlight
        : Colors.surface;

  return (
    <View style={[styles.card, { backgroundColor, padding }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    marginBottom: Spacing.sectionGap,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.soft,
  },
});

