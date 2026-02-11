import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { endpoint, body } = requestData
    const N8N_BASE_URL = 'https://n8n-n8n.gycquy.easypanel.host'
    
    console.log(`[Proxy] Request to: ${endpoint}`)
    console.log(`[Proxy] Payload:`, JSON.stringify(body))

    if (!endpoint) {
      throw new Error("Missing endpoint in request body")
    }

    const targetUrl = `${N8N_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body || {}),
    })

    const responseText = await response.text()
    console.log(`[Proxy] N8N Status: ${response.status}`)
    console.log(`[Proxy] N8N Response: ${responseText}`)

    let responseData
    try {
      // Tenta parsear como JSON, se falhar, retorna o texto bruto
      responseData = responseText ? JSON.parse(responseText) : { success: true }
    } catch (e) {
      responseData = { success: true, message: responseText }
    }

    // Retornamos 200 se o n8n retornou 2xx, caso contrário retornamos o status do n8n
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.ok ? 200 : response.status 
      },
    )
  } catch (error) {
    console.error(`[Proxy] Error:`, error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Check Supabase function logs for more info" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Retornamos 200 mesmo no erro para evitar que o frontend trave, mas com o objeto de erro
      },
    )
  }
})
