/**
 * Supabase Database Types
 * 
 * This file is used by @nuxtjs/supabase for TypeScript type definitions.
 * 
 * To generate types from your Supabase database:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Run: supabase gen types typescript --project-id YOUR_PROJECT_ID > app/types/database.types.ts
 * 
 * For now, this is a placeholder that exports an empty Database type.
 */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

