import React from 'react';
import type { LedgerEntry } from '../types';
import { CheckCircle2, History, ShieldCheck } from 'lucide-react';

interface AuditLedgerProps {
  entries: LedgerEntry[];
}

export const AuditLedger: React.FC<AuditLedgerProps> = ({ entries }) => {
  return (
    <div className="ledger-deck-card" role="region" aria-label="Reward and Activity Ledger">
      <div className="ledger-card-header">
        <div className="flex items-center gap-2">
          <div className="ledger-icon-box">
            <History size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="ledger-title">Cryptographic Reward &amp; Activity Ledger</h3>
            <span className="ledger-subtitle">Immutable audit trail of human-approved handshakes &amp; credited bounties</span>
          </div>
        </div>

        <span className="ledger-badge-verified">
          <ShieldCheck size={13} className="text-emerald-400" />
          Audit Trail Verified
        </span>
      </div>

      <div className="ledger-entries-list">
        {entries.map((entry) => (
          <div key={entry.id} className="ledger-entry-row">
            <div className="entry-left">
              <span className="entry-status-icon">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </span>
              <div className="entry-details">
                <div className="entry-action-line">
                  <strong className="entry-action-text">{entry.action}</strong>
                  <span className="entry-agent-badge">{entry.agentName}</span>
                </div>
                <div className="entry-meta-line">
                  <span className="entry-id font-mono">TX-{entry.id}</span>
                  <span className="bullet-sep">•</span>
                  <span className="entry-time">{entry.timestamp}</span>
                  {entry.issueId && (
                    <>
                      <span className="bullet-sep">•</span>
                      <span className="entry-issue-link">Issue #{entry.issueId}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="entry-right">
              <span className="entry-points-pill font-mono">
                +{entry.points} PTS
              </span>
              <span className="entry-status-pill credited">
                {entry.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
