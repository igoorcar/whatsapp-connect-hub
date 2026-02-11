import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "./constants";

async function callN8N(endpoint: string, body: any) {
  const { data, error } = await supabase.functions.invoke('n8n-proxy', {
    body: { 
      endpoint, 
      body: { 
        ...body, 
        tenant_id: TENANT_ID 
      } 
    }
  });

  if (error) throw error;
  return data;
}

export const api = {
  // Accounts
  validateCredentials: (credentials: any) => 
    callN8N('/webhook/validate-credentials', credentials),
  
  syncTemplates: (accountId: string) => 
    callN8N('/webhook/sync-templates', { account_id: accountId }),

  // Templates
  createTemplate: (templateData: any) => 
    callN8N('/webhook/create-template', templateData),

  // Messages
  sendTextMessage: (to: string, text: string, accountId: string) => 
    callN8N('/webhook/send-text-message', { to, text, account_id: accountId }),

  sendTemplate: (to: string, templateName: string, language: string, components: any[], accountId: string) => 
    callN8N('/webhook/send-template', { to, templateName, language, components, account_id: accountId }),

  // Campaigns
  massDispatch: (data: any) => {
    // Se data for uma string, é o campaign_id direto
    if (typeof data === 'string') {
      return callN8N('/webhook/mass-dispatch', { 
        campaign_id: data, 
        throttle_ms: 1000 
      });
    }
    
    // Se for um objeto, garantimos que enviamos no formato que o n8n espera
    // O n8n espera campaign_id na raiz do body
    const payload = {
      campaign_id: data.campaign_id || data.id, // Suporta objeto de campanha ou objeto com campaign_id
      throttle_ms: data.throttle_ms || 1000
    };
      
    return callN8N('/webhook/mass-dispatch', payload);
  }
};
