import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBrideGroom, useMutateBrideGroom } from '@/hooks/useHallData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

interface Props { hallId: string; }

export default function BrideGroomEditor({ hallId }: Props) {
  const { data } = useBrideGroom(hallId);
  const mutation = useMutateBrideGroom(hallId);
  const [form, setForm] = useState({ bride_name: '', groom_name: '', bride_photo: '', groom_photo: '', love_story: '', wedding_date: '' });

  useEffect(() => {
    if (data) {
      setForm({
        bride_name: data.bride_name,
        groom_name: data.groom_name,
        bride_photo: data.bride_photo ?? '',
        groom_photo: data.groom_photo ?? '',
        love_story: data.love_story ?? '',
        wedding_date: data.wedding_date ?? '',
      });
    }
  }, [data]);

  const handleSave = async () => {
    await mutation.mutateAsync({ ...form, id: data?.id });
    toast.success("Kelin-kuyew mag'lıwmatları saqlandı!");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="glass max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif"><Heart className="h-5 w-5 text-primary" /> Kelin ha'm kuyew</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Kelin atı</label>
              <Input value={form.bride_name} onChange={e => setForm(f => ({ ...f, bride_name: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Kuyew atı</label>
              <Input value={form.groom_name} onChange={e => setForm(f => ({ ...f, groom_name: e.target.value }))} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Kelin foto URL</label>
              <Input value={form.bride_photo} onChange={e => setForm(f => ({ ...f, bride_photo: e.target.value }))} placeholder="https://..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Kuyew foto URL</label>
              <Input value={form.groom_photo} onChange={e => setForm(f => ({ ...f, groom_photo: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Toy kúni</label>
            <Input value={form.wedding_date} onChange={e => setForm(f => ({ ...f, wedding_date: e.target.value }))} placeholder="2025-06-15" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Gáp-hikáyat</label>
            <Textarea rows={4} value={form.love_story} onChange={e => setForm(f => ({ ...f, love_story: e.target.value }))} placeholder="Sizdiń muhabbat hikáyańız..." />
          </div>
          <Button onClick={handleSave} disabled={!form.bride_name || !form.groom_name || mutation.isPending} className="gold-gradient text-primary-foreground">
            {mutation.isPending ? 'Saqlanıwda...' : 'Saqlaw'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
