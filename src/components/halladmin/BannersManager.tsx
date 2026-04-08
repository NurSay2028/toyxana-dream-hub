import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBanners, useMutateBanner, uploadHallAsset } from '@/hooks/useHallData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Image, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Props { hallId: string; }

export default function BannersManager({ hallId }: Props) {
  const { data: items, isLoading } = useBanners(hallId);
  const { create, update, remove } = useMutateBanner(hallId);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', image_url: '', sort_order: '0' });
  const [uploading, setUploading] = useState(false);

  const resetForm = () => setForm({ title: '', image_url: '', sort_order: '0' });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadHallAsset(file, hallId);
      setForm(f => ({ ...f, image_url: url }));
      toast.success('Suwret júklendi!');
    } catch (err: any) {
      toast.error(err.message || 'Suwret júklewde qátelik');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const payload = { title: form.title || undefined, image_url: form.image_url, sort_order: parseInt(form.sort_order) || 0 };
    if (editItem) {
      await update.mutateAsync({ id: editItem.id, ...payload });
      toast.success('Banner jańalandı!');
    } else {
      await create.mutateAsync(payload);
      toast.success('Banner qosıldı!');
    }
    resetForm(); setEditItem(null); setOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ title: item.title ?? '', image_url: item.image_url, sort_order: item.sort_order?.toString() ?? '0' });
    setOpen(true);
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const anim = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold font-serif">Bannerler</h3>
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) { setEditItem(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-primary-foreground"><Plus className="mr-1 h-4 w-4" /> Qosıw</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif">{editItem ? "Banner o'zgertiw" : "Jańa banner qosıw"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Banner atı (ıqtıyarıy)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <div>
                <label className="mb-1 block text-sm font-medium">Suwret</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Suwret URL"
                    value={form.image_url}
                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    className="flex-1"
                  />
                  <label className="cursor-pointer">
                    <Button variant="outline" size="icon" disabled={uploading} asChild>
                      <span><Upload className="h-4 w-4" /></span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                </div>
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="mt-2 h-32 w-full rounded-md object-cover" />
                )}
              </div>
              <Input placeholder="Tartip (0, 1, 2...)" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} />
              <Button onClick={handleSave} disabled={!form.image_url || uploading} className="w-full gold-gradient text-primary-foreground">
                {uploading ? 'Júkleniwde...' : 'Saqlaw'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map(item => (
          <motion.div key={item.id} variants={anim}>
            <Card className="glass overflow-hidden">
              <img src={item.image_url} alt={item.title || 'Banner'} className="h-40 w-full object-cover" />
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    {item.title && <h4 className="font-semibold text-sm">{item.title}</h4>}
                    <span className="text-xs text-muted-foreground">Tartip: {item.sort_order}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(item)}><Edit2 className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { remove.mutateAsync(item.id); toast.success('Banner oshirildi!'); }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {(!items || items.length === 0) && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 p-12 text-center">
          <Image className="mb-2 h-10 w-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">Házirshe bannerler joq</p>
        </div>
      )}
    </div>
  );
}
