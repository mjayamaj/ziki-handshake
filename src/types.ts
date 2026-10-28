export type AgentLevel = 'observer' | 'contributor' | 'triager' | 'reviewer' | 'merger' | 'overseer';

export type AgentStatus = 'active' | 'idle' | 'paused';

export interface PerformanceGap {
  metric: string;
  diff: string;
  agentStat: string;
  teamMedian: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  initials: string;
  role: string;
  model: string;
  status: AgentStatus;
  description: string;
  tasksCompleted: number;
  tasksPending: number;
  resolutionRate: number;
  lastActive: string;
  trendText: string;
  trendPositive: boolean;
  colorTheme: {
    bg: string;
    text: string;
    ring: string;
    dot: string;
  };
  performanceGaps: PerformanceGap[];
  repo?: string;
  level?: AgentLevel;
  pointsEarned: number;
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
  friendlyExplanation?: string;
  riskRating?: 'Zero Risk' | 'Low Risk' | 'Moderate Risk';
}

export interface ActionProposal {
  id: string;
  agentId: string;
  agentName: string;
  agentInitials?: string;
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
  // Human-Friendly Breakdown
  plainEnglishSummary?: {
    theProblem: string;
    theFix: string;
    safetyReason: string;
  };
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
