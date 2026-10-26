import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ActionDeck } from './components/ActionDeck';
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

export function App() {
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [offers, setOffers] = useState<DispatchOffer[]>(INITIAL_OFFERS);
  const [proposals, setProposals] = useState<ActionProposal[]>(INITIAL_PROPOSALS);
  const [claims, setClaims] = useState<ActiveClaim[]>(INITIAL_CLAIMS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [instructions, setInstructions] = useState<StandingInstruction[]>(INITIAL_INSTRUCTIONS);
  const [totalPoints, setTotalPoints] = useState<number>(385);
  const targetPoints = 500;

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

    // Award points
    setTotalPoints((prev) => prev + proposal.pointsReward);

    // Update agent points & claim
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

    // If it was a bid proposal, add to active claims with 15m heartbeat
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

    // Append to ledger
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

    // Attribute to Gojo or Six Eyes
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

  // Simulate an incoming dispatch offer handled quietly in background by Blogger
  const handleSimulateOffer = () => {
    const randomId = Math.floor(1100 + Math.random() * 50);
    const pointsAwarded = 10;
    
    setTotalPoints((prev) => prev + pointsAwarded);
    setAgents((prev) =>
      prev.map((a) => (a.id === 'six-eyes' ? { ...a, pointsEarned: a.pointsEarned + pointsAwarded } : a))
    );

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: LedgerEntry = {
      id: `tx-${Date.now()}`,
      timestamp: timeStr,
      agentName: 'Blogger (Overseer)',
      action: `Background auto-claim on PR #${randomId - 700} review (neo-mando)`,
      issueId: randomId,
      points: pointsAwarded,
      status: 'credited',
    };
    setLedger((prev) => [newEntry, ...prev]);

    showToast(`Blogger auto-claimed PR review #${randomId - 700} in background. +10 pts credited!`);
    VoiceEngine.speak(`Blogger here. I auto-claimed PR review on issue ${randomId} in the background. Ten points credited without any timer stress.`, 'Blogger');
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        totalPoints={totalPoints}
        targetPoints={targetPoints}
        onSimulateOffer={handleSimulateOffer}
        onReset={handleReset}
      />

      {/* Toast Notification */}
      {notification && (
        <div
          className="animate-slide-down"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Humane Voice Comm-Link (Walkie-Talkie & Blogger Overseer) */}
        <HumaneCommLink
          onInstructionReceived={handleAddInstruction}
          onVoiceAction={handleVoiceAction}
        />

        {/* 2-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.65fr) minmax(320px, 1fr)',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: 1-Tap Action Handshake Deck */}
          <div>
            <ActionDeck
              proposals={proposals}
              onApprove={handleApproveProposal}
              onReject={handleRejectProposal}
              onAskAgent={(p) => setClarifyingProposal(p)}
            />
          </div>

          {/* Right Column: Agents, Heartbeat Sentinel & Standing Intentions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Agent Roster */}
            <AgentRoster agents={agents} />

            {/* Heartbeat Sentinel */}
            <ClaimSentinel
              claims={claims}
              onManualHeartbeat={handleManualHeartbeat}
            />

            {/* Standing Instructions */}
            <StandingInstructions
              instructions={instructions}
              onToggle={handleToggleInstruction}
              onAdd={handleAddInstruction}
            />

            {/* Audit Ledger */}
            <AuditLedger entries={ledger} />
          </div>
        </div>
      </main>

      {/* Clarification Q&A Modal */}
      <ClarificationModal
        proposal={clarifyingProposal}
        onClose={() => setClarifyingProposal(null)}
        onApprove={handleApproveProposal}
      />
    </div>
  );
}

export default App;
