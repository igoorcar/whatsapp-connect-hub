import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Phone,
  Plus,
  CheckCircle,
  AlertTriangle,
  Signal,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface Account {
  id: string;
  verified_name: string | null;
  display_phone_number: string | null;
  quality_rating: string | null;
  account_status: string | null;
  messaging_limit_tier: string | null;
  created_at: string | null;
}

const qualityColors: Record<string, string> = {
  GREEN: "text-primary",
  YELLOW: "text-yellow-500",
  RED: "text-destructive",
};

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [validating, setValidating] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Form state
  const [wabaId, setWabaId] = useState("");
  const [phoneId, setPhoneId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    setLoading(true);
    const { data } = await supabase
      .from("whatsapp_accounts")
      .select("id, verified_name, display_phone_number, quality_rating, account_status, messaging_limit_tier, created_at")
      .eq("tenant_id", TENANT_ID);
    setAccounts(data || []);
    setLoading(false);
  }

  async function handleAddAccount() {
    if (!wabaId || !phoneId || !accessToken) {
      toast.error("Preencha todos os campos");
      return;
    }

    setValidating(true);
    try {
      await api.validateCredentials({
        waba_id: wabaId,
        phone_number_id: phoneId,
        access_token: accessToken,
      });
      
      toast.success("Credenciais validadas e conta adicionada!");
      setShowAddDialog(false);
      setWabaId("");
      setPhoneId("");
      setAccessToken("");
      fetchAccounts();
    } catch (err) {
      console.error("Add account error:", err);
      toast.error("Erro ao validar credenciais");
    } finally {
      setValidating(false);
    }
  }

  async function handleSyncTemplates(accountId: string) {
    setSyncingId(accountId);
    try {
      await api.syncTemplates(accountId);
      toast.success("Templates sincronizados com sucesso");
    } catch (err) {
      console.error("Sync templates error:", err);
      toast.error("Erro ao sincronizar templates");
    } finally {
      setSyncingId(null);
    }
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contas WhatsApp</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie suas contas do WhatsApp Business</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Nova Conta</DialogTitle>
              <DialogDescription>
                Insira as credenciais da sua conta do WhatsApp Business para começar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="wabaId">WhatsApp Business Account ID</Label>
                <Input 
                  id="wabaId" 
                  value={wabaId} 
                  onChange={(e) => setWabaId(e.target.value)} 
                  placeholder="Ex: 1092837465"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneId">Phone Number ID</Label>
                <Input 
                  id="phoneId" 
                  value={phoneId} 
                  onChange={(e) => setPhoneId(e.target.value)} 
                  placeholder="Ex: 987654321"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">System User Access Token</Label>
                <Input 
                  id="token" 
                  type="password"
                  value={accessToken} 
                  onChange={(e) => setAccessToken(e.target.value)} 
                  placeholder="EAAB..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
              <Button onClick={handleAddAccount} disabled={validating}>
                {validating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Validar e Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-40 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Nenhuma conta conectada</h3>
            <p className="text-sm text-muted-foreground mt-1">Conecte sua primeira conta WhatsApp Business</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {account.verified_name || "Conta WhatsApp"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {account.display_phone_number || "—"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <div className="flex items-center gap-1">
                      {account.account_status === "CONNECTED" ? (
                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                      )}
                      <span className="text-foreground">{account.account_status || "—"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Qualidade</span>
                    <Signal
                      className={cn(
                        "w-4 h-4",
                        qualityColors[account.quality_rating || ""] || "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Limite</span>
                    <span className="text-foreground">{account.messaging_limit_tier || "—"}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 gap-2"
                  disabled={syncingId === account.id}
                  onClick={() => handleSyncTemplates(account.id)}
                >
                  {syncingId === account.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  Sincronizar Templates
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
