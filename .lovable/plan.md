

# Plan: Wire Up All Buttons with N8N Webhook Integration

## Problem
All action buttons across the app are non-functional -- they render but have no onClick handlers or logic. There's also no API layer (`lib/api.ts`) and no N8N proxy (since this is Vite/React, not Next.js, we need a Supabase Edge Function as proxy).

## Architecture

Since this project uses Vite + React (not Next.js), we cannot create `/api/n8n` routes. Instead, we'll create a **Supabase Edge Function** (`n8n-proxy`) to proxy all calls to the N8N instance at `https://n8n-n8n.gycquy.easypanel.host`.

```text
Frontend (React) --> Edge Function (n8n-proxy) --> N8N Workflows --> Meta API
```

## Changes Summary

### 1. Create Edge Function: `supabase/functions/n8n-proxy/index.ts`
- Accepts POST with `{ endpoint, body }`
- Forwards to N8N base URL
- Handles empty responses safely
- CORS headers included

### 2. Create API Layer: `src/lib/api.ts`
- All N8N webhook calls as typed functions:
  - `validateCredentials()` --> `/webhook/validate-credentials`
  - `createTemplate()` --> `/webhook/create-template`
  - `syncTemplates()` --> `/webhook/sync-templates`
  - `sendTemplate()` --> `/webhook/send-template`
  - `massDispatch()` --> `/webhook/mass-dispatch`
  - `sendTextMessage()` --> `/webhook/send-text-message`

### 3. Fix Inbox (`src/pages/Inbox.tsx`)
- **Send button**: Implement `handleSendMessage()` that:
  1. Fetches first active WhatsApp account
  2. Calls `api.sendTextMessage()` via edge function
  3. Optimistic update (adds message to timeline immediately)
  4. Clears input, scrolls to bottom
- **Enter key**: Wire to same send function
- Toast notifications for success/error

### 4. Fix Accounts (`src/pages/Accounts.tsx`)
- **"Adicionar Conta" button**: Opens a Dialog with form fields (Business Account ID, Phone Number ID, Access Token)
- **"Validar Credenciais" button** inside dialog: Calls `api.validateCredentials()`, then refreshes accounts list
- **"Sincronizar Templates" button**: Calls `api.syncTemplates(account.id)` with loading state and toast feedback

### 5. Fix Templates (`src/pages/Templates.tsx`)
- **"Enviar para Aprovacao" button**: Builds components array from form state (header, body, footer), calls `api.createTemplate()`, closes dialog, refreshes list, shows toast

### 6. Fix Campaigns (`src/pages/Campaigns.tsx`)
- **"Nova Campanha" button**: Opens a multi-step Dialog/wizard with:
  - Step 1: Name, description, select account, select template
  - Step 2: Select contact list or paste phones
  - Step 3: Review and confirm
- **"Iniciar Campanha" button**: Calls `api.massDispatch()` with campaign data

### 7. Fix Lists (`src/pages/Lists.tsx`)
- **"Nova Lista" button**: Opens Dialog with name/description fields, inserts directly into Supabase `contact_lists` table
- **"Importar CSV" button**: Opens file input, parses CSV, inserts contacts into Supabase `contacts` table and links them via `contact_list_members`

## Technical Details

### Edge Function (`n8n-proxy`)
```text
POST /n8n-proxy
Body: { "endpoint": "/webhook/send-text-message", "body": { ... } }
--> Forwards to https://n8n-n8n.gycquy.easypanel.host/webhook/send-text-message
--> Returns JSON response (or { success: true } if empty)
```

### Files to Create
- `supabase/functions/n8n-proxy/index.ts`
- `src/lib/api.ts`

### Files to Modify
- `src/pages/Inbox.tsx` -- add send message handler
- `src/pages/Accounts.tsx` -- add account dialog + sync templates handler
- `src/pages/Templates.tsx` -- add create template submission
- `src/pages/Campaigns.tsx` -- add campaign wizard
- `src/pages/Lists.tsx` -- add create list dialog + CSV import

### Key Patterns
- All N8N calls go through the edge function (avoids CORS)
- `TENANT_ID` used for all Supabase inserts
- Toast notifications (sonner) for all user actions
- Loading states on all buttons during async operations
- Optimistic updates where appropriate (inbox send)

