export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      saved_papers: {
        Row: {
          id: string
          user_id: string
          paper_id: string
          title: string
          authors: string[]
          abstract: string
          url: string
          source: string
          saved_at: string
          notes: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          paper_id: string
          title: string
          authors: string[]
          abstract: string
          url: string
          source: string
          saved_at?: string
          notes?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          paper_id?: string
          title?: string
          authors?: string[]
          abstract?: string
          url?: string
          source?: string
          saved_at?: string
          notes?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_papers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          query: string
          filters: Json | null
          results_count: number
          searched_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query: string
          filters?: Json | null
          results_count: number
          searched_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          query?: string
          filters?: Json | null
          results_count?: number
          searched_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
