/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                dark: {
                    bg: '#0F172A',
                    surface: '#1E293B',
                    border: 'rgba(255,255,255,0.1)',
                    text: '#F8FAFC',
                    muted: '#94A3B8',
                    faint: '#64748B',
                },
                accent: {
                    blue: '#3B82F6',
                    'blue-hover': '#2563EB',
                    cyan: '#22D3EE',
                },
                status: {
                    success: '#10B981',
                    warning: '#F59E0B',
                    error: '#F43F5E',
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
                    '0%, 100%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' },
                    '50%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
