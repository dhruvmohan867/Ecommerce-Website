const shared = {
  fonts: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: '"Calistoga", serif', // A more elegant heading font
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  radii: {
    small: '6px',
    medium: '12px',
    large: '20px',
    full: '9999px',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

export const lightTheme = {
  ...shared,
  colors: {
    primary: '#2563EB', // A strong, confident blue
    background: '#FFFFFF',
    card: '#F9FAFB', // A very light off-white for depth
    textPrimary: '#1F2937', // Dark, readable gray
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#16A34A',
    error: '#DC2626',
    shadow: 'rgba(31, 41, 55, 0.04)',
    shadowHover: 'rgba(31, 41, 55, 0.1)',
    buttonText: '#FFFFFF',
  },
};

export const darkTheme = {
  ...shared,
  colors: {
    primary: '#60A5FA', // A lighter, vibrant blue for dark mode
    background: '#111827', // Deep, near-black
    card: '#1F2937', // A softer dark gray for cards
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    success: '#4ADE80',
    error: '#F87171',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHover: 'rgba(0, 0, 0, 0.2)',
    buttonText: '#111827',
  },
};