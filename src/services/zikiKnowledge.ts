// Ziki Knowledge Engine & Blogger Overseer Agent
// Grounded in ZIKI_HOW_IT_WORKS.md, ZIKI_AGENT_PROTOCOL.md, and ZIKI_EARNING_LOOP.md.

export interface BloggerResponse {
  speaker: 'Blogger (Overseer)' | 'Gojo' | 'Six Eyes';
  spokenText: string;
  actionType?: 'approve_1042' | 'approve_offer' | 'add_instruction' | 'manual_heartbeat' | 'none';
  actionPayload?: string;
}

export class ZikiKnowledgeEngine {
  public static answerQuery(query: string): BloggerResponse {
    const q = query.toLowerCase().trim();

    // 1. ACTION COMMANDS
    if (q.includes('1042') || q.includes('furniture') || q.includes('toast') || q.includes('drawer')) {
      return {
        speaker: 'Gojo',
        spokenText: `Got your voice note! Approving Issue #1042 now. Branching fix/1042-furniture-toast on zedu-team-neo-mando/zedu-fe. Expected reward: +25 points.`,
        actionType: 'approve_1042',
      };
    }

    if (q.includes('408') || q.includes('offer') || q.includes('accept claim') || q.includes('pr review')) {
      return {
        speaker: 'Six Eyes',
        spokenText: `Claiming PR #408 review offer for neo-mando. Submitting good-to-merge verdict right away! That adds +10 points to our ledger.`,
        actionType: 'approve_offer',
      };
    }

    if (q.includes('heartbeat') || q.includes('ping') || q.includes('keepalive')) {
      return {
        speaker: 'Blogger (Overseer)',
        spokenText: `I have sent a manual heartbeat keepalive ping to Ziki. Active claim timers are refreshed to 15 minutes to prevent silence drops.`,
        actionType: 'manual_heartbeat',
      };
    }

    // 2. KNOWLEDGE & OVERSEER Q&A (Answered by Blogger)

    // How points work / earning
    if (q.includes('point') || q.includes('earn') || q.includes('reward') || q.includes('score') || q.includes('target')) {
      return {
        speaker: 'Blogger (Overseer)',
        spokenText: `Here is how points work on Ziki: Solvers earn 15 to 60 points when their fix is merged depending on severity. PR Reviewers earn 10 points for the first sign-off, down to 1. Fast issue validators earn 5 points immediately. All points credit directly to your owner account toward our 500-point sprint target!`,
        actionType: 'none',
      };
    }

    // Idea vs Issue
    if (q.includes('idea') || q.includes('issue') || q.includes('stage') || q.includes('lifecycle')) {
      return {
        speaker: 'Blogger (Overseer)',
        spokenText: `On Ziki, a bug report starts as an 'idea', not an issue. It cannot be worked on until two independent reviewers accept it as real, a triager clears duplicates, and it collects at least three upvotes. Only then does it become an 'issue' ready for claiming and bidding.`,
        actionType: 'none',
      };
    }

    // Bidding and claiming / Rule 1
    if (q.includes('bid') || q.includes('claim') || q.includes('rule 1') || q.includes('award')) {
      return {
        speaker: 'Blogger (Overseer)',
        spokenText: `Under Ziki Rule 1, agents can never self-assign or claim work without human approval. Gojo must bring a concrete plan and ETA to you first. When you approve, a person awards the bid, which becomes the active claim. You can hold a maximum of 2 active claims simultaneously.`,
        actionType: 'none',
      };
    }

    // 60-second offers
    if (q.includes('60') || q.includes('second') || q.includes('radar') || q.includes('dispatch')) {
      return {
        speaker: 'Blogger (Overseer)',
        spokenText: `When Ziki dispatches an issue or PR review offer to your inbox, you have exactly 60 seconds to accept it. Our Offer Radar counts down in real time. PR reviews pay up to 10 points immediately without needing repository push permissions.`,
        actionType: 'none',
      };
    }

    // Independence and Collusion rules
    if (q.includes('independence') || q.includes('collusion') || (q.includes('six eyes') && q.includes('gojo'))) {
      return {
        speaker: 'Blogger (Overseer)',
        spokenText: `Under Ziki's integrity rules, independence is enforced by owner, not agent. Because Gojo and Six Eyes share your account, Six Eyes can never validate or review Gojo's pull requests. Six Eyes works strictly on outside pull requests to prevent 403 collusion penalties.`,
        actionType: 'none',
      };
    }

    // Who are the agents / Roster
    if (q.includes('who are you') || q.includes('agents') || q.includes('team') || q.includes('gojo') || q.includes('blogger')) {
      return {
        speaker: 'Blogger (Overseer)',
        spokenText: `I am Blogger, your Overseer and Knowledge agent. I supervise our team: Gojo is our Contributor working on zedu-fe and 3D office bug fixes, Six Eyes is our Reviewer validating backend Go code, and Sukuna monitors mobile. Ask me anything about Ziki rules, tickets, or points!`,
        actionType: 'none',
      };
    }

    // What is Ziki?
    if (q.includes('what is ziki') || q.includes('ziki works') || q.includes('platform')) {
      return {
        speaker: 'Blogger (Overseer)',
        spokenText: `Ziki is a collaborative bounty and issue-tracking platform where developers and AI agents solve real codebase defects. Points earned by agents are recorded in an append-only ledger and credited directly to you, the human owner.`,
        actionType: 'none',
      };
    }

    // Neo-mando context
    if (q.includes('neo') || q.includes('mando') || q.includes('tower') || q.includes('office')) {
      return {
        speaker: 'Blogger (Overseer)',
        spokenText: `Our target is the Neo-Mando 3D Office at office.groups.zedu.chat/neo-mando/office. We are currently fixing Issue #1042 for false-alarm furniture toasts and PR #408 for toast container collisions over the Leave Office button.`,
        actionType: 'none',
      };
    }

    // Default Fallback: Add as thoughtful standing instruction, guided by Blogger
    return {
      speaker: 'Blogger (Overseer)',
      spokenText: `Understood! I am registering "${query}" as an active standing instruction for Gojo and Six Eyes. They will align their scanning and actions accordingly.`,
      actionType: 'add_instruction',
      actionPayload: query,
    };
  }
}
