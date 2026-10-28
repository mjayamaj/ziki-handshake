import React, { useState } from 'react';
import type { StandingInstruction } from '../types';
import { Sliders, Plus, Check, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="firewall-deck-card" role="region" aria-label="Standing Instructions">
      <div className="firewall-card-header">
        <div className="flex items-center gap-2">
          <div className="firewall-icon-box">
            <Sliders size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="firewall-title">Standing Guardrails &amp; Safety Filters</h3>
            <span className="firewall-subtitle">Live enforcement policies for all autonomous agents</span>
          </div>
        </div>
        <span className="firewall-active-pill">
          <ShieldCheck size={13} className="text-emerald-400" />
          {instructions.filter((i) => i.active).length} Active Policies
        </span>
      </div>

      <div className="instructions-list">
        {instructions.map((inst) => (
          <div
            key={inst.id}
            onClick={() => onToggle(inst.id)}
            className={`instruction-row ${inst.active ? 'active' : 'inactive'}`}
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
            <div className={`instruction-checkbox ${inst.active ? 'checked' : ''}`}>
              {inst.active && <Check size={12} strokeWidth={3} />}
            </div>

            <div className="instruction-content">
              <p className="instruction-text">{inst.text}</p>
              <div className="instruction-meta">
                <span className={`policy-tag ${inst.category}`}>{inst.category.toUpperCase()}</span>
                <span className="policy-status">
                  {inst.active ? '● Enforced' : '○ Disabled'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="new-instruction-form">
        <div className="input-with-icon">
          <Sparkles size={14} className="input-sparkle" />
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Instruct agents in plain English (e.g., 'Never touch production auth tokens without 2-factor approval')..."
            className="instruction-input"
            aria-label="New standing instruction for agents"
          />
        </div>
        <button
          type="submit"
          disabled={!newText.trim()}
          className="instruction-add-btn"
        >
          <Plus size={14} />
          <span>Add Rule</span>
        </button>
      </form>
    </div>
  );
};
