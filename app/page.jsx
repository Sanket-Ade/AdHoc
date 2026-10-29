'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { useAuth } from '@/context/AuthContext';
import { POPULAR_CATEGORIES } from '@/lib/mock-data';
import { formatINR } from '@/lib/format';
import {
  Search,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Video,
  Printer,
  FileText,
  MonitorPlay,
  Camera,
  Compass,
  Layers,
  ChevronRight,
  Heart,
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  Video: <Video className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Printer: <Printer className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  MonitorPlay: <MonitorPlay className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
};

const PRODUCTION_HUBS = [
  { id: 'all', name: 'All India', count: 450 },
  { id: 'mumbai', name: 'Mumbai', count: 210 },
  { id: 'bengaluru', name: 'Bengaluru', count: 78 },
  { id: 'delhi', name: 'Delhi NCR', count: 95 },
];

export default function HomePage() {
  const router = useRouter();
  const { productionHouses, isHouseSaved, toggleSaveHouse } = useAuth();
  const [selectedHub, setSelectedHub] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [enquiryModalHouse, setEnquiryModalHouse] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory && selectedCategory !== 'All Categories')
      params.set('category', selectedCategory);
    if (selectedHub !== 'all') {
      const hubObj = PRODUCTION_HUBS.find((h) => h.id === selectedHub);
      if (hubObj) params.set('location', hubObj.name);
    }
    router.push(`/explore?${params.toString()}`);
  };

  // Filter roster by selected hub
  const rosterHouses = productionHouses.filter((h) => {
    if (selectedHub === 'all') return true;
    if (selectedHub === 'mumbai') return h.city.toLowerCase() === 'mumbai';
    if (selectedHub === 'bengaluru') return h.city.toLowerCase() === 'bengaluru';
    if (selectedHub === 'delhi') return h.city.toLowerCase().includes('delhi');
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-yellow-200">
      {/* 1. MINIMAL HERO SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 bg-white">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold border border-zinc-200">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
              <span>Commercial & Indie Video Production • Budgets from ₹50,000</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.1]">
              Commercial video production & digital ad studios.
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl font-normal leading-relaxed">
              Procure broadcast ad films, TV commercials, performance video, and social creative from verified facilities and top boutique studios. Transparent rate cards from ₹50,000.
            </p>
          </div>

          {/* Hub Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mr-1">
              Hubs:
            </span>
            {PRODUCTION_HUBS.map((hub) => (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedHub === hub.id
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {hub.name}
              </button>
            ))}
          </div>

          {/* Minimal Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="p-2 sm:p-2.5 bg-zinc-50 rounded-2xl border border-zinc-200/90 shadow-soft max-w-3xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6 flex items-center px-3.5 py-2.5 bg-white rounded-xl border border-zinc-200 focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900">
                <Search className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search studio, camera, or capability..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-zinc-900 placeholder-zinc-400 outline-none bg-transparent"
                />
              </div>

              <div className="sm:col-span-4 flex items-center px-3.5 py-2.5 bg-white rounded-xl border border-zinc-200">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-sm text-zinc-800 outline-none cursor-pointer bg-transparent"
                >
                  <option value="All Categories">All Capabilities</option>
                  {POPULAR_CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full text-sm py-2.5 font-bold"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>

          <div className="flex items-center gap-3 pt-1">
            <Link href="/explore">
              <Button
                variant="outline"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="text-xs sm:text-sm font-semibold"
              >
                Browse Full Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DISCIPLINES / CAPABILITIES */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Core Disciplines
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                Production Capabilities
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm" className="text-xs font-medium">
                Full Index ({POPULAR_CATEGORIES.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-soft hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:bg-yellow-300 group-hover:text-zinc-950 transition-colors">
                    {CATEGORY_ICON_MAP[cat.iconName] || <Video className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 truncate">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1 font-normal">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs font-semibold text-zinc-400">
                    {cat.count} Studios
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CURATED PRODUCTION ROSTER */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Roster Index
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                Featured Production Houses
              </h2>
            </div>
            <Link href="/explore">
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs font-medium"
              >
                All {productionHouses.length} Studios
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rosterHouses.slice(0, 6).map((house) => {
              const isSaved = isHouseSaved(house.id);
              return (
                <div
                  key={house.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-soft hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Cover Preview */}
                    <div className="relative h-44 w-full bg-zinc-100 overflow-hidden">
                      <img
                        src={house.coverImageUrl}
                        alt={house.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleSaveHouse(house.id)}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-rose-600 text-white'
                            : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'
                        }`}
                        aria-label="Bookmark Studio"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                      </button>

                      {/* City Hub Tag */}
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {house.city}
                      </span>

                      {/* Studio Identity Overlaid */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5">
                        <img
                          src={house.logoUrl}
                          alt={house.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/40 shadow-xs bg-white shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm sm:text-base font-bold text-white truncate">
                              {house.name}
                            </h3>
                            {house.verified ? (
                              <CheckCircle2
                                className="w-3.5 h-3.5 text-emerald-400 shrink-0"
                                title="GST Verified"
                              />
                            ) : (
                              <Sparkles
                                className="w-3.5 h-3.5 text-yellow-300 shrink-0"
                                title="Local / Independent Studio"
                              />
                            )}
                          </div>
                          <p className="text-xs text-zinc-200 truncate flex items-center gap-1 font-normal">
                            <MapPin className="w-3 h-3 text-yellow-300 shrink-0" />
                            {house.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Middle Content */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                          {house.availability}
                        </span>
                        <span className="font-bold text-zinc-900 bg-yellow-100/70 border border-yellow-300/80 px-2.5 py-0.5 rounded-md">
                          From {formatINR(house.minBudget)}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed font-normal">
                        {house.tagline}
                      </p>

                      {/* Services Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {house.services.map((s) => (
                          <span
                            key={s.id}
                            className="text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80 px-2 py-0.5 rounded-md"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-4 sm:px-5 pb-5 pt-0 flex items-center gap-2">
                    <Link href={`/production-houses/${house.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="md"
                        className="w-full text-xs py-2 font-medium"
                      >
                        Inspect Specs
                      </Button>
                    </Link>
                    <Button
                      variant={house.verified ? "primary" : "outline"}
                      size="md"
                      disabled={!house.verified}
                      className={`flex-1 text-xs py-2 font-semibold ${!house.verified ? 'opacity-50 cursor-not-allowed text-zinc-400' : ''}`}
                      onClick={() => house.verified && setEnquiryModalHouse(house)}
                    >
                      {house.verified ? 'Request Quote' : 'Verification Required'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ACTIVE BRIEFS (PIPELINE) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Live RFPs
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                Active Briefs in Market
              </h2>
            </div>
            <Link href="/ai-assistant">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Draft Project Brief
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Starter Brief */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-soft space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-md">
                  Digital Ad
                </span>
                <span className="text-zinc-500">Pune / Remote</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                Performance Social Video & Reels
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                Vertical short-form performance video and creative hooks for D2C brand.
              </p>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Budget</span>
                <span className="font-bold text-zinc-900 text-sm">₹50,000 – ₹1.5L</span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-soft space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                  TV Commercial
                </span>
                <span className="text-zinc-500">Mumbai</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                Prebiotic Summer TVC & DVCs
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                30s broadcast commercial + multi-day beach shoot.
              </p>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Budget</span>
                <span className="font-bold text-zinc-900 text-sm">₹15L – ₹30L</span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-soft space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                  Digital Ad
                </span>
                <span className="text-zinc-500">Delhi NCR</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                Interactive Motion Creative Engine
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                High-velocity digital video variations, hooks & typography.
              </p>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Budget</span>
                <span className="font-bold text-zinc-900 text-sm">₹12L – ₹25L</span>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200/90 shadow-soft space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                  Video Production
                </span>
                <span className="text-zinc-500">Bandra West</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                Cosmetic Serum Drops at 1000fps
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                Robot motion control + high-speed camera package.
              </p>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Budget</span>
                <span className="font-bold text-zinc-900 text-sm">₹4L – ₹8L</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCTION STANDARDS */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Protocols
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              Production Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-zinc-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400">01</span>
              <h3 className="text-sm font-bold text-zinc-900">
                PPM Protocols
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                Treatment notes, cast lists, and storyboard signoff prior to principal shoot.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-zinc-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400">02</span>
              <h3 className="text-sm font-bold text-zinc-900">
                Milestone Escrow
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                Direct disbursements tied to verifiable deliverable checkpoints and GST invoices.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-zinc-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400">03</span>
              <h3 className="text-sm font-bold text-zinc-900">
                Insurance Coverage
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                Standard equipment and public liability coverage for camera packages and soundstages.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-zinc-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400">04</span>
              <h3 className="text-sm font-bold text-zinc-900">
                Master Archival
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                Direct handover of clean 4K ProRes/RAW masters and color project files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MINIMALIST CTA */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 sm:p-12 bg-zinc-900 text-white rounded-3xl border border-zinc-800 shadow-lg">
          <div className="space-y-2 max-w-lg">
            <span className="text-xs font-mono uppercase tracking-wider text-yellow-300">
              For Studios & Brands
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to produce or list your studio?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Explore verified commercial facilities and boutique creators. Studios can list for free — verification is never mandatory. Budgets starting from ₹50,000.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link href="/explore">
              <Button
                variant="primary"
                size="md"
                className="text-xs sm:text-sm font-bold w-full"
              >
                Browse Directory
              </Button>
            </Link>
            <Link href="/signup?role=production_house">
              <Button
                variant="outline"
                size="md"
                className="text-xs sm:text-sm font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20 w-full"
              >
                List Your Studio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <SendEnquiryModal
        isOpen={Boolean(enquiryModalHouse)}
        onClose={() => setEnquiryModalHouse(null)}
        productionHouse={enquiryModalHouse}
      />
    </div>
  );
}
