import React, { useState } from 'react';
import type { ActiveClaim } from '../types';
import { Activity, GitPullRequest, GitBranch, Heart } from 'lucide-react';

interface ClaimSentinelProps {
  claims: ActiveClaim[];
  onManualHeartbeat: (claimId: string) => void;
}

export const ClaimSentinel: React.FC<ClaimSentinelProps> = ({ claims, onManualHeartbeat }) => {
  const [autoHeartbeat, setAutoHeartbeat] = useState(true);

  if (claims.length === 0) return null;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Heart size={16} color="#ef4444" />
          <span>Heartbeat Sentinel</span>
        </h3>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 600,
            color: autoHeartbeat ? '#10b981' : '#64748b',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={autoHeartbeat}
            onChange={(e) => setAutoHeartbeat(e.target.checked)}
            style={{ accentColor: '#2563eb' }}
          />
          <span>Auto-Safe Keepalive</span>
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {claims.map((claim) => (
          <div
            key={claim.id}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>
                Claim #{claim.issueId}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={12} />
                <span>Next ping in {claim.heartbeatMinutesLeft}m</span>
              </span>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              {claim.title}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <GitBranch size={12} />
                <code>{claim.branchName}</code>
              </span>
              <span>Claimed by {claim.agentName}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {claim.prUrl ? (
                <a
                  href={claim.prUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '11px',
                    color: '#2563eb',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <GitPullRequest size={12} />
                  <span>View PR #408</span>
                </a>
              ) : (
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Branch in progress</span>
              )}

              <button
                onClick={() => onManualHeartbeat(claim.id)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#2563eb',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                Send Ping Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
