import React, { useRef, useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { LiquidGlassButton } from './LiquidGlassButton';

interface HeroProps {
  onOpenBooking?: () => void;
}

interface HeroConfigState {
  videoUrl: string;
  xPosition: number;
  yPosition: number;
  zoom: number;
  brightness: number;
  contrast: number;
}

export const Hero: React.FC<HeroProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [heroConfig, setHeroConfig] = useState<HeroConfigState>({
    videoUrl: '/uploads/media_1791123532086_IMG_3618.mp4',
    xPosition: 50,
    yPosition: 21,
    zoom: 1,
    brightness: 1,
    contrast: 1,
  });

  // Sync latest video URL and framing from server
  useEffect(() => {
    fetch('/api/hero-config')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setHeroConfig((prev) => ({
            ...prev,
            videoUrl: data.videoUrl || prev.videoUrl,
            xPosition: typeof data.xPosition === 'number' ? data.xPosition : prev.xPosition,
            yPosition: typeof data.yPosition === 'number' ? data.yPosition : prev.yPosition,
            zoom: typeof data.zoom === 'number' ? data.zoom : prev.zoom,
            brightness: typeof data.brightness === 'number' ? data.brightness : 1,
            contrast: typeof data.contrast === 'number' ? data.contrast : 1,
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Ensure autoplay works buttery-smooth and instantly across all browsers
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.defaultMuted = true;
    vid.muted = true;

    const playVideo = () => {
      vid.muted = true;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const unlock = () => {
            vid.muted = true;
            vid.play().catch(() => {});
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
          };
          window.addEventListener('click', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
        });
      }
    };

    playVideo();
  }, [heroConfig.videoUrl]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden bg-[#0C0E12] select-none">
      {/* Background Full-Screen Looping Video */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Instant crisp background poster frame */}
        <img
          src="/hero-poster.jpg"
          alt="Ramy's Dance Studio Hero"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          style={{
            objectPosition: `${heroConfig.xPosition}% ${heroConfig.yPosition}%`,
            transform: 'translate3d(0, 0, 0)',
          }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none will-change-transform z-0"
        />

        <video
          ref={videoRef}
          key={heroConfig.videoUrl}
          poster="/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          }}
          onCanPlay={() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          }}
          style={{
            objectPosition: `${heroConfig.xPosition}% ${heroConfig.yPosition}%`,
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            willChange: 'transform',
          }}
          className="relative z-10 w-full h-full object-cover pointer-events-none will-change-transform"
        >
          <source src={heroConfig.videoUrl} type="video/mp4" />
        </video>

        {/* Ambient Top & Bottom Lighting Gradients */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.06) 45%, rgba(0,0,0,0.25) 100%)',
          }}
        />

        {/* Soft top navbar vignette */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 via-black/15 to-transparent pointer-events-none" />
      </div>

      {/* Main Center-Bottom Action - Brand Crest & Liquid Glass Button */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20 flex flex-col items-center justify-center text-center">
        {/* Prominent Official Brand Seal & Studio Name in Hero */}
        <div className="flex flex-col items-center justify-center mb-5 sm:mb-6 pointer-events-none select-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white p-1 sm:p-1.5 shadow-2xl ring-4 ring-white/30 flex items-center justify-center mb-2.5 sm:mb-3 overflow-hidden">
            <img
              src="/logo-badge.png"
              alt="Ramy's Dance Studio Official Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-display text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] uppercase">
            RAMY&apos;S DANCE STUDIO
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/90 font-bold tracking-wide drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] mt-1 max-w-md">
            Premier Dance Academy in Ranchi • All Categories
          </p>
        </div>

        <div className="flex items-center justify-center">
          <LiquidGlassButton
            onClick={() => scrollToSection('categories')}
            icon={<ArrowDown className="w-4 h-4 stroke-[3]" />}
            iconPosition="right"
            padding="px-8 sm:px-10 py-3.5 sm:py-4.5"
          >
            CATEGORIES
          </LiquidGlassButton>
        </div>
      </div>
    </section>
  );
};
