import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TENANT_ID } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Users, Upload, Loader2, Search, Edit2, Trash2, UserPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Contacts management
  const [selectedList, setSelectedList] = useState<ContactList | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [addingContact, setAddingContact] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  async function handleCreateList() {
    if (!name) return;
    setCreating(true);
    try {
      const { error } = await supabase.from("contact_lists").insert({
        name,
        description,
        tenant_id: TENANT_ID,
        type: "MANUAL",
      });
      if (error) throw error;
      toast.success("Lista criada com sucesso");
      setShowCreate(false);
      setName("");
      setDescription("");
      fetchLists();
    } catch (err) {
      console.error("Create list error:", err);
      toast.error("Erro ao criar lista");
    } finally {
      setCreating(false);
    }
  }

  async function fetchContacts(list: ContactList) {
    setContactsLoading(true);
    try {
      // Tenta buscar por list_id, se falhar (coluna não existe), busca por tags
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .or(`list_id.eq.${list.id},tags.cs.{list:${list.id}}`)
        .order("name", { ascending: true });
      
      if (error) {
        // Fallback manual se a query complexa falhar
        const { data: fallbackData } = await supabase
          .from("contacts")
          .select("*")
          .eq("tenant_id", TENANT_ID)
          .contains("tags", [`list:${list.id}`]);
        
        setContacts(fallbackData || []);
      } else {
        setContacts(data || []);
      }
    } catch (err) {
      console.error("Fetch contacts error:", err);
      toast.error("Erro ao carregar contatos");
    } finally {
      setContactsLoading(false);
    }
  }

  async function handleAddContact() {
    if (!newContactPhone || !selectedList) return;
    setAddingContact(true);
    try {
      const phone = newContactPhone.replace(/\D/g, "");
      
      // Busca contato existente para preservar tags
      const { data: existing } = await supabase
        .from("contacts")
        .select("tags")
        .eq("phone", phone)
        .eq("tenant_id", TENANT_ID)
        .maybeSingle();

      const currentTags = existing?.tags || [];
      const listTag = `list:${selectedList.id}`;
      const newTags = currentTags.includes(listTag) ? currentTags : [...currentTags, listTag];

      // Tenta o upsert com list_id e restrição de unicidade
      const { error } = await supabase.from("contacts").upsert({
        phone,
        name: newContactName || "",
        tenant_id: TENANT_ID,
        tags: newTags,
        list_id: selectedList.id
      }, { onConflict: "phone,tenant_id" });

      if (error) {
        console.warn("Primeira tentativa de upsert falhou, tentando fallback...", error);
        
        // Fallback 1: Tenta sem o list_id (caso a coluna não tenha sido criada corretamente)
        const { error: errorNoList } = await supabase.from("contacts").upsert({
          phone,
          name: newContactName || "",
          tenant_id: TENANT_ID,
          tags: newTags
        }, { onConflict: "phone,tenant_id" });

        if (errorNoList) {
          console.warn("Segunda tentativa de upsert falhou, tentando insert simples...", errorNoList);
          
          // Fallback 2: Tenta um insert simples (caso a restrição onConflict não exista)
          const { error: errorInsert } = await supabase.from("contacts").insert({
            phone,
            name: newContactName || "",
            tenant_id: TENANT_ID,
            tags: newTags,
            list_id: selectedList.id
          });

          if (errorInsert) {
            // Fallback 3: Insert simples sem list_id
            const { error: errorFinal } = await supabase.from("contacts").insert({
              phone,
              name: newContactName || "",
              tenant_id: TENANT_ID,
              tags: newTags
            });
            
            if (errorFinal) throw errorFinal;
          }
        }
      }

      toast.success("Contato adicionado");
      setNewContactPhone("");
      setNewContactName("");
      setShowAddContact(false);
      fetchContacts(selectedList);
      fetchLists();
    } catch (err) {
      console.error("Add contact error:", err);
      toast.error("Erro ao adicionar contato");
    } finally {
      setAddingContact(false);
    }
  }

  async function handleDeleteContact(contact: any) {
    if (!selectedList) return;
    try {
      const listTag = `list:${selectedList.id}`;
      const newTags = (contact.tags || []).filter((t: string) => t !== listTag);

      const { error } = await supabase
        .from("contacts")
        .update({ 
          tags: newTags,
          list_id: null 
        })
        .eq("id", contact.id);
      
      if (error) {
        // Fallback sem list_id
        await supabase
          .from("contacts")
          .update({ tags: newTags })
          .eq("id", contact.id);
      }

      toast.success("Contato removido da lista");
      fetchContacts(selectedList);
      fetchLists();
    } catch (err) {
      console.error("Delete contact error:", err);
      toast.error("Erro ao remover contato");
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
        const contactsToImport = [];
        
        for (let i = 1; i < lines.length; i++) {
          const [phone, contactName] = lines[i].split(",");
          if (phone && phone.trim()) {
            contactsToImport.push({
              phone: phone.trim().replace(/\D/g, ""),
              name: contactName?.trim() || null,
              tenant_id: TENANT_ID,
            });
          }
        }

        if (contactsToImport.length > 0) {
          const { error } = await supabase.from("contacts").upsert(contactsToImport, { onConflict: "phone,tenant_id" });
          if (error) throw error;
          toast.success(`${contactsToImport.length} contatos importados/atualizados`);
          fetchLists();
        }
      } catch (err) {
        console.error("Import error:", err);
        toast.error("Erro ao importar CSV");
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
            <Card 
              key={list.id} 
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => {
                setSelectedList(list);
                setShowContacts(true);
                fetchContacts(list);
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">{list.name}</h3>
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

      {/* Contacts View Dialog */}
      <Dialog open={showContacts} onOpenChange={setShowContacts}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedList?.name}</DialogTitle>
            <DialogDescription>Visualizando contatos desta lista</DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar contato..." />
            </div>
            <Button className="gap-2" onClick={() => setShowAddContact(true)}>
              <UserPlus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          <ScrollArea className="flex-1 border rounded-md">
            {contactsLoading ? (
              <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>
            ) : contacts.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">Nenhum contato nesta lista</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name || "Sem nome"}</TableCell>
                      <TableCell>{c.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => handleDeleteContact(c)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Adicionar Contato</DialogTitle>
            <DialogDescription>Insira os dados do novo contato para esta lista</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Telefone (com DDD)</Label>
              <Input value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} placeholder="Ex: 11999999999" />
            </div>
            <div className="space-y-2">
              <Label>Nome (opcional)</Label>
              <Input value={newContactName} onChange={(e) => setNewContactName(e.target.value)} placeholder="Ex: João Silva" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContact(false)}>Cancelar</Button>
            <Button onClick={handleAddContact} disabled={addingContact || !newContactPhone}>
              {addingContact && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
