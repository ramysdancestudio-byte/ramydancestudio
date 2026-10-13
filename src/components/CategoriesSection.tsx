import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { RealWhatsappIcon } from './BrandIcons';
import { studioInfo } from '../data/danceData';
import { CategoryItem, DEFAULT_CATEGORIES, loadCategories, saveCategories, sanitizeCategoryItem } from '../data/categoriesData';

interface CategoriesSectionProps {
  onSelectCategory: (categoryTitle: string) => void;
  categories?: CategoryItem[];
  onCategoriesChange?: (categories: CategoryItem[]) => void;
  onOpenSpecialOffer?: () => void;
}

// High-performance media loader for instantaneous 60fps display and zero delay
const CategoryMedia: React.FC<{
  categoryId: string;
  videoUrl?: string;
  imageUrl: string;
  title: string;
  vX: number;
  vY: number;
  vZoom: number;
  iX: number;
  iY: number;
  iZoom: number;
}> = ({ categoryId, videoUrl, imageUrl, title, vX, vY, vZoom, iX, iY, iZoom }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  // Guarantee clean local first-frame poster, never stock or Unsplash photos
  const safeImageUrl = React.useMemo(() => {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.includes('unsplash') || imageUrl.startsWith('http')) {
      const match = DEFAULT_CATEGORIES.find((c) => c.id === categoryId);
      return match?.imageUrl || '/kids-dance.jpg';
    }
    return imageUrl;
  }, [imageUrl, categoryId]);

  React.useEffect(() => {
    if (!videoUrl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { rootMargin: '350px', threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [videoUrl]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-neutral-900">
      {/* Instant crisp poster background: shows the real first frame with zero flicker */}
      <img
        src={safeImageUrl}
        alt={`${title} - Ramy's Dance Studio Ranchi Dance Classes`}
        loading="lazy"
        decoding="async"
        style={{
          objectPosition: `${videoUrl ? vX : iX}% ${videoUrl ? vY : iY}%`,
          transform: `scale(${videoUrl ? vZoom : iZoom}) translateZ(0)`,
        }}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:brightness-105 will-change-transform z-0"
        referrerPolicy="no-referrer"
      />

      {/* Video layer that seamlessly overlays the poster once playing */}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={safeImageUrl}
          onPlaying={() => setVideoPlaying(true)}
          style={{
            objectPosition: `${vX}% ${vY}%`,
            transform: `scale(${vZoom}) translateZ(0)`,
            opacity: videoPlaying ? 1 : 0.001,
          }}
          loop
          muted
          playsInline
          preload="none"
          className="relative z-10 w-full h-full object-cover transition-opacity duration-300 group-hover:brightness-105 pointer-events-none will-change-transform"
        />
      )}
    </div>
  );
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSelectCategory,
  categories: propCategories,
  onCategoriesChange,
  onOpenSpecialOffer,
}) => {
  const [internalCategories, setInternalCategories] = useState<CategoryItem[]>(() => {
    return propCategories && propCategories.length > 0 ? propCategories : loadCategories();
  });

  // Sync internal state if propCategories changes
  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setInternalCategories(propCategories);
    }
  }, [propCategories]);

  // Sync latest categories from server
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => {
        if (!res.ok) throw new Error('Not ok');
        const ct = res.headers.get('content-type');
        if (!ct || !ct.includes('application/json')) throw new Error('Not JSON');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data
            .filter((c) => c.id !== 'home-service' && c.id !== 'job-person')
            .map(sanitizeCategoryItem);
          setInternalCategories(filtered);
          saveCategories(filtered);
          onCategoriesChange?.(filtered);
        }
      })
      .catch(() => {});
  }, []);

  const displayCategories = internalCategories && internalCategories.length > 0
    ? internalCategories.filter((c) => c.id !== 'home-service' && c.id !== 'job-person')
    : DEFAULT_CATEGORIES;

  return (
    <section id="categories" className="relative bg-white text-neutral-900 overflow-hidden">
      {/* Main Categories Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
        
        {/* Section Header */}
        <div className="relative mb-8 sm:mb-12 flex flex-wrap items-center justify-between sm:justify-center gap-3">
          {/* Top Left: Small Reviews Redirect Button (Scrolls smoothly to #reviews) */}
          <a
            href="#reviews"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('reviews');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="sm:absolute sm:left-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 hover:text-neutral-950 border border-neutral-300/80 shadow-2xs hover:shadow-xs transition-all active:scale-95 group shrink-0"
            title="Go to Reviews section"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 transition-transform group-hover:scale-110" />
            <span>Reviews</span>
          </a>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 font-display tracking-tight uppercase text-center order-first sm:order-none w-full sm:w-auto">
            Categories
          </h2>

          {/* Top Right: Chat with Us WhatsApp Button (Same size as Reviews button) */}
          <a
            href={`https://wa.me/${studioInfo.whatsappNumber}?text=${encodeURIComponent("Hi Ramy's Dance Studio, I want to inquire about dance classes, batches, and admission.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:absolute sm:right-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 hover:text-neutral-950 border border-neutral-300/80 shadow-2xs hover:shadow-xs transition-all active:scale-95 group shrink-0"
            title="Chat with us on WhatsApp"
          >
            <RealWhatsappIcon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110" />
            <span>Chat with us</span>
          </a>
        </div>

        {/* Categories Grid (3 columns on desktop, Wedding centered in its row with same size) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {displayCategories.map((category: CategoryItem) => {
            const isWedding = category.id === 'wedding-choreography' || category.title.toLowerCase().includes('wedding');
            
            // Video positioning values
            const vX = category.videoXPosition ?? 50;
            const vY = category.videoYPosition ?? 50;
            const vZoom = category.videoZoom ?? 1;

            // Image positioning values
            const iX = category.imageXPosition ?? 50;
            const iY = category.imageYPosition ?? 50;
            const iZoom = category.imageZoom ?? 1;

            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category.title)}
                className={`group cursor-pointer flex flex-col select-none relative ${
                  isWedding
                    ? 'sm:col-span-2 sm:w-full sm:max-w-[420px] sm:mx-auto lg:col-span-1 lg:col-start-2 lg:max-w-none lg:mx-0'
                    : ''
                }`}
              >
                {/* Card Container: Identical size & aspect-ratio across all cards */}
                <div className="relative w-full aspect-[16/10.5] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/90 shadow-xs transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-neutral-300">
                  <CategoryMedia
                    categoryId={category.id}
                    videoUrl={category.videoUrl}
                    imageUrl={category.imageUrl}
                    title={category.title}
                    vX={vX}
                    vY={vY}
                    vZoom={vZoom}
                    iX={iX}
                    iY={iY}
                    iZoom={iZoom}
                  />
                </div>

                {/* Single Bold Text Label Centered Directly Below Each Card */}
                <h3 className="mt-3 text-center font-bold text-neutral-950 text-sm sm:text-base md:text-lg tracking-tight group-hover:text-[#0066FF] transition-colors">
                  {category.title}
                </h3>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
