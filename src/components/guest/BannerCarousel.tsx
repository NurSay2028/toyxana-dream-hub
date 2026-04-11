import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  image_url: string;
  title: string | null;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.1,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
  }),
};

export default function BannerCarousel({ banners }: { banners?: Banner[] }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 🔥 KRITIK: banners ma'lumotini LOCAL STATE ga saqlaymiz
  const [localBanners, setLocalBanners] = useState<Banner[]>([]);

  useEffect(() => {
    // Faqat banners mavjud va array bo'lsa
    if (banners && Array.isArray(banners) && banners.length > 0) {
      console.log("✅ Setting banners:", banners.length);
      setLocalBanners(banners);
      setIsReady(true);
    } else {
      console.log("⏳ Waiting for banners...");
    }
  }, [banners]);

  // Agar ma'lumot bo'lmasa, hech narsa ko'rsatma
  if (!isReady || localBanners.length === 0) {
    return (
      <div 
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-2xl bg-gray-200 animate-pulse"
        style={{ aspectRatio: '9/16' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Loading banners...</p>
        </div>
      </div>
    );
  }

  const index = ((page % localBanners.length) + localBanners.length) % localBanners.length;

  const paginate = useCallback((newDirection: number) => {
    setPage(([p]) => [p + newDirection, newDirection]);
  }, []);

  useEffect(() => {
    if (localBanners.length <= 1 || isHovered) return;
    const timer = setInterval(() => paginate(1), 4500);
    return () => clearInterval(timer);
  }, [localBanners.length, isHovered, paginate]);

  const handleDragEnd = (_: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) paginate(1);
    else if (swipe > swipeConfidenceThreshold) paginate(-1);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-2xl"
      style={{ aspectRatio: '9/16' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background blur */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={localBanners[index].image_url}
          alt=""
          className="h-full w-full scale-110 object-cover blur-2xl opacity-40"
        />
      </div>

      {/* Main slide */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <img
            src={localBanners[index].image_url}
            alt={localBanners[index].title || 'Banner'}
            className="h-full w-full object-cover object-center"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {localBanners[index].title && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-20 left-0 right-0 px-6 text-center"
            >
              <h3 className="text-2xl font-bold font-serif text-white drop-shadow-lg">
                {localBanners[index].title}
              </h3>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {localBanners.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/40"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/40"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </motion.button>
        </>
      )}

      {/* Dots */}
      {localBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {localBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > index ? 1 : -1])}
              className={`relative h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-amber-500' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {localBanners.length > 1 && (
        <div className="absolute right-4 top-4 z-10 rounded-full bg-black/30 px-3 py-1 text-xs text-white backdrop-blur-sm">
          {index + 1} / {localBanners.length}
        </div>
      )}
    </div>
  );
}
