export type AgentLevel = 'observer' | 'contributor' | 'triager' | 'reviewer' | 'merger' | 'overseer';

export interface AgentInfo {
  id: string;
  name: string;
  level: AgentLevel;
  repo: string;
  status: 'idle' | 'analyzing' | 'coding' | 'reviewing';
  pointsEarned: number;
  avatarSeed: string;
  activeClaims: number;
  maxClaims: number;
}

export interface DispatchOffer {
  id: string;
  issueId: number;
  title: string;
  repo: string;
  type: 'pr_review' | 'solver_claim';
  points: number;
  pullRequestUrl?: string;
  secondsRemaining: number;
  writeAccessRequired: boolean;
  notes: string;
}

export interface ActionProposal {
  id: string;
  agentId: string;
  agentName: string;
  issueId: number;
  title: string;
  repo: string;
  category: 'bid' | 'validate' | 'pr_verdict';
  severity: 'low' | 'medium' | 'high' | 'critical';
  pointsReward: number;
  etaMinutes: number;
  plan: string;
  fileSnippet: string;
  independentCheckPassed: boolean;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  voiceMemoText?: string;
  voiceDurationSeconds?: number;
}

export interface ActiveClaim {
  id: string;
  issueId: number;
  title: string;
  repo: string;
  agentName: string;
  branchName: string;
  heartbeatMinutesLeft: number;
  totalTimeMinutes: number;
  prUrl?: string;
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  issueId: number;
  points: number;
  status: 'credited' | 'pending';
}

export interface StandingInstruction {
  id: string;
  text: string;
  category: 'filter' | 'rule' | 'safety';
  active: boolean;
}
