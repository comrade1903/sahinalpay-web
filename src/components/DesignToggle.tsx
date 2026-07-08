import { useState } from 'react';

interface DesignToggleProps {
  current: 'v1' | 'v2';
  onChange: (version: 'v1' | 'v2') => void;
}

export default function DesignToggle({ current, onChange }: DesignToggleProps) {
  const [isHovered, setIsHovered] = useState(false);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #eae6de',
    borderRadius: '9999px',
    padding: '6px 12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(8px)',
    fontFamily: '"Nunito Sans", system-ui, sans-serif',
    fontSize: '13px',
    fontWeight: 600,
    color: '#2e2b26',
    userSelect: 'none',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
  };

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: '9999px',
    border: 'none',
    backgroundColor: active ? '#4a7c59' : 'transparent',
    color: active ? '#ffffff' : '#6b6358',
    cursor: 'pointer',
    fontWeight: active ? 700 : 500,
    fontSize: '12px',
    transition: 'all 0.2s ease',
    outline: 'none',
  });

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id="design-toggle-container"
    >
      <span style={{ color: '#705c30', marginRight: '4px', fontSize: '11px', textTransform: 'uppercase', tracking: '0.05em' } as any}>
        Tasarım:
      </span>
      <button
        type="button"
        style={buttonStyle(current === 'v1')}
        onClick={() => onChange('v1')}
      >
        Klasik (A)
      </button>
      <button
        type="button"
        style={buttonStyle(current === 'v2')}
        onClick={() => onChange('v2')}
      >
        Modern (B)
      </button>
    </div>
  );
}
