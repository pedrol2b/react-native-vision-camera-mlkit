export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const typography = {
  xs: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
  sm: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  md: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  lg: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  xl: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  xxl: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
};

export const lightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F9F9F9',
    surfaceDisabled: '#F0F0F0',
    border: '#E5E5E5',
    borderHairline: '#EEEEEE',
    shadow: '#000',
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
    icon: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
    focus: {
      border: 'rgba(255, 204, 0, 0.9)',
    },
    switch: {
      track: {
        inactive: '#E5E5E5',
        active: '#007AFF',
      },
      thumb: {
        inactive: '#FFFFFF',
        active: '#FFFFFF',
      },
    },
    badge: {
      beta: {
        background: 'rgba(255, 159, 64, 0.2)',
        text: '#D97706',
      },
      android: {
        background: 'rgba(61, 220, 132, 0.2)',
        text: '#059669',
      },
      ios: {
        background: 'rgba(10, 132, 255, 0.2)',
        text: '#0369A1',
      },
      complete: {
        background: 'rgba(94, 92, 230, 0.2)',
        text: '#4338CA',
      },
      inProgress: {
        background: 'rgba(255, 214, 10, 0.2)',
        text: '#CA8A04',
      },
    },
  },
  spacing,
  typography,
} as const;

export const darkTheme = {
  colors: {
    primary: '#007AFF',
    background: '#000',
    surface: '#121212',
    surfaceDisabled: '#1A1A1A',
    border: '#222',
    borderHairline: '#222',
    shadow: '#000',
    text: {
      primary: '#fff',
      secondary: '#a1a1a1',
    },
    icon: {
      primary: '#fff',
      secondary: '#a1a1a1',
    },
    focus: {
      border: 'rgba(255, 214, 10, 0.9)',
    },
    switch: {
      track: {
        inactive: '#39393D',
        active: '#007AFF',
      },
      thumb: {
        inactive: '#FFFFFF',
        active: '#FFFFFF',
      },
    },
    badge: {
      beta: {
        background: 'rgba(255, 159, 64, 0.15)',
        text: '#FF9F40',
      },
      android: {
        background: 'rgba(61, 220, 132, 0.15)',
        text: '#3DDC84',
      },
      ios: {
        background: 'rgba(10, 132, 255, 0.15)',
        text: '#0A84FF',
      },
      complete: {
        background: 'rgba(94, 92, 230, 0.15)',
        text: '#5E5CE6',
      },
      inProgress: {
        background: 'rgba(255, 214, 10, 0.15)',
        text: '#FFD60A',
      },
    },
  },
  spacing,
  typography,
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;
