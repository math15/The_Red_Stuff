export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      opportunities: {
        Row: {
          id: string;
          organization_name: string;
          organization_type: string;
          opportunity_title: string;
          description: string;
          time_commitment: string;
          location: Json;
          skills_needed: string[];
          cause_categories: string[];
          related_quotes: string[];
          urgency_level: string;
          contact_info: Json;
          website_url: string | null;
          application_url: string | null;
          verified_status: boolean;
          date_added: string;
          active_status: boolean;
          image_url: string | null;
          highlight_reason: string | null;
          virtual_opportunity: boolean;
          minimum_age: number | null;
          maximum_participants: number | null;
          embedding: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_name: string;
          organization_type: string;
          opportunity_title: string;
          description: string;
          time_commitment: string;
          location: Json;
          skills_needed?: string[];
          cause_categories?: string[];
          related_quotes?: string[];
          urgency_level?: string;
          contact_info?: Json;
          website_url?: string | null;
          application_url?: string | null;
          verified_status?: boolean;
          date_added?: string;
          active_status?: boolean;
          image_url?: string | null;
          highlight_reason?: string | null;
          virtual_opportunity?: boolean;
          minimum_age?: number | null;
          maximum_participants?: number | null;
          embedding?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          organization_name?: string;
          organization_type?: string;
          opportunity_title?: string;
          description?: string;
          time_commitment?: string;
          location?: Json;
          skills_needed?: string[];
          cause_categories?: string[];
          related_quotes?: string[];
          urgency_level?: string;
          contact_info?: Json;
          website_url?: string | null;
          application_url?: string | null;
          verified_status?: boolean;
          date_added?: string;
          active_status?: boolean;
          image_url?: string | null;
          highlight_reason?: string | null;
          virtual_opportunity?: boolean;
          minimum_age?: number | null;
          maximum_participants?: number | null;
          embedding?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          text: string;
          reference: string;
          theme: string;
          tags: string[];
          context: string | null;
          embedding: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          reference: string;
          theme: string;
          tags?: string[];
          context?: string | null;
          embedding?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          text?: string;
          reference?: string;
          theme?: string;
          tags?: string[];
          context?: string | null;
          embedding?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      opportunity_interest: {
        Row: {
          id: string;
          opportunity_id: string;
          user_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          opportunity_id: string;
          user_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          opportunity_id?: string;
          user_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      news_events: {
        Row: {
          id: string;
          external_id: string | null;
          headline: string;
          summary: string | null;
          source: string | null;
          url: string | null;
          region: string | null;
          category: string | null;
          published_at: string | null;
          related_quote_ids: string[];
          related_opportunity_ids: string[];
          embedding: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          external_id?: string | null;
          headline: string;
          summary?: string | null;
          source?: string | null;
          url?: string | null;
          region?: string | null;
          category?: string | null;
          published_at?: string | null;
          related_quote_ids?: string[];
          related_opportunity_ids?: string[];
          embedding?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          external_id?: string | null;
          headline?: string;
          summary?: string | null;
          source?: string | null;
          url?: string | null;
          region?: string | null;
          category?: string | null;
          published_at?: string | null;
          related_quote_ids?: string[];
          related_opportunity_ids?: string[];
          embedding?: Json | null;
          created_at?: string | null;
        };
      };
      news_quote_matches: {
        Row: {
          id: string;
          news_event_id: string;
          quote_id: string;
          similarity: number;
          selected: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          news_event_id: string;
          quote_id: string;
          similarity: number;
          selected?: boolean;
          created_at?: string;
        };
        Update: {
          news_event_id?: string;
          quote_id?: string;
          similarity?: number;
          selected?: boolean;
          created_at?: string;
        };
      };
      news_opportunity_matches: {
        Row: {
          id: string;
          news_event_id: string;
          opportunity_id: string;
          similarity: number;
          relevance_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          news_event_id: string;
          opportunity_id: string;
          similarity: number;
          relevance_score: number;
          created_at?: string;
        };
        Update: {
          news_event_id?: string;
          opportunity_id?: string;
          similarity?: number;
          relevance_score?: number;
          created_at?: string;
        };
      };
      user_engagement: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          event_type: string;
          event_data: Json | null;
          page_url: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          event_type: string;
          event_data?: Json | null;
          page_url?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string | null;
          session_id?: string | null;
          event_type?: string;
          event_data?: Json | null;
          page_url?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
      };
      quote_saves: {
        Row: {
          id: string;
          user_id: string;
          quote_id: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quote_id: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          quote_id?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      match_feedback: {
        Row: {
          id: string;
          user_id: string | null;
          match_type: string;
          event_id: string | null;
          question_id: string | null;
          quote_id: string | null;
          opportunity_id: string | null;
          rating: number | null;
          helpful: boolean | null;
          feedback_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          match_type: string;
          event_id?: string | null;
          question_id?: string | null;
          quote_id?: string | null;
          opportunity_id?: string | null;
          rating?: number | null;
          helpful?: boolean | null;
          feedback_text?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string | null;
          match_type?: string;
          event_id?: string | null;
          question_id?: string | null;
          quote_id?: string | null;
          opportunity_id?: string | null;
          rating?: number | null;
          helpful?: boolean | null;
          feedback_text?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
