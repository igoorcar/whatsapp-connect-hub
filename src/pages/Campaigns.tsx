import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Send, Clock, CheckCircle2, AlertCircle, Loader2, Trash2 } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  total_contacts: number | null;
  total_sent: number | null;
  total_delivered: number | null;
  total_read: number | null;
  total_failed: number | null;
  total_replied: number | null;
  created_at: string | null;
  scheduled_at: string | null;
}

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  draft: { label: "Rascunho", icon: Clock, color: "bg-muted text-muted-foreground" },
  scheduled: { label: "Agendada", icon: Clock, color: "bg-muted text-muted-foreground" },
  sending: { label: "Enviando", icon: Send, color: "bg-accent text-accent-foreground" },
  completed: { label: "Concluída", icon: CheckCircle2, color: "bg-accent text-accent-foreground" },
  failed: { label: "Falhou", icon: AlertCircle, color: "bg-destructive/10 text-destructive" },
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [accounts, setAccounts] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedList, setSelectedList] = useState("");

  useEffect(() => {
    fetchCampaigns();
    fetchMetadata();
  }, []);

  async function handleDeleteCampaign(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta campanha?")) return;
    
    try {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id)
        .eq("tenant_id", TENANT_ID);
      
      if (error) throw error;
      
      toast.success("Campanha excluída com sucesso");
      fetchCampaigns();
    } catch (err) {
      console.error("Delete campaign error:", err);
      toast.error("Erro ao excluir campanha");
    }
  }

  async function fetchCampaigns() {
    setLoading(true);
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .order("created_at", { ascending: false });
    setCampaigns(data || []);
    setLoading(false);
  }

  async function fetchMetadata() {
    const [accRes, tempRes, listRes] = await Promise.all([
      supabase.from("whatsapp_accounts").select("id, verified_name").eq("tenant_id", TENANT_ID),
      supabase.from("templates").select("id, name, status").eq("tenant_id", TENANT_ID).eq("status", "APPROVED"),
      supabase.from("contact_lists").select("id, name").eq("tenant_id", TENANT_ID),
    ]);
    setAccounts(accRes.data || []);
    setTemplates(tempRes.data || []);
    setLists(listRes.data || []);
  }

  async function handleStartCampaign() {
    setSubmitting(true);
    try {
      // 1. Criar a campanha no banco de dados primeiro
      // Nota: A coluna correta no banco é 'wa_account_id' e não 'account_id'
      const { data: newCampaign, error: createError } = await supabase
        .from("campaigns")
        .insert({
          name,
          description,
          wa_account_id: selectedAccount,
          template_id: selectedTemplate,
          list_id: selectedList,
          tenant_id: TENANT_ID,
          status: 'sending'
        })
        .select()
        .single();

      if (createError) throw createError;

      // 2. Chamar o n8n passando apenas o ID da campanha criada
      await api.massDispatch(newCampaign.id);

      toast.success("Campanha iniciada com sucesso!");
      setShowCreate(false);
      fetchCampaigns();
      
      // Reset
      setName("");
      setDescription("");
      setSelectedAccount("");
      setSelectedTemplate("");
      setSelectedList("");
      setStep(1);
    } catch (err) {
      console.error("Start campaign error:", err);
      toast.error("Erro ao iniciar campanha");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campanhas</h1>
          <p className="text-sm text-muted-foreground mt-1">Disparo em massa via WhatsApp</p>
        </div>
        
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha - Passo {step}/3</DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>Nome da Campanha</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Promoção de Verão" />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição (opcional)</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição da campanha..." />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Conta WhatsApp</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger><SelectValue placeholder="Selecione a conta" /></SelectTrigger>
                      <SelectContent>
                        {accounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.verified_name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Template (Apenas aprovados)</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger><SelectValue placeholder="Selecione o template" /></SelectTrigger>
                      <SelectContent>
                        {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label>Lista de Contatos</Label>
                    <Select value={selectedList} onValueChange={setSelectedList}>
                      <SelectTrigger><SelectValue placeholder="Selecione a lista" /></SelectTrigger>
                      <SelectContent>
                        {lists.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
                    <p><strong>Resumo:</strong></p>
                    <p>Campanha: {name}</p>
                    <p>Template: {templates.find(t => t.id === selectedTemplate)?.name}</p>
                    <p>Lista: {lists.find(l => l.id === selectedList)?.name}</p>
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>Voltar</Button>
              ) : <div />}
              
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !name}>Próximo</Button>
              ) : (
                <Button onClick={handleStartCampaign} disabled={submitting || !selectedList}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Iniciar Campanha
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-32 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Send className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Nenhuma campanha</h3>
            <p className="text-sm text-muted-foreground mt-1">Crie sua primeira campanha</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => {
            const total = campaign.total_contacts || 0;
            const sent = campaign.total_sent || 0;
            const progress = total > 0 ? (sent / total) * 100 : 0;
            const config = statusConfig[campaign.status] || statusConfig.draft;
            const StatusIcon = config.icon;

            return (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold">{campaign.name}</CardTitle>
                      <Badge className={cn("mt-1", config.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {campaign.description && (
                    <p className="text-xs text-muted-foreground">{campaign.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{sent} de {total} enviadas</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: "Entregues", value: campaign.total_delivered || 0 },
                        { label: "Lidas", value: campaign.total_read || 0 },
                        { label: "Respostas", value: campaign.total_replied || 0 },
                        { label: "Falhas", value: campaign.total_failed || 0 },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p className="text-base font-semibold text-foreground">{stat.value}</p>
                          <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
