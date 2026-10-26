import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Radio, Volume2, Bot } from 'lucide-react';
import { VoiceEngine } from '../services/voiceEngine';
import { ZikiKnowledgeEngine } from '../services/zikiKnowledge';

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
  const [agentVoiceReply, setAgentVoiceReply] = useState<string | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<string>('Blogger (Overseer)');
  const timerRef = useRef<any>(null);

  const SUGGESTED_VOICE_MEMOS = [
    '“How do points work on Ziki?”',
    '“What is the difference between an idea and an issue?”',
    '“Why can’t Six Eyes review Gojo’s work?”',
    '“Gojo, approve your fix on the furniture toast #1042”',
    '“Six Eyes, review PR #408 and submit good-to-merge signoff”',
  ];

  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setTranscribedText('');
    setAgentVoiceReply(null);

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Check if webkitSpeechRecognition is available
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
        recog.onerror = () => {
          // Handled gracefully
        };
        recog.start();
      } catch (e) {
        console.warn('SpeechRecognition init error:', e);
      }
    }
  };

  const handleProcessQuery = (textToProcess: string) => {
    clearInterval(timerRef.current);
    setIsRecording(false);

    const speech = textToProcess.trim();
    if (!speech) return;

    setTranscribedText(speech);
    setTypedQuery('');

    // Query our domain knowledge engine (Blogger Overseer)
    const result = ZikiKnowledgeEngine.answerQuery(speech);

    setActiveSpeaker(result.speaker);
    setAgentVoiceReply(result.spokenText);
    VoiceEngine.speak(result.spokenText, result.speaker);

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
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #bfdbfe',
        borderRadius: '14px',
        padding: '16px 20px',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #bfdbfe',
            }}
          >
            <Bot size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                Blogger Overseer & Voice Comm-Link
              </h3>
              <span
                style={{
                  background: '#f0fdf4',
                  color: '#16a34a',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid #bbf7d0',
                }}
              >
                Overseer Connected
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748b' }}>
              Oversees Gojo & Six Eyes. Ask Blogger any question about Ziki or speak actions aloud.
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            color: '#2563eb',
            background: '#eff6ff',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontWeight: 600,
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Radio size={12} />
          Push-to-Talk & QA
        </span>
      </div>

      {/* Main Recording & Response Strip */}
      <div
        style={{
          background: isRecording ? '#eff6ff' : '#f8fafc',
          border: isRecording ? '1.5px dashed #2563eb' : '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          transition: 'all 0.2s ease',
          marginBottom: '10px',
        }}
      >
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
          title={isRecording ? 'Tap to finish voice note' : 'Tap to speak to Blogger or your agents'}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Center: Live Audio Status / Answer */}
        <div style={{ flex: 1 }}>
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
                <span>Listening to your voice note... (0:0{recordingSeconds})</span>
              </div>
              <p style={{ fontSize: '12px', color: '#2563eb', fontStyle: 'italic', marginTop: '2px' }}>
                {transcribedText || 'Ask Blogger any question about Ziki or command Gojo/Six Eyes...'}
              </p>
            </div>
          ) : agentVoiceReply ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                <Volume2 size={14} color="#2563eb" />
                <span style={{ color: '#2563eb' }}>{activeSpeaker} replied:</span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#1e293b', marginTop: '2px', lineHeight: 1.45 }}>
                "{agentVoiceReply}"
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                Tap the mic or type to ask Blogger anything about Ziki
              </div>
              <p style={{ fontSize: '11px', color: '#64748b' }}>
                Blogger oversees Gojo, explains points and rules, and answers questions in spoken voice.
              </p>
            </div>
          )}
        </div>

        {isRecording && (
          <button
            onClick={() => handleProcessQuery(transcribedText || 'How do points work on Ziki?')}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Send size={13} />
            <span>Send Memo</span>
          </button>
        )}
      </div>

      {/* Alternative: Type Query to Blogger */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (typedQuery.trim()) handleProcessQuery(typedQuery);
        }}
        style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}
      >
        <input
          type="text"
          value={typedQuery}
          onChange={(e) => setTypedQuery(e.target.value)}
          placeholder="Ask Blogger any question (e.g. 'How do points work on Ziki?')..."
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '12px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
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
            padding: '7px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Send size={13} />
          <span>Ask Blogger</span>
        </button>
      </form>

      {/* Quick Voice & Question Prompt Shortcuts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
          Ask Blogger:
        </span>
        {SUGGESTED_VOICE_MEMOS.map((memo, i) => (
          <button
            key={i}
            onClick={() => handleProcessQuery(memo.replace(/[“”]/g, ''))}
            style={{
              fontSize: '11px',
              color: '#2563eb',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '4px 10px',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {memo}
          </button>
        ))}
      </div>
    </div>
  );
};
