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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>Action Handshake Feed</span>
            <span
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                fontSize: '12px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid #bfdbfe',
              }}
            >
              {proposals.length} awaiting your approval
            </span>
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Your agents investigate issues and propose solutions. You decide with 1 tap.
          </p>
        </div>
      </div>

      {/* Proposals List or Empty State */}
      {proposals.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            border: '1px dashed #cbd5e1',
            borderRadius: '14px',
            padding: '36px 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
            }}
          >
            <Check size={22} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
            All Clear — No Pending Proposals
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '360px', margin: '0 auto' }}>
            All agent proposals have been reviewed. Agents are actively scanning and running heartbeats.
          </p>
        </div>
      ) : (
        proposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onApprove={() => onApprove(proposal)}
            onReject={() => onReject(proposal.id)}
            onAskAgent={() => onAskAgent(proposal)}
          />
        ))
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
        return { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', label: 'Critical Priority' };
      case 'high':
        return { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa', label: 'High Priority' };
      case 'medium':
        return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', label: 'Medium Priority' };
      default:
        return { bg: '#f8fafc', text: '#475569', border: '#e2e8f0', label: 'Low Priority' };
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'bid':
        return { label: 'Bidding Proposal', color: '#2563eb', bg: '#eff6ff' };
      case 'validate':
        return { label: 'Issue Validation', color: '#0284c7', bg: '#f0f9ff' };
      default:
        return { label: 'PR Review', color: '#059669', bg: '#ecfdf5' };
    }
  };

  const severityStyle = getSeverityBadge(proposal.severity);
  const categoryStyle = getCategoryTitle(proposal.category);

  return (
    <div className="proposal-card">
      {/* Top Meta Line */}
      <div className="proposal-meta-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Agent Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              padding: '3px 10px',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0f172a',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#2563eb',
              }}
            />
            <span>{proposal.agentName}</span>
          </div>

          {/* Action category */}
          <span
            style={{
              background: categoryStyle.bg,
              color: categoryStyle.color,
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
            }}
          >
            {categoryStyle.label}
          </span>

          <span style={{ fontSize: '12px', color: '#64748b' }}>
            #{proposal.issueId} • {proposal.repo}
          </span>
        </div>

        {/* Right badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {proposal.independentCheckPassed && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#059669',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '2px 8px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Verified by independent firewall rule to prevent collusion"
            >
              <ShieldCheck size={12} />
              Peer Verified Safe
            </span>
          )}

          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: severityStyle.text,
              background: severityStyle.bg,
              border: `1px solid ${severityStyle.border}`,
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            {severityStyle.label}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '10px', lineHeight: 1.4 }}>
        {proposal.title}
      </h3>

      {/* Humane Voice Note Briefing */}
      {proposal.voiceMemoText && (
        <div style={{ marginBottom: '12px' }}>
          <VoiceNotePlayer
            agentName={proposal.agentName}
            voiceText={proposal.voiceMemoText}
            durationSeconds={proposal.voiceDurationSeconds || 12}
          />
        </div>
      )}

      {/* Plan Details & Snippet */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px 14px',
          marginBottom: '14px',
        }}
      >
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>
          Agent Solution & Plan:
        </div>
        <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, marginBottom: '8px' }}>
          {proposal.plan}
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#2563eb',
            background: '#ffffff',
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <FileCode size={13} style={{ flexShrink: 0 }} />
          <code style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{proposal.fileSnippet}</code>
        </div>
      </div>

      {/* Bottom Bar: Stats & 1-Tap Buttons */}
      <div className="proposal-footer">
        {/* Economics & Time */}
        <div className="proposal-stats">
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
            <Coins size={15} color="#2563eb" />
            <span>+{proposal.pointsReward} pts reward</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
            <Clock size={14} />
            <span>ETA ~{proposal.etaMinutes} mins</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            {proposal.timestamp}
          </div>
        </div>

        {/* 1-Tap Decisions */}
        <div className="proposal-actions">
          <button
            onClick={onReject}
            className="btn-ghost"
            style={{
              minHeight: '36px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#64748b',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
            aria-label={`Decline proposal on #${proposal.issueId}`}
          >
            Decline
          </button>

          <button
            onClick={onAskAgent}
            className="btn-secondary"
            style={{
              minHeight: '36px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #bfdbfe',
              background: '#eff6ff',
              color: '#2563eb',
              fontWeight: 600,
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
            aria-label={`Ask ${proposal.agentName} for clarification`}
          >
            <MessageSquare size={14} />
            <span>Ask {proposal.agentName}</span>
          </button>

          <button
            onClick={onApprove}
            className="btn-primary"
            style={{
              minHeight: '36px',
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#10b981',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
            }}
            aria-label={`Approve and execute plan on #${proposal.issueId}`}
          >
            <CheckCircle2 size={15} />
            <span>Approve & Execute</span>
          </button>
        </div>
      </div>
    </div>
  );
};
