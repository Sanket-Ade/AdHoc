'use client';
import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { POPULAR_CATEGORIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductionHouseCardSkeleton } from '@/components/ui/Skeleton';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { formatINR } from '@/lib/format';
import { Search, MapPin, SlidersHorizontal, X, CheckCircle2, Heart, ArrowUpDown, Building2, ShieldCheck, Sparkles } from 'lucide-react';
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
    const [minExperience, setMinExperience] = useState(0);
    const [availability, setAvailability] = useState('all');
    const [verificationFilter, setVerificationFilter] = useState('all'); // 'all', 'verified', 'independent'
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
            // Verification / Studio Type filter
            if (verificationFilter === 'verified' && !house.verified) {
                return false;
            }
            if (verificationFilter === 'independent' && house.verified) {
                return false;
            }
            // Search text matching name, tagline, description, services, notable clients
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesName = house.name?.toLowerCase().includes(q);
                const matchesTagline = house.tagline?.toLowerCase().includes(q);
                const matchesServices = house.services?.some((s) => s.name.toLowerCase().includes(q));
                const matchesClients = house.notableClients?.some((c) => c.toLowerCase().includes(q));
                if (!matchesName && !matchesTagline && !matchesServices && !matchesClients) {
                    return false;
                }
            }
            // Category filter
            if (selectedCategory && selectedCategory !== 'all') {
                const normSelected = selectedCategory.toLowerCase();
                const hasCategory = house.services?.some((s) => {
                    const normService = s.name.toLowerCase();
                    return normService === normSelected ||
                        (normSelected.startsWith('digital') && normService.startsWith('digital')) ||
                        (normSelected.startsWith('video') && normService.startsWith('video'));
                });
                if (!hasCategory)
                    return false;
            }
            // Location filter
            if (selectedLocation && selectedLocation !== 'all') {
                if (!house.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
                    return false;
                }
            }
            // Budget tier filter (Starting from ₹50,000)
            if (selectedBudget !== 'all') {
                if (selectedBudget === '50k-1l' && (house.minBudget < 50000 || house.minBudget > 100000))
                    return false;
                if (selectedBudget === '1l-5l' && (house.minBudget < 100000 || house.minBudget > 500000))
                    return false;
                if (selectedBudget === '5l-20l' && (house.minBudget < 500000 || house.minBudget > 2000000))
                    return false;
                if (selectedBudget === '20l+' && house.minBudget < 2000000)
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
        minExperience,
        availability,
        verificationFilter,
        sortBy,
    ]);
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (verificationFilter !== 'all')
            count++;
        if (selectedCategory && selectedCategory !== 'all')
            count++;
        if (selectedLocation && selectedLocation !== 'all')
            count++;
        if (selectedBudget !== 'all')
            count++;
        if (minExperience > 0)
            count++;
        if (availability !== 'all')
            count++;
        return count;
    }, [verificationFilter, selectedCategory, selectedLocation, selectedBudget, minExperience, availability]);
    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedLocation('');
        setSelectedBudget('all');
        setMinExperience(0);
        setAvailability('all');
        setVerificationFilter('all');
    };
    return (
    <div className="relative min-h-screen py-8 sm:py-12 bg-[#FAFAFA] text-zinc-900 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs, Eyebrow & Title */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Directory</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-200">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-700"/>
            <span>Verified & Independent Studios • Budgets from ₹50,000</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Production Studios
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl font-normal leading-relaxed">
            Direct access to commercial studios and boutique creators across India. Compare transparent rate cards, technical specs, and verified portfolios.
          </p>
        </div>

        {/* Top Control Bar: Search + Sorting */}
        <div className="bg-white p-3 rounded-2xl border border-zinc-200/90 shadow-soft mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
            <input
              type="text"
              placeholder="Search by studio, camera, capability, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 hover:bg-white focus:bg-white text-sm text-zinc-900 placeholder-zinc-400 pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer p-1"
              >
                <X className="w-4 h-4"/>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 justify-between md:justify-start">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-sm font-semibold border border-zinc-200 cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-zinc-700"/>
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 bg-zinc-50 px-3.5 py-2.5 rounded-xl border border-zinc-200 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500"/>
              <span className="hidden sm:inline text-zinc-500 text-xs uppercase tracking-wider font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-zinc-900 outline-none cursor-pointer text-sm font-semibold"
              >
                <option value="relevance" className="bg-white text-zinc-900">Featured & Relevance</option>
                <option value="experience" className="bg-white text-zinc-900">Most Experienced</option>
                <option value="reviews" className="bg-white text-zinc-900">Most Reviewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-2 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">
              Active Filters:
            </span>
            {verificationFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-900 border border-zinc-200">
                {verificationFilter === 'verified' ? 'GST Verified' : 'Local & Indie'}
                <button onClick={() => setVerificationFilter('all')} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3.5 h-3.5"/>
                </button>
              </span>
            )}
            {selectedCategory && selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-900 border border-zinc-200">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3.5 h-3.5"/>
                </button>
              </span>
            )}
            {selectedLocation && selectedLocation !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-900 border border-zinc-200">
                {selectedLocation}
                <button onClick={() => setSelectedLocation('')} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3.5 h-3.5"/>
                </button>
              </span>
            )}
            {selectedBudget !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-900 border border-zinc-200">
                Budget: {selectedBudget === '50k-1l' ? '₹50k – ₹1L' : selectedBudget}
                <button onClick={() => setSelectedBudget('all')} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3.5 h-3.5"/>
                </button>
              </span>
            )}
            {availability !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-900 border border-zinc-200">
                {availability}
                <button onClick={() => setAvailability('all')} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3.5 h-3.5"/>
                </button>
              </span>
            )}
            <button onClick={clearAllFilters} className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 underline ml-2 cursor-pointer">
              Reset all
            </button>
          </div>
        )}

        {/* Main Layout: Filters Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FILTER SIDEBAR (Desktop & Mobile Drawer) */}
          <aside
            className={`lg:col-span-3 bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-soft space-y-6 lg:block ${
              mobileFilterOpen ? 'block fixed inset-4 z-50 overflow-y-auto max-h-[90vh] bg-white shadow-2xl' : 'hidden'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600"/>
                <h3 className="text-base font-bold text-zinc-900">Filter Studios</h3>
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer">
                  Reset
                </button>
              )}
              {mobileFilterOpen && (
                <button onClick={() => setMobileFilterOpen(false)} className="lg:hidden p-1 text-zinc-400 hover:text-zinc-700">
                  <X className="w-5 h-5"/>
                </button>
              )}
            </div>

            {/* 1. Studio Type & Verification */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2.5">
                Studio Verification Type
              </label>
              <div className="space-y-1 text-sm text-zinc-700">
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-yellow-50/70 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="verification"
                    checked={verificationFilter === 'all'}
                    onChange={() => setVerificationFilter('all')}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <span className="font-medium">All Studios</span>
                </label>
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-yellow-50/70 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="verification"
                    checked={verificationFilter === 'verified'}
                    onChange={() => setVerificationFilter('verified')}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">GST Verified</span>
                  </div>
                </label>
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-yellow-50/70 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="verification"
                    checked={verificationFilter === 'independent'}
                    onChange={() => setVerificationFilter('independent')}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-medium">Local & Indie Studios</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Service Category */}
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2.5">
                Capability
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <label className="flex items-center gap-2.5 text-sm text-zinc-700 hover:text-zinc-950 hover:bg-yellow-50/70 p-1.5 rounded-lg -mx-1 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="category"
                    checked={!selectedCategory || selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <span className="font-medium">All Capabilities</span>
                </label>
                {POPULAR_CATEGORIES.map((cat) => (
                  <label
                    key={cat.name}
                    className="flex items-center justify-between text-sm text-zinc-700 hover:text-zinc-950 hover:bg-yellow-50/70 p-1.5 rounded-lg -mx-1 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory.toLowerCase() === cat.name.toLowerCase()}
                        onChange={() => setSelectedCategory(cat.name)}
                        className="accent-amber-500 w-4 h-4 shrink-0"
                      />
                      <span className="truncate font-medium">{cat.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md font-mono shrink-0 ml-1">
                      {cat.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Location */}
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-white text-sm font-medium text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 cursor-pointer shadow-xs"
              >
                <option value="all">All Indian Hubs</option>
                <option value="Mumbai">Mumbai (Andheri / Bandra / Goregaon)</option>
                <option value="Pune">Pune (FC Road / Baner / Koregaon)</option>
                <option value="Jaipur">Jaipur (C-Scheme / Mansarovar)</option>
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
              <div className="space-y-1 text-sm text-zinc-700">
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <input type="radio" name="budget" checked={selectedBudget === 'all'} onChange={() => setSelectedBudget('all')} className="accent-zinc-900 w-4 h-4"/>
                  <span className="font-medium">All Budgets (From ₹50,000)</span>
                </label>
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <input type="radio" name="budget" checked={selectedBudget === '50k-1l'} onChange={() => setSelectedBudget('50k-1l')} className="accent-zinc-900 w-4 h-4"/>
                  <span className="font-medium">₹50,000 – ₹1 Lakh</span>
                </label>
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <input type="radio" name="budget" checked={selectedBudget === '1l-5l'} onChange={() => setSelectedBudget('1l-5l')} className="accent-zinc-900 w-4 h-4"/>
                  <span className="font-medium">₹1 Lakh – ₹5 Lakh</span>
                </label>
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <input type="radio" name="budget" checked={selectedBudget === '5l-20l'} onChange={() => setSelectedBudget('5l-20l')} className="accent-zinc-900 w-4 h-4"/>
                  <span className="font-medium">₹5 Lakh – ₹20 Lakh</span>
                </label>
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <input type="radio" name="budget" checked={selectedBudget === '20l+'} onChange={() => setSelectedBudget('20l+')} className="accent-zinc-900 w-4 h-4"/>
                  <span className="font-medium">₹20 Lakh+</span>
                </label>
              </div>
            </div>

            {/* 4. Experience */}
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2">
                Industry Experience
              </label>
              <div className="space-y-1 text-sm text-zinc-700">
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <input type="radio" name="experience" checked={minExperience === 0} onChange={() => setMinExperience(0)} className="accent-zinc-900 w-4 h-4"/>
                  <span className="font-medium">Any Experience</span>
                </label>
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <input type="radio" name="experience" checked={minExperience === 5} onChange={() => setMinExperience(5)} className="accent-zinc-900 w-4 h-4"/>
                  <span className="font-medium">5+ Years Established</span>
                </label>
                <label className="flex items-center gap-2.5 p-1.5 rounded-lg -mx-1 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <input type="radio" name="experience" checked={minExperience === 10} onChange={() => setMinExperience(10)} className="accent-zinc-900 w-4 h-4"/>
                  <span className="font-medium">10+ Years Veteran</span>
                </label>
              </div>
            </div>

            {/* 6. Availability */}
            <div className="pt-4 border-t border-zinc-100">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-900 block mb-2">
                Studio Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full bg-zinc-50 text-sm font-medium text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none focus:border-zinc-900 cursor-pointer shadow-xs"
              >
                <option value="all">Any Availability</option>
                <option value="Available Now">Available Now</option>
                <option value="Next 2 Weeks">Next 2 Weeks</option>
                <option value="Waitlist">Waitlist</option>
              </select>
            </div>

            {mobileFilterOpen && (
              <Button variant="primary" size="md" className="w-full mt-4 text-sm font-bold" onClick={() => setMobileFilterOpen(false)}>
                Apply Filters ({filteredHouses.length} Studios)
              </Button>
            )}
          </aside>

          {/* MAIN RESULTS GRID */}
          <div className="lg:col-span-9 space-y-6">
            {/* Results count label */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500">
              <p>
                Showing{' '}
                <strong className="text-zinc-900 font-bold">
                  {Math.min(visibleCount, filteredHouses.length)}
                </strong>{' '}
                of <strong className="text-zinc-900 font-bold">{filteredHouses.length}</strong>{' '}
                studios
              </p>
              {filteredHouses.length > 0 && (
                <span className="text-xs bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full border border-zinc-200 font-medium">
                  Direct Studio Rate Cards
                </span>
              )}
            </div>

            {/* Empty State */}
            {filteredHouses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200/90 p-8 shadow-soft">
                <EmptyState icon={Building2} title="No Production Houses Found" description="No studios match your exact filters. Try broadening the location or budget range." actionText="Reset All Filters" onAction={clearAllFilters}/>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHouses.slice(0, visibleCount).map((house) => {
                  const isSaved = isHouseSaved(house.id);
                  return (
                    <div
                      key={house.id}
                      className="bg-white rounded-2xl border border-zinc-200/90 shadow-soft hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        {/* Top Header with logo & name */}
                        <div className="p-5 pb-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={house.logoUrl}
                                alt={house.name}
                                className="w-12 h-12 rounded-xl object-cover border border-zinc-200 bg-zinc-50 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 truncate">
                                    {house.name}
                                  </h3>
                                  {house.verified ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" title="GST Verified Studio"/>
                                  ) : (
                                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" title="Independent / Local Studio"/>
                                  )}
                                </div>
                                <p className="text-xs text-zinc-500 truncate flex items-center gap-1 mt-0.5 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0"/>
                                  {house.location}
                                </p>
                              </div>
                            </div>

                            {/* Bookmark Action */}
                            <button
                              onClick={() => toggleSaveHouse(house.id)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isSaved
                                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 border-zinc-200'
                              }`}
                              aria-label="Save studio"
                            >
                              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}/>
                            </button>
                          </div>
                        </div>

                        {/* Middle Details */}
                        <div className="p-5 space-y-3.5">
                          {/* Studio Type / Badges */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {house.verified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0"/>
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                                <Sparkles className="w-3 h-3 text-amber-600 shrink-0"/>
                                Local Indie
                              </span>
                            )}
                            {house.badges && house.badges.slice(0, 2).map((b) => (
                              <span key={b} className="text-[11px] font-normal text-zinc-600 bg-zinc-100 border border-zinc-200/70 px-2 py-0.5 rounded-md">
                                {b}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-medium text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md">
                              {house.availability}
                            </span>
                            <span className="font-bold text-zinc-900 bg-yellow-100/70 border border-yellow-300/80 px-2.5 py-1 rounded-md">
                              From {formatINR(house.minBudget)}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                            {house.tagline}
                          </p>

                          {/* Services tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {house.services.map((s) => (
                              <span
                                key={s.id}
                                className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-200/80 px-2.5 py-1 rounded-md font-medium"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-5 pb-5 pt-0 flex items-center gap-2.5">
                        <Link href={`/production-houses/${house.id}`} className="flex-1">
                          <Button variant="outline" size="md" className="w-full text-xs font-semibold py-2">
                            View Specs
                          </Button>
                        </Link>
                        <Button
                          variant={house.verified ? "primary" : "outline"}
                          size="md"
                          disabled={!house.verified}
                          className={`flex-1 text-xs font-bold py-2 ${!house.verified ? 'opacity-50 cursor-not-allowed text-zinc-400' : ''}`}
                          onClick={() => house.verified && setEnquiryModalHouse(house)}
                        >
                          {house.verified ? 'Request Quote' : 'Verification Required'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More Interaction */}
            {filteredHouses.length > visibleCount && (
              <div className="text-center pt-6">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-200 px-6 py-2.5 shadow-xs text-xs sm:text-sm font-semibold"
                >
                  Load More Studios
                </Button>
              </div>
            )}
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
