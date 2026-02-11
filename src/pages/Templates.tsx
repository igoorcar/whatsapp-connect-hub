import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { FileText, Plus, Eye, Send as SendIcon, Smartphone } from "lucide-react";
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
    setLoading(false);
  }

  const statusColor: Record<string, string> = {
    APPROVED: "bg-accent text-accent-foreground",
    PENDING: "bg-muted text-muted-foreground",
    REJECTED: "bg-destructive/10 text-destructive",
  };

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
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
                  <Badge className={cn("text-[10px]", statusColor[template.status] || statusColor.PENDING)}>
                    {template.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Categoria</span>
                    <span className="text-foreground">{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Idioma</span>
                    <span className="text-foreground">{template.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Criado</span>
                    <span className="text-foreground">
                      {new Date(template.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
                {template.components && (
                  <div className="mt-3 p-2 bg-muted rounded text-xs text-foreground line-clamp-3">
                    {Array.isArray(template.components)
                      ? template.components.find((c: any) => c.type === "BODY")?.text || "—"
                      : "—"}
                  </div>
                )}
              </CardContent>
            </Card>
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
              <Button className="w-full gap-2">
                <SendIcon className="w-4 h-4" />
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
                          <div className="px-3 pt-2">
                            <p className="text-xs font-bold text-foreground">{headerText}</p>
                          </div>
                        )}
                        {headerType === "IMAGE" && (
                          <div className="w-full h-32 bg-muted rounded-t-lg flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">📷 Imagem</span>
                          </div>
                        )}
                        {bodyText && (
                          <div className="px-3 py-2">
                            <p className="text-xs text-foreground whitespace-pre-wrap">
                              {renderPreviewBody(bodyText)}
                            </p>
                          </div>
                        )}
                        {footerText && (
                          <div className="px-3 pb-1">
                            <p className="text-[10px] text-muted-foreground">{footerText}</p>
                          </div>
                        )}
                        <div className="px-3 pb-1.5 flex justify-end">
                          <span className="text-[10px] text-muted-foreground">12:00</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                        <p>Preencha os campos para ver o preview</p>
                      </div>
                    )}
                  </div>
                  {/* Input mockup */}
                  <div className="bg-card border-t border-border px-3 py-2">
                    <div className="bg-muted rounded-full px-3 py-1.5 text-xs text-muted-foreground">
                      Digite uma mensagem...
                    </div>
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
