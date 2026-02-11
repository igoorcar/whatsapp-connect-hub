import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .order("created_at", { ascending: false });
    setCampaigns(data || []);
    setLoading(false);
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campanhas</h1>
          <p className="text-sm text-muted-foreground mt-1">Disparo em massa via WhatsApp</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Campanha
        </Button>
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
                    <CardTitle className="text-sm font-semibold">{campaign.name}</CardTitle>
                    <Badge className={config.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
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
