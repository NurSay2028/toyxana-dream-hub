import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useWeddingHalls, useHallAdmins, useMutateHall, useProfiles } from '@/hooks/useHallData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit2, Users, MapPin, Phone, UserPlus, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function SuperAdminDashboard() {
  const { user, signOut } = useAuth();
  const { data: halls, isLoading } = useWeddingHalls();
  const { data: allAdmins } = useHallAdmins();
  const { data: profiles } = useProfiles();
  const { create, update, remove } = useMutateHall();
  const qc = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [editHall, setEditHall] = useState<any>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [adminOpen, setAdminOpen] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Get users who are NOT already hall admins
  const assignedUserIds = new Set(allAdmins?.map(a => a.user_id) ?? []);
  const availableUsers = profiles?.filter(p => !assignedUserIds.has(p.user_id) && p.user_id !== user?.id) ?? [];

  const handleCreate = async () => {
    await create.mutateAsync(form);
    setForm({ name: '', address: '', phone: '' });
    setAddOpen(false);
    toast.success('Toyxona qosıldı!');
  };

  const handleUpdate = async () => {
    if (!editHall) return;
    await update.mutateAsync({ id: editHall.id, ...form });
    setEditHall(null);
    setForm({ name: '', address: '', phone: '' });
    toast.success('Toyxona jańalandı!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Oshiriwdi tastıyqlaysızba?')) return;
    await remove.mutateAsync(id);
    toast.success('Toyxona oshirildi!');
  };

  const handleAddAdmin = async (hallId: string) => {
    const profile = profiles?.find(p => p.user_id === selectedUserId);
    if (!profile) return;

    const { error } = await supabase.from('hall_admins').insert({
      hall_id: hallId,
      email: profile.email || '',
      user_id: profile.user_id,
      full_name: profile.full_name || profile.email || '',
      avatar_url: profile.avatar_url || '',
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Admin tayınlandı!');
      qc.invalidateQueries({ queryKey: ['hall_admins'] });
      setSelectedUserId('');
      setAdminOpen(null);
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    const { error } = await supabase.from('hall_admins').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Admin oshirildi!');
      qc.invalidateQueries({ queryKey: ['hall_admins'] });
    }
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background">
      <Navbar title="NurSay — Super Admin" onLogout={signOut} userName={user?.email ?? ''} />
      <main className="container py-8">
        <Tabs defaultValue="halls">
          <TabsList className="glass mb-6">
            <TabsTrigger value="halls" className="flex items-center gap-1"><Building2 className="h-4 w-4" /> Toyxonalar</TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1"><Users className="h-4 w-4" /> Ro'yxattan ótkenler</TabsTrigger>
          </TabsList>

          <TabsContent value="halls">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold font-serif">Barsha toyxonalar</h2>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button className="gold-gradient text-primary-foreground"><Plus className="mr-1 h-4 w-4" /> Qosıw</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-serif">Jańa toyxona qosıw</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Toyxona atı" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    <Input placeholder="Manzil" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                    <Input placeholder="Telefon" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    <Button onClick={handleCreate} disabled={!form.name || create.isPending} className="w-full gold-gradient text-primary-foreground">
                      {create.isPending ? 'Saqlanıwda...' : 'Saqlaw'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Dialog open={!!editHall} onOpenChange={v => { if (!v) setEditHall(null); }}>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-serif">Toyxona o'zgertiw</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Toyxona atı" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  <Input placeholder="Manzil" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                  <Input placeholder="Telefon" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  <Button onClick={handleUpdate} disabled={!form.name || update.isPending} className="w-full gold-gradient text-primary-foreground">
                    {update.isPending ? 'Saqlanıwda...' : 'Saqlaw'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {halls?.map(hall => (
                <motion.div key={hall.id} variants={item}>
                  <Card className="glass overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between font-serif text-lg">
                        {hall.name}
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditHall(hall); setForm({ name: hall.name, address: hall.address ?? '', phone: hall.phone ?? '' }); }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(hall.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {hall.address && <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" />{hall.address}</p>}
                      {hall.phone && <p className="flex items-center gap-1 text-sm text-muted-foreground"><Phone className="h-3 w-3" />{hall.phone}</p>}
                      <div className="mt-3 border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium flex items-center gap-1"><Users className="h-3 w-3" />Adminler</span>
                          <Button variant="outline" size="sm" onClick={() => setAdminOpen(hall.id)}>
                            <UserPlus className="mr-1 h-3 w-3" /> Tayınlaw
                          </Button>
                        </div>
                        {allAdmins?.filter(a => a.hall_id === hall.id).map(admin => (
                          <div key={admin.id} className="flex items-center justify-between rounded-md bg-secondary/50 px-2 py-1.5 text-sm mb-1">
                            <div className="flex items-center gap-2">
                              {admin.avatar_url && <img src={admin.avatar_url} alt="" className="h-6 w-6 rounded-full" />}
                              <div>
                                <p className="font-medium text-xs">{admin.full_name || admin.email}</p>
                                <p className="text-xs text-muted-foreground">{admin.email}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveAdmin(admin.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        {(!allAdmins || allAdmins.filter(a => a.hall_id === hall.id).length === 0) && (
                          <p className="text-xs text-muted-foreground italic">Házirshe admin joq</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="users">
            <h2 className="mb-4 text-2xl font-bold font-serif">Google orqalı ro'yxattan ótkenler</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {profiles?.map(profile => {
                const isAdmin = assignedUserIds.has(profile.user_id);
                const adminHall = allAdmins?.find(a => a.user_id === profile.user_id);
                const hallName = adminHall ? halls?.find(h => h.id === adminHall.hall_id)?.name : null;
                return (
                  <Card key={profile.id} className="glass">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {profile.avatar_url && <img src={profile.avatar_url} alt="" className="h-10 w-10 rounded-full" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{profile.full_name || 'Atı joq'}</p>
                          <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                        </div>
                      </div>
                      {isAdmin ? (
                        <div className="mt-2 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary font-medium">
                          ✓ Admin: {hallName || 'Toyxona'}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-muted-foreground italic">Házirshe tayınlanbag'an</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              {(!profiles || profiles.length === 0) && (
                <p className="text-muted-foreground col-span-full text-center py-8">Házirshe hesh kim ro'yxattan ótpegen</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Assign Admin Dialog */}
        <Dialog open={!!adminOpen} onOpenChange={v => { if (!v) { setAdminOpen(null); setSelectedUserId(''); } }}>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif">Admin tayınlaw</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Google orqalı kirgen paydalanıwshılar tiziminen tańlań:</p>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Paydalanıwshı tańlań" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map(p => (
                    <SelectItem key={p.user_id} value={p.user_id}>
                      <div className="flex items-center gap-2">
                        {p.avatar_url && <img src={p.avatar_url} alt="" className="h-5 w-5 rounded-full" />}
                        <span>{p.full_name || p.email}</span>
                        <span className="text-muted-foreground text-xs">({p.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableUsers.length === 0 && (
                <p className="text-sm text-muted-foreground italic">Tayınlaw ushın paydalanıwshı joq. Aldın Google menen kirisiw kerek.</p>
              )}
              <Button
                onClick={() => adminOpen && handleAddAdmin(adminOpen)}
                disabled={!selectedUserId}
                className="w-full gold-gradient text-primary-foreground"
              >
                Tayınlaw
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
