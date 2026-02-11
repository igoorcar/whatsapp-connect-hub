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
    // Se data for uma string, assumimos que é o campaign_id (novo formato sugerido)
    if (typeof data === 'string') {
      return callN8N('/webhook/mass-dispatch', { 
        campaign_id: data, 
        throttle_ms: 1000 
      });
    }
    // Se data for um objeto, verificamos se já tem campaign_id ou se é o formato antigo
    const payload = data.campaign_id 
      ? { campaign_id: data.campaign_id, throttle_ms: data.throttle_ms || 1000 }
      : data; // Mantém compatibilidade com o formato antigo se necessário
      
    return callN8N('/webhook/mass-dispatch', payload);
  }
};
