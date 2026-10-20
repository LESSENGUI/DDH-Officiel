export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type LocaleCode = "fr" | "en" | "es" | "ar" | "pt";
export type ContentStatus = "draft" | "pending_review" | "published" | "archived";
export type RoleCode = "SUPERADMIN" | "ADMIN" | "REDACTEUR" | "GESTIONNAIRE_MEDIA";

type Table<Row, RequiredInsert extends keyof Row = never> = {
  Row: Row;
  Insert: Pick<Row, RequiredInsert> & Partial<Omit<Row, RequiredInsert>>;
  Update: Partial<Row>;
  Relationships: [];
};

type IdRow = { id: string; created_at: string; updated_at: string };

export type Database = {
  public: {
    Tables: {
      profiles: Table<{ id: string; email: string; full_name: string | null; is_active: boolean; created_at: string; updated_at: string }>;
      roles: Table<{ id: string; code: RoleCode; name: string; description: string | null; created_at: string }>;
      permissions: Table<{ id: string; code: string; description: string | null; created_at: string }>;
      role_permissions: Table<{ role_id: string; permission_id: string; created_at: string }, "role_id" | "permission_id">;
      user_roles: Table<{ user_id: string; role_id: string; granted_by: string | null; created_at: string }, "user_id" | "role_id">;
      pages: Table<IdRow & { slug: string; status: ContentStatus; is_public: boolean; created_by: string | null; updated_by: string | null; published_at: string | null }, "slug">;
      translations: Table<IdRow & { page_id: string | null; action_id: string | null; publication_id: string | null; news_id: string | null; locale: LocaleCode; title: string; excerpt: string | null; body: string | null; metadata: Json; created_by: string | null; updated_by: string | null }, "locale" | "title">;
      actions: Table<IdRow & { slug: string; category: string | null; status: ContentStatus; is_public: boolean; starts_at: string | null; ends_at: string | null; created_by: string | null; updated_by: string | null; published_at: string | null }, "slug">;
      publications: Table<IdRow & { slug: string; publication_type: string; status: ContentStatus; is_public: boolean; published_at: string | null; created_by: string | null; updated_by: string | null }, "slug" | "publication_type">;
      news: Table<IdRow & { slug: string; status: ContentStatus; is_public: boolean; published_at: string | null; created_by: string | null; updated_by: string | null }, "slug">;
      media: Table<IdRow & { bucket_id: string; object_path: string; original_name: string; mime_type: string; size_bytes: number; is_public: boolean; status: ContentStatus; alt_text: string | null; uploaded_by: string; created_by: string; updated_by: string }, "bucket_id" | "object_path" | "original_name" | "mime_type" | "size_bytes">;
      contact_messages: Table<{ id: string; category: string; name: string; organization: string | null; email: string; phone: string | null; subject: string; body: string; consent: boolean; status: string; assigned_to: string | null; internal_note: string | null; created_at: string; updated_at: string }, "category" | "name" | "email" | "subject" | "body" | "consent">;
      site_settings: Table<{ key: string; value: Json; is_public: boolean; updated_by: string | null; updated_at: string }, "key" | "value">;
      audit_logs: Table<{ id: string; actor_id: string | null; action: string; entity_type: string; entity_id: string | null; metadata: Json; created_at: string }, "action" | "entity_type">;
    };
    Views: Record<string, never>;
    Functions: {
      has_permission: { Args: { permission_code: string }; Returns: boolean };
      current_user_permissions: { Args: Record<string, never>; Returns: string[] };
      promote_first_superadmin: { Args: { target_user_id: string }; Returns: undefined };
    };
    Enums: {
      locale_code: LocaleCode;
      content_status: ContentStatus;
      role_code: RoleCode;
    };
    CompositeTypes: Record<string, never>;
  };
};
