'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { useAuth } from '@/context/AuthContext';
import { POPULAR_CATEGORIES } from '@/lib/mock-data';
import { formatINR } from '@/lib/format';
import { Search, MapPin, ArrowRight, Sparkles, ShieldCheck, Video, Printer, FileText, MonitorPlay, Camera, Compass, Layers, ChevronRight, Heart, Cpu } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
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
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/20 relative bg-cover  bg-no-repeat overflow-hidden " style={{ backgroundImage: `url('/bg-page.png')`,
            padding: '2rem'
        }}>
        {/* Subtle dark gradient overlay to ensure text contrast and legibility */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none"/>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-300 text-zinc-950 text-xs font-bold border border-yellow-400 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-950"/>
              <span>Verified Commercial Roster • FY 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-sm font-bold">
              Commercial Film, Print & Stage Studios.
            </h1>

            <p className="text-sm sm:text-base text-zinc-100 max-w-2xl leading-relaxed font-medium drop-shadow-xs ">
              Procure broadcast ad films, high-run packaging presses, DOOH transit hoardings, 
              and 3D CGI directly from verified Indian facilities.
            </p>

            {/* Hub Tabs */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {PRODUCTION_HUBS.map((hub) => (<button key={hub.id} onClick={() => setSelectedHub(hub.id)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${selectedHub === hub.id
                ? 'bg-yellow-300 text-zinc-950 shadow-sm border border-yellow-400 font-bold'
                : 'bg-white/90 hover:bg-white text-zinc-800 border border-white/60 backdrop-blur-xs font-medium'}`}>
                    {hub.name}
                  </button>))}
              </div>
            </div>

            {/* Direct Search Form */}
            <form onSubmit={handleSearchSubmit} className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl space-y-2 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-6 flex items-center px-3 py-2.5 bg-white rounded-xl border border-zinc-200 focus-within:border-yellow-500">
                  <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0"/>
                  <input type="text" placeholder="Studio, director, or camera (e.g. Alexa LF, Heidelberg)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full text-xs text-zinc-900 placeholder-zinc-400 outline-none bg-transparent"/>
                </div>

                <div className="sm:col-span-4 flex items-center px-3 py-2 bg-white rounded-xl border border-zinc-200">
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full text-xs text-zinc-900 outline-none cursor-pointer bg-transparent">
                    <option value="All Categories" className="bg-white text-zinc-900">All Capabilities</option>
                    {POPULAR_CATEGORIES.map((cat) => (<option key={cat.name} value={cat.name} className="bg-white text-zinc-900">
                        {cat.name}
                      </option>))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <Button type="submit" variant="primary" className="w-full text-xs py-2.5 font-bold">
                    Search
                  </Button>
                </div>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/explore">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4"/>} className="font-bold shadow-md">
                  Open Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES DIRECTORY - MINIMAL & CLEAN */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Disciplines
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
                Commercial Capabilities
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm">
                Full Index ({POPULAR_CATEGORIES.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {POPULAR_CATEGORIES.map((cat) => (<Link key={cat.name} href={`/explore?category=${encodeURIComponent(cat.name)}`} className="p-4 rounded-2xl bg-white border border-zinc-200 hover:border-yellow-400 shadow-soft hover:shadow-md transition-all group flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-yellow-100/70 text-amber-900 border border-yellow-200/90 flex items-center justify-center shrink-0 group-hover:bg-yellow-300 group-hover:text-zinc-950 transition-colors">
                    {CATEGORY_ICON_MAP[cat.iconName] || <Video className="w-4 h-4"/>}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 truncate group-hover:text-amber-900 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-zinc-500 block">
                      {cat.count} Studios
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-transform shrink-0"/>
              </Link>))}
          </div>
        </div>
      </section>

      {/* 4. VERIFIED PRODUCTION ROSTER */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Roster Index
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  GST Verified
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1">
                Featured Production Houses
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4"/>}>
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
                    <div className="relative h-44 w-full bg-zinc-100 overflow-hidden">
                      <img src={house.coverImageUrl} alt={house.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>

                      {/* Bookmark Button */}
                      <button onClick={() => toggleSaveHouse(house.id)} className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors cursor-pointer ${isSaved ? 'bg-rose-600 text-white' : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'}`} aria-label="Bookmark Studio">
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`}/>
                      </button>

                      {/* City Hub Tag */}
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {house.city}
                      </span>

                      {/* Studio Identity Overlaid */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                        <img src={house.logoUrl} alt={house.name} className="w-11 h-11 rounded-xl object-cover border border-white/40 shadow-md bg-white shrink-0"/>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-white truncate">{house.name}</h3>
                          <p className="text-[11px] text-zinc-200 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-yellow-300"/>
                            {house.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Middle Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <RatingStars rating={house.rating} reviewCount={house.reviewCount} size="sm"/>
                        <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded">
                          From {formatINR(house.minBudget)}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 line-clamp-1 leading-relaxed">
                        {house.tagline}
                      </p>

                      {/* Technical Facility Spec Tag */}
                      {house.equipmentFacilities && house.equipmentFacilities[0] && (<div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/80 text-[11px] text-zinc-700 flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-amber-700 shrink-0"/>
                          <span className="truncate font-medium">
                            {house.equipmentFacilities[0]}
                          </span>
                        </div>)}

                      {/* Services Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {house.services.map((s) => (<span key={s.id} className="text-[10px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded">
                            {s.name}
                          </span>))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-5 pt-0 flex items-center gap-2">
                    <Link href={`/production-houses/${house.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs py-2">
                        Inspect Specs
                      </Button>
                    </Link>
                    <Button variant="primary" size="sm" className="flex-1 text-xs py-2" onClick={() => setEnquiryModalHouse(house)}>
                      Request Quote
                    </Button>
                  </div>
                </div>);
        })}
          </div>
        </div>
      </section>

      {/* 5. LIVE COMMERCIAL RFP BOARD */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Pipeline
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-900">
                Active Briefs in Market
              </h2>
            </div>
            <Link href="/ai-assistant">
              <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-4 h-4"/>}>
                Submit Project Brief
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded">
                  TV Commercial
                </span>
                <span className="text-zinc-500">Mumbai</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">
                Prebiotic Summer TVC & DVCs
              </h3>
              <p className="text-xs text-zinc-600 line-clamp-1">
                30s broadcast commercial + beach shoot.
              </p>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Budget</span>
                <span className="font-extrabold text-zinc-900">₹15L – ₹30L</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded">
                  Packaging Run
                </span>
                <span className="text-zinc-500">Navi Mumbai</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">
                2,50,000 FMCG Pouches
              </h3>
              <p className="text-xs text-zinc-600 line-clamp-1">
                FSC kraft paper with micro-foil registration.
              </p>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Budget</span>
                <span className="font-extrabold text-zinc-900">₹3L – ₹6L</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded">
                  Outdoor (OOH)
                </span>
                <span className="text-zinc-500">Delhi NCR</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">
                CyberHub Curved Anamorphic 3D
              </h3>
              <p className="text-xs text-zinc-600 line-clamp-1">
                30-day arterial highway domination.
              </p>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Budget</span>
                <span className="font-extrabold text-zinc-900">₹12L – ₹25L</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded">
                  High-Speed
                </span>
                <span className="text-zinc-500">Bandra West</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">
                Cosmetic Serum Drops at 1000fps
              </h3>
              <p className="text-xs text-zinc-600 line-clamp-1">
                Bolt Cinebot robot motion control + Phantom 4K.
              </p>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Budget</span>
                <span className="font-extrabold text-zinc-900">₹4L – ₹8L</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT INDUSTRY PROTOCOLS - MINIMAL */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-6 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Safeguards
            </span>
            <h2 className="text-2xl font-extrabold text-zinc-900">
              Production Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                PPM Protocols
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Treatment notes & storyboard signoff prior to principal shoot.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                GST Milestones
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Disbursements tied to deliverable milestones with 100% tax credit.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Equipment Insurance
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Full insurance coverage for camera rigs, soundstages & public sites.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Master Archival
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Direct handover of 4K ProRes/RAW masters and color project files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM DIRECTORY CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:p-8 bg-zinc-900 text-white rounded-3xl border border-zinc-800 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Ready to Commission a Production Run?
            </h2>
            <p className="text-xs text-zinc-400">
              Explore verified studios by capability and budget.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/explore">
              <Button variant="primary" size="md">
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
