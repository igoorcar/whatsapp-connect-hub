import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "@/lib/constants";
import {
  MessageSquare,
  Send,
  CheckCheck,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Stats {
  totalMessages: number;
  deliveryRate: number;
  responseRate: number;
  totalContacts: number;
}

const CHART_COLORS = [
  "hsl(152, 69%, 49%)",
  "hsl(0, 84%, 60%)",
  "hsl(210, 90%, 55%)",
  "hsl(210, 11%, 70%)",
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    deliveryRate: 0,
    responseRate: 0,
    totalContacts: 0,
  });
  const [messagesByDay, setMessagesByDay] = useState<any[]>([]);
  const [classificationData, setClassificationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [messagesRes, repliesRes, contactsRes] = await Promise.all([
        supabase
          .from("message_logs")
          .select("id, status, sent_at, delivered_at, read_at")
          .eq("tenant_id", TENANT_ID)
          .order("sent_at", { ascending: false })
          .limit(1000),
        supabase
          .from("replies")
          .select("id, classification, replied_at")
          .eq("tenant_id", TENANT_ID)
          .order("replied_at", { ascending: false })
          .limit(500),
        supabase
          .from("contacts")
          .select("id", { count: "exact", head: true })
          .eq("tenant_id", TENANT_ID),
      ]);

      const messages = messagesRes.data || [];
      const replies = repliesRes.data || [];
      const totalContacts = contactsRes.count || 0;

      const delivered = messages.filter((m) => m.delivered_at || m.read_at).length;
      const deliveryRate = messages.length > 0 ? (delivered / messages.length) * 100 : 0;
      const responseRate = messages.length > 0 ? (replies.length / messages.length) * 100 : 0;

      setStats({
        totalMessages: messages.length,
        deliveryRate: Math.round(deliveryRate),
        responseRate: Math.round(responseRate),
        totalContacts,
      });

      // Messages by day (last 7 days)
      const days: Record<string, { sent: number; delivered: number }> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        days[key] = { sent: 0, delivered: 0 };
      }
      messages.forEach((m) => {
        const key = m.sent_at?.split("T")[0];
        if (key && days[key]) {
          days[key].sent++;
          if (m.delivered_at) days[key].delivered++;
        }
      });
      setMessagesByDay(
        Object.entries(days).map(([date, vals]) => ({
          date: date.slice(5),
          Enviadas: vals.sent,
          Entregues: vals.delivered,
        }))
      );

      // Classification donut
      const classMap: Record<string, number> = {};
      replies.forEach((r) => {
        const c = r.classification || "UNCLASSIFIED";
        classMap[c] = (classMap[c] || 0) + 1;
      });
      setClassificationData(
        Object.entries(classMap).map(([name, value]) => ({ name, value }))
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const kpis = [
    {
      title: "Total Mensagens",
      value: stats.totalMessages.toLocaleString(),
      icon: MessageSquare,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Taxa de Entrega",
      value: `${stats.deliveryRate}%`,
      icon: CheckCheck,
      trend: "+3%",
      trendUp: true,
    },
    {
      title: "Taxa de Resposta",
      value: `${stats.responseRate}%`,
      icon: Send,
      trend: "-2%",
      trendUp: false,
    },
    {
      title: "Contatos",
      value: stats.totalContacts.toLocaleString(),
      icon: Users,
      trend: "+8%",
      trendUp: true,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do seu WhatsApp Business</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4 text-primary" />
          <span>Atualizado agora</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={kpi.title} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{kpi.title}</p>
                  <p className="text-3xl font-black text-foreground tracking-tight">{kpi.value}</p>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                  kpi.trendUp ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                )}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className={cn(
                  "flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                  kpi.trendUp ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                )}>
                  {kpi.trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {kpi.trend}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Mensagens (7 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={messagesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Enviadas"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Entregues"
                  stroke="hsl(var(--wa-teal))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Classificação de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            {classificationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={4}
                  >
                    {classificationData.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                Sem dados de respostas ainda
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-2">
              {classificationData.map((d, idx) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                  />
                  <span className="text-muted-foreground">
                    {d.name} ({d.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
