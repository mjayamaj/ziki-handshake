import { useState } from 'react';
import './App.css';
import { Sidebar, type NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AgentRoster } from './components/AgentRoster';
import { ActionDeck } from './components/ActionDeck';
import { OfferRadar } from './components/OfferRadar';
import { AuditLedger } from './components/AuditLedger';
import { ClarificationModal } from './components/ClarificationModal';
import { AgentDetailModal } from './components/AgentDetailModal';
import { HumaneCommLink } from './components/HumaneCommLink';
import { StandingInstructions } from './components/StandingInstructions';
import { VoiceEngine } from './services/voiceEngine';

import {
  INITIAL_AGENTS,
  INITIAL_OFFERS,
  INITIAL_PROPOSALS,
  INITIAL_LEDGER,
  INITIAL_INSTRUCTIONS,
} from './data/mockZiki';

import type {
  DispatchOffer,
  ActionProposal,
  LedgerEntry,
  AgentInfo,
  StandingInstruction,
} from './types';

export function App() {
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [offers, setOffers] = useState<DispatchOffer[]>(INITIAL_OFFERS);
  const [proposals, setProposals] = useState<ActionProposal[]>(INITIAL_PROPOSALS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [instructions, setInstructions] = useState<StandingInstruction[]>(INITIAL_INSTRUCTIONS);
  const [totalPoints, setTotalPoints] = useState<number>(425);
  const targetPoints = 500;

  const [activeTab, setActiveTab] = useState<NavTab>('copilot');
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);
  const [clarifyingProposal, setClarifyingProposal] = useState<ActionProposal | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Handshake 1: Approve Proposal
  const handleApproveProposal = (proposal: ActionProposal) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposal.id));
    setTotalPoints((prev) => prev + proposal.pointsReward);

    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === proposal.agentId || agent.name.toLowerCase() === proposal.agentName.toLowerCase()) {
          return {
            ...agent,
            tasksCompleted: agent.tasksCompleted + 1,
            tasksPending: Math.max(0, agent.tasksPending - 1),
            pointsEarned: agent.pointsEarned + proposal.pointsReward,
            lastActive: 'Just now',
          };
        }
        return agent;
      })
    );

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: LedgerEntry = {
      id: `tx-${Date.now()}`,
      timestamp: timeStr,
      agentName: proposal.agentName,
      action: `Handshake approved on #${proposal.issueId} (${proposal.title})`,
      issueId: proposal.issueId,
      points: proposal.pointsReward,
      status: 'credited',
    };
    setLedger((prev) => [newEntry, ...prev]);

    showToast(`Approved ${proposal.agentName}'s plan on #${proposal.issueId}! +${proposal.pointsReward} pts credited.`);
  };

  // Handshake 2: Reject Proposal
  const handleRejectProposal = (id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    showToast('Proposal declined. Agent released back to scanning queue.');
  };

  // Handshake 3: Accept 60s Offer
  const handleAcceptOffer = (offer: DispatchOffer) => {
    setOffers((prev) => prev.filter((o) => o.id !== offer.id));
    setTotalPoints((prev) => prev + offer.points);

    setAgents((prev) =>
      prev.map((a) =>
        a.id === 'gojo'
          ? {
              ...a,
              pointsEarned: a.pointsEarned + offer.points,
              tasksCompleted: a.tasksCompleted + 1,
            }
          : a
      )
    );

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: LedgerEntry = {
      id: `tx-${Date.now()}`,
      timestamp: timeStr,
      agentName: 'Gojo',
      action: `Fast PR Review sign-off on Issue #${offer.issueId}`,
      issueId: offer.issueId,
      points: offer.points,
      status: 'credited',
    };
    setLedger((prev) => [newEntry, ...prev]);

    showToast(`Claim accepted within 60s window! +${offer.points} points credited.`);
  };

  const handleDeclineOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
    showToast('Offer declined. Released back to community pool.');
  };

  // Toggle Agent Active / Paused Status
  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          const newStatus = a.status === 'active' ? 'paused' : 'active';
          showToast(`${a.name} is now ${newStatus === 'active' ? 'Active' : 'Off-Duty'}.`);
          return {
            ...a,
            status: newStatus,
            colorTheme: {
              ...a.colorTheme,
              dot: newStatus === 'active' ? '#10b981' : '#94a3b8',
            },
          };
        }
        return a;
      })
    );

    if (selectedAgent && selectedAgent.id === agentId) {
      setSelectedAgent((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === 'active' ? 'paused' : 'active',
              colorTheme: {
                ...prev.colorTheme,
                dot: prev.status === 'active' ? '#94a3b8' : '#10b981',
              },
            }
          : null
      );
    }
  };

  // Toggle Standing Instruction
  const handleToggleInstruction = (id: string) => {
    setInstructions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, active: !inst.active } : inst))
    );
  };

  const handleAddInstruction = (text: string) => {
    const newInst: StandingInstruction = {
      id: `inst-${Date.now()}`,
      text,
      category: 'rule',
      active: true,
    };
    setInstructions((prev) => [...prev, newInst]);
    showToast(`Firewall rule registered: "${text}"`);
  };

  // Simulate an incoming dispatch offer
  const handleSimulateOffer = () => {
    const randomId = Math.floor(1100 + Math.random() * 50);
    const newOffer: DispatchOffer = {
      id: `offer-${Date.now()}`,
      issueId: randomId,
      title: `Fix unhandled error in pkg/centrifugo WebSocket upgrade handshake`,
      repo: 'zedu-team-neo-mando/zedu-be',
      type: 'pr_review',
      points: 10,
      secondsRemaining: 60,
      writeAccessRequired: false,
      pullRequestUrl: `https://github.com/zedu-team-neo-mando/zedu-be/pull/${randomId - 600}`,
      notes: 'Six Eyes spotted an open PR review offer. Zero write access needed.',
      friendlyExplanation: 'A teammate opened a pull request for the WebSocket upgrade handshake. Safe review opportunity with zero write access.',
    };

    setOffers((prev) => [newOffer, ...prev]);
    setActiveTab('offers');
    showToast(`Incoming 60s Dispatch Offer on #${randomId}!`);
    VoiceEngine.speak(
      `Attention supervisor: a new sixty-second dispatch offer arrived for issue ${randomId}. Claim it before the timer expires!`,
      'Blogger'
    );
  };

  // Reset to initial demo defaults
  const handleReset = () => {
    setAgents(INITIAL_AGENTS);
    setOffers(INITIAL_OFFERS);
    setProposals(INITIAL_PROPOSALS);
    setLedger(INITIAL_LEDGER);
    setInstructions(INITIAL_INSTRUCTIONS);
    setTotalPoints(425);
    setActiveTab('copilot');
    setSelectedAgent(null);
    setClarifyingProposal(null);
    showToast('Reset Ziki Handshake state to defaults.');
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'roster':
        return 'AI Fleet';
      case 'handshake':
        return 'Handshake Feed';
      case 'offers':
        return '60s Offer Radar';
      case 'ledger':
        return 'Verified Ledger';
      case 'copilot':
        return 'Blogger Copilot';
      case 'rules':
        return 'Safety Firewall';
      default:
        return 'AI Fleet';
    }
  };

  return (
    <div className="agents-app">
      {/* 1. Sleek Dark Sidebar with Ziki Handshake identity */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        pendingProposalsCount={proposals.length}
        offersCount={offers.length}
        agentsCount={agents.length}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Column */}
      <div className="agents-main-column">
        {/* Top Header Bar */}
        <Navbar
          totalPoints={totalPoints}
          targetPoints={targetPoints}
          onSimulateOffer={handleSimulateOffer}
          onReset={handleReset}
          activeTabName={getActiveTabTitle()}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Toast Notification */}
        {notification && (
          <div
            className="animate-slide-down"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              maxWidth: '420px',
              background: '#0f172a',
              color: '#ffffff',
              padding: '12px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.35)',
              zIndex: 70,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            role="status"
            aria-live="polite"
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#3b82f6',
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1 }}>{notification}</span>
          </div>
        )}

        {/* Main View Area */}
        <main className="agents-content-container">
          {/* TAB 1: AGENT ROSTER */}
          {activeTab === 'roster' && (
            <AgentRoster
              agents={agents}
              onSelectAgent={(agent) => setSelectedAgent(agent)}
              onGoToHandshake={() => setActiveTab('handshake')}
              pendingProposalsCount={proposals.length}
            />
          )}

          {/* TAB 2: HANDSHAKE FEED (Human Friendly Approvals) */}
          {activeTab === 'handshake' && (
            <div>
              {offers.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <OfferRadar
                    offers={offers}
                    onAccept={handleAcceptOffer}
                    onDecline={handleDeclineOffer}
                  />
                </div>
              )}

              <ActionDeck
                proposals={proposals}
                onApprove={handleApproveProposal}
                onReject={handleRejectProposal}
                onAskAgent={(p) => setClarifyingProposal(p)}
              />
            </div>
          )}

          {/* TAB 3: 60s OFFER RADAR */}
          {activeTab === 'offers' && (
            <div style={{ maxWidth: '840px', margin: '0 auto' }}>
              <div style={{ marginBottom: '18px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                  Live 60-Second Dispatch Offers
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Fast race offers spotted by your agents. Review PRs with zero risk to earn instant team points.
                </p>
              </div>

              {offers.length === 0 ? (
                <div className="empty-state-card">
                  <h3 className="empty-state-title">
                    No Active 60s Dispatch Offers
                  </h3>
                  <p className="empty-state-desc">
                    Agents are actively scanning the Ziki repository queues. You can simulate an incoming offer right now.
                  </p>
                  <button
                    onClick={handleSimulateOffer}
                    className="banner-action-btn"
                    style={{ margin: '16px auto 0 auto' }}
                  >
                    Simulate Incoming Offer (+10 pts)
                  </button>
                </div>
              ) : (
                <OfferRadar
                  offers={offers}
                  onAccept={handleAcceptOffer}
                  onDecline={handleDeclineOffer}
                />
              )}
            </div>
          )}

          {/* TAB 4: REWARD LEDGER */}
          {activeTab === 'ledger' && (
            <div style={{ maxWidth: '860px', margin: '0 auto' }}>
              <AuditLedger entries={ledger} />
            </div>
          )}

          {/* TAB 1: BLOGGER COPILOT COMMAND DECK */}
          {activeTab === 'copilot' && (
            <HumaneCommLink
              agents={agents}
              proposals={proposals}
              offers={offers}
              totalPoints={totalPoints}
              targetPoints={targetPoints}
              onApproveProposal={handleApproveProposal}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onInstructionReceived={(text) => {
                handleAddInstruction(text);
              }}
              onVoiceAction={(actionType, text) => {
                if (actionType === 'approve_1042') {
                  const p = proposals.find((x) => x.issueId === 1042);
                  if (p) handleApproveProposal(p);
                  else showToast('Issue #1042 is already resolved!');
                } else if (actionType === 'approve_offer' && offers.length > 0) {
                  handleAcceptOffer(offers[0]);
                } else {
                  showToast(`Voice command received: "${text}"`);
                }
              }}
            />
          )}

          {/* TAB 6: SAFETY FIREWALL & RULES */}
          {activeTab === 'rules' && (
            <div style={{ maxWidth: '840px', margin: '0 auto' }}>
              <div style={{ marginBottom: '18px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                  Safety Firewall &amp; Standing Guardrails
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Active safety policies governing autonomous agents. Toggle rules or register new instructions in plain English.
                </p>
              </div>

              <StandingInstructions
                instructions={instructions}
                onToggle={handleToggleInstruction}
                onAdd={handleAddInstruction}
              />
            </div>
          )}
        </main>
      </div>

      {/* Agent Detail Modal (Inspect performance gaps & queue) */}
      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onToggleStatus={handleToggleAgentStatus}
          pendingProposals={proposals}
          onApproveProposal={handleApproveProposal}
          onAskAgent={(p) => setClarifyingProposal(p)}
        />
      )}

      {/* Clarification Q&A Modal */}
      {clarifyingProposal && (
        <ClarificationModal
          key={clarifyingProposal.id}
          proposal={clarifyingProposal}
          onClose={() => setClarifyingProposal(null)}
          onApprove={handleApproveProposal}
        />
      )}
    </div>
  );
}

export default App;
