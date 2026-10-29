'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { formatINR } from '@/lib/format';
import { MapPin, CheckCircle2, Heart, Mail, Phone, Globe, ShieldCheck, ShieldAlert, Lock, Share2, Award, ArrowLeft, Sparkles } from 'lucide-react';
function ProductionHouseProfileContent() {
    const params = useParams();
    const houseId = params?.id;
    const { productionHouses, isHouseSaved, toggleSaveHouse, showToast } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPortfolioCategory, setSelectedPortfolioCategory] = useState('all');
    const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
    const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);
    const house = productionHouses.find((h) => h.id === houseId || h.slug === houseId) || productionHouses[0];
    const isSaved = isHouseSaved(house.id);
    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard?.writeText(window.location.href);
            showToast('Profile URL copied', 'info');
        }
    };
    const filteredPortfolio = house.portfolio.filter((item) => {
        if (selectedPortfolioCategory === 'all')
            return true;
        return item.category === selectedPortfolioCategory;
    });
    return (<div className="bg-[#FAFAFA] text-zinc-900 min-h-screen pb-20">
      {/* 1. COVER BANNER */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-zinc-100 overflow-hidden border-b border-zinc-200">
        <img src={house.coverImageUrl} alt={house.name} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"/>

        {/* Top Actions */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between text-white z-10">
          <Link href="/explore" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-sm font-semibold text-zinc-800 border border-white/40 shadow-xs backdrop-blur-md transition-colors">
            <ArrowLeft className="w-4 h-4"/>
            <span>Directory</span>
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-zinc-800 border border-white/40 shadow-xs backdrop-blur-md transition-colors cursor-pointer" title="Share">
              <Share2 className="w-4 h-4"/>
            </button>
            <button onClick={() => toggleSaveHouse(house.id)} className={`p-2.5 rounded-xl backdrop-blur-md border shadow-xs transition-colors cursor-pointer ${isSaved ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/80 hover:bg-white text-zinc-800 border-white/40'}`} title="Save">
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}/>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PROFILE HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 mb-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200 shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img src={house.logoUrl} alt={house.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-zinc-200 bg-white shadow-xs shrink-0"/>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                  {house.name}
                </h1>
                {house.verified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4"/>
                    Verified Genuine Studio
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600"/>
                    Unverified Studio (Action Required)
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                  {house.availability}
                </span>
              </div>

              <p className="text-sm sm:text-base text-zinc-600 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-zinc-800 font-medium">
                  <MapPin className="w-4 h-4 text-amber-700"/>
                  {house.location}
                </span>
                <span className="text-zinc-300">•</span>
                <span>{house.yearsInBusiness} Yrs Track Record</span>
                <span className="text-zinc-300">•</span>
                <span>{house.teamSize}</span>
              </p>

              <div className="flex items-center gap-3 pt-1">
                <RatingStars rating={house.rating} reviewCount={house.reviewCount} size="md"/>
                <span className="text-sm text-zinc-500">
                  SLA: <strong className="text-zinc-800 font-semibold">&lt; {house.responseRateHours}h</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              disabled={!house.verified}
              onClick={() => setEnquiryModalOpen(true)}
              leftIcon={!house.verified ? <Lock className="w-4 h-4" /> : undefined}
              className={`w-full sm:w-auto text-base font-semibold px-7 py-3 ${!house.verified ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {house.verified ? 'Request Quote' : 'Verification Required'}
            </Button>
          </div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'services', label: `Services (${house.services.length})` },
            { id: 'portfolio', label: `Portfolio (${house.portfolio.length})` },
            { id: 'reviews', label: `Reviews (${house.reviews.length})` },
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? 'bg-zinc-900 text-white border border-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}>
              {tab.label}
            </button>))}
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA + STICKY SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLS: TAB CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (<div className="space-y-6">
                {!house.verified && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs sm:text-sm text-rose-950 shadow-xs">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-rose-950">Mandatory Document Verification Pending</p>
                      <p className="text-rose-700 leading-relaxed font-normal">
                        This production house has not yet submitted genuine business documents (GSTIN or Udyam Certificate). To safeguard client budgets and guarantee delivery, commercial quoting and briefs are temporarily locked for this profile.
                      </p>
                    </div>
                  </div>
                )}

                {/* About Box */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 shadow-soft space-y-4">
                  <h3 className="text-lg font-bold text-zinc-900">Studio Profile</h3>
                  <p className="text-base text-zinc-800 leading-relaxed font-medium">
                    {house.tagline}
                  </p>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {house.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="pt-4 border-t border-zinc-100 grid grid-cols-3 gap-3">
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                      <span className="text-xs text-zinc-500 font-medium block mb-1">Min Engagement</span>
                      <span className="text-sm sm:text-base font-bold text-zinc-900">
                        {formatINR(house.minBudget)}
                      </span>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                      <span className="text-xs text-zinc-500 font-medium block mb-1">Core Crew</span>
                      <span className="text-sm sm:text-base font-bold text-zinc-900">{house.teamSize}</span>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
                      <span className="text-xs text-zinc-500 font-medium block mb-1">Turnaround SLA</span>
                      <span className="text-sm sm:text-base font-bold text-zinc-900">
                        &lt; {house.responseRateHours}h Proposal
                      </span>
                    </div>
                  </div>

                  {/* Technical Facilities & Equipment */}
                  {(() => {
                    const equipmentList = Array.isArray(house.equipmentFacilities)
                      ? house.equipmentFacilities
                      : (typeof house.equipmentFacilities === 'string' ? house.equipmentFacilities : (house.equipment || ''))
                          .split(/[\n,]+/)
                          .map((s) => s.trim())
                          .filter(Boolean);
                    if (equipmentList.length === 0 && !house.studioFloorSpecs) return null;
                    return (
                      <div className="pt-4 border-t border-zinc-100 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                          The Equipment We Use
                        </h4>
                        {equipmentList.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-800">
                            {equipmentList.map((eq, idx) => (
                              <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-center gap-2.5 font-medium">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                                <span className="truncate">{eq}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {house.studioFloorSpecs && (
                          <p className="text-sm text-zinc-600">
                            Floor: <span className="text-zinc-900 font-medium">{house.studioFloorSpecs}</span>
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Notable Clients */}
                <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-soft space-y-3">
                  <h3 className="text-lg font-bold text-zinc-900">Client Credits</h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {house.notableClients.map((client) => (<span key={client} className="px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-sm text-zinc-800 font-medium">
                        {client}
                      </span>))}
                  </div>
                </div>

                {/* Featured Campaign Highlight */}
                {house.portfolio[0] && (<div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-soft space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-zinc-900">Featured Project</h3>
                      <button onClick={() => setActiveTab('portfolio')} className="text-sm font-semibold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer">
                        View All
                      </button>
                    </div>

                    <div className="relative rounded-xl overflow-hidden bg-zinc-100 h-64 sm:h-72 group">
                      <img src={house.portfolio[0].thumbnailUrl} alt={house.portfolio[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                        <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1">
                          {house.portfolio[0].category} • {house.portfolio[0].clientName}
                        </span>
                        <h4 className="text-xl font-bold">{house.portfolio[0].title}</h4>
                        <p className="text-sm text-zinc-200 mt-1 max-w-xl line-clamp-2">
                          {house.portfolio[0].description}
                        </p>
                        {house.portfolio[0].metrics && (<div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold w-fit text-amber-300">
                            <Award className="w-3.5 h-3.5"/>
                            <span>{house.portfolio[0].metrics}</span>
                          </div>)}
                      </div>
                    </div>
                  </div>)}
              </div>)}

            {/* SERVICES TAB */}
            {activeTab === 'services' && (<div className="space-y-3">
                {house.services.map((service) => (<div key={service.id} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-base font-bold text-zinc-900">{service.name}</h4>
                        <span className="text-xs font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2.5 py-1 rounded-md">
                          ~{service.turnaroundDays}d
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {service.tags.map((tag) => (<span key={tag} className="text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200 px-2.5 py-1 rounded-md">
                            {tag}
                          </span>))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-zinc-500 uppercase font-semibold block">Starting</span>
                        <span className="text-lg sm:text-xl font-bold text-zinc-900">
                          {formatINR(service.startingPrice)}
                        </span>
                      </div>
                      <Button variant="secondary" size="md" onClick={() => setEnquiryModalOpen(true)} className="text-sm font-semibold">
                        Enquire
                      </Button>
                    </div>
                  </div>))}
              </div>)}

            {/* PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (<div className="space-y-4">
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedPortfolioCategory('all')} className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${selectedPortfolioCategory === 'all'
                ? 'bg-zinc-900 text-white'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'}`}>
                    All ({house.portfolio.length})
                  </button>
                  {Array.from(new Set(house.portfolio.map((p) => p.category))).map((cat) => (<button key={cat} onClick={() => setSelectedPortfolioCategory(cat)} className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${selectedPortfolioCategory === cat
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'}`}>
                      {cat}
                    </button>))}
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPortfolio.map((item) => (<div key={item.id} onClick={() => setSelectedPortfolioItem(item)} className="bg-white rounded-2xl border border-zinc-200 shadow-soft overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between">
                      <div className="relative h-44 w-full bg-zinc-100 overflow-hidden">
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                          <span className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">
                            {item.clientName}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-sm text-zinc-500">
                          <span className="text-amber-800 font-semibold">{item.category}</span>
                          <span>{item.year}</span>
                        </div>
                        <h4 className="text-base font-bold text-zinc-900 line-clamp-1 group-hover:text-amber-900 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-zinc-600 line-clamp-2">
                          {item.description}
                        </p>
                        {item.metrics && (<p className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 mt-1 truncate">
                            {item.metrics}
                          </p>)}
                      </div>
                    </div>))}
                </div>
              </div>)}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (<div className="space-y-4">
                {/* Rating Overview Card */}
                <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-5xl font-extrabold text-zinc-900">
                      {house.rating.toFixed(1)}
                    </span>
                    <RatingStars rating={house.rating} showText={false} size="lg"/>
                    <p className="text-sm text-zinc-500">
                      {house.reviewCount} verified client reviews
                    </p>
                  </div>

                  <div className="w-full sm:w-56 space-y-2.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Production</span>
                      <span className="font-semibold text-zinc-900">4.9 / 5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Delivery SLA</span>
                      <span className="font-semibold text-zinc-900">4.8 / 5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Accuracy</span>
                      <span className="font-semibold text-zinc-900">4.9 / 5</span>
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-3">
                  {house.reviews.map((rev) => (<div key={rev.id} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-soft space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-950 font-bold text-sm flex items-center justify-center border border-yellow-300">
                            {rev.authorName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-zinc-900">{rev.authorName}</h4>
                            <p className="text-xs text-zinc-500">{rev.authorCompany}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <RatingStars rating={rev.rating} showText={false} size="sm"/>
                          <span className="text-xs text-zinc-400 block mt-0.5">{rev.date}</span>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-700 leading-relaxed italic">
                        "{rev.comment}"
                      </p>

                      <div className="pt-2 border-t border-zinc-100 flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
                        <span>Project:</span>
                        <span className="text-zinc-700 font-medium">{rev.projectName}</span>
                        <span>•</span>
                        <span className="text-amber-800 font-semibold">{rev.category}</span>
                      </div>
                    </div>))}
                </div>
              </div>)}
          </div>

          {/* RIGHT 4 COLS: STICKY ENQUIRY BOX */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-soft space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Direct Intake
                </span>
                <h3 className="text-lg font-bold text-zinc-900">
                  Request Commercial Quote
                </h3>
                <p className="text-sm text-zinc-600 mt-1">
                  Direct brief to executive producers at {house.name}.
                </p>
              </div>

              <div className="space-y-3 pt-3.5 border-t border-zinc-100 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Min Project:</span>
                  <span className="font-bold text-zinc-900">
                    {formatINR(house.minBudget)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Availability:</span>
                  <span className="font-semibold text-emerald-700">{house.availability}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Turnaround:</span>
                  <span className="text-zinc-700 font-medium">2 - 4 Weeks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Studio Status:</span>
                  <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
                    {house.verified ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-600"/>
                        <span className="text-emerald-700">Verified & Genuine</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4 text-rose-600"/>
                        <span className="text-rose-700">Unverified</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                disabled={!house.verified}
                onClick={() => setEnquiryModalOpen(true)}
                leftIcon={!house.verified ? <Lock className="w-4 h-4" /> : undefined}
                className={`w-full text-base font-semibold py-3 ${!house.verified ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {house.verified ? 'Send Enquiry' : 'Studio Unverified'}
              </Button>

              <p className="text-xs text-zinc-500 text-center">
                Milestone escrow • No fee until quote approved
              </p>
            </div>

            {/* Direct Studio Contact Card */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-soft space-y-3 text-sm text-zinc-500">
              <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider">
                Direct Coordinates
              </h4>
              <p className="flex items-center gap-2.5 text-zinc-700">
                <Mail className="w-4 h-4 text-amber-700 shrink-0"/>
                <span className="truncate">{house.contactEmail}</span>
              </p>
              {house.phone && (<p className="flex items-center gap-2.5 text-zinc-700">
                  <Phone className="w-4 h-4 text-amber-700 shrink-0"/>
                  <span>{house.phone}</span>
                </p>)}
              {house.website && (<p className="flex items-center gap-2.5 text-zinc-700">
                  <Globe className="w-4 h-4 text-amber-700 shrink-0"/>
                  <span className="truncate">{house.website}</span>
                </p>)}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Lightbox Modal */}
      {selectedPortfolioItem && (<div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedPortfolioItem(null)}>
          <div className="bg-white text-zinc-900 rounded-2xl max-w-2xl w-full overflow-hidden border border-zinc-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64 sm:h-80 w-full bg-zinc-100">
              <img src={selectedPortfolioItem.thumbnailUrl} alt={selectedPortfolioItem.title} className="w-full h-full object-cover"/>
              <button onClick={() => setSelectedPortfolioItem(null)} className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-amber-800 uppercase tracking-wider">
                  {selectedPortfolioItem.category} • {selectedPortfolioItem.clientName}
                </span>
                <span className="text-zinc-500">{selectedPortfolioItem.year}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900">
                {selectedPortfolioItem.title}
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                {selectedPortfolioItem.description}
              </p>
              {selectedPortfolioItem.metrics && (<div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-200">
                  Result: {selectedPortfolioItem.metrics}
                </div>)}
              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="md" onClick={() => {
                setSelectedPortfolioItem(null);
                setEnquiryModalOpen(true);
            }} className="text-sm font-semibold">
                  Request Similar Project
                </Button>
              </div>
            </div>
          </div>
        </div>)}

      {/* Reusable Send Enquiry Modal */}
      <SendEnquiryModal isOpen={enquiryModalOpen} onClose={() => setEnquiryModalOpen(false)} productionHouse={house}/>
    </div>);
}
export default function ProductionHouseProfilePage() {
    return (<React.Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]"/>}>
      <ProductionHouseProfileContent />
    </React.Suspense>);
}
