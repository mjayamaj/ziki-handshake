import React from 'react';
import type { ActionProposal } from '../types';
import {
  CheckCircle2,
  MessageSquare,
  Clock,
  Coins,
  FileCode,
  Check,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { VoiceNotePlayer } from './VoiceNotePlayer';

interface ActionDeckProps {
  proposals: ActionProposal[];
  onApprove: (proposal: ActionProposal) => void;
  onReject: (proposalId: string) => void;
  onAskAgent: (proposal: ActionProposal) => void;
}

export const ActionDeck: React.FC<ActionDeckProps> = ({
  proposals,
  onApprove,
  onReject,
  onAskAgent,
}) => {
  return (
    <div className="action-deck-container">
      {/* Feed Header */}
      <div className="action-deck-header">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="action-deck-title">
              Handshake Approval Feed
            </h2>
            <span className="deck-badge-pending">
              {proposals.length} awaiting your decision
            </span>
          </div>
          <p className="action-deck-subtitle">
            AI agents research problems and prepare minimal, safe solutions. They require your handshake approval before making changes.
          </p>
        </div>
      </div>

      {/* Proposals List or Empty State */}
      {proposals.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon-circle">
            <Check size={24} />
          </div>
          <h3 className="empty-state-title">
            All Clear — No Pending Approvals
          </h3>
          <p className="empty-state-desc">
            All agent proposals have been reviewed. Agents are currently monitoring the issue queues and will notify you when new work is ready for review.
          </p>
        </div>
      ) : (
        <div className="proposals-list">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onApprove={() => onApprove(proposal)}
              onReject={() => onReject(proposal.id)}
              onAskAgent={() => onAskAgent(proposal)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProposalCard: React.FC<{
  proposal: ActionProposal;
  onApprove: () => void;
  onReject: () => void;
  onAskAgent: () => void;
}> = ({ proposal, onApprove, onReject, onAskAgent }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.35)', label: 'Critical' };
      case 'high':
        return { bg: 'rgba(249, 115, 22, 0.15)', text: '#fb923c', border: 'rgba(249, 115, 22, 0.35)', label: 'High Priority' };
      case 'medium':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.35)', label: 'Medium Priority' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.35)', label: 'Low Priority' };
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'bid':
        return { label: 'Code Fix Bid', color: '#60a5fa', bg: 'rgba(37, 99, 235, 0.2)' };
      case 'validate':
        return { label: 'Bug Validation', color: '#38bdf8', bg: 'rgba(2, 132, 199, 0.2)' };
      default:
        return { label: 'PR Review', color: '#34d399', bg: 'rgba(5, 150, 105, 0.2)' };
    }
  };

  const severityStyle = getSeverityBadge(proposal.severity);
  const categoryStyle = getCategoryTitle(proposal.category);

  return (
    <div className="proposal-card">
      {/* Top Meta Header */}
      <div className="proposal-meta-top">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Agent Badge */}
          <div className="proposal-agent-tag">
            <span className="agent-tag-dot" />
            <span className="font-semibold">{proposal.agentName}</span>
          </div>

          {/* Action category */}
          <span
            className="proposal-category-pill"
            style={{ background: categoryStyle.bg, color: categoryStyle.color }}
          >
            {categoryStyle.label}
          </span>

          <span className="text-xs text-slate-500 font-medium">
            Issue #{proposal.issueId} • {proposal.repo}
          </span>
        </div>

        {/* Priority & Peer Check */}
        <div className="flex items-center gap-2 flex-wrap">
          {proposal.independentCheckPassed && (
            <span
              className="peer-verified-tag"
              title="Verified by independent agent firewall to ensure security and prevent collusion"
            >
              <ShieldCheck size={12} />
              <span>Safety Verified</span>
            </span>
          )}

          <span
            className="severity-pill"
            style={{
              color: severityStyle.text,
              background: severityStyle.bg,
              borderColor: severityStyle.border,
            }}
          >
            {severityStyle.label}
          </span>
        </div>
      </div>

      {/* Main Title */}
      <h3 className="proposal-headline">
        {proposal.title}
      </h3>

      {/* Plain English Summary Box */}
      {proposal.plainEnglishSummary && (
        <div className="human-explanation-box">
          <div className="explanation-item">
            <div className="explanation-label text-rose-700">
              <AlertCircle size={13} />
              <span>What's Broken:</span>
            </div>
            <p className="explanation-text">{proposal.plainEnglishSummary.theProblem}</p>
          </div>

          <div className="explanation-item">
            <div className="explanation-label text-blue-700">
              <Sparkles size={13} />
              <span>Agent's Proposed Fix:</span>
            </div>
            <p className="explanation-text">{proposal.plainEnglishSummary.theFix}</p>
          </div>

          <div className="explanation-item">
            <div className="explanation-label text-emerald-700">
              <ShieldCheck size={13} />
              <span>Safety & Risk Assessment:</span>
            </div>
            <p className="explanation-text">{proposal.plainEnglishSummary.safetyReason}</p>
          </div>
        </div>
      )}

      {/* Voice Note Briefing */}
      {proposal.voiceMemoText && (
        <div className="my-3">
          <VoiceNotePlayer
            agentName={proposal.agentName}
            voiceText={proposal.voiceMemoText}
            durationSeconds={proposal.voiceDurationSeconds || 12}
          />
        </div>
      )}

      {/* Technical Plan & Snippet */}
      <div className="proposal-code-box">
        <div className="code-box-header">
          <span>Technical Plan & File Target</span>
        </div>
        <p className="code-plan-text">{proposal.plan}</p>
        <div className="code-snippet-row">
          <FileCode size={13} className="text-blue-600 shrink-0" />
          <code>{proposal.fileSnippet}</code>
        </div>
      </div>

      {/* Footer: Points, ETA, and 1-Tap Buttons */}
      <div className="proposal-footer">
        <div className="proposal-stats">
          <div className="stat-points">
            <Coins size={15} className="text-blue-600" />
            <span>+{proposal.pointsReward} pts reward</span>
          </div>
          <div className="stat-eta">
            <Clock size={14} className="text-slate-400" />
            <span>ETA ~{proposal.etaMinutes} mins</span>
          </div>
          <span className="text-xs text-slate-400 font-normal">
            {proposal.timestamp}
          </span>
        </div>

        {/* Action Decision Buttons */}
        <div className="proposal-actions">
          <button
            type="button"
            onClick={onReject}
            className="btn-decline"
            aria-label={`Decline proposal #${proposal.issueId}`}
          >
            Decline
          </button>

          <button
            type="button"
            onClick={onAskAgent}
            className="btn-ask"
            aria-label={`Ask ${proposal.agentName} a question`}
          >
            <MessageSquare size={14} />
            <span>Ask {proposal.agentName}</span>
          </button>

          <button
            type="button"
            onClick={onApprove}
            className="btn-approve"
            aria-label={`Approve proposal #${proposal.issueId}`}
          >
            <CheckCircle2 size={15} />
            <span>Approve Handshake</span>
          </button>
        </div>
      </div>
    </div>
  );
};
