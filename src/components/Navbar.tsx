import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Zap, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showSandbox, setShowSandbox] = useState(false);

  return (
    <header className="navbar-header" role="banner">
      {/* Top / Brand Row */}
      <div className="navbar-top-row">
        <div className="navbar-brand-group">
          <div className="navbar-logo" aria-hidden="true">
            Z
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 className="navbar-title">
                Ziki Handshake
              </h1>
              <span
                style={{
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
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} />
                neo-mando
              </span>
            </div>
            <p className="navbar-subtitle">
              Human-in-the-Loop Mission Control & 1-Tap Handshake
            </p>
          </div>
        </div>

        {/* Safe status indicator on mobile */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            color: '#059669',
            fontWeight: 600,
            padding: '5px 10px',
            background: '#ecfdf5',
            borderRadius: '8px',
            border: '1px solid #a7f3d0',
            flexShrink: 0,
          }}
          title="All agent actions require your explicit confirmation before code changes or rewards are issued"
        >
          <ShieldCheck size={14} />
          <span>Guaranteed Safe</span>
        </div>
      </div>

      {/* Center: Goal Progress Pulse */}
      <div className="navbar-center" role="region" aria-label="Sprint progress">
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Sprint Goal
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
            <span style={{ color: '#2563eb' }}>{totalPoints}</span> / {targetPoints} pts
          </div>
        </div>
        <div style={{ width: '90px', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>
          {percent}%
        </span>
      </div>

      {/* Controls: Human Actions & Sandbox Toggle */}
      <div className="navbar-actions">
        {/* Sandbox Tool Toggle */}
        <button
          onClick={() => setShowSandbox((prev) => !prev)}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px', minHeight: '38px' }}
          aria-expanded={showSandbox}
          aria-label="Toggle demo simulator tools"
        >
          <Zap size={14} />
          <span>Demo Tools</span>
          {showSandbox ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <button
          onClick={onReset}
          className="btn-ghost"
          style={{ padding: '6px 12px', fontSize: '12px', minHeight: '38px' }}
          title="Reset board state to initial defaults"
          aria-label="Reset board state"
        >
          <RefreshCw size={13} />
          <span>Reset Board</span>
        </button>
      </div>

      {/* Collapsible Sandbox Drawer */}
      {showSandbox && (
        <div
          className="animate-slide-down"
          style={{
            width: '100%',
            background: '#f8fafc',
            border: '1px dashed #93c5fd',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            marginTop: '4px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#475569' }}>
            <strong>Demo Sandbox:</strong> Test how Blogger automatically claims incoming PR review offers in the background.
          </div>
          <button
            onClick={() => {
              onSimulateOffer();
            }}
            className="btn-primary"
            style={{ fontSize: '12px', padding: '6px 12px', minHeight: '34px' }}
          >
            <Zap size={13} />
            <span>Simulate Incoming PR Offer (+10 pts)</span>
          </button>
        </div>
      )}
    </header>
  );
};
