import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "./constants";

async function callN8N(endpoint: string, body: any) {
  const { data, error } = await supabase.functions.invoke('n8n-proxy', {
    body: { endpoint, body: { ...body, tenant_id: TENANT_ID } }
  });

  if (error) throw error;
  return data;
}

export const api = {
  // Accounts
  validateCredentials: (credentials: any) => 
    callN8N('/webhook/validate-credentials', credentials),
  
  syncTemplates: (accountId: string) => 
    callN8N('/webhook/sync-templates', { wa_account_id: accountId }),

  // Templates
  createTemplate: (templateData: any) => 
    callN8N('/webhook/create-template', templateData),

  // Messages
  sendTextMessage: (to: string, text: string, accountId: string) => 
    callN8N('/webhook/send-text-message', { to, text, wa_account_id: accountId }),

  sendTemplate: (to: string, templateName: string, language: string, components: any[], accountId: string) => 
    callN8N('/webhook/send-template', { to, templateName, language, components, wa_account_id: accountId }),

  // Campaigns
  massDispatch: (campaignData: any) => 
    callN8N('/webhook/mass-dispatch', campaignData),
};
