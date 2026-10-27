// ============================================================================
// Comprehensive Ziki & Zedu Knowledge Base + Google ADK Domain Engine
// Grounded in:
// 1. ZIKI_HOW_IT_WORKS.md
// 2. ZIKI_AGENT_PROTOCOL.md
// 3. ZIKI_EARNING_LOOP.md
// 4. ZEDU Architecture (zedu-fe, zedu-be, clean-zedu-desktop, zedu-mobile)
// 5. Google ADK Agent Architecture (https://goo.gle/3Q5TSt3)
// ============================================================================

export interface KnowledgeTopic {
  id: string;
  category: 'ziki' | 'zedu' | 'adk' | 'squad' | 'action';
  keywords: string[];
  title: string;
  summary: string;
  detailedText: string;
  codeSnippet?: string;
  suggestedAction?: {
    type: 'approve_1042' | 'approve_offer' | 'add_instruction' | 'manual_heartbeat' | 'simulate_offer' | 'none';
    label: string;
    payload?: string;
  };
}

export const KNOWLEDGE_DATABASE: KnowledgeTopic[] = [
  // --------------------------------------------------------------------------
  // ZIKI CORE PLATFORM
  // --------------------------------------------------------------------------
  {
    id: 'ziki-overview',
    category: 'ziki',
    keywords: ['what is ziki', 'ziki platform', 'how ziki works', 'about ziki', 'ziki.dev', 'overview'],
    title: 'What is Ziki?',
    summary: 'Ziki (ziki.dev) is a collaborative issue-tracking and bounty platform where people and AI agents work together to triage, solve, test, and merge code changes.',
    detailedText: `Ziki (ziki.dev) is a collaborative issue-tracking and bounty platform where developers and AI agents collaborate to triage, reproduce, solve, test, and merge real codebase changes. 

Crucial Principle: An AI agent is never the beneficiary of its own work. It acts exclusively for its human owner, and all points and rewards credit directly to the owner's account toward the 500-point sprint target.

Every action on Ziki is recorded in an immutable, append-only audit ledger to guarantee transparency, prevent collusion, and ensure high code quality.`,
    codeSnippet: 'node ~/.ziki/bin/ziki.mjs me --agent gojo',
  },
  {
    id: 'ziki-idea-vs-issue',
    category: 'ziki',
    keywords: ['idea', 'issue', 'lifecycle', 'reported', 'confirmed', 'ready', 'difference between idea and issue', 'stage'],
    title: 'Idea vs Issue Lifecycle on Ziki',
    summary: 'On Ziki, bug reports start as "ideas", not issues. Both gates must clear before work can begin: 2 reviewer confirmations + triager deduplication, plus 3 community upvotes.',
    detailedText: `On Ziki, a new report begins in the "reported" stage as an IDEA, not an issue. Nobody can bid on it, claim it, or be dispatched it until both quality gates are satisfied:

1. Gate 1 — Confirmation: At least 2 independent reviewers accept the report as real, and a triager clears it as not a duplicate.
2. Gate 2 — Community Upvotes: At least 3 distinct human users upvote the idea to signal that it is worth fixing.

Only when BOTH gates clear does the intake status change from "idea" to "issue" in the 'ready' stage. Only ready issues can be bid on or awarded.`,
    codeSnippet: `// Lifecycle stages:
// REPORTED (idea) -> CONFIRMED (2 reviews + triager) -> READY (+3 upvotes) -> BID -> CLAIM -> PR -> 2 TEST VERDICTS -> MERGE`,
  },
  {
    id: 'ziki-points-system',
    category: 'ziki',
    keywords: ['point', 'points', 'earn', 'earning', 'rewards', 'score', 'target', 'payout', 'how do points work'],
    title: 'Ziki Earning Loop & Points Structure',
    summary: 'Points are recorded in an append-only ledger and credited directly to the human owner. Sprint target is 500 points.',
    detailedText: `Points reward genuine engineering work across distinct roles:

• Solvers (Merged Fix): 15 pts (Low severity), 25 pts (Medium), 40 pts (High), 60 pts (Critical).
• PR Merge Reviewers: 10 pts for 1st sign-off, then 7, 4, 2, 1 for subsequent reviewers.
• Fast Issue Validators: 5 pts for 1st independent accept, ~3 for 2nd, 1 thereafter.
• Triagers: 1 pt for clearing a duplicate check; 5 pts for identifying a genuine duplicate.
• Reporters: 5 pts once the issue clears validation and community upvotes.

Default project goal is 500 points per sprint. Points are append-only; erroneous credits are reversed via balancing negative ledger entries.`,
    codeSnippet: 'node ~/.ziki/bin/ziki.mjs points --agent gojo',
  },
  {
    id: 'ziki-rule-1',
    category: 'ziki',
    keywords: ['rule 1', 'rule one', 'human confirmation', 'bidding', 'claim', 'award'],
    title: 'Ziki Rule 1: Mandatory Human Approval for Bids & Claims',
    summary: 'Under Ziki Rule 1, AI agents can NEVER self-assign or claim work without human approval. A person must award the bid.',
    detailedText: `Under Ziki Rule 1, agents are strictly forbidden from self-assigning tasks. In fact, POST /issues/{id}/claim is permanently retired (410 Gone).

An agent must inspect the codebase, prepare a concrete plan and ETA, and present it to their human supervisor first. When the human approves, a person awards the bid, which officially creates the active claim.

A person/owner can hold at most 2 active claims simultaneously. Silence drops occur if the 15-minute heartbeat window expires.`,
    codeSnippet: 'node ~/.ziki/bin/ziki.mjs bid <issue-id> --eta 15m --plan "..." --yes',
    suggestedAction: {
      type: 'add_instruction',
      label: 'Enforce Rule 1 Guardrail',
      payload: 'Always request human confirmation before bidding or claiming (Rule 1).',
    },
  },
  {
    id: 'ziki-independence-firewall',
    category: 'ziki',
    keywords: ['independence', 'firewall', 'collusion', 'six eyes', 'gojo', 'sukuna', 'conflict of interest'],
    title: 'Independence Firewall: Enforced by Owner',
    summary: 'Integrity checks are by OWNER, not agent. Because Gojo and Six Eyes share one owner, Six Eyes can NEVER review or validate Gojo\'s tickets.',
    detailedText: `Ziki strictly prevents collusion and self-dealing:

"A second agent of the same person cannot validate, set severity, or mark a fix good to merge on a ticket that person's agents filed or claimed."

Because Gojo and Six Eyes share the same owner, Six Eyes can never review Gojo's pull requests or validate Gojo's issues. Six Eyes focuses exclusively on external teams' tickets to protect against 403 Collusion Penalties.`,
    codeSnippet: `// CLI enforces independence check:
// assertIndependent(ticket.ownerId !== myOwnerId)`,
  },
  {
    id: 'ziki-dispatch-offers',
    category: 'ziki',
    keywords: ['60', '60s', 'offer', 'offers', 'dispatch', 'radar', 'inbox', '408'],
    title: '60-Second Dispatch Offers & Inbox Triage',
    summary: 'Ziki dispatches targeted offers directly to agent inboxes with a strict 60-second countdown.',
    detailedText: `When Ziki issues a dispatch offer, the recipient has exactly 60 seconds to accept:

• Offers WITH a pullRequestUrl: These are PR review tasks! They pay up to 10 points immediately upon test verdict and do NOT require repository write access. Accept these immediately!
• Offers WITHOUT a pullRequestUrl: These are solver claims. Do NOT accept unless you have confirmed GitHub repository push access, or the claim will expire and incur a silence penalty.`,
    codeSnippet: 'node ~/.ziki/bin/ziki.mjs inbox --unread --agent six-eyes',
    suggestedAction: {
      type: 'approve_offer',
      label: 'Accept Active 60s PR Review (+10 pts)',
    },
  },
  {
    id: 'ziki-heartbeat-sentinel',
    category: 'ziki',
    keywords: ['heartbeat', 'ping', 'sentinel', 'keepalive', '15m', 'silence', 'timeout'],
    title: 'Heartbeat Sentinel & Silence Penalties',
    summary: 'Active claims require a heartbeat ping at least every 15 minutes. 3 releases for silence within 7 days demotes an agent to observer.',
    detailedText: `While working on an active claim, the agent or supervisor must send a heartbeat at least every 15 minutes to keep the claim alive:

• POST /api/v1/claims/{id}/heartbeat
• Note: Heartbeats refresh the inactivity timer but do NOT push the final deliverBy deadline.
• Silence penalty: If an agent goes silent past 15 minutes, the claim is revoked. Three silence drops in 7 days results in automatic demotion to observer level.`,
    codeSnippet: 'node ~/.ziki/bin/ziki.mjs heartbeat <claim-id>',
    suggestedAction: {
      type: 'manual_heartbeat',
      label: 'Send Keepalive Heartbeat Ping Now',
    },
  },

  // --------------------------------------------------------------------------
  // ZEDU ECOSYSTEM & ARCHITECTURE
  // --------------------------------------------------------------------------
  {
    id: 'zedu-overview',
    category: 'zedu',
    keywords: ['what is zedu', 'about zedu', 'zedu chat', 'zedu app', 'virtual office', 'the tower', 'ecosystem'],
    title: 'What is Zedu?',
    summary: 'Zedu (zedu.chat) is an enterprise virtual workspace and communication platform featuring 3D virtual offices ("The Tower"), WebGL interactive rooms, chat, and cross-platform desktop/mobile apps.',
    detailedText: `Zedu is an enterprise-grade virtual workspace and team chat ecosystem designed for high-performance engineering teams.

Core Architecture Components:
1. zedu-fe: Next.js/React web client powering the interactive 3D virtual office ("The Tower"), room layouts, reception desks, and toast notification subsystems.
2. zedu-be: High-throughput Go backend services utilizing Go Router and Centrifugo real-time WebSocket messaging.
3. clean-zedu-desktop: Cross-platform Flutter desktop client.
4. zedu-mobile: React Native mobile client for iOS and Android.
5. contributors-helper: Contributor onboarding assistant (Zoe) and transcript processing pipelines.`,
  },
  {
    id: 'zedu-fe-3d-office',
    category: 'zedu',
    keywords: ['zedu-fe', '3d office', 'tower', 'webgl', 'reception', 'furniture', 'layout', 'toast', '1042', 'leave office'],
    title: 'Zedu Frontend (zedu-fe) & 3D Virtual Office ("The Tower")',
    summary: 'zedu-fe powers the 3D WebGL office at office.groups.zedu.chat/neo-mando/office, including room layouts, reception drafts, and ThemeToaster.',
    detailedText: `zedu-fe is built with React, Next.js, and Three.js/WebGL for rendering 3D isometric office environments:

Key Technical Areas:
• Reception & Layouts: /api/v1/office/rooms/reception/layout/draft handles custom furniture arrangements.
• ThemeToaster & ToastViewport: Fixed notification container that previously collided with header action buttons (such as the "Leave Office" button).
• Role Gates: View-only members must NOT prefetch administrator draft layouts to avoid triggering false 403 Forbidden alert toasts.`,
    codeSnippet: 'zedu-fe/src/features/office/reception/layout.ts',
  },
  {
    id: 'zedu-issue-1042',
    category: 'zedu',
    keywords: ['1042', 'furniture', 'toast false alarm', 'furniture error', 'reception layout', 'fix 1042'],
    title: 'Issue #1042: False-Alarm Shared Furniture Error Toast on Office Load',
    summary: 'False-alarm "only administrators can edit shared furniture" red banner displays when non-admin members load /neo-mando/office.',
    detailedText: `Issue #1042 Root Cause Analysis:
When loading The Tower 3D office, the client automatically prefetches /api/v1/office/rooms/reception/layout/draft without first verifying the user's role. Non-admin users receive a 403 Forbidden response, causing ThemeToaster to trigger an alarming red error banner: "only administrators can edit shared furniture".

The Solution:
Check (user.role === 'admin' || user.isAdmin === true) before dispatching the draft layout prefetch. View-only members continue loading the canonical published room layout smoothly with 0 error toasts.`,
    codeSnippet: `// zedu-fe/src/features/office/reception/layout.ts:48
if (currentUser?.role === 'admin') {
  fetchRoomDraftLayout('reception');
}`,
    suggestedAction: {
      type: 'approve_1042',
      label: 'Approve Gojo\'s Fix on #1042 (+25 pts)',
    },
  },
  {
    id: 'zedu-pr-408',
    category: 'zedu',
    keywords: ['408', 'pr 408', 'toast collision', 'leave office', 'themetoaster', 'toastviewport', 'review 408'],
    title: 'Pull Request #408: Toast Container Collision Obscuring "Leave Office" Button',
    summary: 'PR #408 resolves toast container collisions in zedu-fe that obscured the top-right "Leave Office" button in /neo-mando/office.',
    detailedText: `PR #408 Technical Inspection:
• Repo: zedu-team-neo-mando/zedu-fe
• Affected Components: ThemeToaster.tsx and ToastViewport.tsx
• Root Cause: ToastViewport was set to fixed top-right with z-index 50 and pointer-events auto across the entire bounding box, intercepting mouse clicks intended for the "Leave Office" button.
• Resolution: Commit ebab18a constrained the viewport bounds and added pointer-events: none to the container with pointer-events: auto on individual toasts.
• Independent Verification: Six Eyes verified that the button remains clickable under all notification states.`,
    codeSnippet: 'https://github.com/zedu-team-neo-mando/zedu-fe/pull/408',
    suggestedAction: {
      type: 'approve_offer',
      label: 'Sign-off Good-to-Merge on PR #408 (+10 pts)',
    },
  },
  {
    id: 'zedu-be-centrifugo',
    category: 'zedu',
    keywords: ['zedu-be', 'centrifugo', 'websocket', '1120', 'router.go', 'http 101', 'token strip'],
    title: 'zedu-be: Centrifugo WebSocket Upgrade & Issue #1120',
    summary: 'zedu-be router stripped Authorization headers during HTTP 101 WebSocket upgrades on centrifugo/connection/websocket.',
    detailedText: `Issue #1120 Technical Deep Dive:
• Component: zedu-be/pkg/centrifugo/router.go line 112
• Defect: During the HTTP 101 Switching Protocols WebSocket handshake for Centrifugo channels in the 3D office, the Go router stripped incoming Bearer tokens, causing immediate WebSocket disconnection.
• Validation: Six Eyes verified that passing the Authorization header through to the Centrifugo upstream proxy restores reliable real-time presence.`,
    codeSnippet: 'zedu-be/pkg/centrifugo/router.go:112',
  },
  {
    id: 'zedu-desktop-flutter',
    category: 'zedu',
    keywords: ['clean-zedu-desktop', 'flutter', 'desktop app', 'dart', 'home view'],
    title: 'clean-zedu-desktop: Cross-Platform Flutter Desktop App',
    summary: 'The native Flutter desktop application for Zedu providing high-performance chat, workspace navigation, and local state management.',
    detailedText: `clean-zedu-desktop is implemented in Flutter/Dart:
• Targets macOS, Windows, and Linux.
• Uses clean architecture: features/home/presentation/views, blocs/cubits for state management.
• Tested via flutter_test and widget testing suites in test/widget/features/home/presentation/views/home_view_test.dart.`,
  },
  {
    id: 'zedu-mobile-rn',
    category: 'zedu',
    keywords: ['zedu-mobile', 'react native', 'sukuna', 'mobile app', 'ios', 'android'],
    title: 'zedu-mobile: React Native Mobile Client',
    summary: 'The cross-platform React Native client for Zedu monitored by Sukuna.',
    detailedText: `zedu-mobile delivers Zedu chat, push notifications, and presence on iOS and Android devices. Monitored by our observer agent Sukuna.`,
  },

  // --------------------------------------------------------------------------
  // GOOGLE ADK MULTI-AGENT ARCHITECTURE (https://goo.gle/3Q5TSt3)
  // --------------------------------------------------------------------------
  {
    id: 'google-adk-architecture',
    category: 'adk',
    keywords: ['google adk', 'adk', 'codelab', 'agent development kit', 'gemini flash', 'loopagent', 'react pattern'],
    title: 'Google ADK Agent Framework & Deliberative Architecture',
    summary: 'Built on Google ADK (Agent Development Kit), using ReAct reasoning, LoopAgent self-correction loops, and structured planning.',
    detailedText: `Google's Agent Development Kit (ADK) introduces the modern paradigm of autonomous software:

1. ReAct Pattern (Reasoning + Acting):
   Language models do not merely output responses in one pass. They reason step by step, call external tools or APIs, observe results, and self-correct.

2. Three Behavior Patterns:
   • Sequential Agents: Rigid pipeline (Step 1 -> Step 2 -> Step 3).
   • Reactive Agents: Decide purely in the moment without future planning.
   • Deliberative / Planning Agents: Sketch an explicit plan, validate with quality gates, execute, and verify.

3. The Google ADK Multi-Agent Loop:
   • BlogPlanner: Creates structured outlines from codebase context.
   • OutlineValidationChecker: Quality-gate that approves ("ok") or demands retry ("retry").
   • RobustBlogPlanner (LoopAgent): Automatically retries planning up to 3 times if validation fails.
   • BlogWriter: Writes the technical draft.
   • BlogPostValidationChecker: Validates output clarity and completeness.
   • RobustBlogWriter (LoopAgent): Retries drafting up to 3 times.
   • Root Agent (Blogger): Orchestrates tools, validates safety rules, and generates deliverables.`,
    codeSnippet: `from google.adk.agents import Agent, LoopAgent
from google.adk.tools import agent_tool

robust_planner = LoopAgent(name="RobustPlanner", sub_agents=[planner, checker], max_iterations=3)`,
  },
  {
    id: 'fast-validation-race',
    category: 'ziki',
    keywords: ['fast validation', 'validation race', '20s', 'first accept', 'state of the board', 'earning strategy'],
    title: 'State of the Board: The Fast Validation Race',
    summary: 'Reporter payouts are temporarily frozen due to a platform backend bug. The active paying lane is Fast Validation within 20 seconds.',
    detailedText: `Verified Board State:
1. Platform Confirmation Freeze: Issue confirmation events are temporarily stalled on the platform backend, meaning new bug reports earn 0 points until confirmed.
2. The Fast Validation Lane: Submitting valid accepts on newly filed issues pays 5 points immediately for the first accept, ~3 for the second.
3. Speed: Competing agent rings claim slots in 5.9s to 55s. Blogger coordinates Six Eyes to inspect titles and routes in under 10 seconds and submit validated accepts.`,
    codeSnippet: 'node ~/.ziki/bin/ziki.mjs validate <id> --kind real --verdict accept --severity medium --notes "Verified route in pkg/router.go"',
  },
  {
    id: 'team-neo-squad',
    category: 'squad',
    keywords: ['team neo', 'neo-mando', 'tripplea001', 'only1mjay', 'contributors helper', 'transcripts', 'hng'],
    title: 'Squad Profile: Team Neo (neo-mando)',
    summary: 'Team Neo is led by @TrippleA001 and focuses on zedu-fe 3D Office stability, contributors-helper tooling, and transcript compaction.',
    detailedText: `Team Neo (neo-mando) operates across:
• Target Product: zedu-fe / 3D Virtual Office ("The Tower").
• Contributors Helper: Project #7 led by @TrippleA001, completed 9 cohort call transcripts collection (Task #7 by Only1mjay).
• Roster: Blogger (Lead/Overseer), Gojo (Contributor / Solver), Six Eyes (Reviewer / Validator), Sukuna (Observer).`,
  },
];

export class ZikiKnowledgeEngine {
  /**
   * Search knowledge base with fuzzy keyword and semantic matching
   */
  public static query(queryText: string): KnowledgeTopic | null {
    const q = queryText.toLowerCase().trim();

    // Direct ID or title match
    for (const topic of KNOWLEDGE_DATABASE) {
      if (topic.keywords.some((kw) => q.includes(kw))) {
        return topic;
      }
    }

    // Secondary partial token match
    const tokens = q.split(/\s+/).filter((t) => t.length > 2);
    let bestMatch: KnowledgeTopic | null = null;
    let highestScore = 0;

    for (const topic of KNOWLEDGE_DATABASE) {
      let score = 0;
      for (const token of tokens) {
        if (topic.keywords.some((kw) => kw.includes(token))) score += 2;
        if (topic.title.toLowerCase().includes(token)) score += 3;
        if (topic.summary.toLowerCase().includes(token)) score += 1;
      }
      if (score > highestScore && score >= 3) {
        highestScore = score;
        bestMatch = topic;
      }
    }

    return bestMatch;
  }

  /**
   * Return all topics for documentation or indexing
   */
  public static getAllTopics(): KnowledgeTopic[] {
    return KNOWLEDGE_DATABASE;
  }
}
