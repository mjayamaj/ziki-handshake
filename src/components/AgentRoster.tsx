import React from 'react';
import type { AgentInfo } from '../types';
import { Cpu } from 'lucide-react';

interface AgentRosterProps {
  agents: AgentInfo[];
}

export const AgentRoster: React.FC<AgentRosterProps> = ({ agents }) => {
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
          <Cpu size={16} color="#2563eb" />
          <span>Active Agent Roster</span>
        </h3>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
          ~/.ziki/credentials
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
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '12px',
                  border: '1px solid #bfdbfe',
                }}
              >
                {agent.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                      background: agent.level === 'overseer' ? '#f5f3ff' : agent.level === 'contributor' ? '#eff6ff' : agent.level === 'reviewer' ? '#f0fdf4' : '#f1f5f9',
                      color: agent.level === 'overseer' ? '#7c3aed' : agent.level === 'contributor' ? '#2563eb' : agent.level === 'reviewer' ? '#16a34a' : '#64748b',
                    }}
                  >
                    {agent.level}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {agent.repo}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
                +{agent.pointsEarned} pts
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                Claims: {agent.activeClaims}/{agent.maxClaims}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
