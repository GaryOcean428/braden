export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_feedback: {
        Row: {
          created_at: string | null
          feedback: string
          id: string
          idea_id: string
        }
        Insert: {
          created_at?: string | null
          feedback: string
          id?: string
          idea_id: string
        }
        Update: {
          created_at?: string | null
          feedback?: string
          id?: string
          idea_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_providers: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          model_name: string
          priority: number
          tier_required: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id: string
          model_name: string
          priority: number
          tier_required?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          model_name?: string
          priority?: number
          tier_required?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_providers_tier_required_fkey"
            columns: ["tier_required"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          key_name: string
          key_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_name: string
          key_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key_name?: string
          key_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      apprentice_profiles: {
        Row: {
          award_id: string | null
          award_template_id: string | null
          base_pay_rate: number
          billable_options: Json
          cost_config: Json
          created_at: string | null
          custom_settings: boolean
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
          work_config: Json
          year: number
        }
        Insert: {
          award_id?: string | null
          award_template_id?: string | null
          base_pay_rate: number
          billable_options?: Json
          cost_config?: Json
          created_at?: string | null
          custom_settings?: boolean
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
          work_config?: Json
          year: number
        }
        Update: {
          award_id?: string | null
          award_template_id?: string | null
          base_pay_rate?: number
          billable_options?: Json
          cost_config?: Json
          created_at?: string | null
          custom_settings?: boolean
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
          work_config?: Json
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_award_template_id"
            columns: ["award_template_id"]
            isOneToOne: false
            referencedRelation: "award_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      award_templates: {
        Row: {
          code: string
          id: string
          industry: string | null
          name: string
          rates: Json
          updated_at: string | null
        }
        Insert: {
          code: string
          id?: string
          industry?: string | null
          name: string
          rates?: Json
          updated_at?: string | null
        }
        Update: {
          code?: string
          id?: string
          industry?: string | null
          name?: string
          rates?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      awards: {
        Row: {
          award_fixed_id: number
          code: string
          created_at: string | null
          name: string
          operativefrom: string
          operativeto: string | null
          published_year: number
          version_number: number
        }
        Insert: {
          award_fixed_id?: number
          code: string
          created_at?: string | null
          name: string
          operativefrom: string
          operativeto?: string | null
          published_year: number
          version_number: number
        }
        Update: {
          award_fixed_id?: number
          code?: string
          created_at?: string | null
          name?: string
          operativefrom?: string
          operativeto?: string | null
          published_year?: number
          version_number?: number
        }
        Relationships: []
      }
      business_plan_sections: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          idea_id: string
          order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          idea_id: string
          order: number
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          idea_id?: string
          order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_plan_sections_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      calculation_templates: {
        Row: {
          apprentice_profiles: Json
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          is_public: boolean
          name: string
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          apprentice_profiles?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          is_public?: boolean
          name: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          apprentice_profiles?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          is_public?: boolean
          name?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      classification_types: {
        Row: {
          classification_fixed_id: number | null
          created_at: string | null
          id: string
          type_code: string
        }
        Insert: {
          classification_fixed_id?: number | null
          created_at?: string | null
          id?: string
          type_code: string
        }
        Update: {
          classification_fixed_id?: number | null
          created_at?: string | null
          id?: string
          type_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "classification_types_classification_fixed_id_fkey"
            columns: ["classification_fixed_id"]
            isOneToOne: false
            referencedRelation: "classifications"
            referencedColumns: ["classification_fixed_id"]
          },
        ]
      }
      classifications: {
        Row: {
          award_fixed_id: number | null
          base_rate: number | null
          base_rate_type: string | null
          calculated_rate: number | null
          calculated_rate_type: string | null
          classification: string
          classification_fixed_id: number
          classification_level: number
          created_at: string | null
          employee_rate_type_code: string | null
          operative_from: string
          operative_to: string | null
        }
        Insert: {
          award_fixed_id?: number | null
          base_rate?: number | null
          base_rate_type?: string | null
          calculated_rate?: number | null
          calculated_rate_type?: string | null
          classification: string
          classification_fixed_id?: number
          classification_level: number
          created_at?: string | null
          employee_rate_type_code?: string | null
          operative_from: string
          operative_to?: string | null
        }
        Update: {
          award_fixed_id?: number | null
          base_rate?: number | null
          base_rate_type?: string | null
          calculated_rate?: number | null
          calculated_rate_type?: string | null
          classification?: string
          classification_fixed_id?: number
          classification_level?: number
          created_at?: string | null
          employee_rate_type_code?: string | null
          operative_from?: string
          operative_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classifications_award_fixed_id_fkey"
            columns: ["award_fixed_id"]
            isOneToOne: false
            referencedRelation: "awards"
            referencedColumns: ["award_fixed_id"]
          },
        ]
      }
      clients: {
        Row: {
          contact_history: Json | null
          created_at: string
          email: string
          id: string
          last_contact_date: string | null
          name: string
          phone: string | null
          service_type: string | null
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          contact_history?: Json | null
          created_at?: string
          email: string
          id?: string
          last_contact_date?: string | null
          name: string
          phone?: string | null
          service_type?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          contact_history?: Json | null
          created_at?: string
          email?: string
          id?: string
          last_contact_date?: string | null
          name?: string
          phone?: string | null
          service_type?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      CompetencyAssessment: {
        Row: {
          assessment_date: string | null
          assessor_name: string | null
          attempt_number: number | null
          competency_unit_id: string
          created_at: string
          evidence_urls: string[] | null
          feedback: string | null
          id: string
          result: string | null
          status: string
          training_contract_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_date?: string | null
          assessor_name?: string | null
          attempt_number?: number | null
          competency_unit_id: string
          created_at?: string
          evidence_urls?: string[] | null
          feedback?: string | null
          id?: string
          result?: string | null
          status: string
          training_contract_id: string
          updated_at: string
          user_id: string
        }
        Update: {
          assessment_date?: string | null
          assessor_name?: string | null
          attempt_number?: number | null
          competency_unit_id?: string
          created_at?: string
          evidence_urls?: string[] | null
          feedback?: string | null
          id?: string
          result?: string | null
          status?: string
          training_contract_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "CompetencyAssessment_competency_unit_id_fkey"
            columns: ["competency_unit_id"]
            isOneToOne: false
            referencedRelation: "CompetencyUnit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetencyAssessment_training_contract_id_fkey"
            columns: ["training_contract_id"]
            isOneToOne: false
            referencedRelation: "TrainingContract"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetencyAssessment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Employee"
            referencedColumns: ["id"]
          },
        ]
      }
      CompetencyUnit: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          nominal_hours: number | null
          prerequisites: string[] | null
          qualification_id: string
          unit_code: string
          unit_name: string
          unit_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          nominal_hours?: number | null
          prerequisites?: string[] | null
          qualification_id: string
          unit_code: string
          unit_name: string
          unit_type: string
          updated_at: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          nominal_hours?: number | null
          prerequisites?: string[] | null
          qualification_id?: string
          unit_code?: string
          unit_name?: string
          unit_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "CompetencyUnit_qualification_id_fkey"
            columns: ["qualification_id"]
            isOneToOne: false
            referencedRelation: "Qualification"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          content: Json
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_published: boolean
          meta_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_components: {
        Row: {
          component_data: Json
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          component_data?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          component_data?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_pay_rates: {
        Row: {
          created_at: string | null
          id: string
          industry: string | null
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
          year1_rate: number
          year2_rate: number
          year3_rate: number
          year4_rate: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry?: string | null
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
          year1_rate: number
          year2_rate: number
          year3_rate: number
          year4_rate: number
        }
        Update: {
          created_at?: string | null
          id?: string
          industry?: string | null
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
          year1_rate?: number
          year2_rate?: number
          year3_rate?: number
          year4_rate?: number
        }
        Relationships: []
      }
      Customer: {
        Row: {
          apprentice_capacity: number | null
          company: string | null
          created_at: string
          created_by: string
          email: string | null
          equipment_provided: string[] | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          previous_apprentice_count: number
          professional_indemnity_expiry: string | null
          professional_indemnity_insurance: string | null
          public_liability_expiry: string | null
          public_liability_insurance: string | null
          suitable_for_first_years: boolean
          supervision_ratio: string | null
          supervisor_qualifications: Json | null
          updated_at: string
          updated_by: string
          work_cover_expiry_date: string | null
          work_cover_policy_number: string | null
          workplace_health_safety_policy: boolean
          workplace_induction_process: string | null
        }
        Insert: {
          apprentice_capacity?: number | null
          company?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          equipment_provided?: string[] | null
          id: string
          name: string
          notes?: string | null
          phone?: string | null
          previous_apprentice_count?: number
          professional_indemnity_expiry?: string | null
          professional_indemnity_insurance?: string | null
          public_liability_expiry?: string | null
          public_liability_insurance?: string | null
          suitable_for_first_years?: boolean
          supervision_ratio?: string | null
          supervisor_qualifications?: Json | null
          updated_at: string
          updated_by: string
          work_cover_expiry_date?: string | null
          work_cover_policy_number?: string | null
          workplace_health_safety_policy?: boolean
          workplace_induction_process?: string | null
        }
        Update: {
          apprentice_capacity?: number | null
          company?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          equipment_provided?: string[] | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          previous_apprentice_count?: number
          professional_indemnity_expiry?: string | null
          professional_indemnity_insurance?: string | null
          public_liability_expiry?: string | null
          public_liability_insurance?: string | null
          suitable_for_first_years?: boolean
          supervision_ratio?: string | null
          supervisor_qualifications?: Json | null
          updated_at?: string
          updated_by?: string
          work_cover_expiry_date?: string | null
          work_cover_policy_number?: string | null
          workplace_health_safety_policy?: boolean
          workplace_induction_process?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          metadata: Json | null
          name: string | null
          notes: string | null
          phone: string | null
          postal_code: string | null
          search_vector: unknown | null
          state: string | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          search_vector?: unknown | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          search_vector?: unknown | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      Employee: {
        Row: {
          created_at: string
          disability_details: string | null
          email: string
          employee_type: string | null
          employment_history: Json | null
          english_proficiency: string | null
          funding_eligibility: Json | null
          id: string
          name: string | null
          numeracy_level: string | null
          preferred_industry: string[] | null
          prior_qualifications: string[] | null
          relocation_willing: boolean
          support_requirements: string | null
          updated_at: string
          visa_expiry: string | null
          visa_status: string | null
          white_card_expiry: string | null
          white_card_number: string | null
        }
        Insert: {
          created_at?: string
          disability_details?: string | null
          email: string
          employee_type?: string | null
          employment_history?: Json | null
          english_proficiency?: string | null
          funding_eligibility?: Json | null
          id: string
          name?: string | null
          numeracy_level?: string | null
          preferred_industry?: string[] | null
          prior_qualifications?: string[] | null
          relocation_willing?: boolean
          support_requirements?: string | null
          updated_at: string
          visa_expiry?: string | null
          visa_status?: string | null
          white_card_expiry?: string | null
          white_card_number?: string | null
        }
        Update: {
          created_at?: string
          disability_details?: string | null
          email?: string
          employee_type?: string | null
          employment_history?: Json | null
          english_proficiency?: string | null
          funding_eligibility?: Json | null
          id?: string
          name?: string | null
          numeracy_level?: string | null
          preferred_industry?: string[] | null
          prior_qualifications?: string[] | null
          relocation_willing?: boolean
          support_requirements?: string | null
          updated_at?: string
          visa_expiry?: string | null
          visa_status?: string | null
          white_card_expiry?: string | null
          white_card_number?: string | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          project_id: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description: string
          id?: string
          project_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          project_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          service_type: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          service_type?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          service_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      llm_api_keys: {
        Row: {
          active: boolean | null
          api_key: string
          created_at: string | null
          id: string
          is_test: boolean | null
          provider: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          api_key: string
          created_at?: string | null
          id?: string
          is_test?: boolean | null
          provider: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          api_key?: string
          created_at?: string | null
          id?: string
          is_test?: boolean | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      llm_conversations: {
        Row: {
          created_at: string | null
          id: string
          idea_id: string
          messages: Json
          provider_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          idea_id: string
          messages?: Json
          provider_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          idea_id?: string
          messages?: Json
          provider_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "llm_conversations_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "llm_conversations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "llm_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "llm_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      llm_feedback: {
        Row: {
          content: string
          created_at: string | null
          id: string
          idea_id: string
          mode: string
          provider_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          idea_id: string
          mode: string
          provider_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          idea_id?: string
          mode?: string
          provider_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "llm_feedback_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "llm_feedback_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "llm_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "llm_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      llm_providers: {
        Row: {
          active: boolean | null
          api_key_id: string | null
          created_at: string | null
          id: string
          max_tokens: number
          model: string
          name: string
          provider: string
          rate_limit_id: string | null
          temperature: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          api_key_id?: string | null
          created_at?: string | null
          id?: string
          max_tokens: number
          model: string
          name: string
          provider: string
          rate_limit_id?: string | null
          temperature?: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          api_key_id?: string | null
          created_at?: string | null
          id?: string
          max_tokens?: number
          model?: string
          name?: string
          provider?: string
          rate_limit_id?: string | null
          temperature?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "llm_providers_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "llm_api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "llm_providers_rate_limit_id_fkey"
            columns: ["rate_limit_id"]
            isOneToOne: false
            referencedRelation: "llm_rate_limits"
            referencedColumns: ["id"]
          },
        ]
      }
      llm_rate_limits: {
        Row: {
          created_at: string | null
          current_requests: number
          current_tokens: number
          id: string
          provider_id: string
          requests_per_minute: number
          reset_at: string
          tokens_per_minute: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_requests?: number
          current_tokens?: number
          id?: string
          provider_id: string
          requests_per_minute?: number
          reset_at?: string
          tokens_per_minute?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_requests?: number
          current_tokens?: number
          id?: string
          provider_id?: string
          requests_per_minute?: number
          reset_at?: string
          tokens_per_minute?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "llm_rate_limits_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "llm_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          created_at: string
          file_path: string
          file_type: string | null
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_path: string
          file_type?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string
          file_type?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      mind_map_nodes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          idea_id: string
          parent_id: string | null
          position_x: number | null
          position_y: number | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          idea_id: string
          parent_id?: string | null
          position_x?: number | null
          position_y?: number | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          idea_id?: string
          parent_id?: string | null
          position_x?: number | null
          position_y?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mind_map_nodes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mind_map_nodes_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "mind_map_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: number
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: never
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: never
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      page_layouts: {
        Row: {
          created_at: string | null
          id: string
          is_published: boolean
          layout_data: Json
          page_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_published?: boolean
          layout_data?: Json
          page_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_published?: boolean
          layout_data?: Json
          page_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          level: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Qualification: {
        Row: {
          certLevel: string | null
          code: string
          core_units_count: number | null
          created_at: string
          delivery_mode: string | null
          description: string | null
          elective_units_count: number | null
          id: string
          industry_demand_rating: number | null
          isActive: boolean
          license_requirements: string[] | null
          name: string
          nationalCode: string | null
          nominal_hours: number | null
          qualification_level: string | null
          qualification_url: string | null
          regulatory_requirements: string[] | null
          trainingPackage: string | null
          updated_at: string
        }
        Insert: {
          certLevel?: string | null
          code: string
          core_units_count?: number | null
          created_at?: string
          delivery_mode?: string | null
          description?: string | null
          elective_units_count?: number | null
          id?: string
          industry_demand_rating?: number | null
          isActive?: boolean
          license_requirements?: string[] | null
          name: string
          nationalCode?: string | null
          nominal_hours?: number | null
          qualification_level?: string | null
          qualification_url?: string | null
          regulatory_requirements?: string[] | null
          trainingPackage?: string | null
          updated_at?: string
        }
        Update: {
          certLevel?: string | null
          code?: string
          core_units_count?: number | null
          created_at?: string
          delivery_mode?: string | null
          description?: string | null
          elective_units_count?: number | null
          id?: string
          industry_demand_rating?: number | null
          isActive?: boolean
          license_requirements?: string[] | null
          name?: string
          nationalCode?: string | null
          nominal_hours?: number | null
          qualification_level?: string | null
          qualification_url?: string | null
          regulatory_requirements?: string[] | null
          trainingPackage?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_research: {
        Row: {
          created_at: string | null
          id: string
          idea_id: string
          notes: string | null
          title: string
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          idea_id: string
          notes?: string | null
          title: string
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          idea_id?: string
          notes?: string | null
          title?: string
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_research_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_research_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string | null
          id: string
          settings: Json
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings?: Json
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          settings?: Json
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          created_at: string | null
          description: string
          features: Json
          id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          features?: Json
          id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          features?: Json
          id?: string
        }
        Relationships: []
      }
      SupportContact: {
        Row: {
          action_items: string[] | null
          contact_date: string
          contact_type: string
          created_at: string
          employer_present: boolean
          follow_up_date: string | null
          follow_up_required: boolean
          id: string
          notes: string | null
          staff_name: string
          training_discussion: boolean
          updated_at: string
          user_id: string
          wellbeing_discussion: boolean
        }
        Insert: {
          action_items?: string[] | null
          contact_date: string
          contact_type: string
          created_at?: string
          employer_present?: boolean
          follow_up_date?: string | null
          follow_up_required?: boolean
          id?: string
          notes?: string | null
          staff_name: string
          training_discussion?: boolean
          updated_at: string
          user_id: string
          wellbeing_discussion?: boolean
        }
        Update: {
          action_items?: string[] | null
          contact_date?: string
          contact_type?: string
          created_at?: string
          employer_present?: boolean
          follow_up_date?: string | null
          follow_up_required?: boolean
          id?: string
          notes?: string | null
          staff_name?: string
          training_discussion?: boolean
          updated_at?: string
          user_id?: string
          wellbeing_discussion?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "SupportContact_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Employee"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      TrainingContract: {
        Row: {
          contract_identifier: string | null
          created_at: string
          eligibleForFunding: boolean
          expiryDate: string
          federal_funded: boolean
          fee_payment_schedule: Json | null
          funding_source_details: string | null
          hoursPerWeek: number
          id: string
          isCustodial: boolean
          isExistingWorker: boolean
          isSchoolBased: boolean
          mentorship_details: Json | null
          nomination_number: string | null
          probation_completion_confirmed: boolean
          qualificationId: string | null
          required_resources: string[] | null
          startDate: string
          state_funded: boolean
          state_training_authority: string | null
          status: string
          termMonths: number
          training_fee: number | null
          training_plan_approval_date: string | null
          training_plan_approved: boolean
          updated_at: string
          variation_history: Json | null
          worksite: string | null
          worksiteAddress: string | null
        }
        Insert: {
          contract_identifier?: string | null
          created_at?: string
          eligibleForFunding: boolean
          expiryDate: string
          federal_funded?: boolean
          fee_payment_schedule?: Json | null
          funding_source_details?: string | null
          hoursPerWeek: number
          id?: string
          isCustodial: boolean
          isExistingWorker: boolean
          isSchoolBased: boolean
          mentorship_details?: Json | null
          nomination_number?: string | null
          probation_completion_confirmed?: boolean
          qualificationId?: string | null
          required_resources?: string[] | null
          startDate: string
          state_funded?: boolean
          state_training_authority?: string | null
          status: string
          termMonths: number
          training_fee?: number | null
          training_plan_approval_date?: string | null
          training_plan_approved?: boolean
          updated_at?: string
          variation_history?: Json | null
          worksite?: string | null
          worksiteAddress?: string | null
        }
        Update: {
          contract_identifier?: string | null
          created_at?: string
          eligibleForFunding?: boolean
          expiryDate?: string
          federal_funded?: boolean
          fee_payment_schedule?: Json | null
          funding_source_details?: string | null
          hoursPerWeek?: number
          id?: string
          isCustodial?: boolean
          isExistingWorker?: boolean
          isSchoolBased?: boolean
          mentorship_details?: Json | null
          nomination_number?: string | null
          probation_completion_confirmed?: boolean
          qualificationId?: string | null
          required_resources?: string[] | null
          startDate?: string
          state_funded?: boolean
          state_training_authority?: string | null
          status?: string
          termMonths?: number
          training_fee?: number | null
          training_plan_approval_date?: string | null
          training_plan_approved?: boolean
          updated_at?: string
          variation_history?: Json | null
          worksite?: string | null
          worksiteAddress?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TrainingContract_qualificationId_fkey"
            columns: ["qualificationId"]
            isOneToOne: false
            referencedRelation: "Qualification"
            referencedColumns: ["id"]
          },
        ]
      }
      TrainingPlanReview: {
        Row: {
          action_items: string[] | null
          apprentice_feedback: string | null
          attendance_rating: number | null
          created_at: string
          employer_feedback: string | null
          id: string
          next_review_date: string | null
          notes: string | null
          performance_rating: number | null
          progress: string | null
          review_date: string
          reviewer_name: string
          status: string
          training_contract_id: string
          updated_at: string
        }
        Insert: {
          action_items?: string[] | null
          apprentice_feedback?: string | null
          attendance_rating?: number | null
          created_at?: string
          employer_feedback?: string | null
          id?: string
          next_review_date?: string | null
          notes?: string | null
          performance_rating?: number | null
          progress?: string | null
          review_date: string
          reviewer_name: string
          status: string
          training_contract_id: string
          updated_at: string
        }
        Update: {
          action_items?: string[] | null
          apprentice_feedback?: string | null
          attendance_rating?: number | null
          created_at?: string
          employer_feedback?: string | null
          id?: string
          next_review_date?: string | null
          notes?: string | null
          performance_rating?: number | null
          progress?: string | null
          review_date?: string
          reviewer_name?: string
          status?: string
          training_contract_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "TrainingPlanReview_training_contract_id_fkey"
            columns: ["training_contract_id"]
            isOneToOne: false
            referencedRelation: "TrainingContract"
            referencedColumns: ["id"]
          },
        ]
      }
      user_calculations: {
        Row: {
          billable_options: Json
          cost_config: Json
          created_at: string | null
          id: string
          name: string
          pay_rate: number
          result: Json
          updated_at: string | null
          user_id: string
          work_config: Json
        }
        Insert: {
          billable_options: Json
          cost_config: Json
          created_at?: string | null
          id?: string
          name: string
          pay_rate: number
          result: Json
          updated_at?: string | null
          user_id: string
          work_config: Json
        }
        Update: {
          billable_options?: Json
          cost_config?: Json
          created_at?: string | null
          id?: string
          name?: string
          pay_rate?: number
          result?: Json
          updated_at?: string | null
          user_id?: string
          work_config?: Json
        }
        Relationships: []
      }
      user_organizations: {
        Row: {
          created_at: string | null
          id: string
          org_id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          org_id: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          org_id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_organizations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          settings: Json | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          settings?: Json | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          user_id: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          active: boolean | null
          created_at: string | null
          expires_at: string | null
          tier_id: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          tier_id?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          tier_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      WorkplaceInspection: {
        Row: {
          attachments: string[] | null
          created_at: string
          customer_id: string
          findings: string | null
          follow_up_date: string | null
          follow_up_required: boolean
          id: string
          inspection_date: string
          inspector_name: string
          recommendations: string | null
          safety_rating: number | null
          status: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string
          customer_id: string
          findings?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean
          id?: string
          inspection_date: string
          inspector_name: string
          recommendations?: string | null
          safety_rating?: number | null
          status: string
          updated_at: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string
          customer_id?: string
          findings?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean
          id?: string
          inspection_date?: string
          inspector_name?: string
          recommendations?: string | null
          safety_rating?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "WorkplaceInspection_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      current_user_info: {
        Row: {
          email: string | null
          id: string | null
          is_admin: boolean | null
          roles: string[] | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_bypass: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      allow_if_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      bypass_rls: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      bypass_rls_for_user: {
        Args: Record<PropertyKey, never> | { input_user_id: string }
        Returns: undefined
      }
      fix_user_access: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_llm_api_key: {
        Args: Record<PropertyKey, never> | { provider_name: string }
        Returns: string
      }
      get_my_user_info: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      has_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_admin_role: {
        Args: { input_id?: string }
        Returns: boolean
      }
      has_role_access: {
        Args: Record<PropertyKey, never> | { required_role: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_braden_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_developer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_developer_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      version: {
        Args: Record<PropertyKey, never>
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
