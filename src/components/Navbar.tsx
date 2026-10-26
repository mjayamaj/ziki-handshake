import React from 'react';
import { ShieldCheck, RefreshCw, Zap } from 'lucide-react';

interface NavbarProps {
  totalPoints: number;
  targetPoints: number;
  onSimulateOffer: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalPoints,
  targetPoints,
  onSimulateOffer,
  onReset,
}) => {
  const percent = Math.min(100, Math.round((totalPoints / targetPoints) * 100));

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '14px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
    }}>
      {/* Brand & Project Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          background: '#2563eb',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '18px',
          letterSpacing: '-0.5px',
          boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
        }}>
          Z
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>
              Ziki Handshake
            </h1>
            <span style={{
              background: '#eff6ff',
              color: '#2563eb',
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              border: '1px solid #bfdbfe',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }}></span>
              neo-mando • zedu-fe
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
            Simple 1-Tap Human-Agent Supervision Deck
          </p>
        </div>
      </div>

      {/* Center: Goal Progress Pulse */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        background: '#f8fafc',
        padding: '6px 14px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Sprint Target
          </div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
            <span style={{ color: '#2563eb' }}>{totalPoints}</span> / {targetPoints} pts
          </div>
        </div>
        <div style={{ width: '100px', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
            borderRadius: '9999px',
            transition: 'width 0.4s ease',
          }}></div>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>
          {percent}%
        </span>
      </div>

      {/* Right Controls: Simulators & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onSimulateOffer}
          style={{
            background: '#eff6ff',
            color: '#2563eb',
            border: '1px solid #bfdbfe',
            padding: '7px 13px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 2px rgba(37, 99, 235, 0.05)',
          }}
          title="Simulate incoming PR dispatch auto-claimed in background by Blogger"
        >
          <Zap size={14} />
          <span>Simulate PR Dispatch</span>
        </button>

        <button
          onClick={onReset}
          style={{
            background: '#ffffff',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            padding: '7px 11px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
          title="Reset board state"
        >
          <RefreshCw size={13} />
          <span>Reset</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: '#10b981',
          fontWeight: 600,
          padding: '6px 10px',
          background: '#ecfdf5',
          borderRadius: '8px',
          border: '1px solid #a7f3d0',
        }}>
          <ShieldCheck size={14} />
          <span>Protocol Active</span>
        </div>
      </div>
    </header>
  );
};
