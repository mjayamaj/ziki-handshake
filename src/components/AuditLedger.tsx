import React from 'react';
import type { LedgerEntry } from '../types';
import { CheckCircle2, History } from 'lucide-react';

interface AuditLedgerProps {
  entries: LedgerEntry[];
}

export const AuditLedger: React.FC<AuditLedgerProps> = ({ entries }) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
      }}
      role="region"
      aria-label="Reward and Activity Ledger"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <History size={16} color="#2563eb" />
          <span>Reward & Activity Ledger</span>
        </h3>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
          Points Earned
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              background: '#f8fafc',
              fontSize: '12px',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
              <span style={{ color: '#10b981', flexShrink: 0 }}>
                <CheckCircle2 size={15} />
              </span>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontWeight: 600, color: '#0f172a', wordBreak: 'break-word' }}>
                  {entry.action}
                </span>
                <span style={{ color: '#64748b', marginLeft: '6px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {entry.timestamp}
                </span>
              </div>
            </div>

            <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '12px', flexShrink: 0 }}>
              +{entry.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
