import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID, isUUID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MessageBubble } from "@/components/MessageBubble";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Search,
  SendHorizontal,
  Phone,
  MoreVertical,
  User,
  X,
  Paperclip,
  Smile,
  Info,
  MessageSquare,
} from "lucide-react";

interface Conversation {
  contactId: string;
  contactName: string;
  contactPhone: string;
  lastMessage: string;
  lastTimestamp: string;
  classification: string;
  unread?: number;
}

interface TimelineMsg {
  id: string;
  type: "sent" | "received";
  content: string;
  timestamp: string;
  status?: string;
  classification?: string;
  mediaUrl?: string;
}

interface ContactDetails {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  tags: string[];
  created_at: string;
}

const classificationBadge: Record<string, string> = {
  INTERESSADO: "bg-accent text-accent-foreground border-primary/20",
  NAO_INTERESSADO: "bg-destructive/10 text-destructive border-destructive/20",
  UNCLASSIFIED: "bg-muted text-muted-foreground border-border",
  OPT_OUT: "bg-muted text-muted-foreground border-border",
};

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConvos, setFilteredConvos] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineMsg[]>([]);
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const { data: replies } = await supabase
        .from("replies")
        .select("id, contact_id, from_phone, from_name, content, replied_at, classification")
        .eq("tenant_id", TENANT_ID)
        .order("replied_at", { ascending: false })
        .limit(500);

      if (!replies) return;

      const conversationsMap = new Map<string, Conversation>();
      for (const reply of replies) {
        const phone = reply.from_phone;
        if (!conversationsMap.has(phone)) {
          conversationsMap.set(phone, {
            contactId: phone,
            contactName: reply.from_name || "Sem nome",
            contactPhone: phone,
            lastMessage: reply.content || "",
            lastTimestamp: reply.replied_at,
            classification: reply.classification || "UNCLASSIFIED",
          });
        }
      }
      const list = Array.from(conversationsMap.values());
      setConversations(list);
      setFilteredConvos(list);
    } catch (err) {
      console.error("Fetch conversations error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    // Fallback polling every 30 seconds in case Realtime fails
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Realtime
  useEffect(() => {
    console.log("Setting up Realtime for TENANT_ID:", TENANT_ID);
    
    const channel = supabase
      .channel(`inbox-global-${TENANT_ID}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "replies", filter: `tenant_id=eq.${TENANT_ID}` },
        (payload) => {
          console.log("Realtime Reply Event:", payload.event, payload);
          fetchConversations();
          if (selectedId) {
            const isFromSelected = 
              payload.new?.from_phone === selectedId || 
              payload.new?.contact_id === selectedId ||
              payload.old?.from_phone === selectedId;
            
            if (isFromSelected) {
              console.log("Updating timeline for selected contact");
              loadTimeline(selectedId);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message_logs", filter: `tenant_id=eq.${TENANT_ID}` },
        (payload) => {
          console.log("Realtime Message Event:", payload.event, payload);
          if (selectedId) {
            const isToSelected = 
              payload.new?.phone === selectedId || 
              payload.new?.contact_id === selectedId ||
              payload.old?.phone === selectedId;
              
            if (isToSelected) {
              console.log("Updating timeline for selected contact (message_logs)");
              loadTimeline(selectedId);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      console.log("Cleaning up Realtime channel");
      supabase.removeChannel(channel);
    };
  }, [selectedId, fetchConversations]);

  // Filter
  useEffect(() => {
    let filtered = conversations;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.contactName.toLowerCase().includes(q) ||
          c.contactPhone.includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }
    if (classFilter) {
      filtered = filtered.filter((c) => c.classification === classFilter);
    }
    setFilteredConvos(filtered);
  }, [searchQuery, classFilter, conversations]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [timeline]);

  async function loadTimeline(contactId: string) {
    setTimelineLoading(true);
    try {
      // Fetch contact
      let contactData = null;
      if (isUUID(contactId)) {
        const { data } = await supabase
          .from("contacts")
          .select("*")
          .eq("id", contactId)
          .maybeSingle();
        contactData = data;
      }
      if (!contactData) {
        const { data } = await supabase
          .from("contacts")
          .select("*")
          .eq("phone", contactId)
          .eq("tenant_id", TENANT_ID)
          .maybeSingle();
        contactData = data;
      }
      if (contactData) {
        setContact({
          id: contactData.id,
          name: contactData.name,
          phone: contactData.phone,
          email: contactData.email,
          tags: contactData.tags || [],
          created_at: contactData.created_at || "",
        });
      } else {
        setContact(null);
      }

      // Fetch sent messages
      const sentQuery = isUUID(contactId)
        ? supabase.from("message_logs").select("*").eq("contact_id", contactId)
        : supabase.from("message_logs").select("*").or(`phone.eq.${contactId},wa_message_id.ilike.%${contactId}%`);
      
      const { data: sentMessages, error: sentError } = await sentQuery
        .eq("tenant_id", TENANT_ID)
        .order("sent_at", { ascending: true })
        .limit(200);
        
      if (sentError) console.error("Sent messages fetch error:", sentError);

      // Fetch received messages
      const recvQuery = isUUID(contactId)
        ? supabase.from("replies").select("*").eq("contact_id", contactId)
        : supabase.from("replies").select("*").or(`from_phone.eq.${contactId},from_name.ilike.%${contactId}%`);
        
      const { data: receivedMessages, error: recvError } = await recvQuery
        .eq("tenant_id", TENANT_ID)
        .order("replied_at", { ascending: true })
        .limit(200);
        
      if (recvError) console.error("Received messages fetch error:", recvError);

      const tl: TimelineMsg[] = [
        ...(sentMessages || []).map((msg: any) => ({
          id: msg.id,
          type: "sent" as const,
          content: msg.text_content || msg.content || msg.template_name || "[Template]",
          timestamp: msg.sent_at,
          status: msg.status,
          mediaUrl: msg.media_url,
        })),
        ...(receivedMessages || []).map((msg: any) => ({
          id: msg.id,
          type: "received" as const,
          content: msg.content || "",
          timestamp: msg.replied_at,
          classification: msg.classification,
          mediaUrl: msg.media_id,
        })),
      ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Merge with existing temporary messages to avoid flicker
      setTimeline((prev) => {
        const tempMsgs = prev.filter(m => m.id.startsWith("temp-"));
        // Filter out temp messages that are now in the real timeline (by content and approximate time)
        const uniqueTempMsgs = tempMsgs.filter(temp => 
          !tl.some(real => real.content === temp.content && 
            Math.abs(new Date(real.timestamp).getTime() - new Date(temp.timestamp).getTime()) < 10000)
        );
        return [...tl, ...uniqueTempMsgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      });
    } catch (err) {
      console.error("Load timeline error:", err);
    } finally {
      setTimelineLoading(false);
    }
  }

  function selectConversation(convo: Conversation) {
    setSelectedId(convo.contactId);
    loadTimeline(convo.contactId);
  }

  async function handleSendMessage() {
    if (!messageText.trim() || !selectedId || sending) return;

    setSending(true);
    try {
      // Get first active WhatsApp account
      // We check for both 'CONNECTED' and 'connected' to be safe
      const { data: accounts } = await supabase
        .from("whatsapp_accounts")
        .select("id, account_status")
        .eq("tenant_id", TENANT_ID)
        .limit(10);

      const activeAccount = accounts?.find(acc => 
        acc.account_status?.toUpperCase() === "CONNECTED"
      ) || accounts?.[0];

      if (!activeAccount) {
        toast.error("Nenhuma conta WhatsApp encontrada.");
        return;
      }

      const accountId = activeAccount.id;
      const phone = contact?.phone || selectedId;

      // Optimistic update
      const tempId = "temp-" + Math.random().toString(36).substr(2, 9);
      const newMessage: TimelineMsg = {
        id: tempId,
        type: "sent",
        content: messageText,
        timestamp: new Date().toISOString(),
        status: "sending",
      };
      
      setTimeline((prev) => [...prev, newMessage]);
      const currentText = messageText;
      setMessageText("");

      // Call API
      try {
        const response = await api.sendTextMessage(phone, currentText, accountId);
        console.log("Send message response:", response);
        
        // Se o n8n não salvou no banco, nós salvamos aqui para garantir que apareça no histórico
        const { data: existingMsg } = await supabase
          .from("message_logs")
          .select("id")
          .eq("wa_message_id", response[0]?.wa_message_id)
          .maybeSingle();

        if (!existingMsg && response[0]?.wa_message_id) {
          console.log("Message not found in DB, saving manually...");
          await supabase.from("message_logs").insert({
            tenant_id: TENANT_ID,
            contact_id: isUUID(selectedId) ? selectedId : null,
            phone: phone,
            text_content: currentText,
            wa_message_id: response[0].wa_message_id,
            status: response[0].message_status || "sent",
            sent_at: response[0].sent_at || new Date().toISOString(),
          });
        }

        toast.success("Mensagem enviada");
        // Forçar recarregamento da timeline para garantir que a mensagem apareça
        setTimeout(() => loadTimeline(selectedId), 500);
      } catch (err) {
        // Remove optimistic message on error
        setTimeline((prev) => prev.filter(m => m.id !== tempId));
        setMessageText(currentText); // Restore text
        throw err;
      }
    } catch (err) {
      console.error("Send message error:", err);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  }

  const selectedConvo = conversations.find((c) => c.contactId === selectedId);

  return (
    <div className="flex h-screen">
      {/* Sidebar - Conversations List */}
      <div className="w-[380px] border-r border-border flex flex-col bg-card shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Mensagens</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {filteredConvos.length}
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/50 text-sm border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Classification Filters */}
        <div className="flex gap-1.5 p-3 border-b border-border overflow-x-auto">
          {["Todos", "INTERESSADO", "NAO_INTERESSADO", "UNCLASSIFIED"].map((f) => {
            const isActive = f === "Todos" ? !classFilter : classFilter === f;
            return (
              <button
                key={f}
                onClick={() => setClassFilter(f === "Todos" ? null : f)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {f === "NAO_INTERESSADO" ? "Não Int." : f === "Todos" ? "Todos" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex gap-3 p-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConvos.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredConvos.map((convo) => (
              <button
                key={convo.contactId}
                onClick={() => selectConversation(convo)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50",
                  selectedId === convo.contactId && "bg-accent"
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  {convo.unread && convo.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-card">
                      {convo.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {convo.contactName}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground shrink-0">
                      {format(new Date(convo.lastTimestamp), "HH:mm")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate line-clamp-1 mb-1.5">
                    {convo.lastMessage}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                        classificationBadge[convo.classification] || classificationBadge.UNCLASSIFIED
                      )}
                    >
                      {convo.classification}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedId && selectedConvo ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{selectedConvo.contactName}</h3>
                <p className="text-xs text-muted-foreground">{selectedConvo.contactPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Info className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 wa-chat-bg overflow-y-auto custom-scrollbar px-6 py-4">
            {timelineLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : timeline.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Nenhuma mensagem nesta conversa
              </div>
            ) : (
              <>
                {timeline.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    type={msg.type}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    status={msg.status}
                    classification={msg.classification}
                    mediaUrl={msg.mediaUrl}
                  />
                ))}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-card border-t border-border px-4 py-3">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
                <Smile className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  rows={1}
                  disabled={sending}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={sending || !messageText.trim()}
                className="bg-primary text-primary-foreground hover:bg-secondary shrink-0"
              >
                <SendHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-accent mx-auto flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">ZapFlow Inbox</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Selecione uma conversa para começar
            </p>
          </div>
        </div>
      )}

      {/* Details Sidebar */}
      {showDetails && selectedId && (
        <div className="w-[320px] border-l border-border bg-card flex flex-col animate-slide-in-right">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Detalhes do Contato</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-foreground">
                {contact?.name || selectedConvo?.contactName || "Sem nome"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {contact?.phone || selectedConvo?.contactPhone}
              </p>
            </div>

            <div className="space-y-4">
              {contact?.email && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-foreground">{contact.email}</p>
                </div>
              )}
              {contact?.tags && contact.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {contact?.created_at && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Criado em
                  </p>
                  <p className="text-sm text-foreground">
                    {format(new Date(contact.created_at), "dd/MM/yyyy")}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Mensagens na conversa
                </p>
                <p className="text-sm text-foreground">{timeline.length}</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
