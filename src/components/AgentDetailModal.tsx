import React from 'react';
import type { AgentInfo, ActionProposal } from '../types';
import {
  X,
  CircleCheck,
  Clock3,
  ShieldCheck,
  Zap,
  Play,
  Pause,
  MessageSquare,
} from 'lucide-react';

interface AgentDetailModalProps {
  agent: AgentInfo;
  onClose: () => void;
  onToggleStatus: (agentId: string) => void;
  pendingProposals: ActionProposal[];
  onApproveProposal: (proposal: ActionProposal) => void;
  onAskAgent: (proposal: ActionProposal) => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  onClose,
  onToggleStatus,
  pendingProposals,
  onApproveProposal,
  onAskAgent,
}) => {
  const agentProposals = pendingProposals.filter(
    (p) => p.agentId === agent.id || p.agentName.toLowerCase() === agent.name.toLowerCase()
  );

  return (
    <div className="modal-overlay animate-fadeIn" role="dialog" aria-modal="true">
      <div className="modal-dialog-large animate-slideDown">
        {/* Header */}
        <div className="modal-header-row">
          <div className="flex items-center gap-3">
            <div
              className="agent-avatar-modal"
              style={{
                background: agent.colorTheme.bg,
                color: agent.colorTheme.text,
                borderColor: agent.colorTheme.ring,
              }}
            >
              <span>{agent.initials}</span>
              <span
                className="avatar-dot-modal"
                style={{ background: agent.colorTheme.dot }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="modal-agent-name">{agent.name}</h2>
                <span className={`agent-status-badge status-${agent.status}`}>
                  <span className="status-dot-tiny" />
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </span>
                <span className="agent-model-pill">{agent.model}</span>
              </div>
              <p className="modal-agent-role">{agent.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-scroll">
          {/* Plain English Mission */}
          <div className="modal-section-card">
            <h4 className="modal-section-title">Agent Mission & Responsibilities</h4>
            <p className="modal-section-text">{agent.description}</p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="task-block">
              <div className="task-block-label">
                <CircleCheck size={14} className="text-emerald-600" />
                <span>Completed</span>
              </div>
              <div className="task-block-value-row">
                <span className="task-block-num">{agent.tasksCompleted}</span>
                <span className="task-block-unit">tasks</span>
              </div>
            </div>

            <div className="task-block">
              <div className="task-block-label">
                <Clock3 size={14} className="text-amber-600" />
                <span>Pending Queue</span>
              </div>
              <div className="task-block-value-row">
                <span className="task-block-num">{agent.tasksPending}</span>
                <span className="task-block-unit">tasks</span>
              </div>
            </div>

            <div className="task-block">
              <div className="task-block-label">
                <Zap size={14} className="text-blue-600" />
                <span>Resolution Rate</span>
              </div>
              <div className="task-block-value-row">
                <span className="task-block-num">{agent.resolutionRate}%</span>
              </div>
            </div>
          </div>

          {/* Performance Gaps Table */}
          <div className="modal-section-card mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="modal-section-title">Performance Gaps vs Team Median</h4>
              <span className="gap-improve-pill">Compared over last 30 days</span>
            </div>

            <div className="flex flex-col gap-2">
              {agent.performanceGaps.map((gap, i) => (
                <div key={i} className="gap-row-modal">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">{gap.metric}</span>
                    <span className="gap-diff-badge">{gap.diff}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Current score: <strong>{gap.agentStat}</strong> vs team median {gap.teamMedian}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Handshake Proposals by this agent */}
          <div className="modal-section-card">
            <div className="flex items-center justify-between mb-3">
              <h4 className="modal-section-title">
                Handshake Proposals Awaiting Your Approval ({agentProposals.length})
              </h4>
            </div>

            {agentProposals.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No active proposals pending your approval for {agent.name}.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {agentProposals.map((prop) => (
                  <div key={prop.id} className="proposal-mini-card">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-bold text-slate-900">
                        #{prop.issueId}: {prop.title}
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        +{prop.pointsReward} pts
                      </span>
                    </div>

                    {prop.plainEnglishSummary && (
                      <div className="my-2 p-2 bg-slate-50 rounded text-[11px] text-slate-600">
                        <div><strong>Problem:</strong> {prop.plainEnglishSummary.theProblem}</div>
                        <div><strong>Solution:</strong> {prop.plainEnglishSummary.theFix}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button
                        onClick={() => onAskAgent(prop)}
                        className="btn-ghost-sm"
                      >
                        <MessageSquare size={12} />
                        <span>Ask Agent</span>
                      </button>
                      <button
                        onClick={() => {
                          onApproveProposal(prop);
                          onClose();
                        }}
                        className="btn-primary-sm"
                      >
                        <CircleCheck size={12} />
                        <span>Approve Handshake</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer-row">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Agent operates under strict sandbox firewall.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStatus(agent.id)}
              className={agent.status === 'active' ? 'btn-pause-agent' : 'btn-activate-agent'}
            >
              {agent.status === 'active' ? (
                <>
                  <Pause size={13} />
                  <span>Pause Agent</span>
                </>
              ) : (
                <>
                  <Play size={13} />
                  <span>Resume Agent</span>
                </>
              )}
            </button>

            <button onClick={onClose} className="btn-done">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
