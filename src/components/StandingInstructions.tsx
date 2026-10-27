import React, { useState } from 'react';
import type { StandingInstruction } from '../types';
import { Sliders, Plus, Check } from 'lucide-react';

interface StandingInstructionsProps {
  instructions: StandingInstruction[];
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
}

export const StandingInstructions: React.FC<StandingInstructionsProps> = ({
  instructions,
  onToggle,
  onAdd,
}) => {
  const [newText, setNewText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAdd(newText.trim());
    setNewText('');
  };

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
      aria-label="Standing Instructions"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={16} color="#2563eb" />
          <span>Standing Instructions</span>
        </h3>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
          Live Safety Guardrails
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {instructions.map((inst) => (
          <div
            key={inst.id}
            onClick={() => onToggle(inst.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: inst.active ? '#eff6ff' : '#f8fafc',
              border: inst.active ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              minHeight: '44px',
            }}
            role="checkbox"
            aria-checked={inst.active}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggle(inst.id);
              }
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '5px',
                border: inst.active ? '1.5px solid #2563eb' : '1.5px solid #cbd5e1',
                background: inst.active ? '#2563eb' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                marginTop: '1px',
                flexShrink: 0,
              }}
            >
              {inst.active && <Check size={12} strokeWidth={3} />}
            </div>
            <div
              style={{
                fontSize: '12.5px',
                color: inst.active ? '#0f172a' : '#64748b',
                fontWeight: inst.active ? 600 : 400,
                lineHeight: 1.45,
              }}
            >
              {inst.text}
            </div>
          </div>
        ))}
      </div>

      {/* Add Instruction Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Instruct your agents in plain English..."
          aria-label="New standing instruction for agents"
          style={{
            flex: '1 1 180px',
            padding: '8px 12px',
            fontSize: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            outline: 'none',
            background: '#f8fafc',
            fontFamily: 'inherit',
            minHeight: '38px',
          }}
          onFocus={(e) => {
            e.target.style.background = '#ffffff';
            e.target.style.borderColor = '#2563eb';
          }}
          onBlur={(e) => {
            e.target.style.background = '#f8fafc';
            e.target.style.borderColor = '#e2e8f0';
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ minHeight: '38px', padding: '6px 14px', fontSize: '12px' }}
        >
          <Plus size={14} />
          <span>Add Rule</span>
        </button>
      </form>
    </div>
  );
};
