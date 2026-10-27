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
      <div className="navbar-inner">
        {/* Left: Brand & Team */}
        <div className="navbar-brand-group">
          <div className="navbar-logo" aria-hidden="true">
            Z
          </div>
          <div className="navbar-title-group">
            <div className="navbar-title-row">
              <h1 className="navbar-title">Ziki Handshake</h1>
              <span className="navbar-team-badge">
                <span className="navbar-team-dot" />
                neo-mando
              </span>
            </div>
            <p className="navbar-subtitle">Human-in-the-Loop Mission Control</p>
          </div>
        </div>

        {/* Center: Sprint Goal Progress Pulse */}
        <div className="navbar-center" role="region" aria-label="Sprint progress">
          <div className="navbar-sprint-info">
            <span className="navbar-sprint-label">Sprint Goal</span>
            <span className="navbar-sprint-score">
              <strong>{totalPoints}</strong> / {targetPoints} pts
            </span>
          </div>
          <div className="navbar-progress-track">
            <div
              className="navbar-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="navbar-sprint-percent">{percent}%</span>
        </div>

        {/* Right: Security & Human Controls */}
        <div className="navbar-actions">
          <div
            className="navbar-safe-badge"
            title="All agent actions require your explicit confirmation before code changes or rewards are issued"
          >
            <ShieldCheck size={14} />
            <span>Guaranteed Safe</span>
          </div>

          <button
            onClick={() => setShowSandbox((prev) => !prev)}
            className="btn-secondary navbar-btn"
            aria-expanded={showSandbox}
            aria-label="Toggle demo simulator tools"
          >
            <Zap size={14} />
            <span>Demo Tools</span>
            {showSandbox ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          <button
            onClick={onReset}
            className="btn-ghost navbar-btn"
            title="Reset board state to initial defaults"
            aria-label="Reset board state"
          >
            <RefreshCw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Collapsible Sandbox Drawer */}
      {showSandbox && (
        <div className="navbar-sandbox-drawer animate-slide-down">
          <div style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#2563eb" />
            <span><strong>Simulator:</strong> Dispatch a simulated 60s PR review ticket to test agent background claims.</span>
          </div>
          <button
            onClick={() => {
              onSimulateOffer();
              setShowSandbox(false);
            }}
            className="btn-primary"
            style={{ fontSize: '12px', padding: '6px 14px', minHeight: '34px' }}
          >
            <Zap size={13} />
            <span>Simulate Incoming PR Offer (+10 pts)</span>
          </button>
        </div>
      )}
    </header>
  );
};
