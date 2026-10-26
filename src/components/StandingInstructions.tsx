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
        borderRadius: '12px',
        padding: '18px',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={16} color="#2563eb" />
          <span>Standing Instructions</span>
        </h3>
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          Real-time Agent Guardrails
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
              padding: '8px 10px',
              borderRadius: '8px',
              background: inst.active ? '#eff6ff' : '#f8fafc',
              border: inst.active ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                border: inst.active ? '1.5px solid #2563eb' : '1.5px solid #cbd5e1',
                background: inst.active ? '#2563eb' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                marginTop: '2px',
                flexShrink: 0,
              }}
            >
              {inst.active && <Check size={11} strokeWidth={3} />}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: inst.active ? '#0f172a' : '#64748b',
                fontWeight: inst.active ? 600 : 400,
                lineHeight: 1.4,
              }}
            >
              {inst.text}
            </div>
          </div>
        ))}
      </div>

      {/* Add Instruction Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Instruct agents in plain English..."
          style={{
            flex: 1,
            padding: '7px 10px',
            fontSize: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            outline: 'none',
            background: '#f8fafc',
            fontFamily: 'inherit',
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
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '7px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
