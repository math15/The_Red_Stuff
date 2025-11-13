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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          text?: string;
          reference?: string;
          theme?: string;
          tags?: string[];
          context?: string | null;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
