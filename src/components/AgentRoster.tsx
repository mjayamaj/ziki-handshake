import React, { useState } from 'react';
import type { AgentInfo } from '../types';
import {
  Bot,
  CircleCheck,
  Clock3,
  Search,
  Sparkles,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Coins,
  Shield,
  Layers,
} from 'lucide-react';

interface AgentRosterProps {
  agents: AgentInfo[];
  onSelectAgent?: (agent: AgentInfo) => void;
  onGoToHandshake?: () => void;
  pendingProposalsCount: number;
}

export const AgentRoster: React.FC<AgentRosterProps> = ({
  agents,
  onSelectAgent,
  onGoToHandshake,
  pendingProposalsCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'idle' | 'paused'>('all');
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);

  // Dynamic calculations
  const activeCount = agents.filter((a) => a.status === 'active').length;
  const idleCount = agents.filter((a) => a.status === 'idle').length;
  const pausedCount = agents.filter((a) => a.status === 'paused').length;
  const totalCompleted = agents.reduce((acc, a) => acc + a.tasksCompleted, 0);
  const totalPoints = agents.reduce((acc, a) => acc + a.pointsEarned, 0);

  // Filtered agents
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || agent.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="agent-roster-view">
      {/* 1. Header Section */}
      <div className="roster-header-row">
        <div>
          <div className="roster-badge-group">
            <span className="roster-subtag">MISSION CONTROL</span>
            <span className="roster-bullet" aria-hidden="true">•</span>
            <span className="roster-sample-badge">
              <Shield size={11} />
              ZERO-TRUST MERGE
            </span>
            <span className="roster-bullet" aria-hidden="true">•</span>
            <span className="roster-sprint-badge">
              <Sparkles size={11} />
              SPRINT 14
            </span>
          </div>

          <h1 className="roster-title">Autonomous AI Fleet</h1>
          <p className="roster-desc">
            Your dedicated AI engineering partners for Zedu Studio. They reproduce bugs, write safe patches, and run independent diagnostics—requiring your 1-tap handshake before anything touches code.
          </p>
        </div>

        <div className="roster-activity-status">
          <span className="roster-activity-icon">
            <Activity size={16} />
          </span>
          <div className="roster-activity-text">
            <strong>Zedu Production Fleet</strong>
            <span>Firewall Active &amp; Guarded</span>
          </div>
        </div>
      </div>

      {/* 1.5 Human Friendly Handshake Banner */}
      {pendingProposalsCount > 0 && onGoToHandshake && (
        <div className="human-friendly-banner animate-slide-down">
          <div className="banner-icon-col">
            <ShieldCheck size={22} className="text-blue-600" />
          </div>
          <div className="banner-text-col">
            <div className="banner-headline">
              {pendingProposalsCount} Agent Proposals Awaiting Your Handshake Approval
            </div>
            <p className="banner-sub">
              Your agents have isolated bugs and prepared sandboxed fixes. They are paused in the queue and will not execute until you review and sign off.
            </p>
          </div>
          <button
            onClick={onGoToHandshake}
            className="banner-action-btn"
          >
            <span>Review Handshake Queue</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* 2. Top Summary Stat Cards */}
      <section className="roster-stats-grid-4" aria-label="Squad task summary">
        {/* Stat 1: Active Squad */}
        <div className="roster-stat-card">
          <div className="roster-stat-content">
            <div>
              <p className="roster-stat-label">Active Agents</p>
              <p className="roster-stat-value">{activeCount} / {agents.length}</p>
            </div>
            <span className="roster-stat-icon-wrap icon-blue">
              <Bot size={20} />
            </span>
          </div>
          <p className="roster-stat-footnote">Investigating issues &amp; drafting solutions</p>
        </div>

        {/* Stat 2: Handshakes Approved */}
        <div className="roster-stat-card">
          <div className="roster-stat-content">
            <div>
              <p className="roster-stat-label">Handshakes Approved</p>
              <p className="roster-stat-value">{totalCompleted}</p>
            </div>
            <span className="roster-stat-icon-wrap icon-emerald">
              <CircleCheck size={20} />
            </span>
          </div>
          <p className="roster-stat-footnote">Verified patches merged with 0 regressions</p>
        </div>

        {/* Stat 3: Pending Review */}
        <div className="roster-stat-card">
          <div className="roster-stat-content">
            <div>
              <p className="roster-stat-label">Pending Handshakes</p>
              <p className="roster-stat-value">{pendingProposalsCount}</p>
            </div>
            <span className="roster-stat-icon-wrap icon-amber">
              <Clock3 size={20} />
            </span>
          </div>
          <p className="roster-stat-footnote">Awaiting your 1-tap human confirmation</p>
        </div>

        {/* Stat 4: Sprint Velocity */}
        <div className="roster-stat-card">
          <div className="roster-stat-content">
            <div>
              <p className="roster-stat-label">Squad Points</p>
              <p className="roster-stat-value">{totalPoints} pts</p>
            </div>
            <span className="roster-stat-icon-wrap icon-purple">
              <Coins size={20} />
            </span>
          </div>
          <p className="roster-stat-footnote">Bounties earned toward Sprint 14 target</p>
        </div>
      </section>

      {/* 3. AI Fleet Directory Toolbar */}
      <section className="roster-section" aria-labelledby="agents-heading">
        <div className="roster-toolbar-header">
          <div className="roster-section-title-wrap">
            <h2 id="agents-heading" className="roster-section-title">Fleet Roster &amp; Specializations</h2>
            <span className="roster-connected-pill">{agents.length} teammates online</span>
          </div>

          <label className="roster-search-box">
            <Search size={14} className="roster-search-icon" />
            <span className="sr-only">Filter squad</span>
            <input
              type="search"
              aria-label="Filter squad"
              placeholder="Search agent, role, or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="roster-search-input"
            />
          </label>
        </div>

        {/* Filter Pills */}
        <div className="roster-filter-row" role="group" aria-label="Filter agents by status">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`roster-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          >
            All Squad
            <span className="filter-count-badge">{agents.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`roster-filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
          >
            Active
            <span className="filter-count-badge">{activeCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('idle')}
            className={`roster-filter-btn ${statusFilter === 'idle' ? 'active' : ''}`}
          >
            Standby
            <span className="filter-count-badge">{idleCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('paused')}
            className={`roster-filter-btn ${statusFilter === 'paused' ? 'active' : ''}`}
          >
            Off-Duty
            <span className="filter-count-badge">{pausedCount}</span>
          </button>
        </div>

        {/* Agent Cards Grid */}
        <div className="roster-cards-grid">
          {filteredAgents.map((agent) => {
            const isPopoverOpen = activePopoverId === agent.id;

            return (
              <article key={agent.id} className="agent-card">
                {/* Top Row: Avatar with Popover + Info */}
                <div className="agent-card-header">
                  {/* Interactive Avatar with Gaps Popover */}
                  <div
                    className="agent-avatar-container"
                    onMouseEnter={() => setActivePopoverId(agent.id)}
                    onMouseLeave={() => setActivePopoverId(null)}
                  >
                    <button
                      type="button"
                      className="agent-avatar-btn"
                      style={{
                        background: agent.colorTheme.bg,
                        color: agent.colorTheme.text,
                        borderColor: agent.colorTheme.ring,
                      }}
                      onClick={() => setActivePopoverId(isPopoverOpen ? null : agent.id)}
                      aria-label={`View ${agent.name}'s diagnostics`}
                    >
                      <span>{agent.initials}</span>
                      <span
                        className="agent-avatar-status-dot"
                        style={{ background: agent.colorTheme.dot }}
                      />
                    </button>

                    {/* Agent Diagnostics Popover */}
                    {isPopoverOpen && (
                      <div className="agent-gap-popover animate-slide-down" role="tooltip">
                        <div className="gap-popover-header">
                          <div>
                            <p className="gap-popover-tag">Squad Diagnostics</p>
                            <p className="gap-popover-sub">{agent.name} vs Team Baseline</p>
                          </div>
                          <span className="gap-improve-pill">
                            Verified
                          </span>
                        </div>

                        <div className="gap-rows-list">
                          {agent.performanceGaps.map((gap, idx) => (
                            <div key={idx} className="gap-row">
                              <div className="gap-row-metric">
                                <span className="gap-metric-name">{gap.metric}</span>
                                <span className="gap-diff-badge">{gap.diff}</span>
                              </div>
                              <p className="gap-stat-compare">
                                <strong>{gap.agentStat}</strong>{' '}
                                <span className="text-slate-400">vs</span>{' '}
                                {gap.teamMedian} squad median
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="gap-popover-footer">
                          <Layers size={12} />
                          <span>Stack: {agent.repo}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Name, Status, Role, Model */}
                  <div className="agent-meta-block">
                    <div className="agent-name-status-row">
                      <h3 className="agent-name">{agent.name}</h3>
                      <span
                        className={`agent-status-badge status-${agent.status}`}
                      >
                        <span className="status-dot-tiny" />
                        {agent.status === 'active'
                          ? 'Active'
                          : agent.status === 'idle'
                          ? 'Standby'
                          : 'Off-Duty'}
                      </span>
                    </div>

                    <p className="agent-role-title">{agent.role}</p>

                    <div className="agent-model-pill">
                      {agent.model}
                    </div>
                  </div>
                </div>

                {/* Plain English Mission */}
                <p className="agent-description">
                  {agent.description}
                </p>

                {/* 2 Task Count Blocks */}
                <div className="agent-task-blocks-grid">
                  <div className="task-block">
                    <div className="task-block-label">
                      <CircleCheck size={13} className="text-emerald-600" />
                      <span>Approved Fixes</span>
                    </div>
                    <div className="task-block-value-row">
                      <span className="task-block-num">{agent.tasksCompleted}</span>
                      <span className="task-block-unit">tasks</span>
                    </div>
                  </div>

                  <div className="task-block">
                    <div className="task-block-label">
                      <Clock3 size={13} className="text-amber-600" />
                      <span>Pending Handshakes</span>
                    </div>
                    <div className="task-block-value-row">
                      <span className="task-block-num">{agent.tasksPending}</span>
                      <span className="task-block-unit">queue</span>
                    </div>
                  </div>
                </div>

                {/* Quality & Reliability Progress */}
                <div className="agent-progress-section">
                  <div className="progress-label-row">
                    <span className="progress-name">Reliability Score</span>
                    <span className="progress-percent">{agent.resolutionRate}%</span>
                  </div>
                  <div
                    className="agent-progress-track"
                    role="progressbar"
                    aria-label={`${agent.name} reliability score`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={agent.resolutionRate}
                  >
                    <span
                      className="agent-progress-fill"
                      style={{ width: `${agent.resolutionRate}%` }}
                    />
                  </div>
                </div>

                {/* Card Footer: Last active & Weekly trend */}
                <div className="agent-card-footer">
                  <span className="agent-last-active">
                    {agent.lastActive}
                  </span>

                  <span
                    className={`agent-trend-badge ${
                      agent.trendPositive ? 'trend-positive' : 'trend-negative'
                    }`}
                  >
                    {agent.trendPositive ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}
                    {agent.trendText}
                  </span>
                </div>

                {/* Action button */}
                {onSelectAgent && (
                  <button
                    onClick={() => onSelectAgent(agent)}
                    className="agent-inspect-btn"
                  >
                    <span>Inspect Teammate &amp; Work</span>
                    <ChevronRight size={13} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Safety Protocol Footnote */}
      <div className="roster-footnote">
        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
        <span>
          <strong>Zero-Trust Protocol:</strong> Agents operate on sandboxed branches and are strictly blocked from pushing to main without your direct handshake confirmation.
        </span>
      </div>
    </div>
  );
};
