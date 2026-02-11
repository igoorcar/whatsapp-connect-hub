import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Plus, Eye, Send as SendIcon, Smartphone, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  language: string;
  category: string;
  status: string;
  components: any;
  created_at: string;
}

interface WaAccount {
  id: string;
  verified_name: string | null;
  display_phone_number: string | null;
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [accounts, setAccounts] = useState<WaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Create form state
  const [selectedAccount, setSelectedAccount] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("MARKETING");
  const [language, setLanguage] = useState("pt_BR");
  const [headerType, setHeaderType] = useState("NONE");
  const [headerText, setHeaderText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [footerText, setFooterText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [templatesRes, accountsRes] = await Promise.all([
        supabase
          .from("templates")
          .select("*")
          .eq("tenant_id", TENANT_ID)
          .order("created_at", { ascending: false }),
        supabase
          .from("whatsapp_accounts")
          .select("id, verified_name, display_phone_number")
          .eq("tenant_id", TENANT_ID),
      ]);
      setTemplates(templatesRes.data || []);
      setAccounts(accountsRes.data || []);
    } catch (err) {
      console.error("Fetch data error:", err);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTemplate(id: string) {
    if (!confirm("Tem certeza que deseja excluir este template?")) return;
    
    try {
      const { error } = await supabase
        .from("templates")
        .delete()
        .eq("id", id)
        .eq("tenant_id", TENANT_ID);
      
      if (error) {
        if (error.code === '23503') {
          toast.error("Não é possível excluir este template pois ele está sendo usado em uma ou mais campanhas.");
          return;
        }
        throw error;
      }
      
      toast.success("Template excluído com sucesso");
      fetchData();
    } catch (err: any) {
      console.error("Delete template error:", err);
      toast.error(err.message || "Erro ao excluir template");
    }
  }

  const statusColor: Record<string, string> = {
    APPROVED: "bg-accent text-accent-foreground",
    PENDING: "bg-muted text-muted-foreground",
    REJECTED: "bg-destructive/10 text-destructive",
  };

  async function handleCreateTemplate() {
    if (!selectedAccount || !templateName || !bodyText) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      const components = [];
      
      if (headerType === "TEXT" && headerText) {
        components.push({ type: "HEADER", format: "TEXT", text: headerText });
      } else if (headerType === "IMAGE") {
        components.push({ type: "HEADER", format: "IMAGE", example: { header_handle: [""] } });
      }

      components.push({ type: "BODY", text: bodyText });

      if (footerText) {
        components.push({ type: "FOOTER", text: footerText });
      }

      await api.createTemplate({
        account_id: selectedAccount,
        name: templateName,
        category,
        language,
        components
      });

      toast.success("Template enviado para aprovação!");
      setShowCreate(false);
      fetchData();
      
      // Reset form
      setTemplateName("");
      setBodyText("");
      setHeaderText("");
      setFooterText("");
    } catch (err) {
      console.error("Create template error:", err);
      toast.error("Erro ao criar template");
    } finally {
      setSubmitting(false);
    }
  }

  // Replace variables in body text for preview
  function renderPreviewBody(text: string) {
    return text.replace(/\{\{(\d+)\}\}/g, (_, num) => `[Variável ${num}]`);
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus templates do WhatsApp Business
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Nenhum template</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Crie seu primeiro template para começar a enviar mensagens
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-card text-card-foreground rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              {/* Header do Card com Botões Forçados */}
              <div className="p-4 border-b border-border flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground truncate" title={template.name}>
                    {template.name}
                  </h3>
                  <div className="mt-1">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium",
                      statusColor[template.status] || statusColor.PENDING
                    )}>
                      {template.status}
                    </span>
                  </div>
                </div>
                
                {/* ÁREA DE BOTÕES - FORÇADA COM FLEX-SHRINK-0 */}
                <div className="flex items-center gap-1 flex-shrink-0" style={{ minWidth: '72px' }}>
                  <button 
                    onClick={() => toast.info(`Visualizando: ${template.name}`)}
                    className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20"
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteTemplate(template.id);
                    }}
                    className="p-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/20"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-4 space-y-3 flex-1">
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                  <span className="text-muted-foreground">Categoria:</span>
                  <span className="text-foreground font-medium text-right">{template.category}</span>
                  
                  <span className="text-muted-foreground">Idioma:</span>
                  <span className="text-foreground font-medium text-right">{template.language}</span>
                  
                  <span className="text-muted-foreground">Criado em:</span>
                  <span className="text-foreground font-medium text-right">
                    {new Date(template.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {template.components && (
                  <div className="mt-2 p-2 bg-muted/50 rounded border border-border/50 text-[11px] text-foreground line-clamp-3 italic">
                    {Array.isArray(template.components)
                      ? template.components.find((c: any) => c.type === "BODY")?.text || "Sem conteúdo"
                      : "Sem conteúdo"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Template</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Form */}
            <div className="space-y-4">
              <div>
                <Label>Conta WhatsApp</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.verified_name || acc.display_phone_number || acc.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nome do Template</Label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                  placeholder="meu_template"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKETING">Marketing</SelectItem>
                      <SelectItem value="UTILITY">Utilidade</SelectItem>
                      <SelectItem value="AUTHENTICATION">Autenticação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt_BR">Português (BR)</SelectItem>
                      <SelectItem value="en_US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Header</Label>
                <Select value={headerType} onValueChange={setHeaderType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Sem Header</SelectItem>
                    <SelectItem value="TEXT">Texto</SelectItem>
                    <SelectItem value="IMAGE">Imagem</SelectItem>
                  </SelectContent>
                </Select>
                {headerType === "TEXT" && (
                  <Input
                    className="mt-2"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    placeholder="Texto do header"
                  />
                )}
              </div>
              <div>
                <Label>Body (Corpo da mensagem)</Label>
                <Textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Olá {{1}}, sua mensagem aqui..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {"{{1}}"}, {"{{2}}"} para variáveis
                </p>
              </div>
              <div>
                <Label>Footer (opcional)</Label>
                <Input
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="Texto do footer"
                />
              </div>
              <Button onClick={handleCreateTemplate} disabled={submitting} className="w-full gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
                Enviar para Aprovação
              </Button>
            </div>

            {/* iPhone Preview */}
            <div className="flex justify-center">
              <div className="w-[300px] bg-foreground rounded-[2.5rem] p-3 shadow-2xl">
                <div className="bg-card rounded-[2rem] overflow-hidden h-[560px] flex flex-col">
                  {/* Phone header */}
                  <div className="bg-wa-header text-primary-foreground px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Empresa</p>
                      <p className="text-[10px] opacity-70">online</p>
                    </div>
                  </div>
                  {/* Chat area */}
                  <div className="flex-1 wa-chat-bg p-3 overflow-y-auto">
                    {(bodyText || headerText || footerText) ? (
                      <div className="bg-card rounded-lg shadow-sm max-w-[85%] ml-auto">
                        {headerType === "TEXT" && headerText && (
                          <div className="px-3 py-2 border-b border-border/50 font-bold text-sm">
                            {headerText}
                          </div>
                        )}
                        <div className="px-3 py-2 text-sm whitespace-pre-wrap">
                          {renderPreviewBody(bodyText)}
                        </div>
                        {footerText && (
                          <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-t border-border/30">
                            {footerText}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-xs text-center p-8">
                        Preencha o conteúdo para visualizar o preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
