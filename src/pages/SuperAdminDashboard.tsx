import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useWeddingHalls, useHallAdmins, useMutateHall } from '@/hooks/useHallData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit2, Users, MapPin, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function SuperAdminDashboard() {
  const { user, signOut } = useAuth();
  const { data: halls, isLoading } = useWeddingHalls();
  const { data: allAdmins } = useHallAdmins();
  const { create, update, remove } = useMutateHall();
  const qc = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [editHall, setEditHall] = useState<any>(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [adminForm, setAdminForm] = useState({ hallId: '', email: '', userId: '' });
  const [adminOpen, setAdminOpen] = useState<string | null>(null);

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
    if (!confirm("Oshiriwdi tastıyqlaysızba?")) return;
    await remove.mutateAsync(id);
    toast.success('Toyxona oshirildi!');
  };

  const handleAddAdmin = async (hallId: string) => {
    // We need to add by user_id + email. The super admin provides the email.
    // We'll store a placeholder user_id that gets linked when user logs in
    const { error } = await supabase.from('hall_admins').insert({
      hall_id: hallId,
      email: adminForm.email,
      user_id: adminForm.userId || '00000000-0000-0000-0000-000000000000',
      full_name: adminForm.email,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Admin qosıldı!');
      qc.invalidateQueries({ queryKey: ['hall_admins'] });
      setAdminForm({ hallId: '', email: '', userId: '' });
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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-serif">Barshа toyxonalar</h2>
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

        {/* Edit dialog */}
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
                        <Plus className="mr-1 h-3 w-3" /> Admin qosıw
                      </Button>
                    </div>
                    {allAdmins?.filter(a => a.hall_id === hall.id).map(admin => (
                      <div key={admin.id} className="flex items-center justify-between rounded-md bg-secondary/50 px-2 py-1 text-sm mb-1">
                        <span>{admin.email}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveAdmin(admin.id)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Admin Dialog */}
        <Dialog open={!!adminOpen} onOpenChange={v => { if (!v) setAdminOpen(null); }}>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif">Admin qosıw</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Admin email" value={adminForm.email} onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))} />
              <Input placeholder="User ID (Supabase auth.users UUID)" value={adminForm.userId} onChange={e => setAdminForm(f => ({ ...f, userId: e.target.value }))} />
              <p className="text-xs text-muted-foreground">Admin Google arqali kirisin, keyin user ID sini kórshetiń</p>
              <Button onClick={() => adminOpen && handleAddAdmin(adminOpen)} disabled={!adminForm.email || !adminForm.userId} className="w-full gold-gradient text-primary-foreground">
                Saqlaw
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
