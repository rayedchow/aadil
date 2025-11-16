import { TextStyle } from 'react-native';
import { Fonts } from '../constants/theme';

export const withFont = (style: TextStyle, weight?: 'regular' | 'medium' | 'semiBold' | 'bold'): TextStyle => {
  const fontFamily = weight ? Fonts[weight] : getFontFromWeight(style.fontWeight);
  return {
    ...style,
    fontFamily,
  };
};

const getFontFromWeight = (fontWeight?: string | number): string => {
  if (!fontWeight) return Fonts.regular;
  
  const weight = typeof fontWeight === 'string' ? fontWeight : fontWeight.toString();
  
  switch (weight) {
    case '700':
    case 'bold':
      return Fonts.bold;
    case '600':
    case 'semibold':
      return Fonts.semiBold;
    case '500':
    case 'medium':
      return Fonts.medium;
    default:
      return Fonts.regular;
  }
};

export const applyFontsToStyles = <T extends Record<string, any>>(styles: T): T => {
  const newStyles: any = {};
  
  for (const [key, value] of Object.entries(styles)) {
    if (value && typeof value === 'object') {
      if ('fontSize' in value || 'fontWeight' in value || 'color' in value) {
        newStyles[key] = withFont(value as TextStyle);
      } else {
        newStyles[key] = value;
      }
    } else {
      newStyles[key] = value;
    }
  }
  
  return newStyles as T;
};

