export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      cell_assignments: {
        Row: {
          assigned_col_value: number | null;
          assigned_row_value: number | null;
          assigned_value: string | null;
          cell_id: string | null;
          col_index: number | null;
          created_at: string | null;
          grid_id: string | null;
          id: number;
          row_index: number | null;
          updated_at: string | null;
        };
        Insert: {
          assigned_col_value?: number | null;
          assigned_row_value?: number | null;
          assigned_value?: string | null;
          cell_id?: string | null;
          col_index?: number | null;
          created_at?: string | null;
          grid_id?: string | null;
          id?: number;
          row_index?: number | null;
          updated_at?: string | null;
        };
        Update: {
          assigned_col_value?: number | null;
          assigned_row_value?: number | null;
          assigned_value?: string | null;
          cell_id?: string | null;
          col_index?: number | null;
          created_at?: string | null;
          grid_id?: string | null;
          id?: number;
          row_index?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cell_assignments_grid_id_fkey';
            columns: ['grid_id'];
            isOneToOne: false;
            referencedRelation: 'grids';
            referencedColumns: ['uuid'];
          },
        ];
      };
      grids: {
        Row: {
          created_at: string;
          event_id: string | null;
          id: number;
          locked_at: string | null;
          name: string;
          num_cols: number;
          num_rows: number;
          total_empty_cells: number | null;
          updated_at: string | null;
          user_id: string;
          uuid: string | null;
        };
        Insert: {
          created_at?: string;
          event_id?: string | null;
          id?: number;
          locked_at?: string | null;
          name: string;
          num_cols: number;
          num_rows: number;
          total_empty_cells?: number | null;
          updated_at?: string | null;
          user_id: string;
          uuid?: string | null;
        };
        Update: {
          created_at?: string;
          event_id?: string | null;
          id?: number;
          locked_at?: string | null;
          name?: string;
          num_cols?: number;
          num_rows?: number;
          total_empty_cells?: number | null;
          updated_at?: string | null;
          user_id?: string;
          uuid?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'grids_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'nfl_schedule';
            referencedColumns: ['event_id'];
          },
        ];
      };
      nfl_schedule: {
        Row: {
          away_team_id: string | null;
          created_at: string | null;
          date: string;
          event_id: string;
          home_team_id: string | null;
          id: number;
          name: string | null;
          season_type: string | null;
          season_type_id: number | null;
          season_year: number | null;
          short_name: string | null;
          updated_at: string | null;
          venue: string | null;
          week: number | null;
        };
        Insert: {
          away_team_id?: string | null;
          created_at?: string | null;
          date: string;
          event_id: string;
          home_team_id?: string | null;
          id?: number;
          name?: string | null;
          season_type?: string | null;
          season_type_id?: number | null;
          season_year?: number | null;
          short_name?: string | null;
          updated_at?: string | null;
          venue?: string | null;
          week?: number | null;
        };
        Update: {
          away_team_id?: string | null;
          created_at?: string | null;
          date?: string;
          event_id?: string;
          home_team_id?: string | null;
          id?: number;
          name?: string | null;
          season_type?: string | null;
          season_type_id?: number | null;
          season_year?: number | null;
          short_name?: string | null;
          updated_at?: string | null;
          venue?: string | null;
          week?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'nfl_schedule_away_team_id_fkey';
            columns: ['away_team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['team_id'];
          },
          {
            foreignKeyName: 'nfl_schedule_home_team_id_fkey';
            columns: ['home_team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['team_id'];
          },
        ];
      };
      nfl_scores: {
        Row: {
          away_quarter_scores: Json | null;
          away_score: number | null;
          created_at: string | null;
          current_quarter: number;
          current_time_left: number | null;
          event_id: string;
          game_status: string;
          home_quarter_scores: Json | null;
          home_score: number | null;
          id: number;
          updated_at: string | null;
        };
        Insert: {
          away_quarter_scores?: Json | null;
          away_score?: number | null;
          created_at?: string | null;
          current_quarter: number;
          current_time_left?: number | null;
          event_id: string;
          game_status: string;
          home_quarter_scores?: Json | null;
          home_score?: number | null;
          id?: number;
          updated_at?: string | null;
        };
        Update: {
          away_quarter_scores?: Json | null;
          away_score?: number | null;
          created_at?: string | null;
          current_quarter?: number;
          current_time_left?: number | null;
          event_id?: string;
          game_status?: string;
          home_quarter_scores?: Json | null;
          home_score?: number | null;
          id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'nfl_scores_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: true;
            referencedRelation: 'nfl_schedule';
            referencedColumns: ['event_id'];
          },
        ];
      };
      teams: {
        Row: {
          abbreviation: string;
          alternate_color: string | null;
          color: string | null;
          created_at: string | null;
          display_name: string;
          id: number;
          is_active: boolean;
          location: string;
          logos: Json | null;
          name: string;
          nickname: string;
          record: string | null;
          short_display_name: string;
          slug: string;
          team_id: string;
          uid: string;
          updated_at: string | null;
        };
        Insert: {
          abbreviation: string;
          alternate_color?: string | null;
          color?: string | null;
          created_at?: string | null;
          display_name: string;
          id?: number;
          is_active: boolean;
          location: string;
          logos?: Json | null;
          name: string;
          nickname: string;
          record?: string | null;
          short_display_name: string;
          slug: string;
          team_id: string;
          uid: string;
          updated_at?: string | null;
        };
        Update: {
          abbreviation?: string;
          alternate_color?: string | null;
          color?: string | null;
          created_at?: string | null;
          display_name?: string;
          id?: number;
          is_active?: boolean;
          location?: string;
          logos?: Json | null;
          name?: string;
          nickname?: string;
          record?: string | null;
          short_display_name?: string;
          slug?: string;
          team_id?: string;
          uid?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      winners: {
        Row: {
          created_at: string | null;
          grid_id: string | null;
          id: number;
          status: string | null;
          updated_at: string | null;
          winners: Json | null;
        };
        Insert: {
          created_at?: string | null;
          grid_id?: string | null;
          id?: number;
          status?: string | null;
          updated_at?: string | null;
          winners?: Json | null;
        };
        Update: {
          created_at?: string | null;
          grid_id?: string | null;
          id?: number;
          status?: string | null;
          updated_at?: string | null;
          winners?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'winners_grid_id_fkey';
            columns: ['grid_id'];
            isOneToOne: false;
            referencedRelation: 'grids';
            referencedColumns: ['uuid'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
