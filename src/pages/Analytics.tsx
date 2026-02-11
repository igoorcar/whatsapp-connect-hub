import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, MessageSquare, Users, CheckCheck } from "lucide-react";

const COLORS = [
  "hsl(152, 69%, 49%)",
  "hsl(0, 84%, 60%)",
  "hsl(210, 90%, 55%)",
  "hsl(45, 90%, 55%)",
  "hsl(210, 11%, 70%)",
];

export default function Analytics() {
  const [period, setPeriod] = useState("7");
  const [messagesByStatus, setMessagesByStatus] = useState<any[]>([]);
  const [repliesByClass, setRepliesByClass] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  async function fetchAnalytics() {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - parseInt(period));

    const [messagesRes, repliesRes] = await Promise.all([
      supabase
        .from("message_logs")
        .select("status, sent_at")
        .eq("tenant_id", TENANT_ID)
        .gte("sent_at", since.toISOString())
        .limit(1000),
      supabase
        .from("replies")
        .select("classification, replied_at")
        .eq("tenant_id", TENANT_ID)
        .gte("replied_at", since.toISOString())
        .limit(500),
    ]);

    const messages = messagesRes.data || [];
    const replies = repliesRes.data || [];

    // Messages by status
    const statusMap: Record<string, number> = {};
    messages.forEach((m) => {
      const s = m.status || "unknown";
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    setMessagesByStatus(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

    // Replies by classification
    const classMap: Record<string, number> = {};
    replies.forEach((r) => {
      const c = r.classification || "UNCLASSIFIED";
      classMap[c] = (classMap[c] || 0) + 1;
    });
    setRepliesByClass(Object.entries(classMap).map(([name, value]) => ({ name, value })));

    // Daily stats
    const days: Record<string, { sent: number; replies: number }> = {};
    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[d.toISOString().split("T")[0]] = { sent: 0, replies: 0 };
    }
    messages.forEach((m) => {
      const key = m.sent_at?.split("T")[0];
      if (key && days[key]) days[key].sent++;
    });
    replies.forEach((r) => {
      const key = r.replied_at?.split("T")[0];
      if (key && days[key]) days[key].replies++;
    });
    setDailyStats(
      Object.entries(days).map(([date, vals]) => ({
        date: date.slice(5),
        Enviadas: vals.sent,
        Respostas: vals.replies,
      }))
    );

    setLoading(false);
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Relatórios e métricas</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-64 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Volume Diário</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyStats}>
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
                  <Line type="monotone" dataKey="Enviadas" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Respostas" stroke="hsl(var(--wa-blue))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Status de Mensagens</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={messagesByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Classificação de Respostas</CardTitle>
            </CardHeader>
            <CardContent>
              {repliesByClass.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={repliesByClass}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        paddingAngle={4}
                      >
                        {repliesByClass.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 mt-2 justify-center">
                    {repliesByClass.map((d, idx) => (
                      <div key={d.name} className="flex items-center gap-1.5 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-muted-foreground">{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                  Sem dados
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
