import React, { useState } from 'react';
import type { ActionProposal } from '../types';
import { X, Send, Bot, CheckCircle2 } from 'lucide-react';

interface ClarificationModalProps {
  proposal: ActionProposal | null;
  onClose: () => void;
  onApprove: (proposal: ActionProposal) => void;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  proposal,
  onClose,
  onApprove,
}) => {
  if (!proposal) return null;

  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{ sender: 'human' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: `Hello! I analyzed Issue #${proposal.issueId} ("${proposal.title}"). How can I clarify my plan for you before you approve?`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const QUICK_QUESTIONS = [
    'How did you verify the reproduction locally?',
    'Will this affect any other screens or tests?',
    'Can we shorten the ETA or reduce file changes?',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || question;
    if (!q.trim()) return;

    const newConvo = [...conversation, { sender: 'human' as const, text: q }];
    setConversation(newConvo);
    setQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (q.toLowerCase().includes('reproduction') || q.toLowerCase().includes('locally')) {
        reply = `I verified this directly on https://office.groups.zedu.chat/neo-mando/office. On initial load of The Tower 3D office, the client prefetches /api/v1/office/rooms/reception/layout/draft without verifying admin role, throwing 403 Forbidden and popping up the alarming red error banner "only administrators can edit shared furniture". Adding a role check (isAdmin === true) before dispatching the request eliminates the false alert.`;
      } else if (q.toLowerCase().includes('affect') || q.toLowerCase().includes('test')) {
        reply = `Zero breaking changes. View-only members continue loading the canonical published layout normally. Verified against all existing Jest and Cypress test suites in zedu-fe with 0 regressions.`;
      } else {
        reply = `The fix requires only 4 lines of code in zedu-fe/src/features/office/reception/layout.ts, well below the ~400 line PR limit. Ready to branch as fix/1042-furniture-toast and open PR to zedu-team-neo-mando/zedu-fe upon your approval.`;
      }

      setConversation([...newConvo, { sender: 'agent' as const, text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
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
                border: '1px solid #bfdbfe',
              }}
            >
              <Bot size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                Ask {proposal.agentName}
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b' }}>
                Clarifying Issue #{proposal.issueId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              color: '#94a3b8',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat / Clarification Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#ffffff',
          }}
        >
          {conversation.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'human' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: 1.45,
                  background: msg.sender === 'human' ? '#2563eb' : '#f1f5f9',
                  color: msg.sender === 'human' ? '#ffffff' : '#0f172a',
                  borderBottomRightRadius: msg.sender === 'human' ? '4px' : '12px',
                  borderBottomLeftRadius: msg.sender === 'agent' ? '4px' : '12px',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bot size={13} color="#2563eb" />
              <span>{proposal.agentName} is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div style={{ padding: '8px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              style={{
                fontSize: '11px',
                color: '#2563eb',
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                borderRadius: '9999px',
                padding: '4px 10px',
                whiteSpace: 'nowrap',
                fontWeight: 500,
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Footer: Input & Instant 1-Tap Handshake */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
          }}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${proposal.agentName} a question...`}
            style={{
              flex: 1,
              padding: '9px 12px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />

          <button
            onClick={() => handleSend()}
            style={{
              background: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              padding: '9px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Send size={14} />
            <span>Ask</span>
          </button>

          <button
            onClick={() => {
              onApprove(proposal);
              onClose();
            }}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            <CheckCircle2 size={15} />
            <span>Approve Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
