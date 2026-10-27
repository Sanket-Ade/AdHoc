'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { useAuth } from '@/context/AuthContext';
import { POPULAR_CATEGORIES } from '@/lib/mock-data';
import { formatINR } from '@/lib/format';
import { Search, MapPin, ArrowRight, Sparkles, ShieldCheck, Video, Printer, FileText, MonitorPlay, Camera, Compass, Layers, ChevronRight, Heart } from 'lucide-react';
const CATEGORY_ICON_MAP = {
    Video: <Video className="w-4 h-4"/>,
    Sparkles: <Sparkles className="w-4 h-4"/>,
    Printer: <Printer className="w-4 h-4"/>,
    FileText: <FileText className="w-4 h-4"/>,
    MonitorPlay: <MonitorPlay className="w-4 h-4"/>,
    Camera: <Camera className="w-4 h-4"/>,
    Compass: <Compass className="w-4 h-4"/>,
    Layers: <Layers className="w-4 h-4"/>,
};
const PRODUCTION_HUBS = [
    { id: 'all', name: 'All India', count: 450 },
    { id: 'mumbai', name: 'Mumbai (Film City & Ad Studios)', count: 210 },
    { id: 'bengaluru', name: 'Bengaluru (D2C & Tech Brands)', count: 78 },
];
export default function HomePage() {
    const router = useRouter();
    const { productionHouses, isHouseSaved, toggleSaveHouse } = useAuth();
    const [selectedHub, setSelectedHub] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedBudgetRange, setSelectedBudgetRange] = useState('all');
    const [enquiryModalHouse, setEnquiryModalHouse] = useState(null);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery)
            params.set('q', searchQuery);
        if (selectedCategory && selectedCategory !== 'All Categories')
            params.set('category', selectedCategory);
        if (selectedHub !== 'all') {
            const hubObj = PRODUCTION_HUBS.find((h) => h.id === selectedHub);
            if (hubObj)
                params.set('location', hubObj.name.split(' ')[0]);
        }
        router.push(`/explore?${params.toString()}`);
    };
    // Filter roster by selected hub
    const rosterHouses = productionHouses.filter((h) => {
        if (selectedHub === 'all')
            return true;
        if (selectedHub === 'mumbai')
            return h.city.toLowerCase() === 'mumbai';
        if (selectedHub === 'bengaluru')
            return h.city.toLowerCase() === 'bengaluru';
        return true;
    });
    return (<div className="flex flex-col min-h-screen bg-[#FAFAFA] text-zinc-900">
      {/* 1. TOP HUB TICKER / MARKETPLACE STATUS BAR */}
      <div className="bg-white border-b border-zinc-200/80 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm gap-2">
          {/* <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-zinc-900">India Production Index:</span>
          <span className="text-zinc-500">
            450+ Verified Studios • Direct Commercial Rate Cards in ₹ INR
          </span>
        </div> */}

          {/* <div className="flex items-center gap-3 text-zinc-500">
          <span>Response SLA: &lt; 2.4h</span>
          <span>•</span>
          <span className="text-amber-800 font-semibold">Zero Broker Markup</span>
        </div> */}
        </div>
      </div>

      {/* 2. EDITORIAL HERO & COMMAND CENTER */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/20 relative bg-cover bg-no-repeat overflow-hidden " style={{ backgroundImage: `url('/bg-page.png')`,
            padding: '2rem'

        }}>
        {/* Subtle dark gradient overlay to ensure text contrast and legibility */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none"/>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-300 text-zinc-950 text-xs sm:text-sm font-bold border border-yellow-400 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-zinc-950"/>
              <span>Verified Commercial Roster • FY 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black  text-white tracking-tight leading-[1.1] drop-shadow-sm">
              Commercial Video & Digital Advertisement Studios.
            </h1>

            <p className="text-base sm:text-lg text-zinc-100 max-w-2xl leading-relaxed font-medium drop-shadow-xs">
              Procure broadcast ad films, TVCs, performance digital video, 
              and high-impact digital advertisement campaigns directly from verified Indian facilities.
            </p>

            {/* Hub Tabs */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {PRODUCTION_HUBS.map((hub) => (<button key={hub.id} onClick={() => setSelectedHub(hub.id)} className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${selectedHub === hub.id
                ? 'bg-yellow-300 text-zinc-950 shadow-sm border border-yellow-400 font-bold'
                : 'bg-white/90 hover:bg-white text-zinc-800 border border-white/60 backdrop-blur-xs font-medium'}`}>
                    {hub.name}
                  </button>))}
              </div>
            </div>

            {/* Direct Search Form */}
            <form onSubmit={handleSearchSubmit} className="p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl space-y-2 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-6 flex items-center px-3.5 py-2.5 bg-white rounded-xl border border-zinc-200 focus-within:border-yellow-500">
                  <Search className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0"/>
                  <input type="text" placeholder="Studio, director, or camera (e.g. Alexa LF, Heidelberg)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full text-sm text-zinc-900 placeholder-zinc-400 outline-none bg-transparent"/>
                </div>

                <div className="sm:col-span-4 flex items-center px-3.5 py-2 bg-white rounded-xl border border-zinc-200">
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full text-sm text-zinc-900 outline-none cursor-pointer bg-transparent">
                    <option value="All Categories" className="bg-white text-zinc-900">All Capabilities</option>
                    {POPULAR_CATEGORIES.map((cat) => (<option key={cat.name} value={cat.name} className="bg-white text-zinc-900">
                        {cat.name}
                      </option>))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <Button type="submit" variant="primary" size="md" className="w-full text-sm py-2.5 font-bold">
                    Search
                  </Button>
                </div>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/explore">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4"/>} className="text-sm font-bold shadow-md">
                  Open Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES DIRECTORY - MINIMAL & CLEAN */}
      <section
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b mt-[0.5px] border-zinc-800/20 relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url('/empty-bg.png')` }}
      >
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-yellow-300 block mb-1">
                Disciplines
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white drop-shadow-sm">
                Commercial Capabilities
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="md" className="bg-white/90 hover:bg-white text-zinc-900 border-white/60 font-semibold shadow-xs text-xs sm:text-sm">
                Full Index ({POPULAR_CATEGORIES.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POPULAR_CATEGORIES.map((cat) => (<Link key={cat.name} href={`/explore?category=${encodeURIComponent(cat.name)}`} className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 hover:border-yellow-400 shadow-soft hover:shadow-md transition-all group flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100/70 text-amber-900 border border-yellow-200/90 flex items-center justify-center shrink-0 group-hover:bg-yellow-300 group-hover:text-zinc-950 transition-colors">
                    {CATEGORY_ICON_MAP[cat.iconName] || <Video className="w-5 h-5"/>}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 truncate group-hover:text-amber-900 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs sm:text-sm text-zinc-500 block font-medium">
                      {cat.count} Studios
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-transform shrink-0"/>
              </Link>))}
          </div>
        </div>
      </section>

      {/* 4. VERIFIED PRODUCTION ROSTER */}
      <section
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b  mt-[0.5px] border-zinc-800/20 relative bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url('/production-houses.png')` }}
      >
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-yellow-300">
                  Roster Index
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GST Verified
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white drop-shadow-sm">
                Featured Production Houses
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4"/>} className="text-xs sm:text-sm font-bold">
                All {productionHouses.length} Studios
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rosterHouses.slice(0, 6).map((house) => {
            const isSaved = isHouseSaved(house.id);
            return (<div key={house.id} className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-soft hover:border-zinc-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    {/* Visual Cover Preview */}
                    <div className="relative h-48 w-full bg-zinc-100 overflow-hidden">
                      <img src={house.coverImageUrl} alt={house.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"/>

                      {/* Bookmark Button */}
                      <button onClick={() => toggleSaveHouse(house.id)} className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${isSaved ? 'bg-rose-600 text-white' : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'}`} aria-label="Bookmark Studio">
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`}/>
                      </button>

                      {/* City Hub Tag */}
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {house.city}
                      </span>

                      {/* Studio Identity Overlaid */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                        <img src={house.logoUrl} alt={house.name} className="w-12 h-12 rounded-xl object-cover border border-white/40 shadow-md bg-white shrink-0"/>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-white truncate drop-shadow-xs">{house.name}</h3>
                          <p className="text-xs sm:text-sm text-zinc-200 truncate flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-yellow-300 shrink-0"/>
                            {house.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Middle Content */}
                    <div className="p-5 space-y-3.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                          {house.availability}
                        </span>
                        <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2.5 py-1 rounded-md">
                          From {formatINR(house.minBudget)}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                        {house.tagline}
                      </p>

                      {/* Services Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {house.services.map((s) => (<span key={s.id} className="text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200 px-2.5 py-1 rounded-md">
                            {s.name}
                          </span>))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-5 pt-0 flex items-center gap-2.5">
                    <Link href={`/production-houses/${house.id}`} className="flex-1">
                      <Button variant="outline" size="md" className="w-full text-xs sm:text-sm py-2.5 font-semibold">
                        Inspect Specs
                      </Button>
                    </Link>
                    <Button variant="primary" size="md" className="flex-1 text-xs sm:text-sm py-2.5 font-semibold" onClick={() => setEnquiryModalHouse(house)}>
                      Request Quote
                    </Button>
                  </div>
                </div>);
        })}
          </div>
        </div>
      </section>

      {/* 5 & 6. PIPELINE & PRODUCTION STANDARDS (SAFEGUARDS) */}
      <div
        className="relative bg-cover bg-center bg-no-repeat overflow-hidden mt-[0.5px] border-b border-zinc-800/20"
        style={{ backgroundImage: `url('/ad-pipeline.png')` }}
      >
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        <div className="relative z-10 divide-y divide-zinc-700/30 ">
          {/* 5. LIVE COMMERCIAL RFP BOARD */}
          <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-yellow-300 block mb-1">
                    Pipeline
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white drop-shadow-sm">
                    Active Briefs in Market
                  </h2>
                </div>
                <Link href="/ai-assistant">
                  <Button variant="primary" size="md" leftIcon={<Sparkles className="w-4 h-4"/>} className="text-xs sm:text-sm font-bold">
                    Submit Project Brief
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-soft space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2.5 py-1 rounded-md">
                      TV Commercial
                    </span>
                    <span className="text-zinc-600 font-medium">Mumbai</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                    Prebiotic Summer TVC & DVCs
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                    30s broadcast commercial + beach shoot.
                  </p>
                  <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-zinc-500 font-medium">Budget</span>
                    <span className="font-extrabold text-zinc-900 text-sm sm:text-base">₹15L – ₹30L</span>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-soft space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2.5 py-1 rounded-md">
                      Digital Advertisement
                    </span>
                    <span className="text-zinc-600 font-medium">Navi Mumbai</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                    Performance Social Video Ads
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                    Multi-aspect motion creative for summer D2C launch.
                  </p>
                  <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-zinc-500 font-medium">Budget</span>
                    <span className="font-extrabold text-zinc-900 text-sm sm:text-base">₹3L – ₹6L</span>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-soft space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2.5 py-1 rounded-md">
                      Digital Advertisement
                    </span>
                    <span className="text-zinc-600 font-medium">Delhi NCR</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                    Interactive Motion Ad Engine
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                    High-velocity digital video variations & hooks.
                  </p>
                  <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-zinc-500 font-medium">Budget</span>
                    <span className="font-extrabold text-zinc-900 text-sm sm:text-base">₹12L – ₹25L</span>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-soft space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2.5 py-1 rounded-md">
                      Video Production
                    </span>
                    <span className="text-zinc-600 font-medium">Bandra West</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                    Cosmetic Serum Drops at 1000fps
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                    Bolt Cinebot robot motion control + Phantom 4K.
                  </p>
                  <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-zinc-500 font-medium">Budget</span>
                    <span className="font-extrabold text-zinc-900 text-sm sm:text-base">₹4L – ₹8L</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. TRANSPARENT INDUSTRY PROTOCOLS (SAFEGUARDS) */}
          <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8  ">
            <div className="max-w-7xl mx-auto  ">
              <div className="max-w-xl mb-6 space-y-1 ">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-yellow-300 block mb-1">
                  Safeguards
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white drop-shadow-sm">
                  Production Standards
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-soft space-y-2">
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-900">
                    PPM Protocols
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    Treatment notes & storyboard signoff prior to principal shoot.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-soft space-y-2">
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-900">
                    GST Milestones
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    Disbursements tied to deliverable milestones with 100% tax credit.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-soft space-y-2">
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-900">
                    Equipment Insurance
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    Full insurance coverage for camera rigs, soundstages & public sites.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-soft space-y-2">
                  <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-900">
                    Master Archival
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    Direct handover of 4K ProRes/RAW masters and color project files.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 7. BOTTOM DIRECTORY CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-10 bg-zinc-900 text-white rounded-3xl border border-zinc-800 shadow-xl">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Commission a Production Run?
            </h2>
            <p className="text-sm sm:text-base text-zinc-300">
              Explore verified studios by capability and budget.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/explore">
              <Button variant="primary" size="lg" className="text-sm sm:text-base font-bold">
                Browse Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enquiry Modal with Indian Rupee formatting */}
      <SendEnquiryModal isOpen={Boolean(enquiryModalHouse)} onClose={() => setEnquiryModalHouse(null)} productionHouse={enquiryModalHouse}/>
    </div>);
}
