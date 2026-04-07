import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFoodItems, useArtists, useBrideGroom } from '@/hooks/useHallData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Heart, UtensilsCrossed, Music, Clock, MapPin } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function GuestPage() {
  const { hallId } = useParams<{ hallId: string }>();
  const [searchParams] = useSearchParams();
  const tableNum = searchParams.get('table');

  const { data: hall, isLoading: hallLoading } = useQuery({
    queryKey: ['hall', hallId],
    queryFn: async () => {
      const { data, error } = await supabase.from('wedding_halls').select('*').eq('id', hallId!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!hallId,
  });

  const { data: brideGroom } = useBrideGroom(hallId!);
  const { data: foods } = useFoodItems(hallId!);
  const { data: artists } = useArtists(hallId!);

  const todayFoods = foods?.filter(f => f.is_today);

  if (hallLoading) return <LoadingSpinner />;
  if (!hall) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Toyxona tabılmadı</p>
    </div>
  );

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.8 }}
        className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 text-center"
      >
        <div className="absolute inset-0 gold-gradient opacity-10" />
        <motion.div variants={fadeUp} className="relative z-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">As salaman alaykum</p>
          <h1 className="mb-4 text-4xl font-bold font-serif text-gold-gradient sm:text-6xl">{hall.name}</h1>
          {hall.address && <p className="flex items-center justify-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{hall.address}</p>}
          {tableNum && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="mt-6 inline-block rounded-full gold-gradient px-6 py-2 text-primary-foreground font-semibold"
            >
              Stol nomiri: {tableNum}
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      {/* Bride & Groom */}
      {brideGroom && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="container py-12"
        >
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <Heart className="mx-auto mb-2 h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-serif text-gold-gradient">Kelin ha'm Kuyew</h2>
          </motion.div>
          <motion.div variants={fadeUp} className="mx-auto max-w-3xl">
            <div className="glass rounded-lg p-8">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
                <div className="text-center">
                  {brideGroom.groom_photo && (
                    <img src={brideGroom.groom_photo} alt={brideGroom.groom_name} className="mx-auto mb-3 h-32 w-32 rounded-full border-4 border-primary/30 object-cover" />
                  )}
                  <h3 className="text-xl font-bold font-serif">{brideGroom.groom_name}</h3>
                  <p className="text-sm text-muted-foreground">Kuyew</p>
                </div>
                <Heart className="h-10 w-10 text-primary animate-pulse" />
                <div className="text-center">
                  {brideGroom.bride_photo && (
                    <img src={brideGroom.bride_photo} alt={brideGroom.bride_name} className="mx-auto mb-3 h-32 w-32 rounded-full border-4 border-primary/30 object-cover" />
                  )}
                  <h3 className="text-xl font-bold font-serif">{brideGroom.bride_name}</h3>
                  <p className="text-sm text-muted-foreground">Kelin</p>
                </div>
              </div>
              {brideGroom.wedding_date && (
                <p className="mt-6 text-center text-muted-foreground">Toy kúni: <span className="font-semibold text-foreground">{brideGroom.wedding_date}</span></p>
              )}
              {brideGroom.love_story && (
                <div className="mt-6 border-t border-border pt-6">
                  <h4 className="mb-2 text-center font-serif text-lg font-semibold">Gáp-hikáyat</h4>
                  <p className="text-center text-muted-foreground leading-relaxed">{brideGroom.love_story}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.section>
      )}

      {/* Food Menu */}
      {todayFoods && todayFoods.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="container py-12"
        >
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <UtensilsCrossed className="mx-auto mb-2 h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-serif text-gold-gradient">Búgingi ta'mlar</h2>
          </motion.div>
          <motion.div variants={stagger} className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {todayFoods.map(food => (
              <motion.div key={food.id} variants={fadeUp} className="glass rounded-lg p-5">
                <h4 className="font-semibold text-lg">{food.name}</h4>
                {food.price && <p className="text-primary font-medium">{Number(food.price).toLocaleString()} so'm</p>}
                {food.description && <p className="mt-1 text-sm text-muted-foreground">{food.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Artists */}
      {artists && artists.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="container py-12"
        >
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <Music className="mx-auto mb-2 h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-serif text-gold-gradient">Artistler</h2>
          </motion.div>
          <motion.div variants={stagger} className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map(artist => (
              <motion.div key={artist.id} variants={fadeUp} className="glass rounded-lg p-5 text-center">
                <h4 className="text-lg font-semibold">{artist.name}</h4>
                {artist.performance_time && (
                  <p className="mt-1 flex items-center justify-center gap-1 text-sm text-primary"><Clock className="h-3 w-3" />{artist.performance_time}</p>
                )}
                {artist.description && <p className="mt-1 text-sm text-muted-foreground">{artist.description}</p>}
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>NurSay Toyxana © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
