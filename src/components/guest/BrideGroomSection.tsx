import { motion } from 'framer-motion';
import { Heart, Calendar } from 'lucide-react';

interface BrideGroomData {
  bride_name: string;
  groom_name: string;
  bride_photo: string | null;
  groom_photo: string | null;
  love_story: string | null;
  wedding_date: string | null;
}

export default function BrideGroomSection({ data }: { data: BrideGroomData }) {
  const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="container py-16"
    >
      {/* Title */}
      <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="mb-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <Heart className="mx-auto mb-3 h-10 w-10 text-primary" />
        </motion.div>
        <h2 className="text-3xl font-bold font-serif text-gold-gradient sm:text-4xl">Kelin ha'm Kuyew</h2>
      </motion.div>

      {/* Photos */}
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
        {/* Groom */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative mb-4"
          >
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-md" />
            {data.groom_photo ? (
              <img
                src={data.groom_photo}
                alt={data.groom_name}
                className="relative h-48 w-48 rounded-full border-4 border-primary/40 object-cover shadow-2xl sm:h-56 sm:w-56"
              />
            ) : (
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-primary/40 bg-muted sm:h-56 sm:w-56">
                <span className="text-5xl font-serif font-bold text-primary/60">{data.groom_name[0]}</span>
              </div>
            )}
          </motion.div>
          <h3 className="text-2xl font-bold font-serif">{data.groom_name}</h3>
          <p className="text-sm text-muted-foreground">Kuyew</p>
        </motion.div>

        {/* Heart animation */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="h-14 w-14 fill-primary text-primary drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Bride */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative mb-4"
          >
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-md" />
            {data.bride_photo ? (
              <img
                src={data.bride_photo}
                alt={data.bride_name}
                className="relative h-48 w-48 rounded-full border-4 border-primary/40 object-cover shadow-2xl sm:h-56 sm:w-56"
              />
            ) : (
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-primary/40 bg-muted sm:h-56 sm:w-56">
                <span className="text-5xl font-serif font-bold text-primary/60">{data.bride_name[0]}</span>
              </div>
            )}
          </motion.div>
          <h3 className="text-2xl font-bold font-serif">{data.bride_name}</h3>
          <p className="text-sm text-muted-foreground">Kelin</p>
        </motion.div>
      </div>

      {/* Wedding date */}
      {data.wedding_date && (
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-6 py-3">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Toy kúni:</span>
            <span className="font-semibold text-foreground">{data.wedding_date}</span>
          </div>
        </motion.div>
      )}

      {/* Love story */}
      {data.love_story && (
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="glass rounded-2xl p-8 text-center">
            <h4 className="mb-4 font-serif text-xl font-semibold text-gold-gradient">Gáp-hikáyat</h4>
            <p className="leading-relaxed text-muted-foreground">{data.love_story}</p>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
