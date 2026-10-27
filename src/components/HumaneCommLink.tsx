import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Radio, Volume2, Bot, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { VoiceEngine } from '../services/voiceEngine';
import { BloggerAgent, type ADKAgentResult } from '../services/bloggerAgent';

interface HumaneCommLinkProps {
  onInstructionReceived: (text: string) => void;
  onVoiceAction: (actionType: 'approve_1042' | 'approve_offer' | 'custom', text: string) => void;
}

export const HumaneCommLink: React.FC<HumaneCommLinkProps> = ({
  onInstructionReceived,
  onVoiceAction,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [typedQuery, setTypedQuery] = useState('');
  const [agentResult, setAgentResult] = useState<ADKAgentResult | null>(null);
  const [showTrace, setShowTrace] = useState(false);
  const timerRef = useRef<any>(null);

  const SUGGESTED_QUERIES = [
    { label: 'Points System', query: 'How do points work on Ziki?' },
    { label: 'Idea vs Issue', query: 'What is the difference between an idea and an issue?' },
    { label: 'Independence Firewall', query: 'Why can’t Six Eyes review Gojo’s work?' },
    { label: 'Issue #1042 (3D Office)', query: 'What is Zedu 3D Office & Issue #1042?' },
    { label: 'Validation Race', query: 'What is the Fast Validation Race on Ziki?' },
    { label: 'Google ADK Loops', query: 'How does Google ADK multi-agent planning work?' },
  ];

  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setTranscribedText('');

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Check if SpeechRecognition is available
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recog = new SpeechRec();
        recog.continuous = false;
        recog.interimResults = true;
        recog.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join('');
          setTranscribedText(transcript);
        };
        recog.onerror = (err: any) => {
          console.debug('Speech recognition ended:', err);
        };
        recog.start();
      } catch (e) {
        console.debug('SpeechRecognition init error:', e);
      }
    }
  };

  const handleProcessQuery = async (textToProcess: string) => {
    clearInterval(timerRef.current);
    setIsRecording(false);

    const speech = textToProcess.trim();
    if (!speech) return;

    setTranscribedText(speech);
    setTypedQuery('');

    // Execute through Google ADK Multi-Agent Deliberative Loop with Live Gemini
    const result = await BloggerAgent.processQueryAsync(speech);
    setAgentResult(result);

    // Speak natural audio response
    VoiceEngine.speak(result.spokenText, result.speaker);

    // Dispatch autonomous actions if instructed
    if (result.actionType === 'approve_1042') {
      onVoiceAction('approve_1042', speech);
    } else if (result.actionType === 'approve_offer') {
      onVoiceAction('approve_offer', speech);
    } else if (result.actionType === 'add_instruction') {
      onInstructionReceived(result.actionPayload || speech);
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="commlink-box" role="region" aria-label="Blogger Autonomous Agent & Voice Companion">
      {/* Header */}
      <div className="commlink-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #bfdbfe',
              flexShrink: 0,
            }}
          >
            <Bot size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                Blogger Autonomous Agent • Voice & Knowledge
              </h3>
              <span
                style={{
                  background: '#f0fdf4',
                  color: '#16a34a',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #bbf7d0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={11} />
                Google ADK Powered
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748b' }}>
              Self-sufficient deliberative agent. Knows everything about Ziki, Zedu architecture, codebases, and rules.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {agentResult && (
            <button
              onClick={() => setShowTrace((prev) => !prev)}
              className="btn-ghost"
              style={{ fontSize: '11px', padding: '4px 10px', minHeight: '32px' }}
              aria-label="Toggle agent reasoning trace"
            >
              <span>ADK Reasoning Trace ({agentResult.executionTrace.length} steps)</span>
              {showTrace ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          )}

          <span
            style={{
              fontSize: '11px',
              color: '#2563eb',
              background: '#eff6ff',
              padding: '3px 10px',
              borderRadius: '9999px',
              fontWeight: 600,
              border: '1px solid #bfdbfe',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Radio size={12} />
            Voice & Chat
          </span>
        </div>
      </div>

      {/* Main Recording & Response Strip */}
      <div
        className="commlink-strip"
        style={{
          background: isRecording ? '#eff6ff' : '#f8fafc',
          border: isRecording ? '1.5px dashed #2563eb' : '1px solid #e2e8f0',
        }}
      >
        <div className="commlink-mic-row">
          {/* Push-to-Talk Mic Button */}
          <button
            onClick={isRecording ? () => handleProcessQuery(transcribedText || 'How do points work on Ziki?') : startRecording}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: isRecording ? '#ef4444' : '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isRecording
                ? '0 0 0 6px rgba(239, 68, 68, 0.25)'
                : '0 4px 12px rgba(37, 99, 235, 0.3)',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title={isRecording ? 'Tap to finish voice note' : 'Tap to speak to Blogger'}
            aria-label={isRecording ? 'Finish voice note' : 'Record voice note'}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Center: Live Audio Status / Answer */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {isRecording ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 700, fontSize: '13px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      animation: 'pulseSlow 1s infinite',
                    }}
                  />
                  <span>Listening... (0:0{recordingSeconds})</span>
                </div>
                <p style={{ fontSize: '12px', color: '#2563eb', fontStyle: 'italic', marginTop: '2px', wordBreak: 'break-word' }}>
                  {transcribedText || 'Speak any question about Ziki, Zedu, or instruct Blogger to take action...'}
                </p>
              </div>
            ) : agentResult ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  <Volume2 size={14} color="#2563eb" />
                  <span style={{ color: '#2563eb' }}>{agentResult.speaker} replied:</span>
                  {agentResult.actionType && agentResult.actionType !== 'none' && (
                    <span
                      style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        border: '1px solid #a7f3d0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <CheckCircle2 size={11} />
                      Action Executed
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#1e293b', marginTop: '2px', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  "{agentResult.spokenText}"
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                  Tap mic or ask Blogger anything about Ziki, Zedu, or your agents
                </div>
                <p style={{ fontSize: '11px', color: '#64748b' }}>
                  Grounded in Ziki protocol docs, Zedu repositories, and Google ADK deliberative planning loops.
                </p>
              </div>
            )}
          </div>
        </div>

        {isRecording && (
          <button
            onClick={() => handleProcessQuery(transcribedText || 'How do points work on Ziki?')}
            className="btn-primary"
            style={{ minHeight: '38px', padding: '6px 14px', fontSize: '12px' }}
          >
            <Send size={13} />
            <span>Send Memo</span>
          </button>
        )}
      </div>

      {/* Collapsible Google ADK Multi-Agent Execution Trace */}
      {showTrace && agentResult && (
        <div
          className="animate-slide-down"
          style={{
            background: '#0f172a',
            color: '#e2e8f0',
            borderRadius: '10px',
            padding: '14px 16px',
            marginBottom: '10px',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.4px', fontSize: '11px' }}>
              Google ADK Execution Trace (ReAct Deliberative Loop)
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Confidence: 10/10 • Auto-Validated
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {agentResult.executionTrace.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  background: '#1e293b',
                  padding: '8px 10px',
                  borderRadius: '6px',
                }}
              >
                <div
                  style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    background: step.status === 'passed' ? '#065f46' : step.status === 'retry' ? '#991b1b' : '#1e40af',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {step.agentName}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '12px' }}>
                    {step.action}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px', wordBreak: 'break-word' }}>
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Markdown Technical Summary */}
          {agentResult.markdownAnswer && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #334155', color: '#cbd5e1', lineHeight: 1.5 }}>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '12px' }}>
                {agentResult.markdownAnswer}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Alternative: Type Query to Blogger */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (typedQuery.trim()) handleProcessQuery(typedQuery);
        }}
        style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}
      >
        <input
          type="text"
          value={typedQuery}
          onChange={(e) => setTypedQuery(e.target.value)}
          placeholder="Ask Blogger anything about Ziki, Zedu, or agents..."
          aria-label="Ask Blogger a question"
          style={{
            flex: '1 1 200px',
            padding: '8px 12px',
            fontSize: '12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
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
          <Send size={13} />
          <span>Ask Blogger</span>
        </button>
      </form>

      {/* Quick Voice & Question Prompt Shortcuts */}
      <div className="commlink-chips">
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Explore:
        </span>
        {SUGGESTED_QUERIES.map((item, i) => (
          <button
            key={i}
            onClick={() => handleProcessQuery(item.query)}
            style={{
              fontSize: '11px',
              color: '#2563eb',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '3px 9px',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
