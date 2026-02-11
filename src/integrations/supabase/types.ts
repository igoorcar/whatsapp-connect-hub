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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      areas: {
        Row: {
          acessivel: boolean | null
          ativa: boolean | null
          capacidade_maxima: number
          coberta: boolean | null
          created_at: string
          id: string
          nome: string
          texto_aviso: string | null
          updated_at: string
        }
        Insert: {
          acessivel?: boolean | null
          ativa?: boolean | null
          capacidade_maxima?: number
          coberta?: boolean | null
          created_at?: string
          id?: string
          nome: string
          texto_aviso?: string | null
          updated_at?: string
        }
        Update: {
          acessivel?: boolean | null
          ativa?: boolean | null
          capacidade_maxima?: number
          coberta?: boolean | null
          created_at?: string
          id?: string
          nome?: string
          texto_aviso?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      atendentes: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          avatar_url: string | null
          conversas_ativas: number | null
          criado_em: string | null
          email: string
          especialidades: string[] | null
          id: string
          max_conversas_simultaneas: number | null
          nome: string
          papel: string | null
          senha_hash: string | null
          status: string | null
          ultimo_login: string | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          avatar_url?: string | null
          conversas_ativas?: number | null
          criado_em?: string | null
          email: string
          especialidades?: string[] | null
          id?: string
          max_conversas_simultaneas?: number | null
          nome: string
          papel?: string | null
          senha_hash?: string | null
          status?: string | null
          ultimo_login?: string | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          avatar_url?: string | null
          conversas_ativas?: number | null
          criado_em?: string | null
          email?: string
          especialidades?: string[] | null
          id?: string
          max_conversas_simultaneas?: number | null
          nome?: string
          papel?: string | null
          senha_hash?: string | null
          status?: string | null
          ultimo_login?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string | null
          tenant_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          tenant_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          tenant_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      banco_de_dados_agente_financeiro: {
        Row: {
          Id: string
          nome: string
          whatsapp_number: string | null
        }
        Insert: {
          Id: string
          nome: string
          whatsapp_number?: string | null
        }
        Update: {
          Id?: string
          nome?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      base_de_leads: {
        Row: {
          etapa: number | null
          nome: string
          telefone: string
          ultimamensagem: string | null
        }
        Insert: {
          etapa?: number | null
          nome: string
          telefone?: string
          ultimamensagem?: string | null
        }
        Update: {
          etapa?: number | null
          nome?: string
          telefone?: string
          ultimamensagem?: string | null
        }
        Relationships: []
      }
      bloqueios_agenda: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          horario_fim: string | null
          horario_inicio: string | null
          id: string
          motivo: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          motivo: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          motivo?: string
        }
        Relationships: []
      }
      botoes_resposta: {
        Row: {
          acao: string | null
          ativo: boolean | null
          contexto: string | null
          cor: string | null
          criado_em: string | null
          icone: string | null
          id: number
          label: string
          ordem: number | null
          produto_id: string | null
          template_id: number | null
          tipo: string
        }
        Insert: {
          acao?: string | null
          ativo?: boolean | null
          contexto?: string | null
          cor?: string | null
          criado_em?: string | null
          icone?: string | null
          id?: number
          label: string
          ordem?: number | null
          produto_id?: string | null
          template_id?: number | null
          tipo: string
        }
        Update: {
          acao?: string | null
          ativo?: boolean | null
          contexto?: string | null
          cor?: string | null
          criado_em?: string | null
          icone?: string | null
          id?: number
          label?: string
          ordem?: number | null
          produto_id?: string | null
          template_id?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "botoes_resposta_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "botoes_resposta_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_produtos_mais_enviados"
            referencedColumns: ["id"]
          },
        ]
      }
      briefing_ia_completo: {
        Row: {
          abreviacoes_permitidas: boolean | null
          apis_internas_disponiveis: string[] | null
          assuntos_proibidos: string[] | null
          campos_obrigatorios_faltantes: string[] | null
          canais_atuacao: string[] | null
          canais_suporte_oficial: string[] | null
          cases_sucesso_depoimentos: string | null
          catalogo_produtos_servicos: Json | null
          cnpj: string | null
          contato_escalonamento: string | null
          created_at: string | null
          dados_que_deve_coletar: string[] | null
          data_aprovacao: string | null
          diferenciais_competitivos: string[] | null
          elevator_pitch: string | null
          email_principal: string | null
          emojis_preferidos: string[] | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_complemento: string | null
          endereco_estado: string | null
          endereco_fisico: string | null
          endereco_logradouro: string | null
          endereco_numero: string | null
          exemplo_despedida: string | null
          exemplo_faca: string | null
          exemplo_nao_faca: string | null
          exemplo_saudacao_primeira_vez: string | null
          faq_perguntas_respostas: Json | null
          ferramenta_suporte: string | null
          ferramentas_trabalho: string[] | null
          fluxo_pergunta_preco: string | null
          fluxo_primeiro_contato: string | null
          fluxo_suporte_duvida_comum: string | null
          fontes_conhecimento_externas: string[] | null
          formas_pagamento_aceitas: string[] | null
          gatilhos_escalonamento: string[] | null
          historia_empresa: string | null
          historia_empresa_resumo: string | null
          horario_atendimento_humano: string | null
          horario_atendimento_suporte: string | null
          horario_funcionamento_atendimento: string | null
          horario_funcionamento_geral: string | null
          horario_funcionamento_suporte: string | null
          horario_funcionamento_vendas: string | null
          id: string
          ip_usuario: string | null
          link_facebook: string | null
          link_instagram: string | null
          link_linkedin: string | null
          link_outras_redes: string | null
          materiais_ricos_disponiveis: Json | null
          mensagem_padrao_transferencia: string | null
          metricas_sucesso_kpis: string[] | null
          missao_empresa: string | null
          nome_empresa: string | null
          nome_fantasia: string | null
          objetivo_principal: string | null
          observacoes_internas: string | null
          outros_fluxos_importantes: Json | null
          palavras_devemos_evitar: string[] | null
          palavras_devemos_usar: string[] | null
          personalidade_acolhedor_direto: string | null
          personalidade_entusiasmado_calmo: string | null
          personalidade_formal_informal: string | null
          personalidade_serio_divertido: string | null
          personalidade_tecnico_simples: string | null
          plataforma_ecommerce: string | null
          politica_entrega_frete: string | null
          politica_garantia_cancelamento_reembolso: string | null
          politica_trocas_devolucoes: string | null
          procedimentos_problemas_comuns: Json | null
          processo_agendamento: string | null
          processo_onboarding_clientes: string | null
          processo_venda_passo_a_passo: string | null
          produtos_servicos: Json | null
          progresso: number | null
          promessas_nao_podem_ser_feitas: string[] | null
          promocoes_descontos_ativos: Json | null
          proposta_unica_valor: string | null
          publico_alvo_detalhado: string | null
          razao_social: string | null
          redes_sociais_principais: string | null
          responsavel_aprovacao: string | null
          score_completude: number | null
          secao_atual: number | null
          sistema_crm: string | null
          sla_tempo_primeira_resposta: string | null
          status: string | null
          telefone_principal: string | null
          tempo_preenchimento_minutos: number | null
          termos_jargoes_evitar: string[] | null
          tom_voz_marca: string | null
          ultima_secao_completa: number | null
          updated_at: string | null
          user_agent: string | null
          uso_emojis: string | null
          valores_empresa: string[] | null
          valores_inegociaveis: string[] | null
          visao_empresa: string | null
          website: string | null
          website_oficial: string | null
          whatsapp_atendimento: string | null
        }
        Insert: {
          abreviacoes_permitidas?: boolean | null
          apis_internas_disponiveis?: string[] | null
          assuntos_proibidos?: string[] | null
          campos_obrigatorios_faltantes?: string[] | null
          canais_atuacao?: string[] | null
          canais_suporte_oficial?: string[] | null
          cases_sucesso_depoimentos?: string | null
          catalogo_produtos_servicos?: Json | null
          cnpj?: string | null
          contato_escalonamento?: string | null
          created_at?: string | null
          dados_que_deve_coletar?: string[] | null
          data_aprovacao?: string | null
          diferenciais_competitivos?: string[] | null
          elevator_pitch?: string | null
          email_principal?: string | null
          emojis_preferidos?: string[] | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_estado?: string | null
          endereco_fisico?: string | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          exemplo_despedida?: string | null
          exemplo_faca?: string | null
          exemplo_nao_faca?: string | null
          exemplo_saudacao_primeira_vez?: string | null
          faq_perguntas_respostas?: Json | null
          ferramenta_suporte?: string | null
          ferramentas_trabalho?: string[] | null
          fluxo_pergunta_preco?: string | null
          fluxo_primeiro_contato?: string | null
          fluxo_suporte_duvida_comum?: string | null
          fontes_conhecimento_externas?: string[] | null
          formas_pagamento_aceitas?: string[] | null
          gatilhos_escalonamento?: string[] | null
          historia_empresa?: string | null
          historia_empresa_resumo?: string | null
          horario_atendimento_humano?: string | null
          horario_atendimento_suporte?: string | null
          horario_funcionamento_atendimento?: string | null
          horario_funcionamento_geral?: string | null
          horario_funcionamento_suporte?: string | null
          horario_funcionamento_vendas?: string | null
          id?: string
          ip_usuario?: string | null
          link_facebook?: string | null
          link_instagram?: string | null
          link_linkedin?: string | null
          link_outras_redes?: string | null
          materiais_ricos_disponiveis?: Json | null
          mensagem_padrao_transferencia?: string | null
          metricas_sucesso_kpis?: string[] | null
          missao_empresa?: string | null
          nome_empresa?: string | null
          nome_fantasia?: string | null
          objetivo_principal?: string | null
          observacoes_internas?: string | null
          outros_fluxos_importantes?: Json | null
          palavras_devemos_evitar?: string[] | null
          palavras_devemos_usar?: string[] | null
          personalidade_acolhedor_direto?: string | null
          personalidade_entusiasmado_calmo?: string | null
          personalidade_formal_informal?: string | null
          personalidade_serio_divertido?: string | null
          personalidade_tecnico_simples?: string | null
          plataforma_ecommerce?: string | null
          politica_entrega_frete?: string | null
          politica_garantia_cancelamento_reembolso?: string | null
          politica_trocas_devolucoes?: string | null
          procedimentos_problemas_comuns?: Json | null
          processo_agendamento?: string | null
          processo_onboarding_clientes?: string | null
          processo_venda_passo_a_passo?: string | null
          produtos_servicos?: Json | null
          progresso?: number | null
          promessas_nao_podem_ser_feitas?: string[] | null
          promocoes_descontos_ativos?: Json | null
          proposta_unica_valor?: string | null
          publico_alvo_detalhado?: string | null
          razao_social?: string | null
          redes_sociais_principais?: string | null
          responsavel_aprovacao?: string | null
          score_completude?: number | null
          secao_atual?: number | null
          sistema_crm?: string | null
          sla_tempo_primeira_resposta?: string | null
          status?: string | null
          telefone_principal?: string | null
          tempo_preenchimento_minutos?: number | null
          termos_jargoes_evitar?: string[] | null
          tom_voz_marca?: string | null
          ultima_secao_completa?: number | null
          updated_at?: string | null
          user_agent?: string | null
          uso_emojis?: string | null
          valores_empresa?: string[] | null
          valores_inegociaveis?: string[] | null
          visao_empresa?: string | null
          website?: string | null
          website_oficial?: string | null
          whatsapp_atendimento?: string | null
        }
        Update: {
          abreviacoes_permitidas?: boolean | null
          apis_internas_disponiveis?: string[] | null
          assuntos_proibidos?: string[] | null
          campos_obrigatorios_faltantes?: string[] | null
          canais_atuacao?: string[] | null
          canais_suporte_oficial?: string[] | null
          cases_sucesso_depoimentos?: string | null
          catalogo_produtos_servicos?: Json | null
          cnpj?: string | null
          contato_escalonamento?: string | null
          created_at?: string | null
          dados_que_deve_coletar?: string[] | null
          data_aprovacao?: string | null
          diferenciais_competitivos?: string[] | null
          elevator_pitch?: string | null
          email_principal?: string | null
          emojis_preferidos?: string[] | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_complemento?: string | null
          endereco_estado?: string | null
          endereco_fisico?: string | null
          endereco_logradouro?: string | null
          endereco_numero?: string | null
          exemplo_despedida?: string | null
          exemplo_faca?: string | null
          exemplo_nao_faca?: string | null
          exemplo_saudacao_primeira_vez?: string | null
          faq_perguntas_respostas?: Json | null
          ferramenta_suporte?: string | null
          ferramentas_trabalho?: string[] | null
          fluxo_pergunta_preco?: string | null
          fluxo_primeiro_contato?: string | null
          fluxo_suporte_duvida_comum?: string | null
          fontes_conhecimento_externas?: string[] | null
          formas_pagamento_aceitas?: string[] | null
          gatilhos_escalonamento?: string[] | null
          historia_empresa?: string | null
          historia_empresa_resumo?: string | null
          horario_atendimento_humano?: string | null
          horario_atendimento_suporte?: string | null
          horario_funcionamento_atendimento?: string | null
          horario_funcionamento_geral?: string | null
          horario_funcionamento_suporte?: string | null
          horario_funcionamento_vendas?: string | null
          id?: string
          ip_usuario?: string | null
          link_facebook?: string | null
          link_instagram?: string | null
          link_linkedin?: string | null
          link_outras_redes?: string | null
          materiais_ricos_disponiveis?: Json | null
          mensagem_padrao_transferencia?: string | null
          metricas_sucesso_kpis?: string[] | null
          missao_empresa?: string | null
          nome_empresa?: string | null
          nome_fantasia?: string | null
          objetivo_principal?: string | null
          observacoes_internas?: string | null
          outros_fluxos_importantes?: Json | null
          palavras_devemos_evitar?: string[] | null
          palavras_devemos_usar?: string[] | null
          personalidade_acolhedor_direto?: string | null
          personalidade_entusiasmado_calmo?: string | null
          personalidade_formal_informal?: string | null
          personalidade_serio_divertido?: string | null
          personalidade_tecnico_simples?: string | null
          plataforma_ecommerce?: string | null
          politica_entrega_frete?: string | null
          politica_garantia_cancelamento_reembolso?: string | null
          politica_trocas_devolucoes?: string | null
          procedimentos_problemas_comuns?: Json | null
          processo_agendamento?: string | null
          processo_onboarding_clientes?: string | null
          processo_venda_passo_a_passo?: string | null
          produtos_servicos?: Json | null
          progresso?: number | null
          promessas_nao_podem_ser_feitas?: string[] | null
          promocoes_descontos_ativos?: Json | null
          proposta_unica_valor?: string | null
          publico_alvo_detalhado?: string | null
          razao_social?: string | null
          redes_sociais_principais?: string | null
          responsavel_aprovacao?: string | null
          score_completude?: number | null
          secao_atual?: number | null
          sistema_crm?: string | null
          sla_tempo_primeira_resposta?: string | null
          status?: string | null
          telefone_principal?: string | null
          tempo_preenchimento_minutos?: number | null
          termos_jargoes_evitar?: string[] | null
          tom_voz_marca?: string | null
          ultima_secao_completa?: number | null
          updated_at?: string | null
          user_agent?: string | null
          uso_emojis?: string | null
          valores_empresa?: string[] | null
          valores_inegociaveis?: string[] | null
          visao_empresa?: string | null
          website?: string | null
          website_oficial?: string | null
          whatsapp_atendimento?: string | null
        }
        Relationships: []
      }
      campaign_contacts: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          failed_at: string | null
          meta_message_id: string | null
          phone_number: string
          read_at: string | null
          sent_at: string | null
          status: string | null
          variables: Json | null
        }
        Insert: {
          campaign_id: string
          contact_id?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          meta_message_id?: string | null
          phone_number: string
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          variables?: Json | null
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          meta_message_id?: string | null
          phone_number?: string
          read_at?: string | null
          sent_at?: string | null
          status?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      campaign_messages: {
        Row: {
          campaign_id: string
          contact_id: string
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          read_at: string | null
          replied_at: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          tenant_id: string
          variables: Json | null
          whatsapp_message_id: string | null
        }
        Insert: {
          campaign_id: string
          contact_id: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          read_at?: string | null
          replied_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          tenant_id: string
          variables?: Json | null
          whatsapp_message_id?: string | null
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          read_at?: string | null
          replied_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          tenant_id?: string
          variables?: Json | null
          whatsapp_message_id?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          header_filename: string | null
          header_media_url: string | null
          id: string
          list_id: string | null
          name: string
          objective: string | null
          schedule_at: string | null
          send_in_waves: boolean | null
          started_at: string | null
          status: string
          template_id: string
          tenant_id: string
          throttle_ms: number | null
          total_contacts: number | null
          total_delivered: number | null
          total_failed: number | null
          total_read: number | null
          total_replied: number | null
          total_sent: number | null
          updated_at: string | null
          variables_mapping: Json | null
          wa_account_id: string
          wave_interval_minutes: number | null
          wave_size: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          header_filename?: string | null
          header_media_url?: string | null
          id?: string
          list_id?: string | null
          name: string
          objective?: string | null
          schedule_at?: string | null
          send_in_waves?: boolean | null
          started_at?: string | null
          status?: string
          template_id: string
          tenant_id: string
          throttle_ms?: number | null
          total_contacts?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_read?: number | null
          total_replied?: number | null
          total_sent?: number | null
          updated_at?: string | null
          variables_mapping?: Json | null
          wa_account_id: string
          wave_interval_minutes?: number | null
          wave_size?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          header_filename?: string | null
          header_media_url?: string | null
          id?: string
          list_id?: string | null
          name?: string
          objective?: string | null
          schedule_at?: string | null
          send_in_waves?: boolean | null
          started_at?: string | null
          status?: string
          template_id?: string
          tenant_id?: string
          throttle_ms?: number | null
          total_contacts?: number | null
          total_delivered?: number | null
          total_failed?: number | null
          total_read?: number | null
          total_replied?: number | null
          total_sent?: number | null
          updated_at?: string | null
          variables_mapping?: Json | null
          wa_account_id?: string
          wave_interval_minutes?: number | null
          wave_size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "contact_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_wa_account_id_fkey"
            columns: ["wa_account_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      campanhas_marketing: {
        Row: {
          created_at: string
          data_envio: string | null
          id: string
          mensagem: string
          nome: string
          publico_alvo: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          data_envio?: string | null
          id?: string
          mensagem: string
          nome: string
          publico_alvo?: Json | null
          status?: string
        }
        Update: {
          created_at?: string
          data_envio?: string | null
          id?: string
          mensagem?: string
          nome?: string
          publico_alvo?: Json | null
          status?: string
        }
        Relationships: []
      }
      client_webhooks: {
        Row: {
          client_id: string
          created_at: string | null
          events: Json | null
          failure_count: number | null
          is_active: boolean | null
          last_triggered: string | null
          secret_key: string | null
          success_count: number | null
          url: string
          webhook_id: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          events?: Json | null
          failure_count?: number | null
          is_active?: boolean | null
          last_triggered?: string | null
          secret_key?: string | null
          success_count?: number | null
          url: string
          webhook_id?: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          events?: Json | null
          failure_count?: number | null
          is_active?: boolean | null
          last_triggered?: string | null
          secret_key?: string | null
          success_count?: number | null
          url?: string
          webhook_id?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          avatar_url: string | null
          bloqueado: boolean | null
          created_at: string | null
          criado_em: string | null
          email: string | null
          id: string
          nome: string | null
          notas: string | null
          preferencias: Json | null
          status: string | null
          tags: string[] | null
          total_compras: number | null
          total_conversas: number | null
          ultima_interacao: string | null
          updated_at: string | null
          valor_total_compras: number | null
          whatsapp: string
        }
        Insert: {
          avatar_url?: string | null
          bloqueado?: boolean | null
          created_at?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          notas?: string | null
          preferencias?: Json | null
          status?: string | null
          tags?: string[] | null
          total_compras?: number | null
          total_conversas?: number | null
          ultima_interacao?: string | null
          updated_at?: string | null
          valor_total_compras?: number | null
          whatsapp: string
        }
        Update: {
          avatar_url?: string | null
          bloqueado?: boolean | null
          created_at?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          notas?: string | null
          preferencias?: Json | null
          status?: string | null
          tags?: string[] | null
          total_compras?: number | null
          total_conversas?: number | null
          ultima_interacao?: string | null
          updated_at?: string | null
          valor_total_compras?: number | null
          whatsapp?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          client_id: string
          company_name: string
          created_at: string | null
          email: string
          plan_type: string | null
          status: string | null
          subdomain: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string
          company_name: string
          created_at?: string | null
          email: string
          plan_type?: string | null
          status?: string | null
          subdomain: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          company_name?: string
          created_at?: string | null
          email?: string
          plan_type?: string | null
          status?: string | null
          subdomain?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          atualizado_em: string | null
          atualizado_por: string | null
          chave: string
          descricao: string | null
          tipo: string | null
          valor: Json
        }
        Insert: {
          atualizado_em?: string | null
          atualizado_por?: string | null
          chave: string
          descricao?: string | null
          tipo?: string | null
          valor: Json
        }
        Update: {
          atualizado_em?: string | null
          atualizado_por?: string | null
          chave?: string
          descricao?: string | null
          tipo?: string | null
          valor?: Json
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "configuracoes_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "v_conversas_ativas"
            referencedColumns: ["atendente_id"]
          },
        ]
      }
      contact_list_members: {
        Row: {
          added_at: string | null
          contact_id: string
          id: string
          list_id: string
        }
        Insert: {
          added_at?: string | null
          contact_id: string
          id?: string
          list_id: string
        }
        Update: {
          added_at?: string | null
          contact_id?: string
          id?: string
          list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_list_members_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_list_members_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "contact_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_lists: {
        Row: {
          contact_count: number | null
          created_at: string | null
          description: string | null
          filter_criteria: Json | null
          id: string
          name: string
          tenant_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          contact_count?: number | null
          created_at?: string | null
          description?: string | null
          filter_criteria?: Json | null
          id?: string
          name: string
          tenant_id: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          contact_count?: number | null
          created_at?: string | null
          description?: string | null
          filter_criteria?: Json | null
          id?: string
          name?: string
          tenant_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_lists_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          blocked_at: string | null
          blocked_reason: string | null
          created_at: string | null
          custom_fields: Json | null
          deleted_at: string | null
          email: string | null
          id: string
          is_blocked: boolean | null
          last_message_at: string | null
          last_reply_at: string | null
          name: string | null
          opt_in_date: string | null
          opt_in_source: string | null
          phone: string
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_reason?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_blocked?: boolean | null
          last_message_at?: string | null
          last_reply_at?: string | null
          name?: string | null
          opt_in_date?: string | null
          opt_in_source?: string | null
          phone: string
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_reason?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_blocked?: boolean | null
          last_message_at?: string | null
          last_reply_at?: string | null
          name?: string | null
          opt_in_date?: string | null
          opt_in_source?: string | null
          phone?: string
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      contatos_agente: {
        Row: {
          agente: string | null
          cargo: string | null
          chatwoot_contact_id: number | null
          chatwoot_conversation_id: number | null
          created_at: string | null
          data_qualificacao: string | null
          data_transferencia: string | null
          email: string | null
          empresa: string | null
          etiqueta: string | null
          etiqueta_atualizada_em: string | null
          id: number
          interesse: string | null
          interesse_duvida: string | null
          necessidade: string | null
          orcamento: string | null
          porte_empresa: string | null
          prazo: string | null
          role: string | null
          segmento: string | null
          status: string | null
          status_qualificacao: string | null
          user_name: string | null
          user_number: string | null
          user_profile: string | null
        }
        Insert: {
          agente?: string | null
          cargo?: string | null
          chatwoot_contact_id?: number | null
          chatwoot_conversation_id?: number | null
          created_at?: string | null
          data_qualificacao?: string | null
          data_transferencia?: string | null
          email?: string | null
          empresa?: string | null
          etiqueta?: string | null
          etiqueta_atualizada_em?: string | null
          id?: number
          interesse?: string | null
          interesse_duvida?: string | null
          necessidade?: string | null
          orcamento?: string | null
          porte_empresa?: string | null
          prazo?: string | null
          role?: string | null
          segmento?: string | null
          status?: string | null
          status_qualificacao?: string | null
          user_name?: string | null
          user_number?: string | null
          user_profile?: string | null
        }
        Update: {
          agente?: string | null
          cargo?: string | null
          chatwoot_contact_id?: number | null
          chatwoot_conversation_id?: number | null
          created_at?: string | null
          data_qualificacao?: string | null
          data_transferencia?: string | null
          email?: string | null
          empresa?: string | null
          etiqueta?: string | null
          etiqueta_atualizada_em?: string | null
          id?: number
          interesse?: string | null
          interesse_duvida?: string | null
          necessidade?: string | null
          orcamento?: string | null
          porte_empresa?: string | null
          prazo?: string | null
          role?: string | null
          segmento?: string | null
          status?: string | null
          status_qualificacao?: string | null
          user_name?: string | null
          user_number?: string | null
          user_profile?: string | null
        }
        Relationships: []
      }
      Content: {
        Row: {
          Content: string
          Number: number | null
        }
        Insert: {
          Content: string
          Number?: number | null
        }
        Update: {
          Content?: string
          Number?: number | null
        }
        Relationships: []
      }
      conversas: {
        Row: {
          atendente_id: string | null
          atribuida_em: string | null
          avaliacao: number | null
          canal: string | null
          cliente_id: string | null
          cliente_nome: string | null
          cliente_whatsapp: string | null
          contexto: Json | null
          created_at: string | null
          feedback_texto: string | null
          finalizada_em: string | null
          id: string
          iniciada_em: string | null
          motivo_finalizacao: string | null
          primeira_resposta_em: string | null
          prioridade: number | null
          qtd_mensagens: number | null
          status: string | null
          tags: string[] | null
          tempo_primeira_resposta: number | null
          tempo_total_atendimento: number | null
          updated_at: string | null
        }
        Insert: {
          atendente_id?: string | null
          atribuida_em?: string | null
          avaliacao?: number | null
          canal?: string | null
          cliente_id?: string | null
          cliente_nome?: string | null
          cliente_whatsapp?: string | null
          contexto?: Json | null
          created_at?: string | null
          feedback_texto?: string | null
          finalizada_em?: string | null
          id?: string
          iniciada_em?: string | null
          motivo_finalizacao?: string | null
          primeira_resposta_em?: string | null
          prioridade?: number | null
          qtd_mensagens?: number | null
          status?: string | null
          tags?: string[] | null
          tempo_primeira_resposta?: number | null
          tempo_total_atendimento?: number | null
          updated_at?: string | null
        }
        Update: {
          atendente_id?: string | null
          atribuida_em?: string | null
          avaliacao?: number | null
          canal?: string | null
          cliente_id?: string | null
          cliente_nome?: string | null
          cliente_whatsapp?: string | null
          contexto?: Json | null
          created_at?: string | null
          feedback_texto?: string | null
          finalizada_em?: string | null
          id?: string
          iniciada_em?: string | null
          motivo_finalizacao?: string | null
          primeira_resposta_em?: string | null
          prioridade?: number | null
          qtd_mensagens?: number | null
          status?: string | null
          tags?: string[] | null
          tempo_primeira_resposta?: number | null
          tempo_total_atendimento?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversas_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "v_conversas_ativas"
            referencedColumns: ["atendente_id"]
          },
          {
            foreignKeyName: "conversas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "v_conversas_ativas"
            referencedColumns: ["cliente_id"]
          },
        ]
      }
      conversas_whatsapp: {
        Row: {
          atendente: string | null
          created_at: string
          id: string
          nome_cliente: string | null
          numero_cliente: string
          status: string
          ultima_mensagem: string | null
          updated_at: string
        }
        Insert: {
          atendente?: string | null
          created_at?: string
          id?: string
          nome_cliente?: string | null
          numero_cliente: string
          status?: string
          ultima_mensagem?: string | null
          updated_at?: string
        }
        Update: {
          atendente?: string | null
          created_at?: string
          id?: string
          nome_cliente?: string | null
          numero_cliente?: string
          status?: string
          ultima_mensagem?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          ai_summary: string | null
          assigned_to: string | null
          contact_id: string
          created_at: string | null
          ctwa_clid: string | null
          first_message_at: string | null
          followup_count: number | null
          followup_enabled: boolean | null
          followup_paused: boolean | null
          id: string
          is_ctwa_lead: boolean | null
          labels: string[] | null
          last_followup_sent_at: string | null
          last_intent: string | null
          last_message_at: string | null
          messages_count: number | null
          next_followup_at: string | null
          priority: string | null
          referral_body: string | null
          referral_headline: string | null
          referral_source_url: string | null
          status: string | null
          subject: string | null
          tenant_id: string
          unread_count: number | null
          updated_at: string | null
          window_expires_at: string | null
          window_hours: number | null
        }
        Insert: {
          ai_summary?: string | null
          assigned_to?: string | null
          contact_id: string
          created_at?: string | null
          ctwa_clid?: string | null
          first_message_at?: string | null
          followup_count?: number | null
          followup_enabled?: boolean | null
          followup_paused?: boolean | null
          id?: string
          is_ctwa_lead?: boolean | null
          labels?: string[] | null
          last_followup_sent_at?: string | null
          last_intent?: string | null
          last_message_at?: string | null
          messages_count?: number | null
          next_followup_at?: string | null
          priority?: string | null
          referral_body?: string | null
          referral_headline?: string | null
          referral_source_url?: string | null
          status?: string | null
          subject?: string | null
          tenant_id: string
          unread_count?: number | null
          updated_at?: string | null
          window_expires_at?: string | null
          window_hours?: number | null
        }
        Update: {
          ai_summary?: string | null
          assigned_to?: string | null
          contact_id?: string
          created_at?: string | null
          ctwa_clid?: string | null
          first_message_at?: string | null
          followup_count?: number | null
          followup_enabled?: boolean | null
          followup_paused?: boolean | null
          id?: string
          is_ctwa_lead?: boolean | null
          labels?: string[] | null
          last_followup_sent_at?: string | null
          last_intent?: string | null
          last_message_at?: string | null
          messages_count?: number | null
          next_followup_at?: string | null
          priority?: string | null
          referral_body?: string | null
          referral_headline?: string | null
          referral_source_url?: string | null
          status?: string | null
          subject?: string | null
          tenant_id?: string
          unread_count?: number | null
          updated_at?: string | null
          window_expires_at?: string | null
          window_hours?: number | null
        }
        Relationships: []
      }
      credentials: {
        Row: {
          access_token_encrypted: string
          client_id: string
          created_at: string | null
          credential_id: string
          display_name: string | null
          is_valid: boolean | null
          last_validated_at: string | null
          messaging_limit_tier: string | null
          phone_number: string | null
          phone_number_id: string
          quality_rating: string | null
          updated_at: string | null
          waba_id: string
          webhook_subscribed: boolean | null
        }
        Insert: {
          access_token_encrypted: string
          client_id: string
          created_at?: string | null
          credential_id?: string
          display_name?: string | null
          is_valid?: boolean | null
          last_validated_at?: string | null
          messaging_limit_tier?: string | null
          phone_number?: string | null
          phone_number_id: string
          quality_rating?: string | null
          updated_at?: string | null
          waba_id: string
          webhook_subscribed?: boolean | null
        }
        Update: {
          access_token_encrypted?: string
          client_id?: string
          created_at?: string | null
          credential_id?: string
          display_name?: string | null
          is_valid?: boolean | null
          last_validated_at?: string | null
          messaging_limit_tier?: string | null
          phone_number?: string | null
          phone_number_id?: string
          quality_rating?: string | null
          updated_at?: string | null
          waba_id?: string
          webhook_subscribed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "credentials_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      eventos_agente: {
        Row: {
          created_at: string
          detalhes: Json | null
          id: number
          tipo_evento: string | null
          user_number: string | null
        }
        Insert: {
          created_at?: string
          detalhes?: Json | null
          id?: number
          tipo_evento?: string | null
          user_number?: string | null
        }
        Update: {
          created_at?: string
          detalhes?: Json | null
          id?: number
          tipo_evento?: string | null
          user_number?: string | null
        }
        Relationships: []
      }
      feriados: {
        Row: {
          ativo: boolean | null
          data: string
          id: number
          mensagem_automatica: string | null
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          data: string
          id?: number
          mensagem_automatica?: string | null
          nome: string
        }
        Update: {
          ativo?: boolean | null
          data?: string
          id?: number
          mensagem_automatica?: string | null
          nome?: string
        }
        Relationships: []
      }
      follow_up: {
        Row: {
          assunto_interesse: string | null
          ciclo_iniciado_em: string | null
          ciclo_numero: number | null
          contact_name: string | null
          conversation_id: number | null
          created_at: string | null
          etapa: string | null
          etapa_numero: number | null
          first_message_at: string | null
          followup_count: number | null
          followup_no_ciclo: number | null
          id: number
          is_ctwa_lead: boolean | null
          last_ai_response: string | null
          last_followup_sent: string | null
          last_message: string | null
          last_user_message: string | null
          mensagem_enviada: string | null
          next_followup: string | null
          referral_headline: string | null
          referral_source_url: string | null
          updated_at: string | null
          user_number: string | null
          window_expires_at: string | null
          window_hours: number | null
        }
        Insert: {
          assunto_interesse?: string | null
          ciclo_iniciado_em?: string | null
          ciclo_numero?: number | null
          contact_name?: string | null
          conversation_id?: number | null
          created_at?: string | null
          etapa?: string | null
          etapa_numero?: number | null
          first_message_at?: string | null
          followup_count?: number | null
          followup_no_ciclo?: number | null
          id?: number
          is_ctwa_lead?: boolean | null
          last_ai_response?: string | null
          last_followup_sent?: string | null
          last_message?: string | null
          last_user_message?: string | null
          mensagem_enviada?: string | null
          next_followup?: string | null
          referral_headline?: string | null
          referral_source_url?: string | null
          updated_at?: string | null
          user_number?: string | null
          window_expires_at?: string | null
          window_hours?: number | null
        }
        Update: {
          assunto_interesse?: string | null
          ciclo_iniciado_em?: string | null
          ciclo_numero?: number | null
          contact_name?: string | null
          conversation_id?: number | null
          created_at?: string | null
          etapa?: string | null
          etapa_numero?: number | null
          first_message_at?: string | null
          followup_count?: number | null
          followup_no_ciclo?: number | null
          id?: number
          is_ctwa_lead?: boolean | null
          last_ai_response?: string | null
          last_followup_sent?: string | null
          last_message?: string | null
          last_user_message?: string | null
          mensagem_enviada?: string | null
          next_followup?: string | null
          referral_headline?: string | null
          referral_source_url?: string | null
          updated_at?: string | null
          user_number?: string | null
          window_expires_at?: string | null
          window_hours?: number | null
        }
        Relationships: []
      }
      gasto_agente_financeiro: {
        Row: {
          created_at: string
          data: string | null
          Id: string | null
          iddfdfdfd: number
          nome: string | null
          tipo: Database["public"]["Enums"]["Tipo"] | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          data?: string | null
          Id?: string | null
          iddfdfdfd?: number
          nome?: string | null
          tipo?: Database["public"]["Enums"]["Tipo"] | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          data?: string | null
          Id?: string | null
          iddfdfdfd?: number
          nome?: string | null
          tipo?: Database["public"]["Enums"]["Tipo"] | null
          valor?: number | null
        }
        Relationships: []
      }
      historico_conversas: {
        Row: {
          atendente_destino: string | null
          atendente_origem: string | null
          conversa_id: string | null
          criado_em: string | null
          evento: string | null
          id: string
          motivo: string | null
        }
        Insert: {
          atendente_destino?: string | null
          atendente_origem?: string | null
          conversa_id?: string | null
          criado_em?: string | null
          evento?: string | null
          id?: string
          motivo?: string | null
        }
        Update: {
          atendente_destino?: string | null
          atendente_origem?: string | null
          conversa_id?: string | null
          criado_em?: string | null
          evento?: string | null
          id?: string
          motivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_conversas_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_conversas_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "v_conversas_ativas"
            referencedColumns: ["id"]
          },
        ]
      }
      horario_atendimento: {
        Row: {
          ativo: boolean | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id: number
        }
        Insert: {
          ativo?: boolean | null
          dia_semana: number
          hora_fim: string
          hora_inicio: string
          id?: number
        }
        Update: {
          ativo?: boolean | null
          dia_semana?: number
          hora_fim?: string
          hora_inicio?: string
          id?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_subtotal: number | null
          amount_tax: number | null
          amount_total: number
          client_id: string
          created_at: string | null
          due_date: string | null
          invoice_date: string | null
          invoice_id: string
          line_items: Json | null
          paid_at: string | null
          payment_method: string | null
          pdf_url: string | null
          status: string | null
          stripe_invoice_id: string | null
          subscription_id: string | null
        }
        Insert: {
          amount_subtotal?: number | null
          amount_tax?: number | null
          amount_total: number
          client_id: string
          created_at?: string | null
          due_date?: string | null
          invoice_date?: string | null
          invoice_id?: string
          line_items?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          pdf_url?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          subscription_id?: string | null
        }
        Update: {
          amount_subtotal?: number | null
          amount_tax?: number | null
          amount_total?: number
          client_id?: string
          created_at?: string | null
          due_date?: string | null
          invoice_date?: string | null
          invoice_id?: string
          line_items?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          pdf_url?: string | null
          status?: string | null
          stripe_invoice_id?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      "Konnect Marketingg": {
        Row: {
          created_at: string
          Desejo: string | null
          id: number
          "Nome do Lead": string | null
        }
        Insert: {
          created_at?: string
          Desejo?: string | null
          id?: number
          "Nome do Lead"?: string | null
        }
        Update: {
          created_at?: string
          Desejo?: string | null
          id?: number
          "Nome do Lead"?: string | null
        }
        Relationships: []
      }
      leads_prospeccao: {
        Row: {
          created_at: string
          decisor: string | null
          e_decisor: boolean | null
          empresa: string
          id: number
          link_facebook: string | null
          link_instagram: string | null
          link_linkedin: string | null
          observacoes: string | null
          origem: string | null
          score_final: string | null
          segmento: string | null
          telefone: string | null
          tem_fit: boolean | null
          tem_orcamento: boolean | null
          tem_urgencia: boolean | null
        }
        Insert: {
          created_at?: string
          decisor?: string | null
          e_decisor?: boolean | null
          empresa: string
          id?: number
          link_facebook?: string | null
          link_instagram?: string | null
          link_linkedin?: string | null
          observacoes?: string | null
          origem?: string | null
          score_final?: string | null
          segmento?: string | null
          telefone?: string | null
          tem_fit?: boolean | null
          tem_orcamento?: boolean | null
          tem_urgencia?: boolean | null
        }
        Update: {
          created_at?: string
          decisor?: string | null
          e_decisor?: boolean | null
          empresa?: string
          id?: number
          link_facebook?: string | null
          link_instagram?: string | null
          link_linkedin?: string | null
          observacoes?: string | null
          origem?: string | null
          score_final?: string | null
          segmento?: string | null
          telefone?: string | null
          tem_fit?: boolean | null
          tem_orcamento?: boolean | null
          tem_urgencia?: boolean | null
        }
        Relationships: []
      }
      logs_atividade: {
        Row: {
          acao: string | null
          criado_em: string | null
          dados_antigos: Json | null
          dados_novos: Json | null
          id: string
          registro_id: string | null
          tabela: string | null
          usuario_id: string | null
        }
        Insert: {
          acao?: string | null
          criado_em?: string | null
          dados_antigos?: Json | null
          dados_novos?: Json | null
          id?: string
          registro_id?: string | null
          tabela?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string | null
          criado_em?: string | null
          dados_antigos?: Json | null
          dados_novos?: Json | null
          id?: string
          registro_id?: string | null
          tabela?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      logs_auditoria: {
        Row: {
          acao: string | null
          criado_em: string | null
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          ip_address: unknown
          registro_id: string | null
          tabela: string
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          acao?: string | null
          criado_em?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: unknown
          registro_id?: string | null
          tabela: string
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string | null
          criado_em?: string | null
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: unknown
          registro_id?: string | null
          tabela?: string
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "v_conversas_ativas"
            referencedColumns: ["atendente_id"]
          },
        ]
      }
      mensagens: {
        Row: {
          atualizado_em: string | null
          conteudo: string | null
          conversa_id: string | null
          created_at: string | null
          direcao: string
          entregue_em: string | null
          enviada_em: string | null
          enviada_por: string | null
          falha_motivo: string | null
          id: string
          lida_em: string | null
          metadata: Json | null
          midia_mime_type: string | null
          midia_tamanho: number | null
          midia_url: string | null
          status: string | null
          tipo: string
          whatsapp_message_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          conteudo?: string | null
          conversa_id?: string | null
          created_at?: string | null
          direcao: string
          entregue_em?: string | null
          enviada_em?: string | null
          enviada_por?: string | null
          falha_motivo?: string | null
          id?: string
          lida_em?: string | null
          metadata?: Json | null
          midia_mime_type?: string | null
          midia_tamanho?: number | null
          midia_url?: string | null
          status?: string | null
          tipo: string
          whatsapp_message_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          conteudo?: string | null
          conversa_id?: string | null
          created_at?: string | null
          direcao?: string
          entregue_em?: string | null
          enviada_em?: string | null
          enviada_por?: string | null
          falha_motivo?: string | null
          id?: string
          lida_em?: string | null
          metadata?: Json | null
          midia_mime_type?: string | null
          midia_tamanho?: number | null
          midia_url?: string | null
          status?: string | null
          tipo?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "v_conversas_ativas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_enviada_por_fkey"
            columns: ["enviada_por"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_enviada_por_fkey"
            columns: ["enviada_por"]
            isOneToOne: false
            referencedRelation: "v_conversas_ativas"
            referencedColumns: ["atendente_id"]
          },
        ]
      }
      mensagens_whatsapp: {
        Row: {
          conteudo: string
          conversa_id: string | null
          created_at: string
          de_cliente: boolean
          id: string
          timestamp_mensagem: string
          tipo: string
        }
        Insert: {
          conteudo: string
          conversa_id?: string | null
          created_at?: string
          de_cliente?: boolean
          id?: string
          timestamp_mensagem?: string
          tipo?: string
        }
        Update: {
          conteudo?: string
          conversa_id?: string | null
          created_at?: string
          de_cliente?: boolean
          id?: string
          timestamp_mensagem?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_whatsapp_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas_whatsapp"
            referencedColumns: ["id"]
          },
        ]
      }
      message_logs: {
        Row: {
          campaign_id: string
          contact_id: string
          conversation_id: string | null
          created_at: string | null
          delivered_at: string | null
          error_code: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          is_billable: boolean | null
          phone: string
          pricing_category: string | null
          read_at: string | null
          sent_at: string | null
          status: string
          tenant_id: string
          wa_message_id: string | null
        }
        Insert: {
          campaign_id: string
          contact_id: string
          conversation_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          is_billable?: boolean | null
          phone: string
          pricing_category?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          tenant_id: string
          wa_message_id?: string | null
        }
        Update: {
          campaign_id?: string
          contact_id?: string
          conversation_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          is_billable?: boolean | null
          phone?: string
          pricing_category?: string | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          tenant_id?: string
          wa_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_logs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          client_id: string | null
          contact_id: string | null
          content: string | null
          content_type: string | null
          conversation_id: string | null
          created_at: string | null
          delivered_at: string | null
          direction: string
          failed_at: string | null
          id: string
          is_followup: boolean | null
          is_private: boolean | null
          media_metadata: Json | null
          media_url: string | null
          metadata: Json | null
          phone: string | null
          read_at: string | null
          sender_id: string | null
          sender_type: string | null
          sent_at: string | null
          status: string | null
          tenant_id: string | null
          whatsapp_error: string | null
          whatsapp_message_id: string | null
          whatsapp_status: string | null
        }
        Insert: {
          client_id?: string | null
          contact_id?: string | null
          content?: string | null
          content_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          direction: string
          failed_at?: string | null
          id?: string
          is_followup?: boolean | null
          is_private?: boolean | null
          media_metadata?: Json | null
          media_url?: string | null
          metadata?: Json | null
          phone?: string | null
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string | null
          sent_at?: string | null
          status?: string | null
          tenant_id?: string | null
          whatsapp_error?: string | null
          whatsapp_message_id?: string | null
          whatsapp_status?: string | null
        }
        Update: {
          client_id?: string | null
          contact_id?: string | null
          content?: string | null
          content_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          direction?: string
          failed_at?: string | null
          id?: string
          is_followup?: boolean | null
          is_private?: boolean | null
          media_metadata?: Json | null
          media_url?: string | null
          metadata?: Json | null
          phone?: string | null
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string | null
          sent_at?: string | null
          status?: string | null
          tenant_id?: string | null
          whatsapp_error?: string | null
          whatsapp_message_id?: string | null
          whatsapp_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_diarias: {
        Row: {
          atendente_id: string | null
          avaliacao_media: number | null
          calculado_em: string | null
          conversas_finalizadas: number | null
          data: string
          id: string
          mensagens_enviadas: number | null
          mensagens_recebidas: number | null
          taxa_resolucao: number | null
          tempo_medio_atendimento: number | null
          tempo_medio_primeira_resposta: number | null
          total_avaliacoes: number | null
          total_conversas: number | null
        }
        Insert: {
          atendente_id?: string | null
          avaliacao_media?: number | null
          calculado_em?: string | null
          conversas_finalizadas?: number | null
          data: string
          id?: string
          mensagens_enviadas?: number | null
          mensagens_recebidas?: number | null
          taxa_resolucao?: number | null
          tempo_medio_atendimento?: number | null
          tempo_medio_primeira_resposta?: number | null
          total_avaliacoes?: number | null
          total_conversas?: number | null
        }
        Update: {
          atendente_id?: string | null
          avaliacao_media?: number | null
          calculado_em?: string | null
          conversas_finalizadas?: number | null
          data?: string
          id?: string
          mensagens_enviadas?: number | null
          mensagens_recebidas?: number | null
          taxa_resolucao?: number | null
          tempo_medio_atendimento?: number | null
          tempo_medio_primeira_resposta?: number | null
          total_avaliacoes?: number | null
          total_conversas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metricas_diarias_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metricas_diarias_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "v_conversas_ativas"
            referencedColumns: ["atendente_id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          created_at: string
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_fila_mensagens: {
        Row: {
          id: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Insert: {
          id?: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Update: {
          id?: number
          id_mensagem?: string
          mensagem?: string
          telefone?: string
          timestamp?: string
        }
        Relationships: []
      }
      n8n_historico_mensagens: {
        Row: {
          created_at: string
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          read_at: string | null
          related_id: string | null
          related_type: string | null
          tenant_id: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          tenant_id: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          related_id?: string | null
          related_type?: string | null
          tenant_id?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          display_name: string
          features: Json
          is_active: boolean | null
          message_limit: number
          name: string
          plan_id: string
          price_monthly: number
        }
        Insert: {
          display_name: string
          features: Json
          is_active?: boolean | null
          message_limit: number
          name: string
          plan_id?: string
          price_monthly: number
        }
        Update: {
          display_name?: string
          features?: Json
          is_active?: boolean | null
          message_limit?: number
          name?: string
          plan_id?: string
          price_monthly?: number
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          categoria: string | null
          criado_em: string | null
          descricao: string | null
          documentos: string[] | null
          em_estoque: boolean | null
          id: string
          imagens: string[] | null
          mensagem_template: string | null
          nome: string
          preco: number | null
          sku: string | null
          tags: string[] | null
          videos: string[] | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          categoria?: string | null
          criado_em?: string | null
          descricao?: string | null
          documentos?: string[] | null
          em_estoque?: boolean | null
          id: string
          imagens?: string[] | null
          mensagem_template?: string | null
          nome: string
          preco?: number | null
          sku?: string | null
          tags?: string[] | null
          videos?: string[] | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          categoria?: string | null
          criado_em?: string | null
          descricao?: string | null
          documentos?: string[] | null
          em_estoque?: boolean | null
          id?: string
          imagens?: string[] | null
          mensagem_template?: string | null
          nome?: string
          preco?: number | null
          sku?: string | null
          tags?: string[] | null
          videos?: string[] | null
        }
        Relationships: []
      }
      replies: {
        Row: {
          campaign_id: string | null
          classification: string | null
          contact_id: string | null
          content: string | null
          created_at: string | null
          from_name: string | null
          from_phone: string
          id: string
          is_read: boolean | null
          media_id: string | null
          message_log_id: string | null
          message_type: string | null
          replied_at: string
          responded: boolean | null
          responded_at: string | null
          responded_by: string | null
          tenant_id: string
          wa_message_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          classification?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          from_name?: string | null
          from_phone: string
          id?: string
          is_read?: boolean | null
          media_id?: string | null
          message_log_id?: string | null
          message_type?: string | null
          replied_at: string
          responded?: boolean | null
          responded_at?: string | null
          responded_by?: string | null
          tenant_id: string
          wa_message_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          classification?: string | null
          contact_id?: string | null
          content?: string | null
          created_at?: string | null
          from_name?: string | null
          from_phone?: string
          id?: string
          is_read?: boolean | null
          media_id?: string | null
          message_log_id?: string | null
          message_type?: string | null
          replied_at?: string
          responded?: boolean | null
          responded_at?: string | null
          responded_by?: string | null
          tenant_id?: string
          wa_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_message_log_id_fkey"
            columns: ["message_log_id"]
            isOneToOne: false
            referencedRelation: "message_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          adultos: number
          area: string
          created_at: string
          criancas: number
          data_reserva: string
          horario_reserva: string
          id: string
          nascimento_cliente: string | null
          nome_cliente: string
          observacoes: string | null
          origem: string
          sobrenome_cliente: string
          status: string
          telefone_cliente: string
          updated_at: string
        }
        Insert: {
          adultos?: number
          area?: string
          created_at?: string
          criancas?: number
          data_reserva: string
          horario_reserva: string
          id?: string
          nascimento_cliente?: string | null
          nome_cliente: string
          observacoes?: string | null
          origem?: string
          sobrenome_cliente: string
          status?: string
          telefone_cliente: string
          updated_at?: string
        }
        Update: {
          adultos?: number
          area?: string
          created_at?: string
          criancas?: number
          data_reserva?: string
          horario_reserva?: string
          id?: string
          nascimento_cliente?: string | null
          nome_cliente?: string
          observacoes?: string | null
          origem?: string
          sobrenome_cliente?: string
          status?: string
          telefone_cliente?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          date: string
          email: string
          guests: number
          id: string
          message: string | null
          name: string
          phone: string
          source: string
          status: string
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          email: string
          guests?: number
          id?: string
          message?: string | null
          name: string
          phone: string
          source?: string
          status?: string
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          email?: string
          guests?: number
          id?: string
          message?: string | null
          name?: string
          phone?: string
          source?: string
          status?: string
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          client_id: string
          created_at: string | null
          current_period_end: string
          current_period_start: string
          payment_method: string | null
          plan_price: number | null
          plan_type: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_id: string
          trial_end: string | null
        }
        Insert: {
          cancelled_at?: string | null
          client_id: string
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          payment_method?: string | null
          plan_price?: number | null
          plan_type: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_id?: string
          trial_end?: string | null
        }
        Update: {
          cancelled_at?: string | null
          client_id?: string
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          payment_method?: string | null
          plan_price?: number | null
          plan_type?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_id?: string
          trial_end?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          actual_category: string | null
          body_text: string
          buttons_json: Json | null
          category: string
          components_json: Json | null
          created_at: string | null
          example_values: Json | null
          footer_text: string | null
          header_content: string | null
          header_type: string | null
          id: string
          language: string
          last_synced_at: string | null
          meta_template_id: string | null
          name: string
          quality_rating: string | null
          rejection_reason: string | null
          status: string
          status_updated_at: string | null
          submitted_category: string | null
          tenant_id: string
          updated_at: string | null
          wa_account_id: string
        }
        Insert: {
          actual_category?: string | null
          body_text: string
          buttons_json?: Json | null
          category: string
          components_json?: Json | null
          created_at?: string | null
          example_values?: Json | null
          footer_text?: string | null
          header_content?: string | null
          header_type?: string | null
          id?: string
          language?: string
          last_synced_at?: string | null
          meta_template_id?: string | null
          name: string
          quality_rating?: string | null
          rejection_reason?: string | null
          status?: string
          status_updated_at?: string | null
          submitted_category?: string | null
          tenant_id: string
          updated_at?: string | null
          wa_account_id: string
        }
        Update: {
          actual_category?: string | null
          body_text?: string
          buttons_json?: Json | null
          category?: string
          components_json?: Json | null
          created_at?: string | null
          example_values?: Json | null
          footer_text?: string | null
          header_content?: string | null
          header_type?: string | null
          id?: string
          language?: string
          last_synced_at?: string | null
          meta_template_id?: string | null
          name?: string
          quality_rating?: string | null
          rejection_reason?: string | null
          status?: string
          status_updated_at?: string | null
          submitted_category?: string | null
          tenant_id?: string
          updated_at?: string | null
          wa_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_wa_account_id_fkey"
            columns: ["wa_account_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_mensagem: {
        Row: {
          aprovado_whatsapp: boolean | null
          ativo: boolean | null
          atualizado_em: string | null
          categoria: string | null
          conteudo: string
          criado_em: string | null
          id: number
          midia_tipo: string | null
          midia_url: string | null
          nome: string
          template_whatsapp_id: string | null
          tipo: string | null
          variaveis: string[] | null
        }
        Insert: {
          aprovado_whatsapp?: boolean | null
          ativo?: boolean | null
          atualizado_em?: string | null
          categoria?: string | null
          conteudo: string
          criado_em?: string | null
          id?: number
          midia_tipo?: string | null
          midia_url?: string | null
          nome: string
          template_whatsapp_id?: string | null
          tipo?: string | null
          variaveis?: string[] | null
        }
        Update: {
          aprovado_whatsapp?: boolean | null
          ativo?: boolean | null
          atualizado_em?: string | null
          categoria?: string | null
          conteudo?: string
          criado_em?: string | null
          id?: number
          midia_tipo?: string | null
          midia_url?: string | null
          nome?: string
          template_whatsapp_id?: string | null
          tipo?: string | null
          variaveis?: string[] | null
        }
        Relationships: []
      }
      tenant_ai_config: {
        Row: {
          ai_avatar_url: string | null
          ai_model: string | null
          ai_name: string | null
          ai_personality: string | null
          ai_role: string | null
          ai_temperature: number | null
          auto_reply_enabled: boolean | null
          business_address: string | null
          business_description: string | null
          business_email: string | null
          business_hours: Json | null
          business_name: string | null
          business_phone: string | null
          business_segment: string | null
          business_website: string | null
          created_at: string | null
          id: string
          max_response_length: number | null
          out_of_hours_message: string | null
          response_style: string | null
          signature_text: string | null
          system_prompt: string | null
          tenant_id: string
          timezone: string | null
          transfer_to_human_keywords: string[] | null
          updated_at: string | null
          use_emojis: boolean | null
        }
        Insert: {
          ai_avatar_url?: string | null
          ai_model?: string | null
          ai_name?: string | null
          ai_personality?: string | null
          ai_role?: string | null
          ai_temperature?: number | null
          auto_reply_enabled?: boolean | null
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_hours?: Json | null
          business_name?: string | null
          business_phone?: string | null
          business_segment?: string | null
          business_website?: string | null
          created_at?: string | null
          id?: string
          max_response_length?: number | null
          out_of_hours_message?: string | null
          response_style?: string | null
          signature_text?: string | null
          system_prompt?: string | null
          tenant_id: string
          timezone?: string | null
          transfer_to_human_keywords?: string[] | null
          updated_at?: string | null
          use_emojis?: boolean | null
        }
        Update: {
          ai_avatar_url?: string | null
          ai_model?: string | null
          ai_name?: string | null
          ai_personality?: string | null
          ai_role?: string | null
          ai_temperature?: number | null
          auto_reply_enabled?: boolean | null
          business_address?: string | null
          business_description?: string | null
          business_email?: string | null
          business_hours?: Json | null
          business_name?: string | null
          business_phone?: string | null
          business_segment?: string | null
          business_website?: string | null
          created_at?: string | null
          id?: string
          max_response_length?: number | null
          out_of_hours_message?: string | null
          response_style?: string | null
          signature_text?: string | null
          system_prompt?: string | null
          tenant_id?: string
          timezone?: string | null
          transfer_to_human_keywords?: string[] | null
          updated_at?: string | null
          use_emojis?: boolean | null
        }
        Relationships: []
      }
      tenant_credentials: {
        Row: {
          created_at: string | null
          id: string
          openai_api_key: string | null
          openai_connected: boolean | null
          openai_organization_id: string | null
          tenant_id: string
          updated_at: string | null
          webhook_incoming_url: string | null
          webhook_status_url: string | null
          whatsapp_access_token: string | null
          whatsapp_business_account_id: string | null
          whatsapp_connected: boolean | null
          whatsapp_connected_at: string | null
          whatsapp_phone_number: string | null
          whatsapp_phone_number_id: string | null
          whatsapp_webhook_verify_token: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          openai_api_key?: string | null
          openai_connected?: boolean | null
          openai_organization_id?: string | null
          tenant_id: string
          updated_at?: string | null
          webhook_incoming_url?: string | null
          webhook_status_url?: string | null
          whatsapp_access_token?: string | null
          whatsapp_business_account_id?: string | null
          whatsapp_connected?: boolean | null
          whatsapp_connected_at?: string | null
          whatsapp_phone_number?: string | null
          whatsapp_phone_number_id?: string | null
          whatsapp_webhook_verify_token?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          openai_api_key?: string | null
          openai_connected?: boolean | null
          openai_organization_id?: string | null
          tenant_id?: string
          updated_at?: string | null
          webhook_incoming_url?: string | null
          webhook_status_url?: string | null
          whatsapp_access_token?: string | null
          whatsapp_business_account_id?: string | null
          whatsapp_connected?: boolean | null
          whatsapp_connected_at?: string | null
          whatsapp_phone_number?: string | null
          whatsapp_phone_number_id?: string | null
          whatsapp_webhook_verify_token?: string | null
        }
        Relationships: []
      }
      tenant_daily_metrics: {
        Row: {
          avg_resolution_time_minutes: number | null
          avg_response_time_seconds: number | null
          campaign_messages_delivered: number | null
          campaign_messages_read: number | null
          campaign_messages_sent: number | null
          created_at: string | null
          date: string
          followups_replied: number | null
          followups_sent: number | null
          id: string
          leads_from_ads: number | null
          leads_organic: number | null
          messages_by_bot: number | null
          messages_by_human: number | null
          messages_received: number | null
          messages_sent: number | null
          new_conversations: number | null
          new_leads: number | null
          resolved_conversations: number | null
          tenant_id: string | null
        }
        Insert: {
          avg_resolution_time_minutes?: number | null
          avg_response_time_seconds?: number | null
          campaign_messages_delivered?: number | null
          campaign_messages_read?: number | null
          campaign_messages_sent?: number | null
          created_at?: string | null
          date: string
          followups_replied?: number | null
          followups_sent?: number | null
          id?: string
          leads_from_ads?: number | null
          leads_organic?: number | null
          messages_by_bot?: number | null
          messages_by_human?: number | null
          messages_received?: number | null
          messages_sent?: number | null
          new_conversations?: number | null
          new_leads?: number | null
          resolved_conversations?: number | null
          tenant_id?: string | null
        }
        Update: {
          avg_resolution_time_minutes?: number | null
          avg_response_time_seconds?: number | null
          campaign_messages_delivered?: number | null
          campaign_messages_read?: number | null
          campaign_messages_sent?: number | null
          created_at?: string | null
          date?: string
          followups_replied?: number | null
          followups_sent?: number | null
          id?: string
          leads_from_ads?: number | null
          leads_organic?: number | null
          messages_by_bot?: number | null
          messages_by_human?: number | null
          messages_received?: number | null
          messages_sent?: number | null
          new_conversations?: number | null
          new_leads?: number | null
          resolved_conversations?: number | null
          tenant_id?: string | null
        }
        Relationships: []
      }
      tenant_followup_config: {
        Row: {
          avoid_lunch: boolean | null
          created_at: string | null
          ctwa_day1_strategy: string | null
          ctwa_day2_strategy: string | null
          ctwa_day3_strategy: string | null
          ctwa_delays_minutes: Json | null
          ctwa_enabled: boolean | null
          ctwa_max_followups: number | null
          enabled: boolean | null
          followup_prompt_template: string | null
          id: string
          lunch_end: string | null
          lunch_start: string | null
          organic_delays_minutes: Json | null
          organic_enabled: boolean | null
          organic_max_followups: number | null
          send_hours_end: string | null
          send_hours_start: string | null
          stop_keywords: string[] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          avoid_lunch?: boolean | null
          created_at?: string | null
          ctwa_day1_strategy?: string | null
          ctwa_day2_strategy?: string | null
          ctwa_day3_strategy?: string | null
          ctwa_delays_minutes?: Json | null
          ctwa_enabled?: boolean | null
          ctwa_max_followups?: number | null
          enabled?: boolean | null
          followup_prompt_template?: string | null
          id?: string
          lunch_end?: string | null
          lunch_start?: string | null
          organic_delays_minutes?: Json | null
          organic_enabled?: boolean | null
          organic_max_followups?: number | null
          send_hours_end?: string | null
          send_hours_start?: string | null
          stop_keywords?: string[] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          avoid_lunch?: boolean | null
          created_at?: string | null
          ctwa_day1_strategy?: string | null
          ctwa_day2_strategy?: string | null
          ctwa_day3_strategy?: string | null
          ctwa_delays_minutes?: Json | null
          ctwa_enabled?: boolean | null
          ctwa_max_followups?: number | null
          enabled?: boolean | null
          followup_prompt_template?: string | null
          id?: string
          lunch_end?: string | null
          lunch_start?: string | null
          organic_delays_minutes?: Json | null
          organic_enabled?: boolean | null
          organic_max_followups?: number | null
          send_hours_end?: string | null
          send_hours_start?: string | null
          stop_keywords?: string[] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tenant_knowledge_base: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          priority: number | null
          question: string
          tenant_id: string
          updated_at: string | null
          use_count: number | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          priority?: number | null
          question: string
          tenant_id: string
          updated_at?: string | null
          use_count?: number | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          priority?: number | null
          question?: string
          tenant_id?: string
          updated_at?: string | null
          use_count?: number | null
        }
        Relationships: []
      }
      tenant_labels: {
        Row: {
          auto_apply_rules: Json | null
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          auto_apply_rules?: Json | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          auto_apply_rules?: Json | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: []
      }
      tenant_message_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          situation: string
          tenant_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          situation: string
          tenant_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          situation?: string
          tenant_id?: string
        }
        Relationships: []
      }
      tenant_products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          details: Json | null
          display_order: number | null
          duration: string | null
          faq: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          keywords: string[] | null
          name: string
          price: number | null
          price_display: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          details?: Json | null
          display_order?: number | null
          duration?: string | null
          faq?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          keywords?: string[] | null
          name: string
          price?: number | null
          price_display?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          details?: Json | null
          display_order?: number | null
          duration?: string | null
          faq?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          keywords?: string[] | null
          name?: string
          price?: number | null
          price_display?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tenant_quick_replies: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          shortcut: string
          tenant_id: string
          title: string
          use_count: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          shortcut: string
          tenant_id: string
          title: string
          use_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          shortcut?: string
          tenant_id?: string
          title?: string
          use_count?: number | null
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          messages_used_this_month: number | null
          name: string
          owner_email: string
          plan: string
          plan_message_limit: number | null
          slug: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages_used_this_month?: number | null
          name: string
          owner_email: string
          plan?: string
          plan_message_limit?: number | null
          slug: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          messages_used_this_month?: number | null
          name?: string
          owner_email?: string
          plan?: string
          plan_message_limit?: number | null
          slug?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_login_at: string | null
          role: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          last_login_at?: string | null
          role?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          role?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          event_type: string | null
          id: string
          payload: Json | null
          processed: boolean | null
          processed_at: string | null
          processing_error: string | null
          source: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          source?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          source?: string | null
          tenant_id?: string | null
        }
        Relationships: []
      }
      whatsapp_accounts: {
        Row: {
          access_token: string
          account_status: string | null
          app_id: string | null
          app_secret: string | null
          business_id: string | null
          connected_at: string | null
          created_at: string | null
          display_phone_number: string | null
          id: string
          last_health_check: string | null
          messaging_limit_tier: string | null
          phone_number_id: string
          quality_rating: string | null
          tenant_id: string
          updated_at: string | null
          verified_name: string | null
          waba_id: string
          webhook_verify_token: string
        }
        Insert: {
          access_token: string
          account_status?: string | null
          app_id?: string | null
          app_secret?: string | null
          business_id?: string | null
          connected_at?: string | null
          created_at?: string | null
          display_phone_number?: string | null
          id?: string
          last_health_check?: string | null
          messaging_limit_tier?: string | null
          phone_number_id: string
          quality_rating?: string | null
          tenant_id: string
          updated_at?: string | null
          verified_name?: string | null
          waba_id: string
          webhook_verify_token?: string
        }
        Update: {
          access_token?: string
          account_status?: string | null
          app_id?: string | null
          app_secret?: string | null
          business_id?: string | null
          connected_at?: string | null
          created_at?: string | null
          display_phone_number?: string | null
          id?: string
          last_health_check?: string | null
          messaging_limit_tier?: string | null
          phone_number_id?: string
          quality_rating?: string | null
          tenant_id?: string
          updated_at?: string | null
          verified_name?: string | null
          waba_id?: string
          webhook_verify_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_accounts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_templates: {
        Row: {
          category: string
          components: Json
          created_at: string | null
          id: string
          language: string | null
          last_used_at: string | null
          meta_template_id: string | null
          name: string
          rejection_reason: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
          use_count: number | null
        }
        Insert: {
          category: string
          components: Json
          created_at?: string | null
          id?: string
          language?: string | null
          last_used_at?: string | null
          meta_template_id?: string | null
          name: string
          rejection_reason?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
          use_count?: number | null
        }
        Update: {
          category?: string
          components?: Json
          created_at?: string | null
          id?: string
          language?: string | null
          last_used_at?: string | null
          meta_template_id?: string | null
          name?: string
          rejection_reason?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
          use_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      v_conversas_ativas: {
        Row: {
          atendente_avatar: string | null
          atendente_id: string | null
          atendente_nome: string | null
          cliente_id: string | null
          cliente_nome: string | null
          cliente_tags: string[] | null
          id: string | null
          iniciada_em: string | null
          prioridade: number | null
          qtd_mensagens: number | null
          status: string | null
          tags: string[] | null
          tempo_espera_segundos: number | null
          ultima_mensagem: string | null
          ultima_mensagem_direcao: string | null
          ultima_mensagem_em: string | null
          whatsapp: string | null
        }
        Relationships: []
      }
      v_dashboard_metricas: {
        Row: {
          atendentes_ocupados: number | null
          atendentes_online: number | null
          avaliacao_media_hoje: number | null
          conversas_aguardando: number | null
          conversas_ativas: number | null
          conversas_finalizadas_hoje: number | null
          novos_clientes_hoje: number | null
          tempo_medio_atendimento_hoje: number | null
          tfr_medio_hoje: number | null
          total_mensagens_hoje: number | null
        }
        Relationships: []
      }
      v_followups_pendentes: {
        Row: {
          contact_name: string | null
          conversation_id: number | null
          dia_atual: string | null
          etapa: string | null
          followup_count: number | null
          horas_restantes: number | null
          is_ctwa_lead: boolean | null
          next_followup: string | null
          status: string | null
          user_number: string | null
          window_hours: number | null
        }
        Insert: {
          contact_name?: string | null
          conversation_id?: number | null
          dia_atual?: never
          etapa?: string | null
          followup_count?: number | null
          horas_restantes?: never
          is_ctwa_lead?: boolean | null
          next_followup?: string | null
          status?: never
          user_number?: string | null
          window_hours?: number | null
        }
        Update: {
          contact_name?: string | null
          conversation_id?: number | null
          dia_atual?: never
          etapa?: string | null
          followup_count?: number | null
          horas_restantes?: never
          is_ctwa_lead?: boolean | null
          next_followup?: string | null
          status?: never
          user_number?: string | null
          window_hours?: number | null
        }
        Relationships: []
      }
      v_leads_janela_ativa: {
        Row: {
          assunto_interesse: string | null
          contact_name: string | null
          etapa: string | null
          followup_count: number | null
          followups_restantes: number | null
          horas_restantes: number | null
          id: number | null
          is_ctwa_lead: boolean | null
          last_followup_sent: string | null
          last_message: string | null
          max_followups: number | null
          next_followup: string | null
          status_janela: string | null
          tipo_lead: string | null
          user_number: string | null
          window_expires_at: string | null
          window_hours: number | null
        }
        Insert: {
          assunto_interesse?: string | null
          contact_name?: string | null
          etapa?: string | null
          followup_count?: number | null
          followups_restantes?: never
          horas_restantes?: never
          id?: number | null
          is_ctwa_lead?: boolean | null
          last_followup_sent?: string | null
          last_message?: string | null
          max_followups?: never
          next_followup?: string | null
          status_janela?: never
          tipo_lead?: never
          user_number?: string | null
          window_expires_at?: string | null
          window_hours?: number | null
        }
        Update: {
          assunto_interesse?: string | null
          contact_name?: string | null
          etapa?: string | null
          followup_count?: number | null
          followups_restantes?: never
          horas_restantes?: never
          id?: number | null
          is_ctwa_lead?: boolean | null
          last_followup_sent?: string | null
          last_message?: string | null
          max_followups?: never
          next_followup?: string | null
          status_janela?: never
          tipo_lead?: never
          user_number?: string | null
          window_expires_at?: string | null
          window_hours?: number | null
        }
        Relationships: []
      }
      v_produtos_mais_enviados: {
        Row: {
          categoria: string | null
          clientes_unicos: number | null
          id: string | null
          nome: string | null
          vezes_enviado: number | null
        }
        Relationships: []
      }
      vw_briefings_resumo: {
        Row: {
          created_at: string | null
          email_principal: string | null
          id: string | null
          nome_empresa: string | null
          objetivo_principal: string | null
          progresso: number | null
          razao_social: string | null
          score_completude: number | null
          secao_atual: number | null
          status: string | null
          status_descritivo: string | null
          telefone_principal: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_principal?: string | null
          id?: string | null
          nome_empresa?: string | null
          objetivo_principal?: string | null
          progresso?: number | null
          razao_social?: string | null
          score_completude?: number | null
          secao_atual?: number | null
          status?: string | null
          status_descritivo?: never
          telefone_principal?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_principal?: string | null
          id?: string | null
          nome_empresa?: string | null
          objetivo_principal?: string | null
          progresso?: number | null
          razao_social?: string | null
          score_completude?: number | null
          secao_atual?: number | null
          status?: string | null
          status_descritivo?: never
          telefone_principal?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calcular_proximo_followup: {
        Args: { delay_minutos: number; hora_fim?: number; hora_inicio?: number }
        Returns: string
      }
      calculate_next_followup: {
        Args: {
          p_followup_count: number
          p_is_ctwa: boolean
          p_tenant_id: string
        }
        Returns: string
      }
      create_client_schema: {
        Args: { p_client_id: string }
        Returns: undefined
      }
      create_tenant_with_owner: {
        Args: {
          p_owner_email: string
          p_owner_id: string
          p_owner_name: string
          p_tenant_name: string
          p_tenant_slug: string
        }
        Returns: string
      }
      finalizar_conversa: {
        Args: {
          avaliacao_valor?: number
          conversa_uuid: string
          motivo_text?: string
        }
        Returns: boolean
      }
      get_conversas_atendente: {
        Args: { atendente_uuid: string }
        Returns: {
          cliente_nome: string
          cliente_whatsapp: string
          id: string
          nao_lidas: number
          status: string
          ultima_mensagem: string
          ultima_mensagem_em: string
        }[]
      }
      get_pending_followups: {
        Args: { p_limit?: number }
        Returns: {
          contact_id: string
          contact_name: string
          contact_phone: string
          conversation_id: string
          followup_count: number
          hours_remaining: number
          is_ctwa_lead: boolean
          last_message_at: string
          tenant_id: string
          window_expires_at: string
          window_hours: number
        }[]
      }
      get_tenant_by_phone_id: {
        Args: { p_phone_number_id: string }
        Returns: {
          openai_api_key: string
          tenant_id: string
          tenant_name: string
          whatsapp_access_token: string
          whatsapp_phone_number: string
        }[]
      }
      get_user_tenant_id: { Args: never; Returns: string }
      insert_message: {
        Args: {
          p_contact_id: string
          p_content: string
          p_content_type?: string
          p_conversation_id: string
          p_direction: string
          p_is_followup?: boolean
          p_metadata?: Json
          p_sender_id?: string
          p_sender_type: string
          p_tenant_id: string
          p_whatsapp_message_id?: string
        }
        Returns: string
      }
      insert_template:
        | {
            Args: {
              p_body_text: string
              p_category: string
              p_client_id: string
              p_footer_text: string
              p_header_content: string
              p_header_type: string
              p_language: string
              p_meta_template_id: string
              p_status: string
              p_template_name: string
            }
            Returns: {
              created_at: string
              template_id: string
            }[]
          }
        | {
            Args: {
              p_body_text: string
              p_category: string
              p_footer_text: string
              p_header_content: string
              p_header_type: string
              p_language: string
              p_meta_template_id: string
              p_schema_name: string
              p_status: string
              p_template_name: string
            }
            Returns: Json
          }
      is_service_role: { Args: never; Returns: boolean }
      match_documents: {
        Args: { filter: Json; match_count: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      reset_monthly_message_counts: { Args: never; Returns: undefined }
      update_daily_metrics: {
        Args: { p_increment?: number; p_metric: string; p_tenant_id: string }
        Returns: undefined
      }
      update_message_status: {
        Args: {
          p_error?: string
          p_status: string
          p_whatsapp_message_id: string
        }
        Returns: undefined
      }
      upsert_contact: {
        Args: {
          p_is_ctwa?: boolean
          p_name?: string
          p_phone: string
          p_source?: string
          p_source_details?: Json
          p_tenant_id: string
        }
        Returns: string
      }
      upsert_conversation: {
        Args: {
          p_contact_id: string
          p_is_ctwa?: boolean
          p_referral_data?: Json
          p_tenant_id: string
        }
        Returns: string
      }
    }
    Enums: {
      Tipo:
        | "Conta de luz"
        | "Conta de água"
        | "Internet"
        | "Wi-Fi"
        | "Celular"
        | "Plano de dados"
        | "Aluguel"
        | "Prestação do imóvel"
        | "Escola"
        | "Faculdade"
        | "Cursos"
        | "Assinaturas"
        | "Financiamento do carro"
        | "IPVA"
        | "Restaurantee"
        | "Supermercadoo"
        | "Parcelas de cartão"
        | "Lanches"
        | "Fast food"
        | "Padarias"
        | "Cafeteria"
        | "ifood"
        | "Cafés"
        | "Delivery"
        | "Transporte público"
        | "uber"
        | "99"
        | "Passagens"
        | "Farmácia"
        | "Consultas médicas"
        | "Dentista"
        | "Plano de saúde"
        | "roupas"
        | "Calçados"
        | "Cosméticos"
        | "Eletrônicos"
        | "Celular novo"
        | "Shopping"
        | "cinema"
        | "Streaming"
        | "jogos"
        | "Aplicativos"
        | "Academia"
        | "Pilates"
        | "Eventos"
        | "Festas"
        | "Poupança"
        | "Tesouro direto"
        | "Ações"
        | "Criptoativos"
        | "pet shop"
        | "Veterinário"
        | "Mensalidade de cursos"
        | "Impostos"
        | "Doações"
        | "Presentes"
        | "Viagens"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Tipo: [
        "Conta de luz",
        "Conta de água",
        "Internet",
        "Wi-Fi",
        "Celular",
        "Plano de dados",
        "Aluguel",
        "Prestação do imóvel",
        "Escola",
        "Faculdade",
        "Cursos",
        "Assinaturas",
        "Financiamento do carro",
        "IPVA",
        "Restaurantee",
        "Supermercadoo",
        "Parcelas de cartão",
        "Lanches",
        "Fast food",
        "Padarias",
        "Cafeteria",
        "ifood",
        "Cafés",
        "Delivery",
        "Transporte público",
        "uber",
        "99",
        "Passagens",
        "Farmácia",
        "Consultas médicas",
        "Dentista",
        "Plano de saúde",
        "roupas",
        "Calçados",
        "Cosméticos",
        "Eletrônicos",
        "Celular novo",
        "Shopping",
        "cinema",
        "Streaming",
        "jogos",
        "Aplicativos",
        "Academia",
        "Pilates",
        "Eventos",
        "Festas",
        "Poupança",
        "Tesouro direto",
        "Ações",
        "Criptoativos",
        "pet shop",
        "Veterinário",
        "Mensalidade de cursos",
        "Impostos",
        "Doações",
        "Presentes",
        "Viagens",
      ],
    },
  },
} as const
