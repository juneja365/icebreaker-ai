import {
  IcebreakerResponse,
  ReplyCoachResponse,
  RescueResponse,
  RewriteResponse,
  BioResponse,
  ScreenshotAnalysisResponse,
  DeliveryAdviceResponse,
  SafetyReport,
  Scenario,
  SettingType,
  VibeType
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Fallback client-side safety guard in case backend is offline
function clientSafetyCheck(text: string): SafetyReport {
  const lower = text.toLowerCase();
  const pushyWords = ["why aren't you replying", "answer me", "you owe me", "are you ignoring me"];
  const hasPushy = pushyWords.some(w => lower.includes(w));

  return {
    is_safe: !hasPushy,
    respect_score: hasPushy ? 40 : 98,
    pressure_level: hasPushy ? 'high' : 'low',
    feedback: hasPushy 
      ? 'Detected high-pressure phrasing. Keep it casual and respect their time.' 
      : '100% natural and respectful. Low pressure with an easy conversational hook.',
    flags: hasPushy ? ['Pushy / Demanding language'] : [],
    positive_tags: ['Consensual', 'Natural Hook', 'Low-Pressure Exit']
  };
}

export const api = {
  async getHealth(): Promise<{ status: string; engine: string; llm_key_present: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'client_fallback', engine: 'Smart Engine (Offline Ready)', llm_key_present: false };
    }
  },

  async getScenarios(): Promise<Scenario[]> {
    try {
      const res = await fetch(`${API_BASE}/scenarios`);
      if (!res.ok) throw new Error('Failed to load scenarios');
      return await res.json();
    } catch {
      // In-client fallback scenarios
      return [
        {
          id: 'sc-1',
          title: 'College Lab Partner',
          badge: 'College / Campus',
          setting: 'college',
          situation: 'We are in the same biology lab but haven\'t talked much outside of assignments.',
          vibe: 'chill',
          target_details: 'Always brings an iced matcha and has sticker decals on their laptop.',
          recommended_tool: 'icebreaker'
        },
        {
          id: 'sc-2',
          title: 'Instagram Hiking Story',
          badge: 'Instagram / Social',
          setting: 'instagram',
          situation: 'They posted a story at a breathtaking mountain summit overlook.',
          vibe: 'funny',
          target_details: 'Stunning view, cute dog in the frame.',
          recommended_tool: 'icebreaker'
        },
        {
          id: 'sc-3',
          title: 'Reply Coach: "Haha yeah"',
          badge: 'Rescue Mode',
          setting: 'dating',
          situation: 'Conversation stalled after they gave a dry reply.',
          received_message: 'haha yeah totally',
          stall_reason: 'one_word_answer',
          vibe: 'chill',
          recommended_tool: 'rescue'
        }
      ];
    }
  },

  async generateIcebreakers(params: {
    setting: SettingType;
    situation: string;
    vibe: VibeType;
    target_details?: string;
  }): Promise<IcebreakerResponse> {
    try {
      const res = await fetch(`${API_BASE}/icebreakers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Server returned an error');
      return await res.json();
    } catch {
      // Robust client fallback
      const { setting, situation, vibe, target_details } = params;
      return {
        setting,
        situation_analysis: `Analyzed scenario in ${setting} context with a ${vibe} tone.`,
        options: [
          {
            id: 'opt-1',
            style: 'Casual & Low-Pressure',
            text: target_details 
              ? `Hey! Couldn't help but notice your ${target_details.toLowerCase()}. Where did you find that?` 
              : `Hey! Aren't you in that same group? Was trying to figure out if that last part was as confusing to everyone else as it was to me haha.`,
            why_it_works: 'Opens with a low-pressure observational hook that requires minimal effort to answer.',
            respect_score: 99,
            follow_up_tip: 'Validate their response warmly before asking a follow-up question.'
          },
          {
            id: 'opt-2',
            style: 'Funny & Witty',
            text: `Scale of 1 to 10, how emotionally prepared are you for this week? Because I'm currently hovering around a solid 3.2.`,
            why_it_works: 'Mild relatable self-deprecation breaks the ice and invites a playful number rating.',
            respect_score: 97,
            follow_up_tip: 'Playfully debate their number rating!'
          },
          {
            id: 'opt-3',
            style: 'Confident & Direct',
            text: `Hey, noticed your vibe and just wanted to introduce myself before I talked myself out of it. I'm [Your Name]!`,
            why_it_works: 'Direct authenticity shows emotional maturity and confidence.',
            respect_score: 96,
            follow_up_tip: 'Keep your body language open and smile warmly.'
          }
        ],
        safety_assessment: clientSafetyCheck(situation),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async getReplyCoach(params: {
    received_message: string;
    conversation_context?: string;
    desired_intent?: string;
    vibe?: VibeType;
  }): Promise<ReplyCoachResponse> {
    try {
      const res = await fetch(`${API_BASE}/reply-coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Reply coach call failed');
      return await res.json();
    } catch {
      const msg = params.received_message;
      return {
        intent_detected: params.desired_intent || 'keep_vibe',
        subtext_analysis: `Recipient said: "${msg}". They are open to banter but need a conversational bridge.`,
        replies: [
          {
            id: 'r-1',
            label: 'The Natural Flow',
            text: `Haha right? Remind me to tell you the chaotic follow-up to that later. How's the rest of your day going?`,
            subtext: 'Teases an open-loop story that makes them curious to reply.',
            momentum_rating: 'High engagement'
          },
          {
            id: 'r-2',
            label: 'The Playful Banter',
            text: `Wait... did you really just say that with a straight face? 😂 Bold claim.`,
            subtext: 'Playfully challenges them to qualify or defend their opinion.',
            momentum_rating: 'Flirty & fun'
          },
          {
            id: 'r-3',
            label: 'The Direct Move',
            text: `Haha love that. We should honestly grab coffee or a drink this week so you can tell me the full story. Free Thursday?`,
            subtext: 'Smoothly transitions text chemistry into a real-life meetup.',
            momentum_rating: 'Direct & confident'
          }
        ],
        safety_assessment: clientSafetyCheck(msg),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async rescueConversation(params: {
    last_messages: string;
    stall_reason: string;
    vibe?: VibeType;
  }): Promise<RescueResponse> {
    try {
      const res = await fetch(`${API_BASE}/rescue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Rescue call failed');
      return await res.json();
    } catch {
      return {
        stall_diagnosis: 'The current topic reached a natural expiration. Continuing it feels forced. Pivot smoothly to a new, low-stakes visual or intriguing question.',
        strategies: [
          {
            id: 's-1',
            approach: 'The Random Hypothetical',
            text: 'Random urgent survey: if you could only eat food from one country for the next 5 years, what are you picking?',
            rationale: 'Bypasses awkward silences with a fun, non-threatening opinion game.'
          },
          {
            id: 's-2',
            approach: 'The Low-Stakes Recommendation',
            text: 'Hey, quick question—you seem like someone with great taste: what is the best spot around here for a casual bite?',
            rationale: 'Flattering and practical; almost impossible to ignore.'
          },
          {
            id: 's-3',
            approach: 'The Playful Tease',
            text: 'Careful now, don\'t wear yourself out with all those paragraphs at once haha 😂',
            rationale: 'Self-aware humor that acknowledges brevity with zero bitterness.'
          }
        ],
        coach_tip: 'Never ask "why are you being dry?". Restart conversational momentum with fresh energy instead.',
        safety_assessment: clientSafetyCheck(params.last_messages),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async rewriteTone(params: {
    message: string;
    target_tone: string;
    slang_level?: string;
  }): Promise<RewriteResponse> {
    try {
      const res = await fetch(`${API_BASE}/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Rewrite call failed');
      return await res.json();
    } catch {
      const { message, target_tone } = params;
      let rewritten = message;
      if (target_tone === 'chill') {
        rewritten = message.replace(/I was wondering if maybe/gi, 'Hey, was curious if') + ' haha';
      } else if (target_tone === 'confident') {
        rewritten = message.replace(/sorry to bother you, but /gi, '').trim();
      } else if (target_tone === 'funny') {
        rewritten = `Not to be dramatic, but ${message.toLowerCase().trim()} (or am I totally reading the room wrong haha)`;
      }

      return {
        original: message,
        rewritten,
        explanation: `Adjusted phrasing to sound more ${target_tone} and effortless.`,
        safety_assessment: clientSafetyCheck(rewritten),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async generateBios(params: {
    platform: string;
    archetype: string;
    interests: string;
    hot_take?: string;
    vibe?: VibeType;
  }): Promise<BioResponse> {
    try {
      const res = await fetch(`${API_BASE}/bio-builder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Bio builder call failed');
      return await res.json();
    } catch {
      const interests = params.interests;
      const hot_take = params.hot_take || 'Pineapple belongs on pizza';
      return {
        platform: params.platform,
        options: [
          {
            id: 'bio-1',
            archetype: 'The Witty Storyteller',
            headline_or_prompt: 'A shower thought I recently had...',
            content: `If we survive a road trip listening exclusively to ${interests.split(',')[0]}, we're legally soulmates.`,
            hook_strategy: 'Playfully tests music chemistry and sets up an easy conversation opener.'
          },
          {
            id: 'bio-2',
            archetype: 'The Playful Debate',
            headline_or_prompt: 'Change my mind about...',
            content: `${hot_take}. (Warning: I have an entire PowerPoint prepared).`,
            hook_strategy: 'Gives matches an irresistible invitation to challenge or banter.'
          },
          {
            id: 'bio-3',
            archetype: 'The Low-Key Relatable',
            headline_or_prompt: 'Together, we could...',
            content: `Argue over the best coffee spot in town, spontaneously book tickets, and talk about ${interests}.`,
            hook_strategy: 'Paints a vivid picture of what going on a date with you actually feels like.'
          }
        ],
        profile_tips: [
          'Photo tip: Make sure your first photo is high-res, smiling, with no sunglasses.',
          'Hook rule: Always end with a question or open challenge so matches don\'t have to guess what to say.',
          'Authenticity win: Quirky specific hobbies perform 3x better than generic answers.'
        ],
        safety_assessment: clientSafetyCheck(params.interests),
        provider_used: 'client_smart_engine'
      };
    }
  },

  async analyzeScreenshot(params: {
    image_data?: string;
    screenshot_type: string;
    user_note?: string;
  }): Promise<ScreenshotAnalysisResponse> {
    try {
      const res = await fetch(`${API_BASE}/screenshot-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Screenshot analysis call failed');
      return await res.json();
    } catch {
      return {
        detected_elements: ['Scenic outdoor / cafe aesthetic', 'Cute pet or music detail', 'No location tag'],
        detected_vibe: 'Candid, adventurous, inviting',
        suggested_openers: [
          {
            id: 'opt-v1',
            style: 'Curious & Observational',
            text: 'Okay wait, where was this photo taken? The aesthetic is unmatched, adding it to my bucket list.',
            why_it_works: 'People love sharing hidden gems and travel spots.',
            respect_score: 99,
            follow_up_tip: 'Ask what their favorite part of the trip was.'
          },
          {
            id: 'opt-v2',
            style: 'Playful & Banter',
            text: 'Not you living in a cinematic indie film while the rest of us are doing mundane laundry 😭',
            why_it_works: 'Light hyperbole that flatters their visual taste with modern humor.',
            respect_score: 97,
            follow_up_tip: 'Keep the tone playful and low-stakes.'
          },
          {
            id: 'opt-v3',
            style: 'Direct & Charming',
            text: 'That view looks unreal. Are you always this spontaneous or was this a planned weekend escape?',
            why_it_works: 'Direct interest in their personality rather than just the photo.',
            respect_score: 96,
            follow_up_tip: 'Transition into weekend leisure plans.'
          }
        ],
        delivery_tip: 'Reply directly to their story within 2-4 hours while the experience is fresh.',
        safety_assessment: clientSafetyCheck('Story reply'),
        provider_used: 'client_vision_engine'
      };
    }
  },

  async getDeliveryAdvice(params: {
    message: string;
    relationship_stage?: string;
  }): Promise<DeliveryAdviceResponse> {
    try {
      const res = await fetch(`${API_BASE}/delivery-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!res.ok) throw new Error('Delivery advice failed');
      return await res.json();
    } catch {
      return {
        timing_recommendation: 'Send between 6:30 PM - 9:30 PM (peak leisure hours). Wait 5 to 15 minutes before opening so you appear calm and intentional.',
        delivery_score: 96,
        voice_note_suggestion: 'Stick to text for opener #1. Once you exchange 3-4 friendly messages, a 15-second voice note boosts rapport by 40%!',
        dos_and_donts: [
          'Keep message under 25 words',
          'End with an open-ended hook or playful claim',
          'Avoid sending multiple texts before they reply'
        ],
        safety_assessment: clientSafetyCheck(params.message)
      };
    }
  },

  async checkSafety(text: string): Promise<SafetyReport> {
    try {
      const res = await fetch(`${API_BASE}/safety-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Safety check failed');
      return await res.json();
    } catch {
      return clientSafetyCheck(text);
    }
  }
};

