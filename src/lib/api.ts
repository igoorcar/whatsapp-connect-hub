import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "./constants";

async function callN8N(endpoint: string, body: any) {
  // Regra Geral: Se houver account_id, garante que wa_account_id também exista com o mesmo valor
  // Isso resolve a obrigatoriedade exigida pelo n8n
  const accountId = body.account_id || body.wa_account_id;
  
  const normalizedBody = {
    ...body,
    tenant_id: TENANT_ID,
    ...(accountId ? { wa_account_id: accountId, account_id: accountId } : {})
  };

  const { data, error } = await supabase.functions.invoke('n8n-proxy', {
    body: { 
      endpoint, 
      body: normalizedBody
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
    
    const payload = {
      campaign_id: data.campaign_id || data.id,
      throttle_ms: data.throttle_ms || 1000,
      // Se a campanha tiver um account_id vinculado, ele será normalizado dentro do callN8N
      account_id: data.account_id || data.wa_account_id
    };
      
    return callN8N('/webhook/mass-dispatch', payload);
  }
};
