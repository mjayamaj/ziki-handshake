import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Radio,
  Bot,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
  Pause,
  ShieldCheck,
  Activity,
  Code2,
  Flame,
  Check,
} from 'lucide-react';
import { VoiceEngine } from '../services/voiceEngine';
import { BloggerAgent, type ADKAgentResult } from '../services/bloggerAgent';
import type { AgentInfo, ActionProposal, DispatchOffer } from '../types';
import type { NavTab } from './Sidebar';

interface HumaneCommLinkProps {
  onInstructionReceived: (text: string) => void;
  onVoiceAction: (actionType: 'approve_1042' | 'approve_offer' | 'custom', text: string) => void;
  agents: AgentInfo[];
  proposals: ActionProposal[];
  offers: DispatchOffer[];
  totalPoints: number;
  targetPoints: number;
  onApproveProposal: (proposal: ActionProposal) => void;
  onNavigateTab: (tab: NavTab) => void;
}

interface ChatMessage {
  id: string;
  sender: 'human' | 'blogger';
  text: string;
  timestamp: string;
  adkResult?: ADKAgentResult;
  isAudioPlaying?: boolean;
}

function getFormattedTime(): string {
  try {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Now';
  }
}

export const HumaneCommLink: React.FC<HumaneCommLinkProps> = ({
  onInstructionReceived,
  onVoiceAction,
  agents: _agents,
  proposals,
  offers: _offers,
  totalPoints,
  targetPoints,
  onApproveProposal,
  onNavigateTab,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [typedQuery, setTypedQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAudioMsgId, setActiveAudioMsgId] = useState<string | null>(null);
  const isPlayingAudio = activeAudioMsgId !== null;
  const [showTrace, setShowTrace] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'blogger',
      text: 'Good morning, Commander! I am Blogger, your lead AI copilot. All 3 agents (Blogger, Gojo, Sukuna) are active. Issue #1042 (3D Office draft prefetch) has been verified and is waiting for your 1-tap handshake approval.',
      timestamp: 'Just now',
    },
  ]);

  const timerRef = useRef<any>(null);
  const msgCountRef = useRef(1);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quick Action Command Tiles (reduced to 2 high-priority actions)
  const QUICK_COMMANDS = [
    {
      icon: <Sparkles size={16} className="text-blue-500" />,
      title: 'Issue #1042 Voice Briefing',
      desc: '3D Office layout toast false-alarm analysis',
      query: 'What is Zedu 3D Office & Issue #1042?',
      badge: '12s Audio',
      color: 'blue',
    },
    {
      icon: <Activity size={16} className="text-emerald-500" />,
      title: 'Autonomous Fleet Audit',
      desc: 'Check Blogger, Gojo & Sukuna compliance',
      query: 'Run autonomous diagnostic sweep on all agents',
      badge: 'Zero-Trust',
      color: 'emerald',
    },
  ];

  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setTranscribedText('');

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

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
          console.debug('Speech recognition error:', err);
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
    setIsProcessing(true);

    const timeStr = getFormattedTime();

    msgCountRef.current += 1;
    const humanMsg: ChatMessage = {
      id: `user-${msgCountRef.current}`,
      sender: 'human',
      text: speech,
      timestamp: timeStr,
    };
    setMessages((prev) => [...prev, humanMsg]);

    try {
      // Execute through Google ADK Multi-Agent Deliberative Loop
      const result = await BloggerAgent.processQueryAsync(speech);

      msgCountRef.current += 1;
      const botMsgId = `bot-${msgCountRef.current}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'blogger',
        text: result.spokenText,
        timestamp: timeStr,
        adkResult: result,
      };
      setMessages((prev) => [...prev, botMsg]);

      // Speak the Google ADK Blogger answer aloud
      setActiveAudioMsgId(botMsgId);
      VoiceEngine.speak(result.spokenText, result.speaker, () => {
        setActiveAudioMsgId((curr) => (curr === botMsgId ? null : curr));
      });

      // Execute any direct actions
      if (result.actionType === 'approve_1042') {
        onVoiceAction('approve_1042', speech);
      } else if (result.actionType === 'approve_offer') {
        onVoiceAction('approve_offer', speech);
      } else if (result.actionType === 'add_instruction') {
        onInstructionReceived(result.actionPayload || speech);
      }
    } catch (e) {
      console.error('Error running Blogger query:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleVoicePlayback = (msgId: string, text: string, speaker: string = 'Blogger') => {
    if (activeAudioMsgId === msgId) {
      VoiceEngine.stop();
      setActiveAudioMsgId(null);
    } else {
      VoiceEngine.stop();
      setActiveAudioMsgId(msgId);
      VoiceEngine.speak(text, speaker, () => {
        setActiveAudioMsgId((curr) => (curr === msgId ? null : curr));
      });
    }
  };

  useEffect(() => {
    // Only scroll to bottom when there are multiple messages or processing,
    // avoiding abruptly scrolling the top hero banner out of view on page load
    if (messages.length > 1 || isProcessing) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isProcessing]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      VoiceEngine.stop();
    };
  }, []);

  const pendingProposal = proposals.find((p) => p.issueId === 1042) || proposals[0];
  const percentComplete = Math.min(100, Math.round((totalPoints / targetPoints) * 100));

  return (
    <div className="copilot-mission-hub" role="region" aria-label="Blogger AI Copilot Command Deck">
      {/* 1. Hero Intelligence Header with Ambient Cyber Glow */}
      <div className="copilot-hero-banner">
        <div className="copilot-hero-glow" aria-hidden="true" />
        <div className="copilot-hero-content">
          <div className="copilot-avatar-col">
            <div className={`copilot-orb ${isRecording ? 'recording' : isPlayingAudio ? 'speaking' : 'ready'}`}>
              <Bot size={28} className="copilot-bot-icon" />
              <div className="orb-ring-wave" />
              <div className="orb-ring-pulse" />
            </div>
          </div>

          <div className="copilot-hero-info">
            <div className="copilot-tagline-row">
              <span className="copilot-badge-live">
                <span className="live-pulsar" />
                Fleet Online • 3 Agents
              </span>
            </div>

            <h1 className="copilot-hero-title">
              Blogger Copilot
            </h1>
            <p className="copilot-hero-desc">
              Lead AI copilot supervising Gojo and Sukuna under zero-trust governance.
            </p>
          </div>
        </div>

        {/* 2. Interactive Quick Capability Cards */}
        <div className="copilot-command-grid">
          {QUICK_COMMANDS.map((cmd, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleProcessQuery(cmd.query)}
              className={`command-tile card-${cmd.color}`}
            >
              <div className="tile-top">
                <span className="tile-icon-box">{cmd.icon}</span>
                <span className="tile-badge">{cmd.badge}</span>
              </div>
              <span className="tile-title">{cmd.title}</span>
              <p className="tile-desc">{cmd.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Split View: Left Chat & Audio Console, Right Live Telemetry */}
      <div className="copilot-split-layout">
        {/* Left Column: Conversational Voice Console */}
        <div className="copilot-chat-panel">
          {/* Conversation History Stream */}
          <div className="chat-messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.sender === 'human' ? 'user' : 'blogger'}`}>
                {msg.sender === 'blogger' && (
                  <div className="chat-avatar blogger">
                    <span>BL</span>
                  </div>
                )}

                <div className={`chat-bubble ${msg.sender === 'human' ? 'user-bubble' : 'blogger-bubble'}`}>
                  <div className="bubble-header">
                    <span className="bubble-author">
                      {msg.sender === 'human' ? 'Human Supervisor' : 'Blogger (Lead Architect)'}
                    </span>
                    <span className="bubble-time">{msg.timestamp}</span>
                  </div>

                  <p className="bubble-text">{msg.text}</p>

                  {/* Audio Playback Controller for Blogger */}
                  {msg.sender === 'blogger' && (
                    <div className="audio-voice-bar">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleVoicePlayback(
                            msg.id,
                            msg.text,
                            msg.adkResult?.speaker || 'Blogger'
                          )
                        }
                        className="audio-play-btn"
                        title={
                          activeAudioMsgId === msg.id
                            ? 'Pause voice'
                            : 'Listen to Blogger synthetic voice'
                        }
                        aria-label="Toggle voice playback"
                      >
                        {activeAudioMsgId === msg.id ? <Pause size={14} /> : <Play size={14} />}
                      </button>

                      <div className="audio-waveform-bars">
                        {[...Array(8)].map((_, barIdx) => (
                          <span
                            key={barIdx}
                            className={`audio-bar ${
                              activeAudioMsgId === msg.id ? 'animating' : ''
                            }`}
                          />
                        ))}
                      </div>

                      <span className="audio-meta">
                        {activeAudioMsgId === msg.id
                          ? 'Speaking Google ADK Voice...'
                          : '0:12 • Synthesized Voice'}
                      </span>
                    </div>
                  )}

                  {/* Google ADK Multi-Agent Execution Trace & Details */}
                  {msg.adkResult && (
                    <div className="adk-trace-accordion">
                      <button
                        type="button"
                        onClick={() => setShowTrace((prev) => !prev)}
                        className="trace-toggle-btn"
                      >
                        <div className="flex items-center gap-2">
                          <Code2 size={13} className="text-blue-400" />
                          <span>Google ADK Reasoning Engine ({msg.adkResult.executionTrace.length} Steps)</span>
                        </div>
                        {showTrace ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {showTrace && (
                        <div className="trace-expanded-body animate-slide-down">
                          <div className="trace-steps-list">
                            {msg.adkResult.executionTrace.map((step, sIdx) => (
                              <div key={sIdx} className="trace-step-item">
                                <span className={`step-badge ${step.status}`}>
                                  {step.agentName}
                                </span>
                                <div className="step-content">
                                  <strong className="step-action">{step.action}</strong>
                                  <span className="step-detail">{step.detail}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {msg.adkResult.markdownAnswer && (
                            <div className="trace-markdown">
                              <pre>{msg.adkResult.markdownAnswer}</pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {msg.sender === 'human' && (
                  <div className="chat-avatar human">
                    <span>HL</span>
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="chat-bubble-row blogger">
                <div className="chat-avatar blogger">
                  <span>BL</span>
                </div>
                <div className="chat-bubble blogger-bubble typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-label">Blogger Deliberative Loop Running...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Tactical Bottom Input Console */}
          <div className="copilot-input-console">
            {/* Live Audio Visualizer Banner during push-to-talk */}
            {isRecording && (
              <div className="recording-status-strip animate-slide-down">
                <div className="flex items-center gap-2 text-rose-500 text-xs font-medium">
                  <span className="recording-beacon" />
                  <span>Listening... (0:0{recordingSeconds})</span>
                </div>
                <div className="live-audio-bars">
                  <span className="eq-bar bar-1" />
                  <span className="eq-bar bar-2" />
                  <span className="eq-bar bar-3" />
                  <span className="eq-bar bar-4" />
                  <span className="eq-bar bar-5" />
                </div>
                <span className="transcribe-preview">
                  {transcribedText || 'Speak naturally into your microphone...'}
                </span>
              </div>
            )}

            <div className="input-row-bar">
              {/* Push-to-Talk Tactile Button */}
              <button
                type="button"
                onClick={isRecording ? () => handleProcessQuery(transcribedText || 'Explain Issue #1042') : startRecording}
                className={`tactile-mic-btn ${isRecording ? 'active-pulse' : ''}`}
                title={isRecording ? 'Click to finalize voice note' : 'Click to talk to Blogger'}
                aria-label={isRecording ? 'Stop Recording' : 'Start Recording Voice Note'}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* Text Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (typedQuery.trim()) handleProcessQuery(typedQuery);
                }}
                className="input-form"
              >
                <input
                  type="text"
                  value={typedQuery}
                  onChange={(e) => setTypedQuery(e.target.value)}
                  placeholder="Ask Blogger anything about Ziki, Zedu, or instruct agents..."
                  className="command-input"
                  aria-label="Command input"
                />
                <button
                  type="submit"
                  disabled={!typedQuery.trim() || isProcessing}
                  className="command-send-btn"
                  title="Send command"
                >
                  <Send size={15} />
                  <span>Execute</span>
                </button>
              </form>
            </div>

            <div className="input-shortcut-hints">
              <span className="shortcut-pill">
                <kbd>Enter</kbd> to Send
              </span>
              <span className="shortcut-pill">
                <Radio size={11} className="text-emerald-400" />
                Voice Recognition Active
              </span>
              <span className="shortcut-pill">
                <ShieldCheck size={11} className="text-blue-400" />
                Zero-Trust Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 1-Tap Handshake Spotlight & Sprint Meter */}
        <aside className="copilot-telemetry-panel" aria-label="Live Fleet Handshake & Metrics">
          {/* Spotlight Card: 1-Tap Pending Handshake carried to the top */}
          {pendingProposal ? (
            <div className="telemetry-card spotlight-card">
              <div className="spotlight-header">
                <span className="spotlight-tag">
                  <Flame size={12} className="text-amber-500" />
                  Pending Handshake
                </span>
                <span className="spotlight-points font-mono">+{pendingProposal.pointsReward} pts</span>
              </div>

              <h4 className="spotlight-issue-title">
                #{pendingProposal.issueId}: {pendingProposal.title}
              </h4>

              <p className="spotlight-fix-summary">
                {pendingProposal.plainEnglishSummary?.theFix || pendingProposal.plan}
              </p>

              <div className="spotlight-author-row">
                <span className="spotlight-badge">Author: {pendingProposal.agentName}</span>
                <span className="spotlight-badge">Zero Risk</span>
              </div>

              <div className="spotlight-actions">
                <button
                  type="button"
                  onClick={() => onApproveProposal(pendingProposal)}
                  className="spotlight-approve-btn"
                >
                  <Check size={14} />
                  <span>1-Tap Handshake Approve</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('handshake')}
                  className="spotlight-inspect-btn"
                >
                  Inspect Feed
                </button>
              </div>
            </div>
          ) : (
            <div className="telemetry-card spotlight-card">
              <div className="spotlight-header">
                <span className="spotlight-tag">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  All Handshakes Verified
                </span>
              </div>
              <h4 className="spotlight-issue-title">No Pending Approvals</h4>
              <p className="spotlight-fix-summary">
                All agent proposals have been reviewed and approved. Monitoring feeds for new activity.
              </p>
              <div className="spotlight-actions">
                <button
                  type="button"
                  onClick={() => onNavigateTab('handshake')}
                  className="spotlight-inspect-btn"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  View Verified Ledger
                </button>
              </div>
            </div>
          )}

          {/* Telemetry Card 3: Sprint 14 Points Meter */}
          <div className="telemetry-card sprint-card">
            <div className="sprint-header">
              <div>
                <span className="sprint-sub">Sprint 14 Target</span>
                <h4 className="sprint-title">Team Neo-Mando</h4>
              </div>
              <span className="sprint-pct font-mono text-blue-600 font-semibold">
                {percentComplete}%
              </span>
            </div>

            <div className="sprint-progress-track">
              <div
                className="sprint-progress-fill"
                style={{ width: `${percentComplete}%` }}
              />
            </div>

            <div className="sprint-metrics-row">
              <div className="metric-box">
                <span className="metric-val font-mono">{totalPoints}</span>
                <span className="metric-lbl">Points Credited</span>
              </div>
              <div className="metric-box">
                <span className="metric-val font-mono">{targetPoints}</span>
                <span className="metric-lbl">Target Target</span>
              </div>
              <div className="metric-box">
                <span className="metric-val font-mono text-emerald-400">100%</span>
                <span className="metric-lbl">Integrity Pass</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
