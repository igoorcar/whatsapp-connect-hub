import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Users, Upload, Loader2, Trash2 } from "lucide-react";

interface ContactList {
  id: string;
  name: string;
  description: string | null;
  type: string;
  contact_count: number | null;
  created_at: string | null;
}

export default function Lists() {
  const [lists, setLists] = useState<ContactList[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [manualNumbers, setManualNumbers] = useState("");

  useEffect(() => {
    fetchLists();
  }, []);

  async function fetchLists() {
    setLoading(true);
    const { data } = await supabase
      .from("contact_lists")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .order("created_at", { ascending: false });
    setLists(data || []);
    setLoading(false);
  }

  async function handleDeleteList(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta lista?")) return;
    
    try {
      const { error } = await supabase
        .from("contact_lists")
        .delete()
        .eq("id", id)
        .eq("tenant_id", TENANT_ID);
      
      if (error) {
        if (error.code === '23503') {
          toast.error("Não é possível excluir esta lista pois ela está vinculada a uma ou mais campanhas.");
          return;
        }
        throw error;
      }
      
      toast.success("Lista excluída com sucesso");
      fetchLists();
    } catch (err: any) {
      console.error("Delete list error:", err);
      toast.error(err.message || "Erro ao excluir lista");
    }
  }

  async function handleCreateList() {
    if (!name) return;
    setCreating(true);
    try {
      // 1. Criar a lista
      const { data: newList, error: listError } = await supabase
        .from("contact_lists")
        .insert({
          name,
          description,
          tenant_id: TENANT_ID,
          type: "MANUAL",
        })
        .select()
        .single();

      if (listError) throw listError;

      // 2. Processar números manuais se houver
      if (manualNumbers.trim()) {
        // Extrai números e remove duplicatas locais antes de enviar ao banco
        const rawNumbers = manualNumbers
          .split(/[\n,;]/)
          .map(n => n.trim().replace(/\D/g, ""))
          .filter(n => n.length >= 8);
        
        const uniqueNumbers = Array.from(new Set(rawNumbers));

        if (uniqueNumbers.length > 0) {
          // Criar/Atualizar contatos
          const contactsToUpsert = uniqueNumbers.map(phone => ({
            phone,
            tenant_id: TENANT_ID,
          }));

          const { data: upsertedContacts, error: upsertError } = await supabase
            .from("contacts")
            .upsert(contactsToUpsert, { onConflict: "phone,tenant_id" })
            .select();

          if (upsertError) throw upsertError;

          // Vincular contatos à lista
          if (upsertedContacts && upsertedContacts.length > 0) {
            const membersToInsert = upsertedContacts.map(c => ({
              list_id: newList.id,
              contact_id: c.id,
            }));

            const { error: memberError } = await supabase
              .from("contact_list_members")
              .insert(membersToInsert);

            if (memberError) throw memberError;
          }
        }
      }

      toast.success("Lista criada com sucesso");
      setShowCreate(false);
      setName("");
      setDescription("");
      setManualNumbers("");
      fetchLists();
    } catch (err: any) {
      console.error("Create list error:", err);
      toast.error(err.message || "Erro ao criar lista");
    } finally {
      setCreating(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split("\n");
        const contactsToUpsert = [];
        
        // 1. Parse CSV e remove duplicatas
        const seenPhones = new Set();
        for (let i = 1; i < lines.length; i++) {
          const [phone, contactName] = lines[i].split(",");
          if (phone && phone.trim()) {
            const cleanPhone = phone.trim().replace(/\D/g, "");
            if (cleanPhone.length >= 8 && !seenPhones.has(cleanPhone)) {
              seenPhones.add(cleanPhone);
              contactsToUpsert.push({
                phone: cleanPhone,
                name: contactName?.trim() || null,
                tenant_id: TENANT_ID,
              });
            }
          }
        }

        if (contactsToUpsert.length === 0) {
          toast.error("Nenhum contato válido encontrado no CSV");
          return;
        }

        // 2. Criar uma lista automática para esta importação
        const { data: newList, error: listError } = await supabase
          .from("contact_lists")
          .insert({
            name: `Importação ${new Date().toLocaleDateString("pt-BR")} ${new Date().toLocaleTimeString("pt-BR")}`,
            description: `Importado via CSV (${file.name})`,
            tenant_id: TENANT_ID,
            type: "IMPORT",
          })
          .select()
          .single();

        if (listError) throw listError;

        // 3. Upsert contatos
        const { data: upsertedContacts, error: upsertError } = await supabase
          .from("contacts")
          .upsert(contactsToUpsert, { onConflict: "phone,tenant_id" })
          .select();

        if (upsertError) throw upsertError;

        // 4. Vincular à lista
        if (upsertedContacts && upsertedContacts.length > 0) {
          const membersToInsert = upsertedContacts.map(c => ({
            list_id: newList.id,
            contact_id: c.id,
          }));

          const { error: memberError } = await supabase
            .from("contact_list_members")
            .insert(membersToInsert);

          if (memberError) throw memberError;
        }

        toast.success(`${contactsToUpsert.length} contatos importados na lista "${newList.name}"`);
        fetchLists();
      } catch (err: any) {
        console.error("Import error:", err);
        toast.error(err.message || "Erro ao importar CSV");
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Listas de Contatos</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize seus contatos em listas</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Importar CSV
          </Button>
          
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Lista
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Lista</DialogTitle>
                <DialogDescription>
                  Dê um nome e uma descrição para a sua nova lista de contatos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome da Lista</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Clientes VIP" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opcional..." />
                </div>
                <div className="space-y-2">
                  <Label>Números (um por linha ou separados por vírgula)</Label>
                  <Textarea 
                    value={manualNumbers} 
                    onChange={(e) => setManualNumbers(e.target.value)} 
                    placeholder="Ex: 5511999999999&#10;5511888888888"
                    className="min-h-[120px] font-mono text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Você também pode importar via CSV usando o botão no topo da página.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateList} disabled={creating || !name}>
                  {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Criar Lista
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-24 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      ) : lists.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Nenhuma lista</h3>
            <p className="text-sm text-muted-foreground mt-1">Crie listas para organizar seus contatos</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <Card key={list.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground text-sm">{list.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteList(list.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {list.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{list.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {list.contact_count || 0} contatos
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {list.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
