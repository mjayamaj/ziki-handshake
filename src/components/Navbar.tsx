import React from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Menu,
  Activity,
} from 'lucide-react';

interface NavbarProps {
  totalPoints: number;
  targetPoints: number;
  onSimulateOffer: () => void;
  onReset: () => void;
  activeTabName: string;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalPoints,
  targetPoints,
  onSimulateOffer,
  onReset,
  activeTabName,
  onToggleMobileMenu,
}) => {
  const percent = Math.min(100, Math.round((totalPoints / targetPoints) * 100));

  return (
    <header className="agents-topbar" role="banner">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="topbar-left">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="mobile-menu-trigger"
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>
        )}

        <div className="topbar-brand-icon-small">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="7" fill="#1e293b" />
            <path d="M7 10L14 7L21 10L14 13L7 10Z" fill="#3b82f6" />
            <path d="M7 14L14 17L21 14" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <nav className="topbar-breadcrumb" aria-label="Breadcrumb">
          <span className="breadcrumb-root">Zedu Hub</span>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span className="breadcrumb-current">{activeTabName}</span>
        </nav>
      </div>

      {/* Center: Live Sprint Velocity / Points Meter */}
      <div className="topbar-center">
        <div className="topbar-points-pill" title="Sprint points earned through human-approved agent proposals">
          <span className="points-label">Sprint 14:</span>
          <span className="points-current">{totalPoints}</span>
          <span className="points-target">/ {targetPoints} pts</span>
          <div className="points-track">
            <div className="points-bar" style={{ width: `${percent}%` }} />
          </div>
          <span className="points-pct">{percent}%</span>
        </div>
      </div>

      {/* Right: Security & Demo Actions */}
      <div className="topbar-right">
        {/* Human Safe Handshake Badge */}
        <div
          className="topbar-safe-badge"
          title="Zero-Trust Guarantee: Autonomous code execution requires human confirmation"
        >
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Handshake Enforced</span>
        </div>

        {/* Demo Simulator Trigger */}
        <button
          type="button"
          onClick={onSimulateOffer}
          className="topbar-action-btn btn-sim"
          title="Simulate an incoming 60s fast validation offer from an agent"
        >
          <Zap size={13} />
          <span className="hidden-mobile">Simulate Offer</span>
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="topbar-action-btn"
          title="Reset board state back to defaults"
        >
          <RefreshCw size={13} />
          <span className="hidden-mobile">Reset</span>
        </button>

        {/* Live Status indicator */}
        <div className="topbar-live-indicator hidden-mobile" title="Autonomous monitoring active">
          <Activity size={13} className="text-emerald-600" />
          <span>Live Sentinel</span>
        </div>
      </div>
    </header>
  );
};
