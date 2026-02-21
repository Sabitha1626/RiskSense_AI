import { useState } from 'react';

const AccessibilityControls = () => {
    const [fontSize, setFontSize] = useState(100);
    const [highContrast, setHighContrast] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    const apply = (size, contrast, motion) => {
        document.documentElement.style.fontSize = `${size}%`;
        document.body.classList.toggle('high-contrast', contrast);
        document.body.classList.toggle('reduce-motion', motion);
    };

    const handleFontSize = (val) => {
        setFontSize(val);
        apply(val, highContrast, reduceMotion);
    };

    const handleContrast = (val) => {
        setHighContrast(val);
        apply(fontSize, val, reduceMotion);
    };

    const handleMotion = (val) => {
        setReduceMotion(val);
        apply(fontSize, highContrast, val);
    };

    const reset = () => {
        setFontSize(100);
        setHighContrast(false);
        setReduceMotion(false);
        apply(100, false, false);
    };

    return (
        <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 16, fontFamily: 'var(--font-display)' }}>♿ Accessibility</h3>

            <div className="settings-toggle-row">
                <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Font Size</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Adjust text size ({fontSize}%)</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleFontSize(Math.max(80, fontSize - 10))}>A-</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleFontSize(100)}>A</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleFontSize(Math.min(150, fontSize + 10))}>A+</button>
                </div>
            </div>

            <div className="settings-toggle-row">
                <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>High Contrast</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Increase contrast for better visibility</div>
                </div>
                <label className="toggle-switch">
                    <input type="checkbox" checked={highContrast} onChange={e => handleContrast(e.target.checked)} />
                    <span className="toggle-slider" />
                </label>
            </div>

            <div className="settings-toggle-row">
                <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Reduce Motion</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Minimize animations and transitions</div>
                </div>
                <label className="toggle-switch">
                    <input type="checkbox" checked={reduceMotion} onChange={e => handleMotion(e.target.checked)} />
                    <span className="toggle-slider" />
                </label>
            </div>

            <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={reset}>Reset to Defaults</button>
        </div>
    );
};

export default AccessibilityControls;
