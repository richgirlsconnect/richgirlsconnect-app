export type PipelineStage = 'Found' | 'Chatting' | 'Close' | 'Dating' | 'Visit Planned' | 'Partner';

export interface PresidentialDetails {
  country: string;
  parent_title: string;
  presidential_term: string;
  official_residence: string;
  security_protocol: string;
  whatsapp: string;
  verified_credentials: boolean;
  relationship_intent: string;
}

export interface Girl {
  id: string;
  name: string;
  bio: string;
  ig: string;
  location: string;
  ethnicity: string;
  age: number;
  tags: string[];
  match_score: number;
  match_reason: string;
  stage: PipelineStage;
  avatar_url: string;
  public_likes_black_men: boolean;
  created_at: string;
  estimated_net_worth?: string;
  verified?: boolean;
  whatsapp?: string;
  is_presidential_daughter?: boolean;
  presidential_details?: PresidentialDetails;
}

export interface Message {
  id: string;
  girl_id: string;
  sender: 'user' | 'girl';
  text: string;
  created_at: string;
}

export interface Memory {
  id: string;
  girl_id: string;
  birthday: string;
  business: string;
  hobbies: string;
  food: string;
  last_contact: string;
  notes: string;
  updated_at: string;
  gift_ideas?: string;
  relationship_goals?: string;
}

export interface DatePlan {
  id: string;
  girl_id: string;
  girl_name: string;
  girl_avatar: string;
  title: string;
  date_time: string; // ISO string
  city: string;
  venue: string;
  experience_type: string;
  notes?: string;
  budget_tier?: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Rescheduled';
  created_at: string;
}

export interface GeminiSuggestionResponse {
  primaryReply: string;
  rationale: string;
  alternatives: Array<{
    label: string;
    text: string;
  }>;
  wingmanTip?: string;
}

// Mode 2: Elite Private Matchmaking Types
export interface Client {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  avatar_url: string;
  photos: string[];
  partner_preference: string;
  wealth_level: string;
  bio: string;
  what_they_want: string;
  is_public: boolean; // Always false for private matchmaking
  whatsapp: string;
  email: string;
  consultation_paid: boolean;
  consultation_amount?: number;
  consultation_gateway?: 'Paystack' | 'Stripe';
  created_at: string;
}

export type MatchStatus = 'pending' | 'approved' | 'rejected';

export interface Match {
  id: string;
  client_a_id: string;
  client_b_id: string;
  client_a?: Client;
  client_b?: Client;
  score: number; // 0 - 100
  reason: string;
  status: MatchStatus;
  created_at: string;
  approved_at?: string | null;
}

export interface MatchMessage {
  id: string;
  match_id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  created_at: string;
  is_admin_note?: boolean;
}

export interface Consultation {
  id: string;
  client_name: string;
  email: string;
  whatsapp: string;
  amount: number;
  currency: string;
  payment_gateway: 'Paystack' | 'Stripe';
  payment_status: 'paid' | 'pending' | 'failed';
  reference: string;
  created_at: string;
}

export interface AIChatSummary {
  sentiment: string;
  chemistryLevel: string;
  chemistryScore: number;
  redFlags: string;
  suggestion: string;
  conciergeAdvice: string;
}

