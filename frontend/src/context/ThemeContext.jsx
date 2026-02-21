import { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Helper: compute a lighter and darker shade from a hex color
const hexToShades = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const lighter = `#${Math.min(255, r + 30).toString(16).padStart(2, '0')}${Math.min(255, g + 30).toString(16).padStart(2, '0')}${Math.min(255, b + 30).toString(16).padStart(2, '0')}`;
    const darker = `#${Math.max(0, r - 25).toString(16).padStart(2, '0')}${Math.max(0, g - 25).toString(16).padStart(2, '0')}${Math.max(0, b - 25).toString(16).padStart(2, '0')}`;
    return { lighter, darker, r, g, b };
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accentColor') || '#6366f1');
    const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'normal');
    const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('reducedMotion') === 'true');
    const [highContrast, setHighContrast] = useState(() => localStorage.getItem('highContrast') === 'true');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const { lighter, darker, r, g, b } = hexToShades(accentColor);
        const root = document.documentElement;
        root.style.setProperty('--color-primary', accentColor);
        root.style.setProperty('--color-primary-light', lighter);
        root.style.setProperty('--color-primary-dark', darker);
        root.style.setProperty('--color-primary-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${accentColor}, ${lighter})`);
        root.style.setProperty('--shadow-glow-primary', `0 0 20px rgba(${r}, ${g}, ${b}, 0.3)`);
        root.style.setProperty('--gradient-card', `linear-gradient(145deg, rgba(${r}, ${g}, ${b}, 0.08), rgba(6, 182, 212, 0.04))`);
        root.style.setProperty('--gradient-bg', `radial-gradient(ellipse at 20% 50%, rgba(${r}, ${g}, ${b}, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(239, 68, 68, 0.04) 0%, transparent 50%)`);
        localStorage.setItem('accentColor', accentColor);
    }, [accentColor]);

    useEffect(() => {
        document.documentElement.setAttribute('data-font-size', fontSize);
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    useEffect(() => {
        document.documentElement.setAttribute('data-reduced-motion', reducedMotion);
        localStorage.setItem('reducedMotion', reducedMotion);
    }, [reducedMotion]);

    useEffect(() => {
        document.documentElement.setAttribute('data-high-contrast', highContrast);
        localStorage.setItem('highContrast', highContrast);
    }, [highContrast]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{
            theme, toggleTheme,
            accentColor, setAccentColor,
            fontSize, setFontSize,
            reducedMotion, setReducedMotion,
            highContrast, setHighContrast
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
