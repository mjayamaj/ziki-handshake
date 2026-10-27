import { useState } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { ActionDeck } from './components/ActionDeck';
import { OfferRadar } from './components/OfferRadar';
import { AgentRoster } from './components/AgentRoster';
import { ClaimSentinel } from './components/ClaimSentinel';
import { StandingInstructions } from './components/StandingInstructions';
import { AuditLedger } from './components/AuditLedger';
import { ClarificationModal } from './components/ClarificationModal';
import { HumaneCommLink } from './components/HumaneCommLink';
import { VoiceEngine } from './services/voiceEngine';

import {
  INITIAL_AGENTS,
  INITIAL_OFFERS,
  INITIAL_PROPOSALS,
  INITIAL_CLAIMS,
  INITIAL_LEDGER,
  INITIAL_INSTRUCTIONS,
} from './data/mockZiki';

import type { DispatchOffer, ActionProposal, ActiveClaim, LedgerEntry, StandingInstruction, AgentInfo } from './types';

type DashboardTab = 'proposals' | 'offers' | 'blogger' | 'team' | 'ledger';

export function App() {
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [offers, setOffers] = useState<DispatchOffer[]>(INITIAL_OFFERS);
  const [proposals, setProposals] = useState<ActionProposal[]>(INITIAL_PROPOSALS);
  const [claims, setClaims] = useState<ActiveClaim[]>(INITIAL_CLAIMS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [instructions, setInstructions] = useState<StandingInstruction[]>(INITIAL_INSTRUCTIONS);
  const [totalPoints, setTotalPoints] = useState<number>(385);
  const targetPoints = 500;

  const [activeTab, setActiveTab] = useState<DashboardTab>('proposals');
  const [clarifyingProposal, setClarifyingProposal] = useState<ActionProposal | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Handshake Action 1: Approve Proposal
  const handleApproveProposal = (proposal: ActionProposal) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposal.id));
    setTotalPoints((prev) => prev + proposal.pointsReward);

    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === proposal.agentId) {
          return {
            ...agent,
            pointsEarned: agent.pointsEarned + proposal.pointsReward,
            activeClaims: proposal.category === 'bid' ? agent.activeClaims + 1 : agent.activeClaims,
          };
        }
        return agent;
      })
    );

    if (proposal.category === 'bid') {
      const newClaim: ActiveClaim = {
        id: `claim-${proposal.issueId}`,
        issueId: proposal.issueId,
        title: proposal.title,
        repo: proposal.repo,
        agentName: proposal.agentName,
        branchName: `fix/${proposal.issueId}-${proposal.agentName.toLowerCase()}`,
        heartbeatMinutesLeft: 15,
        totalTimeMinutes: 15,
      };
      setClaims((prev) => [newClaim, ...prev]);
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: LedgerEntry = {
      id: `tx-${Date.now()}`,
      timestamp: timeStr,
      agentName: proposal.agentName,
      action: `${proposal.category === 'bid' ? 'Bid Awarded' : 'Validation Confirmed'}: #${proposal.issueId} (${proposal.title})`,
      issueId: proposal.issueId,
      points: proposal.pointsReward,
      status: 'credited',
    };
    setLedger((prev) => [newEntry, ...prev]);

    showToast(`Approved ${proposal.agentName}'s plan on #${proposal.issueId}! +${proposal.pointsReward} pts credited.`);
  };

  // Handshake Action 2: Reject Proposal
  const handleRejectProposal = (id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    showToast('Proposal declined. Agent released back to scanning queue.');
  };

  // Handshake Action 3: Accept 60s Offer
  const handleAcceptOffer = (offer: DispatchOffer) => {
    setOffers((prev) => prev.filter((o) => o.id !== offer.id));
    setTotalPoints((prev) => prev + offer.points);

    setAgents((prev) =>
      prev.map((a) => (a.id === 'six-eyes' ? { ...a, pointsEarned: a.pointsEarned + offer.points } : a))
    );

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: LedgerEntry = {
      id: `tx-${Date.now()}`,
      timestamp: timeStr,
      agentName: 'Six Eyes',
      action: `PR Review sign-off on Issue #${offer.issueId}`,
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
      notes: 'Blogger spotted an open PR review offer. Zero write access needed.',
    };

    setOffers((prev) => [newOffer, ...prev]);
    setActiveTab('offers');
    showToast(`Incoming 60s Dispatch Offer on #${randomId}!`);
    VoiceEngine.speak(`Attention supervisor: a new sixty-second dispatch offer arrived for issue ${randomId}. Claim it before the timer expires!`, 'Blogger');
  };

  const handleToggleInstruction = (id: string) => {
    setInstructions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, active: !inst.active } : inst))
    );
  };

  const handleAddInstruction = (text: string) => {
    const newInst: StandingInstruction = {
      id: `inst-${Date.now()}`,
      text,
      category: 'filter',
      active: true,
    };
    setInstructions((prev) => [...prev, newInst]);
    showToast(`Standing rule active: "${text}"`);
  };

  const handleManualHeartbeat = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, heartbeatMinutesLeft: 15 } : c))
    );
    showToast('Heartbeat ping sent to Ziki. Claim timer refreshed to 15m.');
  };

  const handleReset = () => {
    setAgents(INITIAL_AGENTS);
    setOffers(INITIAL_OFFERS);
    setProposals(INITIAL_PROPOSALS);
    setClaims(INITIAL_CLAIMS);
    setLedger(INITIAL_LEDGER);
    setInstructions(INITIAL_INSTRUCTIONS);
    setTotalPoints(385);
    setActiveTab('proposals');
    showToast('Board state reset to initial demo defaults.');
  };

  const handleVoiceAction = (actionType: 'approve_1042' | 'approve_offer' | 'custom', text: string) => {
    if (actionType === 'approve_1042') {
      const prop1042 = proposals.find((p) => p.issueId === 1042);
      if (prop1042) {
        handleApproveProposal(prop1042);
      } else {
        showToast('Issue #1042 is already approved or not in pending queue.');
      }
    } else if (actionType === 'approve_offer') {
      if (offers.length > 0) {
        handleAcceptOffer(offers[0]);
      } else {
        showToast('No active dispatch offers to claim right now.');
      }
    } else {
      handleAddInstruction(text);
    }
  };

  return (
    <div className="app-container">
      {/* 1. Standard Top Navbar */}
      <Navbar
        totalPoints={totalPoints}
        targetPoints={targetPoints}
        onSimulateOffer={handleSimulateOffer}
        onReset={handleReset}
      />

      {/* 2. Standard View Selector Tabs */}
      <nav className="dashboard-subnav" aria-label="Dashboard views">
        <div className="dashboard-subnav-inner">
          <div className="tab-list">
            <button
              onClick={() => setActiveTab('proposals')}
              className={`tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
            >
              <span>⚡ Action Feed</span>
              <span className={`tab-badge ${proposals.length > 0 ? 'tab-badge-blue' : 'tab-badge-muted'}`}>
                {proposals.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            >
              <span>📡 60s Offer Radar</span>
              <span className={`tab-badge ${offers.length > 0 ? 'tab-badge-emerald' : 'tab-badge-muted'}`}>
                {offers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('blogger')}
              className={`tab-btn ${activeTab === 'blogger' ? 'active' : ''}`}
            >
              <span>🤖 Blogger Copilot</span>
              <span className="tab-badge tab-badge-muted">AI</span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            >
              <span>👥 Agent Team & Sentinel</span>
              <span className="tab-badge tab-badge-muted">{agents.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
            >
              <span>📜 Reward Ledger</span>
              <span className="tab-badge tab-badge-muted">{ledger.length}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Toast Notification */}
      {notification && (
        <div
          className="animate-slide-down"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '20px',
            left: '20px',
            maxWidth: '420px',
            margin: '0 auto',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          role="status"
          aria-live="polite"
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
          <span style={{ flex: 1 }}>{notification}</span>
        </div>
      )}

      {/* Main Container Content based on Tab */}
      <main className="dashboard-main">
        {activeTab === 'proposals' && (
          <div className="dashboard-grid">
            {/* Primary Column: Action Proposals & Active Offers */}
            <div>
              {offers.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
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

            {/* Sidebar Column: Blogger AI Copilot & Sentinel */}
            <div className="sidebar-column">
              <HumaneCommLink
                onInstructionReceived={handleAddInstruction}
                onVoiceAction={handleVoiceAction}
              />

              <ClaimSentinel
                claims={claims}
                onManualHeartbeat={handleManualHeartbeat}
              />
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                Live 60-Second Dispatch Offers
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Fast validation race offers. Solver claims require write access; PR reviews are zero-risk signoffs.
              </p>
            </div>

            {offers.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                  No Active 60s Dispatch Offers
                </p>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                  Blogger is actively monitoring Ziki queues. You can simulate an incoming offer to test.
                </p>
                <button onClick={handleSimulateOffer} className="btn-primary">
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

        {activeTab === 'blogger' && (
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <HumaneCommLink
              onInstructionReceived={handleAddInstruction}
              onVoiceAction={handleVoiceAction}
            />
          </div>
        )}

        {activeTab === 'team' && (
          <div className="dashboard-grid">
            <AgentRoster agents={agents} />
            <div className="sidebar-column">
              <ClaimSentinel
                claims={claims}
                onManualHeartbeat={handleManualHeartbeat}
              />
              <StandingInstructions
                instructions={instructions}
                onToggle={handleToggleInstruction}
                onAdd={handleAddInstruction}
              />
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <AuditLedger entries={ledger} />
          </div>
        )}
      </main>

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
