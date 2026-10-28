import React from 'react';
import {
  Bot,
  Zap,
  Radio,
  History,
  Sparkles,
  ChevronDown,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export type NavTab = 'roster' | 'handshake' | 'offers' | 'ledger' | 'copilot' | 'rules';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingProposalsCount: number;
  offersCount: number;
  agentsCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingProposalsCount,
  offersCount,
  agentsCount = 3,
  isOpenMobile,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`agents-sidebar ${isOpenMobile ? 'mobile-open' : ''}`} aria-label="Main sidebar">
        {/* Brand */}
        <div className="sidebar-brand-row">
          <div className="sidebar-brand-mark">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="7" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path
                d="M7 10L14 7L21 10L14 13L7 10Z"
                fill="#3b82f6"
              />
              <path
                d="M7 14L14 17L21 14"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 18L14 21L21 18"
                stroke="#93c5fd"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="sidebar-brand-title">ziki</span>
          <span className="sidebar-brand-pill">HANDSHAKE</span>
        </div>

        {/* Workspace Card: Zedu Engineering Hub */}
        <div className="sidebar-workspace-card">
          <span className="sidebar-workspace-avatar">Z</span>
          <div className="sidebar-workspace-info">
            <span className="sidebar-workspace-name">Zedu Engineering Hub</span>
            <span className="sidebar-workspace-sub">Team Neo-Mando • Sprint 14</span>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        {/* Navigation Sections */}
        <nav className="sidebar-nav" aria-label="Workspace views">
          <div className="sidebar-section-title">Human-Agent Hub</div>

          <button
            type="button"
            onClick={() => {
              onTabChange('roster');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-nav-btn ${activeTab === 'roster' ? 'active' : ''}`}
          >
            <Bot size={17} />
            <span className="truncate">Agent Squad</span>
            <span className="sidebar-pill-badge">{agentsCount}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTabChange('handshake');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-nav-btn ${activeTab === 'handshake' ? 'active' : ''}`}
          >
            <Zap size={17} />
            <span className="truncate">Handshake Feed</span>
            {pendingProposalsCount > 0 && (
              <span className="sidebar-badge-alert">{pendingProposalsCount}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onTabChange('offers');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-nav-btn ${activeTab === 'offers' ? 'active' : ''}`}
          >
            <Radio size={17} />
            <span className="truncate">60s Offer Radar</span>
            {offersCount > 0 && (
              <span className="sidebar-badge-emerald">{offersCount}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onTabChange('ledger');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-nav-btn ${activeTab === 'ledger' ? 'active' : ''}`}
          >
            <History size={17} />
            <span className="truncate">Verified Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTabChange('copilot');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-nav-btn ${activeTab === 'copilot' ? 'active' : ''}`}
          >
            <Sparkles size={17} />
            <span className="truncate">Blogger Copilot</span>
            <span className="sidebar-pill-ai">Voice</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTabChange('rules');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`sidebar-nav-btn ${activeTab === 'rules' ? 'active' : ''}`}
          >
            <ShieldCheck size={17} />
            <span className="truncate">Safety Firewall</span>
            <span className="sidebar-tag-verified">4 Active</span>
          </button>

          <div className="sidebar-section-title" style={{ marginTop: '22px' }}>
            Mission Protocol
          </div>

          <div className="sidebar-muted-row">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Zero-Trust Approval</span>
          </div>
          <div className="sidebar-muted-row">
            <Users size={16} />
            <span>Squad Firewall</span>
          </div>
        </nav>

        {/* Bottom Docs Callout & Profile */}
        <div className="sidebar-footer">
          <div className="sidebar-docs-box">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck size={15} className="text-emerald-400" />
              <span>Handshake Protocol v2</span>
            </div>
            <p className="sidebar-docs-desc">
              Agents research and code autonomously, but require human confirmation before every commit.
            </p>
            <span className="sidebar-docs-link">
              <span>Read Safety Specs</span>
              <ArrowRight size={12} />
            </span>
          </div>

          <div className="sidebar-user-row">
            <span className="sidebar-user-avatar">HL</span>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Human Supervisor</span>
              <span className="sidebar-user-sub">Lead Approver • Zedu Team</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
