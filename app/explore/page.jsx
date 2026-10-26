'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { POPULAR_CATEGORIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductionHouseCardSkeleton } from '@/components/ui/Skeleton';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { formatINR } from '@/lib/format';
import { Search, MapPin, SlidersHorizontal, X, CheckCircle2, Heart, ArrowUpDown, Clock, Building2 } from 'lucide-react';
function ExploreContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || '';
    const initialQuery = searchParams.get('q') || '';
    const initialLocation = searchParams.get('location') || '';
    const { productionHouses, isHouseSaved, toggleSaveHouse } = useAuth();
    // Filters State
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [selectedBudget, setSelectedBudget] = useState('all');
    const [minRating, setMinRating] = useState(0);
    const [minExperience, setMinExperience] = useState(0);
    const [availability, setAvailability] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    // Enquiry modal state
    const [enquiryModalHouse, setEnquiryModalHouse] = useState(null);
    // Pagination state
    const [visibleCount, setVisibleCount] = useState(6);
    // Filtering Logic
    const filteredHouses = useMemo(() => {
        return productionHouses
            .filter((house) => {
            // Search text matching name, tagline, description, services, notable clients
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesName = house.name.toLowerCase().includes(q);
                const matchesTagline = house.tagline.toLowerCase().includes(q);
                const matchesServices = house.services.some((s) => s.name.toLowerCase().includes(q));
                const matchesClients = house.notableClients.some((c) => c.toLowerCase().includes(q));
                if (!matchesName && !matchesTagline && !matchesServices && !matchesClients) {
                    return false;
                }
            }
            // Category filter
            if (selectedCategory && selectedCategory !== 'all') {
                const hasCategory = house.services.some((s) => s.name.toLowerCase() === selectedCategory.toLowerCase());
                if (!hasCategory)
                    return false;
            }
            // Location filter
            if (selectedLocation && selectedLocation !== 'all') {
                if (!house.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
                    return false;
                }
            }
            // Budget tier filter
            if (selectedBudget !== 'all') {
                if (selectedBudget === 'under1l' && house.minBudget > 100000)
                    return false;
                if (selectedBudget === '1l-5l' && (house.minBudget < 100000 || house.minBudget > 500000))
                    return false;
                if (selectedBudget === '5l-20l' && (house.minBudget < 500000 || house.minBudget > 2000000))
                    return false;
                if (selectedBudget === '20l+' && house.minBudget < 2000000)
                    return false;
            }
            // Rating filter
            if (minRating > 0 && house.rating < minRating) {
                return false;
            }
            // Experience filter
            if (minExperience > 0 && house.yearsInBusiness < minExperience) {
                return false;
            }
            // Availability filter
            if (availability !== 'all' && house.availability !== availability) {
                return false;
            }
            return true;
        })
            .sort((a, b) => {
            if (sortBy === 'rating')
                return b.rating - a.rating;
            if (sortBy === 'experience')
                return b.yearsInBusiness - a.yearsInBusiness;
            if (sortBy === 'reviews')
                return b.reviewCount - a.reviewCount;
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });
    }, [
        productionHouses,
        searchQuery,
        selectedCategory,
        selectedLocation,
        selectedBudget,
        minRating,
        minExperience,
        availability,
        sortBy,
    ]);
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (selectedCategory && selectedCategory !== 'all')
            count++;
        if (selectedLocation && selectedLocation !== 'all')
            count++;
        if (selectedBudget !== 'all')
            count++;
        if (minRating > 0)
            count++;
        if (minExperience > 0)
            count++;
        if (availability !== 'all')
            count++;
        return count;
    }, [selectedCategory, selectedLocation, selectedBudget, minRating, minExperience, availability]);
    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedLocation('');
        setSelectedBudget('all');
        setMinRating(0);
        setMinExperience(0);
        setAvailability('all');
    };
    return (<div className="bg-[#FAFAFA] text-zinc-900 min-h-screen py-8 sm:py-12 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5">
            <Link href="/" className="hover:text-amber-800">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 font-semibold">Explore Studios</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Production House Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl">
            Compare camera packages, verified rate cards, and soundstage specifications.
          </p>
        </div>

        {/* Top Control Bar: Search + Sorting */}
        <div className="bg-white p-3 rounded-2xl border border-zinc-200 shadow-soft mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
            <input type="text" placeholder="Search by studio, camera, capability, or client..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-50 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:border-yellow-500 focus:bg-white outline-none transition-all"/>
            {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer">
                <X className="w-4 h-4"/>
              </button>)}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 justify-between md:justify-start">
            {/* Mobile Filter Toggle */}
            <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)} className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-50 text-zinc-700 text-xs font-semibold border border-zinc-200 hover:bg-zinc-100 cursor-pointer">
              <SlidersHorizontal className="w-4 h-4"/>
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400"/>
              <span className="hidden sm:inline text-zinc-500">Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-zinc-900 outline-none cursor-pointer text-xs font-semibold">
                <option value="relevance" className="bg-white text-zinc-900">Featured & Relevance</option>
                <option value="rating" className="bg-white text-zinc-900">Highest Rated</option>
                <option value="experience" className="bg-white text-zinc-900">Most Experienced</option>
                <option value="reviews" className="bg-white text-zinc-900">Most Reviewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFilterCount > 0 && (<div className="flex flex-wrap items-center gap-2 mb-6 animate-in fade-in">
            <span className="text-xs font-semibold text-zinc-500">Filters:</span>
            {selectedCategory && selectedCategory !== 'all' && (<Badge variant="pastelYellow" size="sm">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="ml-1 hover:text-rose-600 cursor-pointer">
                  <X className="w-3 h-3"/>
                </button>
              </Badge>)}
            {selectedLocation && selectedLocation !== 'all' && (<Badge variant="pastelYellow" size="sm">
                Location: {selectedLocation}
                <button onClick={() => setSelectedLocation('')} className="ml-1 hover:text-rose-600 cursor-pointer">
                  <X className="w-3 h-3"/>
                </button>
              </Badge>)}
            {selectedBudget !== 'all' && (<Badge variant="pastelYellow" size="sm">
                Budget: {selectedBudget}
                <button onClick={() => setSelectedBudget('all')} className="ml-1 hover:text-rose-600 cursor-pointer">
                  <X className="w-3 h-3"/>
                </button>
              </Badge>)}
            {minRating > 0 && (<Badge variant="pastelYellow" size="sm">
                {minRating}+ Stars
                <button onClick={() => setMinRating(0)} className="ml-1 hover:text-rose-600 cursor-pointer">
                  <X className="w-3 h-3"/>
                </button>
              </Badge>)}
            {availability !== 'all' && (<Badge variant="pastelYellow" size="sm">
                {availability}
                <button onClick={() => setAvailability('all')} className="ml-1 hover:text-rose-600 cursor-pointer">
                  <X className="w-3 h-3"/>
                </button>
              </Badge>)}
            <button onClick={clearAllFilters} className="text-xs text-amber-800 hover:underline font-semibold ml-2 cursor-pointer">
              Reset all
            </button>
          </div>)}

        {/* Main Layout: Filters Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FILTER SIDEBAR (Desktop & Mobile Drawer) */}
          <aside className={`lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 shadow-soft space-y-6 lg:block ${mobileFilterOpen ? 'block fixed inset-4 z-50 overflow-y-auto max-h-[90vh] bg-white shadow-xl' : 'hidden'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-700"/>
                <h3 className="text-sm font-bold text-zinc-900">Filter Studios</h3>
              </div>
              {activeFilterCount > 0 && (<button onClick={clearAllFilters} className="text-xs text-amber-800 hover:underline cursor-pointer">
                  Reset
                </button>)}
              {mobileFilterOpen && (<button onClick={() => setMobileFilterOpen(false)} className="lg:hidden p-1 text-zinc-400 hover:text-zinc-700">
                  <X className="w-5 h-5"/>
                </button>)}
            </div>

            {/* 1. Service Category */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2.5">
                Capability
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <label className="flex items-center gap-2 text-xs text-zinc-700 hover:text-zinc-900 cursor-pointer">
                  <input type="radio" name="category" checked={!selectedCategory || selectedCategory === 'all'} onChange={() => setSelectedCategory('all')} className="accent-amber-500"/>
                  <span>All Capabilities</span>
                </label>
                {POPULAR_CATEGORIES.map((cat) => (<label key={cat.name} className="flex items-center justify-between text-xs text-zinc-700 hover:text-zinc-900 cursor-pointer py-0.5">
                    <div className="flex items-center gap-2">
                      <input type="radio" name="category" checked={selectedCategory.toLowerCase() === cat.name.toLowerCase()} onChange={() => setSelectedCategory(cat.name)} className="accent-amber-500"/>
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">{cat.count}</span>
                  </label>))}
              </div>
            </div>

            {/* 2. Location */}
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2">
                Location
              </label>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full bg-zinc-50 text-xs font-medium text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none cursor-pointer">
                <option value="all">All Indian Hubs</option>
                <option value="Mumbai">Mumbai (Andheri / Bandra / Goregaon)</option>
                <option value="Bengaluru">Bengaluru (Indiranagar / Koramangala)</option>
                <option value="Delhi NCR">Delhi NCR (CP / Gurugram / Okhla)</option>
                <option value="Hyderabad">Hyderabad (Jubilee Hills / Hitec City)</option>
              </select>
            </div>

            {/* 3. Budget Tier */}
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2">
                Minimum Budget (₹ INR)
              </label>
              <div className="space-y-1.5 text-xs text-zinc-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="budget" checked={selectedBudget === 'all'} onChange={() => setSelectedBudget('all')} className="accent-amber-500"/>
                  <span>All Budgets</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="budget" checked={selectedBudget === 'under1l'} onChange={() => setSelectedBudget('under1l')} className="accent-amber-500"/>
                  <span>Under ₹1 Lakh</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="budget" checked={selectedBudget === '1l-5l'} onChange={() => setSelectedBudget('1l-5l')} className="accent-amber-500"/>
                  <span>₹1 Lakh – ₹5 Lakh</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="budget" checked={selectedBudget === '5l-20l'} onChange={() => setSelectedBudget('5l-20l')} className="accent-amber-500"/>
                  <span>₹5 Lakh – ₹20 Lakh</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="budget" checked={selectedBudget === '20l+'} onChange={() => setSelectedBudget('20l+')} className="accent-amber-500"/>
                  <span>₹20 Lakh+</span>
                </label>
              </div>
            </div>

            {/* 4. Rating */}
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2">
                Minimum Rating
              </label>
              <div className="space-y-1.5 text-xs text-zinc-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rating" checked={minRating === 0} onChange={() => setMinRating(0)} className="accent-amber-500"/>
                  <span>Any Rating</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rating" checked={minRating === 4.5} onChange={() => setMinRating(4.5)} className="accent-amber-500"/>
                  <span>4.5 & above (Top Tier)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="rating" checked={minRating === 4.0} onChange={() => setMinRating(4.0)} className="accent-amber-500"/>
                  <span>4.0 & above</span>
                </label>
              </div>
            </div>

            {/* 5. Experience */}
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2">
                Industry Experience
              </label>
              <div className="space-y-1.5 text-xs text-zinc-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="experience" checked={minExperience === 0} onChange={() => setMinExperience(0)} className="accent-amber-500"/>
                  <span>Any Experience</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="experience" checked={minExperience === 5} onChange={() => setMinExperience(5)} className="accent-amber-500"/>
                  <span>5+ Years Established</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="experience" checked={minExperience === 10} onChange={() => setMinExperience(10)} className="accent-amber-500"/>
                  <span>10+ Years Veteran</span>
                </label>
              </div>
            </div>

            {/* 6. Availability */}
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2">
                Studio Availability
              </label>
              <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="w-full bg-zinc-50 text-xs font-medium text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none cursor-pointer">
                <option value="all">Any Availability</option>
                <option value="Available Now">Available Now</option>
                <option value="Next 2 Weeks">Next 2 Weeks</option>
                <option value="Waitlist">Waitlist</option>
              </select>
            </div>

            {mobileFilterOpen && (<Button variant="primary" className="w-full mt-4" onClick={() => setMobileFilterOpen(false)}>
                Apply Filters ({filteredHouses.length} Studios)
              </Button>)}
          </aside>

          {/* MAIN RESULTS GRID */}
          <div className="lg:col-span-9 space-y-6">
            {/* Results count label */}
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <p>
                Showing{' '}
                <strong className="text-zinc-900 font-bold">
                  {Math.min(visibleCount, filteredHouses.length)}
                </strong>{' '}
                of <strong className="text-zinc-900 font-bold">{filteredHouses.length}</strong>{' '}
                studios
              </p>
              {filteredHouses.length > 0 && (<span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  100% Identity Vetted
                </span>)}
            </div>

            {/* Empty State */}
            {filteredHouses.length === 0 ? (<EmptyState icon={Building2} title="No Production Houses Found" description="No studios match your exact filters. Try broadening the location or budget range." actionText="Reset All Filters" onAction={clearAllFilters}/>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHouses.slice(0, visibleCount).map((house) => {
                const isSaved = isHouseSaved(house.id);
                const portfolioSnippet = house.portfolio.slice(0, 2);
                return (<div key={house.id} className="bg-white rounded-2xl border border-zinc-200 shadow-soft hover:border-zinc-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                      {/* Top Header with cover banner & logo */}
                      <div>
                        <div className="relative h-40 w-full bg-zinc-100 overflow-hidden">
                          <img src={house.coverImageUrl} alt={house.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>

                          {/* Bookmark Action */}
                          <button onClick={() => toggleSaveHouse(house.id)} className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${isSaved
                        ? 'bg-rose-600 text-white'
                        : 'bg-black/40 hover:bg-black/60 text-white border border-white/20'}`} aria-label="Save studio">
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`}/>
                          </button>

                          {/* Availability Badge */}
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-600 text-white shadow-xs">
                            {house.availability}
                          </span>

                          {/* Studio Info Overlaid */}
                          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                            <img src={house.logoUrl} alt={house.name} className="w-12 h-12 rounded-xl object-cover border border-white/40 shadow-md bg-white shrink-0"/>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-base font-bold text-white truncate">
                                  {house.name}
                                </h3>
                                {house.verified && (<CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0"/>)}
                              </div>
                              <p className="text-xs text-zinc-200 truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-yellow-300"/>
                                {house.location}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Middle Details */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <RatingStars rating={house.rating} reviewCount={house.reviewCount} size="sm"/>
                            <span className="text-xs font-semibold text-yellow-950 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-md">
                              From {formatINR(house.minBudget)}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-600 line-clamp-1 leading-relaxed">
                            {house.tagline}
                          </p>

                          {/* Services tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {house.services.map((s) => (<span key={s.id} className="text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded-md">
                                {s.name}
                              </span>))}
                          </div>

                          {/* Portfolio Previews */}
                          {portfolioSnippet.length > 0 && (<div className="pt-1">
                              <div className="grid grid-cols-2 gap-2">
                                {portfolioSnippet.map((p) => (<div key={p.id} className="relative h-16 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 group/img">
                                    <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"/>
                                    <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                                      <span className="text-[10px] font-semibold text-white truncate">
                                        {p.title}
                                      </span>
                                    </div>
                                  </div>))}
                              </div>
                            </div>)}

                          {/* SLA & Notable Clients */}
                          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-700"/>
                              {house.responseRateHours}h response
                            </span>
                            <span className="truncate max-w-[150px]">
                              {house.notableClients.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-5 pb-5 pt-0 flex items-center gap-2">
                        <Link href={`/production-houses/${house.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            View Specs
                          </Button>
                        </Link>
                        <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={() => setEnquiryModalHouse(house)}>
                          Send Enquiry
                        </Button>
                      </div>
                    </div>);
            })}
              </div>)}

            {/* Load More Interaction */}
            {filteredHouses.length > visibleCount && (<div className="text-center pt-6">
                <Button variant="outline" onClick={() => setVisibleCount((prev) => prev + 6)} className="px-8 shadow-xs">
                  Load More Studios
                </Button>
              </div>)}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <SendEnquiryModal isOpen={Boolean(enquiryModalHouse)} onClose={() => setEnquiryModalHouse(null)} productionHouse={enquiryModalHouse}/>
    </div>);
}
export default function ExplorePage() {
    return (<Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12">
          <ProductionHouseCardSkeleton />
        </div>}>
      <ExploreContent />
    </Suspense>);
}
