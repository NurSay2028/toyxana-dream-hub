import { useState, useEffect } from 'react';

interface Banner {
  id: string;
  image_url: string;
  title: string | null;
}

export default function BannerCarousel({ banners }: { banners?: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log("📸 BannerCarousel render:", { banners });

  // Agar banners bo'lmasa yoki bo'sh bo'lsa
  if (!banners || banners.length === 0) {
    console.log("❌ No banners");
    return (
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-3xl" style={{ aspectRatio: '9/16' }}>
        <div className="flex items-center justify-center h-full text-white">
          <p>Bannerlar mavjud emas</p>
        </div>
      </div>
    );
  }

  console.log("✅ Showing banner:", banners[currentIndex]);

  return (
    <div className="w-full max-w-md mx-auto" style={{ aspectRatio: '9/16' }}>
      <img
        src={banners[currentIndex].image_url}
        alt="Banner"
        className="w-full h-full object-cover rounded-3xl"
        onError={(e) => {
          console.error("❌ Rasm yuklanmadi:", banners[currentIndex].image_url);
          e.currentTarget.src = "https://via.placeholder.com/400x700?text=No+Image";
        }}
      />
    </div>
  );
}
