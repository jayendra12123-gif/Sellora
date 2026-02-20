export const theme = {
  colors: {
    primary: '#1a1a1a',        // Deep black
    secondary: '#d4af88',      // Elegant gold
    accent: '#8b7355',         // Warm taupe
    light: '#f5f5f5',          // Off-white
    border: '#e8e8e8',         // Subtle border
    text: '#2d2d2d',           // Dark text
    textLight: '#666666',      // Medium text
    white: '#ffffff',
  },
  fonts: {
    serif: "'Playfair Display', serif",
    sans: "'Poppins', sans-serif",
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  transitions: {
    default: 'all 0.3s ease-out',
  },
};

// Utility classes
export const buttonVariants = {
  primary: 'bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] border border-[#1a1a1a]',
  secondary: 'bg-white text-[#1a1a1a] hover:bg-[#f5f5f5] border border-[#1a1a1a]',
  accent: 'bg-[#d4af88] text-white hover:bg-[#c49968] border border-[#d4af88]',
  ghost: 'bg-transparent text-[#2d2d2d] hover:bg-[#f5f5f5] border border-[#e8e8e8]',
};

export const inputClasses = 'w-full px-0 py-3 bg-white border-b-2 border-[#e8e8e8] focus:border-[#d4af88] focus:outline-none text-[#2d2d2d] placeholder-[#999999] transition';
