export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ianga_friend_ids: {
        Row: {
          pid: string
          public_id: string
        }
        Insert: {
          pid: string
          public_id: string
        }
        Update: {
          pid?: string
          public_id?: string
        }
        Relationships: []
      }
      ianga_friend_messages: {
        Row: {
          created_at: string
          handled: boolean
          id: string
          kind: string
          payload: Json
          recipient: string
          sender: string
        }
        Insert: {
          created_at?: string
          handled?: boolean
          id?: string
          kind: string
          payload?: Json
          recipient: string
          sender: string
        }
        Update: {
          created_at?: string
          handled?: boolean
          id?: string
          kind?: string
          payload?: Json
          recipient?: string
          sender?: string
        }
        Relationships: []
      }
      ianga_profiles: {
        Row: {
          data: Json
          name: string
          pid: string
          updated_at: string
        }
        Insert: {
          data: Json
          name: string
          pid: string
          updated_at?: string
        }
        Update: {
          data?: Json
          name?: string
          pid?: string
          updated_at?: string
        }
        Relationships: []
      }
      ianga_tourneys: {
        Row: {
          code: string
          data: Json
          host_key: string | null
          updated_at: string
        }
        Insert: {
          code: string
          data: Json
          host_key?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          data?: Json
          host_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      if_inbox: { Args: { _pid: string; _pin: string }; Returns: Json }
      if_register: {
        Args: { _id: string; _pid: string; _pin: string }
        Returns: undefined
      }
      if_reply: {
        Args: { _accept: boolean; _message: string; _pid: string; _pin: string }
        Returns: undefined
      }
      if_send: {
        Args: {
          _id: string
          _kind: string
          _name: string
          _payload: Json
          _pid: string
          _pin: string
        }
        Returns: string
      }
      ip_delete: { Args: { _pid: string; _pin: string }; Returns: undefined }
      ip_fetch: { Args: { _pid: string; _pin: string }; Returns: Json }
      ip_salts: {
        Args: { _name: string }
        Returns: {
          kv: number
          pid: string
          salt: string
        }[]
      }
      ip_save: {
        Args: { _data: Json; _pid: string; _pin: string }
        Returns: undefined
      }
      ot_advance: {
        Args: { _code: string; _data: Json; _key: string }
        Returns: undefined
      }
      ot_career_test: {
        Args: { _code: string; _pid: string; _pin: string; _result: Json }
        Returns: undefined
      }
      ot_chat: {
        Args: { _code: string; _pid: string; _pin: string; _text: string }
        Returns: undefined
      }
      ot_create: {
        Args: { _code: string; _data: Json; _key: string }
        Returns: undefined
      }
      ot_join: { Args: { _code: string; _name: string }; Returns: Json }
      ot_leave: {
        Args: { _code: string; _pid: string; _pin: string }
        Returns: undefined
      }
      ot_report: {
        Args: { _code: string; _idx: number; _sa: number; _sb: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
