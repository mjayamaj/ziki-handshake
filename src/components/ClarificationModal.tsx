import React, { useState } from 'react';
import type { ActionProposal } from '../types';
import { X, Send, Bot, CheckCircle2 } from 'lucide-react';

interface ClarificationModalProps {
  proposal: ActionProposal;
  onClose: () => void;
  onApprove: (proposal: ActionProposal) => void;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  proposal,
  onClose,
  onApprove,
}) => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{ sender: 'human' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: `Hello! I analyzed Issue #${proposal.issueId} ("${proposal.title}"). How can I clarify my plan for you before you approve?`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const QUICK_QUESTIONS = [
    'How did you verify this locally?',
    'Will this affect any tests or screens?',
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
      if (q.toLowerCase().includes('reproduction') || q.toLowerCase().includes('locally') || q.toLowerCase().includes('verify')) {
        reply = `I verified this directly on the 3D office page. On initial load, the client requested /api/v1/office/rooms/reception/layout/draft without checking admin status, triggering a false-alarm red banner "only administrators can edit shared furniture". Adding a role check (isAdmin === true) before dispatching eliminates the false error cleanly.`;
      } else if (q.toLowerCase().includes('affect') || q.toLowerCase().includes('test')) {
        reply = `Zero breaking changes. Non-admin members continue loading the canonical layout normally. All existing test suites pass with 0 regressions.`;
      } else {
        reply = `The fix requires only 4 lines of code in zedu-fe/src/features/office/reception/layout.ts, well below the ~400 line PR limit. Ready to branch and open a PR upon your approval!`;
      }

      setConversation([...newConvo, { sender: 'agent' as const, text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="clarification-modal-title"
    >
      <div
        className="modal-dialog animate-slide-down"
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
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                border: '1px solid #bfdbfe',
              }}
            >
              <Bot size={18} />
            </div>
            <div>
              <h3 id="clarification-modal-title" style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                Ask {proposal.agentName}
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b' }}>
                Clarifying Issue #{proposal.issueId} • {proposal.title.slice(0, 40)}...
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              color: '#64748b',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              minHeight: '40px',
              cursor: 'pointer',
            }}
            aria-label="Close modal"
          >
            <X size={20} />
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
            WebkitOverflowScrolling: 'touch',
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
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bot size={13} color="#2563eb" />
              <span>{proposal.agentName} is reviewing...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div style={{ padding: '8px 16px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '6px', overflowX: 'auto', flexShrink: 0, WebkitOverflowScrolling: 'touch' }}>
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
                padding: '5px 12px',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Footer: Input & Instant 1-Tap Handshake */}
        <div
          className="modal-footer"
          style={{
            padding: '14px 20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#ffffff',
            flexShrink: 0,
          }}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${proposal.agentName} a question...`}
            aria-label={`Ask ${proposal.agentName} a question`}
            style={{
              flex: 1,
              padding: '9px 12px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              outline: 'none',
              fontFamily: 'inherit',
              minHeight: '40px',
            }}
          />

          <button
            onClick={() => handleSend()}
            className="btn-secondary"
            style={{ minHeight: '40px', padding: '8px 16px' }}
          >
            <Send size={14} />
            <span>Ask</span>
          </button>

          <button
            onClick={() => {
              onApprove(proposal);
              onClose();
            }}
            className="btn-primary"
            style={{ minHeight: '40px', padding: '8px 18px', whiteSpace: 'nowrap' }}
          >
            <CheckCircle2 size={15} />
            <span>Approve Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
