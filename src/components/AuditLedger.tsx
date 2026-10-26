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
        borderRadius: '12px',
        padding: '18px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <History size={16} color="#2563eb" />
          <span>Reward Ledger (Append-Only)</span>
        </h3>
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          Ziki Point Credits
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
              padding: '8px 10px',
              borderRadius: '6px',
              background: '#f8fafc',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>
                <CheckCircle2 size={14} />
              </span>
              <div>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                  {entry.action}
                </span>
                <span style={{ color: '#94a3b8', marginLeft: '6px', fontSize: '11px' }}>
                  {entry.timestamp}
                </span>
              </div>
            </div>

            <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '12px' }}>
              +{entry.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
