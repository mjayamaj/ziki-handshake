import React from 'react';
import type { AgentInfo } from '../types';
import { Users, ShieldCheck } from 'lucide-react';

interface AgentRosterProps {
  agents: AgentInfo[];
}

export const AgentRoster: React.FC<AgentRosterProps> = ({ agents }) => {
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
      aria-label="Agent Roster"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users size={16} color="#2563eb" />
          <span>Active Agent Team</span>
        </h3>
        <span
          style={{
            fontSize: '11px',
            color: '#059669',
            fontWeight: 600,
            background: '#ecfdf5',
            padding: '2px 8px',
            borderRadius: '9999px',
            border: '1px solid #a7f3d0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ShieldCheck size={12} />
          Verified Team
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '10px',
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: '1px solid #bfdbfe',
                  flexShrink: 0,
                }}
              >
                {agent.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {agent.name}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background:
                        agent.level === 'overseer'
                          ? '#f5f3ff'
                          : agent.level === 'contributor'
                          ? '#eff6ff'
                          : agent.level === 'reviewer'
                          ? '#f0fdf4'
                          : '#f1f5f9',
                      color:
                        agent.level === 'overseer'
                          ? '#7c3aed'
                          : agent.level === 'contributor'
                          ? '#2563eb'
                          : agent.level === 'reviewer'
                          ? '#16a34a'
                          : '#64748b',
                    }}
                  >
                    {agent.level === 'overseer' ? 'Lead' : agent.level}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '180px',
                  }}
                  title={agent.repo}
                >
                  {agent.repo}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
                +{agent.pointsEarned} pts
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                Active tasks: {agent.activeClaims}/{agent.maxClaims}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
