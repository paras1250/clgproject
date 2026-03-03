/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sora: ['Sora', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                // Core backgrounds
                navy: {
                    DEFAULT: '#0A0F1C',
                    section: '#0F1629',
                    card: '#121826',
                    hover: '#182034',
                },
                // Primary accent — Neon Teal
                teal: {
                    DEFAULT: '#00F5D4',
                    hover: '#00D9C0',
                    glow: 'rgba(0, 245, 212, 0.25)',
                },
                // Secondary accent — Royal Blue
                royal: {
                    DEFAULT: '#3A86FF',
                },
                // Text system
                txt: {
                    primary: '#F1F5F9',
                    secondary: '#94A3B8',
                    muted: '#64748B',
                },
                // Status
                status: {
                    success: '#10B981',
                    warning: '#F59E0B',
                    error: '#EF4444',
                },
                // Legacy mappings (for migration convenience)
                primary: {
                    50: '#f0fdf9',
                    100: '#ccfbeb',
                    200: '#99f6d8',
                    300: '#5cedc2',
                    400: '#2bdcad',
                    500: '#00F5D4',
                    600: '#00D9C0',
                    700: '#00b89e',
                    800: '#009280',
                    900: '#007868',
                },
                dark: {
                    bg: '#0A0F1C',
                    surface: '#121826',
                    border: 'rgba(255,255,255,0.08)',
                    text: '#F1F5F9',
                    muted: '#94A3B8',
                    faint: '#64748B',
                },
                accent: {
                    teal: '#00F5D4',
                    'teal-hover': '#00D9C0',
                    blue: '#3A86FF',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'float': 'float 4s ease-in-out infinite',
                'float-slow': 'floatSlow 6s ease-in-out infinite',
                'glow': 'glow 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.85)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                floatSlow: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '25%': { transform: 'translateY(-6px) rotate(0.5deg)' },
                    '75%': { transform: 'translateY(4px) rotate(-0.5deg)' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(0, 245, 212, 0.15)' },
                    '50%': { boxShadow: '0 0 30px rgba(0, 245, 212, 0.3)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
