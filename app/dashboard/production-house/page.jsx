'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { EnquiryStatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatINR } from '@/lib/format';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Plus,
  Trash2,
  TrendingUp,
  Check,
  Send,
  ExternalLink,
  Calendar,
  MapPin,
  Inbox,
  Clock,
  Video,
  Sparkles,
  Globe,
  Phone,
  MessageSquare
} from 'lucide-react';
import { EnquiryChatModal } from '@/components/EnquiryChatModal';

export default function ProductionHouseDashboardPage() {
  const {
    user,
    enquiries,
    productionHouses,
    updateEnquiryStatus,
    updateProductionHouse,
    addPortfolioItem,
    deletePortfolioItem,
    addService,
    deleteService,
  } = useAuth();

  const studioId = (user?.role === 'production_house' && (user?.productionHouseId || user?.id)) || 'ph-1';
  const studio = productionHouses.find((h) => h.id === studioId) || productionHouses[0];

  const [activeTab, setActiveTab] = useState('enquiries');

  // Quote modal state
  const [quotingEnquiry, setQuotingEnquiry] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  // Add Portfolio Item modal state
  const [addPortfolioModalOpen, setAddPortfolioModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCategory, setNewCategory] = useState('Video Production');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [newMetrics, setNewMetrics] = useState('');

  // Add Service modal state
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDays, setServiceDays] = useState('10');
  const [serviceTags, setServiceTags] = useState('');

  // Profile Settings Form State
  const [studioName, setStudioName] = useState(studio?.name || '');
  const [studioTagline, setStudioTagline] = useState(studio?.tagline || '');
  const [studioDescription, setStudioDescription] = useState(studio?.description || '');
  const [studioLocation, setStudioLocation] = useState(studio?.location || '');
  const [studioCity, setStudioCity] = useState(studio?.city || '');
  const [studioAvailability, setStudioAvailability] = useState(studio?.availability || 'Available Now');
  const [studioMinBudget, setStudioMinBudget] = useState(studio?.minBudget ? studio.minBudget.toString() : '50000');
  const [studioPhone, setStudioPhone] = useState(studio?.phone || '');
  const [studioWebsite, setStudioWebsite] = useState(studio?.website || '');
  const [studioTeamSize, setStudioTeamSize] = useState(studio?.teamSize || '5-15 Crew');
  const [studioEquipment, setStudioEquipment] = useState(
    studio?.equipmentFacilities
      ? (Array.isArray(studio.equipmentFacilities) ? studio.equipmentFacilities.join('\n') : studio.equipmentFacilities)
      : (studio?.equipment || '')
  );

  // Keep state in sync when studio updates
  useEffect(() => {
    if (studio) {
      setStudioName(studio.name || '');
      setStudioTagline(studio.tagline || '');
      setStudioDescription(studio.description || '');
      setStudioLocation(studio.location || '');
      setStudioCity(studio.city || '');
      setStudioAvailability(studio.availability || 'Available Now');
      setStudioMinBudget(studio.minBudget ? studio.minBudget.toString() : '50000');
      setStudioPhone(studio.phone || '');
      setStudioWebsite(studio.website || '');
      setStudioTeamSize(studio.teamSize || '5-15 Crew');
      setStudioEquipment(
        studio.equipmentFacilities
          ? (Array.isArray(studio.equipmentFacilities) ? studio.equipmentFacilities.join('\n') : studio.equipmentFacilities)
          : (studio.equipment || '')
      );
    }
  }, [studio?.id]);

  const studioEnquiries = enquiries.filter(
    (e) => e.productionHouseId === studio.id || (studio.id === 'ph-1' && e.productionHouseId === 'ph-1')
  );
  const pendingEnquiries = studioEnquiries.filter((e) => e.status === 'pending');
  const activeProjects = studioEnquiries.filter((e) => e.status === 'in_progress' || e.status === 'under_review');
  const totalRevenue = studioEnquiries
    .filter((e) => e.quotedAmount)
    .reduce((sum, e) => sum + (e.quotedAmount || 0), 0);

  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!quotingEnquiry) return;
    updateEnquiryStatus(
      quotingEnquiry.id,
      'quoted',
      Number(quoteAmount) || 1500000,
      quoteNotes || 'Standard proposal with full deliverables.'
    );
    setQuotingEnquiry(null);
    setQuoteAmount('');
    setQuoteNotes('');
  };

  const handleCreatePortfolioItem = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addPortfolioItem(studio.id, {
      title: newTitle,
      clientName: newClient || 'Client Project',
      category: newCategory,
      thumbnailUrl: newImageUrl,
      description: newDescription || 'Commercial campaign deliverables delivered with excellence.',
      metrics: newMetrics || 'High Engagement',
      year: 2026,
    });
    setAddPortfolioModalOpen(false);
    setNewTitle('');
    setNewClient('');
    setNewDescription('');
    setNewMetrics('');
  };

  const handleCreateService = (e) => {
    e.preventDefault();
    if (!serviceName.trim()) return;
    addService(studio.id, {
      name: serviceName,
      description: serviceDesc || 'Comprehensive commercial production service.',
      startingPrice: Number(servicePrice) || 60000,
      turnaroundDays: Number(serviceDays) || 10,
      tags: serviceTags ? serviceTags.split(',').map((t) => t.trim()).filter(Boolean) : ['Commercial', 'Video'],
    });
    setAddServiceModalOpen(false);
    setServiceName('');
    setServiceDesc('');
    setServicePrice('');
    setServiceDays('10');
    setServiceTags('');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const equipmentList = studioEquipment
      ? studioEquipment.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    updateProductionHouse(studio.id, {
      name: studioName,
      tagline: studioTagline,
      description: studioDescription,
      equipmentFacilities: equipmentList,
      equipment: studioEquipment,
      location: studioLocation,
      city: studioCity || studioLocation.split(',')[0].trim(),
      availability: studioAvailability,
      minBudget: Number(studioMinBudget) || 50000,
      phone: studioPhone,
      website: studioWebsite,
      teamSize: studioTeamSize,
    });
  };

  return (
    <div className="bg-[#FAFAFA] text-zinc-900 min-h-screen py-8 sm:py-12 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Welcome Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={studio.logoUrl}
              alt={studio.name}
              className="w-16 h-16 rounded-2xl object-cover border border-zinc-200 bg-zinc-50 shrink-0 shadow-xs"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900">
                  {studio.name}
                </h1>

                {/* Dynamic Verification / Status Badge */}
                
              </div>
              <p className="text-sm sm:text-base text-zinc-500 font-medium">
                {studio.location} • {studio.tagline || 'Commercial Video & Film'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/production-houses/${studio.id}`} target="_blank">
              <Button
                variant="outline"
                size="md"
                rightIcon={<ExternalLink className="w-4 h-4" />}
                className="text-sm font-semibold"
              >
                View Public Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Studio Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Total Enquiries</p>
              <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">{studioEnquiries.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Pending Action</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{pendingEnquiries.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-200/80 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">In Production</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{activeProjects.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Pipeline Value</p>
              <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
                {formatINR(totalRevenue)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto">
          {[
            { id: 'enquiries', label: 'Enquiries', count: studioEnquiries.length },
            { id: 'portfolio', label: 'Portfolio Showcases', count: studio.portfolio?.length || 0 },
            { id: 'services', label: 'Services & Pricing', count: studio.services?.length || 0 },
            { id: 'settings', label: 'Profile Parameters' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-zinc-800 text-yellow-300' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 1. ENQUIRIES PIPELINE MANAGEMENT */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {studioEnquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-zinc-200 shadow-soft space-y-3">
                <Inbox className="w-10 h-10 text-zinc-400 mx-auto" />
                <h4 className="text-base font-bold text-zinc-800">No Enquiries Yet</h4>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
                  Clients discover production houses through the directory and AI brief matcher. Once they review your portfolio, project briefs will arrive here.
                </p>
              </div>
            ) : (
              studioEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/90 shadow-soft space-y-4 hover:border-zinc-300 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h4 className="text-lg sm:text-xl font-bold text-zinc-900">{enq.projectTitle}</h4>
                        <EnquiryStatusBadge status={enq.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-600">
                        
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/60">
                          {enq.category}
                        </span>
                        {enq.location && (
                          <>
                            <span className="text-zinc-300">•</span>
                            <span className="inline-flex items-center gap-1 text-zinc-500 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                              {enq.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-zinc-400 font-medium block">Budget</span>
                      <span className="text-base sm:text-lg font-bold text-zinc-900">
                        {enq.budgetRange}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-700 bg-zinc-50/80 p-4 rounded-xl border border-zinc-200/70 leading-relaxed font-normal">
                    {enq.description}
                  </p>

                  {enq.quotedAmount && (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-sm sm:text-base text-emerald-950 flex flex-wrap items-center justify-between gap-2 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800">Formal Quote:</span>
                        <span className="text-base font-extrabold text-emerald-900">{formatINR(enq.quotedAmount)}</span>
                        {enq.quoteNotes && <span className="text-xs sm:text-sm text-emerald-700">({enq.quoteNotes})</span>}
                      </div>
                      <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Active
                      </span>
                    </div>
                  )}

                  {/* Action Pipeline Buttons */}
                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        Received {enq.createdAt ? enq.createdAt.split('T')[0] : 'Recently'}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span>Deadline: <strong className="text-zinc-700 font-medium">{enq.deadline || 'Flexible'}</strong></span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {enq.status === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => {
                              setQuotingEnquiry(enq);
                              setQuoteAmount('1850000');
                            }}
                            leftIcon={<IndianRupee className="w-4 h-4" />}
                            className="text-sm font-bold py-2 shadow-xs"
                          >
                            Send Quote
                          </Button>
                          <Button
                            variant="ghost"
                            size="md"
                            className="text-zinc-500 hover:text-rose-600 text-sm font-semibold py-2"
                            onClick={() => updateEnquiryStatus(enq.id, 'declined')}
                          >
                            Decline
                          </Button>
                        </>
                      )}

                      {enq.status === 'quoted' && (
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={() => updateEnquiryStatus(enq.id, 'in_progress')}
                          leftIcon={<CheckCircle2 className="w-4 h-4" />}
                          className="text-sm font-bold py-2 shadow-xs"
                        >
                          Start Production
                        </Button>
                      )}

                      {enq.status === 'in_progress' && (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => updateEnquiryStatus(enq.id, 'completed')}
                          leftIcon={<Check className="w-4 h-4" />}
                          className="text-sm font-bold py-2 shadow-xs"
                        >
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. PORTFOLIO MANAGEMENT TAB */}
        {activeTab === 'portfolio' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">Portfolio Showcases</h3>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Great work speaks for itself! High-quality reels and projects allow local and independent studios to win high-budget brand briefs.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setAddPortfolioModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="text-sm font-bold shadow-xs shrink-0"
              >
                Add Project
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(studio.portfolio || []).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-zinc-200/90 shadow-soft overflow-hidden flex flex-col justify-between hover:border-zinc-300 hover:shadow-md transition-all"
                >
                  <div className="relative h-48 w-full bg-zinc-100">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => deletePortfolioItem(studio.id, item.id)}
                        className="p-2 rounded-xl bg-white/90 hover:bg-rose-50 text-zinc-600 hover:text-rose-600 border border-zinc-200 shadow-xs transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500 font-semibold">
                      <span className="text-amber-800 font-bold">{item.category}</span>
                      <span>{item.clientName}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-zinc-900 line-clamp-1">{item.title}</h4>
                    <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">{item.description}</p>
                    {item.metrics && (
                      <span className="inline-block text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                        {item.metrics}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SERVICES & PRICING TAB */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">Commercial Services & Rate Cards</h3>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Define your studio deliverables and starting pricing so clients can immediately match your offerings.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setAddServiceModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="text-sm font-bold shadow-xs shrink-0"
              >
                Add Service
              </Button>
            </div>

            <div className="space-y-3.5">
              {(studio.services || []).map((service) => (
                <div
                  key={service.id}
                  className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                      <h4 className="text-lg font-bold text-zinc-900">{service.name}</h4>
                      <button
                        type="button"
                        onClick={() => deleteService(studio.id, service.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-zinc-600 max-w-xl leading-relaxed">{service.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {service.tags &&
                        service.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-white text-zinc-700 px-3 py-1 rounded-md border border-zinc-200 shadow-xs font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs text-zinc-400 uppercase font-semibold block mb-0.5">Starting</span>
                    <span className="text-lg sm:text-xl font-extrabold text-zinc-900">
                      {formatINR(service.startingPrice)}
                    </span>
                    <span className="text-xs text-amber-800 block font-bold mt-0.5">
                      ~{service.turnaroundDays}d Delivery
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SETTINGS & PROFILE TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-soft max-w-2xl space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">Studio Profile Parameters</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Customize your public studio profile as displayed to brands, agencies, and creators.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <Input
                label="Studio / Production House Name"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                required
              />

              <Input
                label="Tagline / Specialty Headline"
                value={studioTagline}
                onChange={(e) => setStudioTagline(e.target.value)}
                placeholder="e.g. Commercial TVCs, Guerrilla Ad Films & Viral Video Campaigns"
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs sm:text-sm font-bold text-zinc-700 tracking-wide">
                  About Studio / Bio
                </label>
                <textarea
                  rows={3}
                  value={studioDescription}
                  onChange={(e) => setStudioDescription(e.target.value)}
                  placeholder="Detail your filmmaking style, camera inventory, and vision..."
                  className="w-full bg-white text-sm sm:text-base text-zinc-900 rounded-xl border border-zinc-200 p-3 outline-none resize-none focus:border-yellow-500 placeholder:text-zinc-400"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs sm:text-sm font-bold text-zinc-700 tracking-wide">
                  The Equipment We Use
                </label>
                <textarea
                  rows={3}
                  value={studioEquipment}
                  onChange={(e) => setStudioEquipment(e.target.value)}
                  placeholder="e.g. ARRI Alexa Mini LF, Sony FX6 / FX9, Cooke Anamorphic Primes, DaVinci Resolve Studio Suite (separate items by commas or new lines)..."
                  className="w-full bg-white text-sm sm:text-base text-zinc-900 rounded-xl border border-zinc-200 p-3 outline-none resize-none focus:border-yellow-500 placeholder:text-zinc-400"
                />
                <span className="text-[11px] text-zinc-400">
                  List camera packages, lenses, lighting gear, and sound stages (separate with commas or new lines).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Studio Location / Address"
                  value={studioLocation}
                  onChange={(e) => setStudioLocation(e.target.value)}
                  placeholder="e.g. Bandra, Mumbai or FC Road, Pune"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />

                <Input
                  label="City / Hub"
                  value={studioCity}
                  onChange={(e) => setStudioCity(e.target.value)}
                  placeholder="e.g. Pune, Mumbai, Jaipur, Kochi"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs sm:text-sm font-bold text-zinc-700 tracking-wide">
                    Availability Status
                  </label>
                  <select
                    value={studioAvailability}
                    onChange={(e) => setStudioAvailability(e.target.value)}
                    className="w-full bg-white text-sm sm:text-base text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none cursor-pointer focus:border-yellow-500 transition-colors"
                  >
                    <option value="Available Now">Available Now</option>
                    <option value="Next 2 Weeks">Next 2 Weeks</option>
                    <option value="Waitlist">Waitlist</option>
                  </select>
                </div>

                <Input
                  label="Minimum Budget (₹ INR)"
                  type="number"
                  value={studioMinBudget}
                  onChange={(e) => setStudioMinBudget(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Contact Phone"
                  value={studioPhone}
                  onChange={(e) => setStudioPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  leftIcon={<Phone className="w-4 h-4" />}
                />

                <Input
                  label="Website / Linktree"
                  value={studioWebsite}
                  onChange={(e) => setStudioWebsite(e.target.value)}
                  placeholder="https://yourstudio.com"
                  leftIcon={<Globe className="w-4 h-4" />}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="md" type="submit" className="text-sm font-bold px-6 py-2.5 shadow-xs">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Quote Proposal Modal */}
      {quotingEnquiry && (
        <Modal
          isOpen={Boolean(quotingEnquiry)}
          onClose={() => setQuotingEnquiry(null)}
          title={`Quote for "${quotingEnquiry.projectTitle}"`}
          description={`Submit official proposal to ${quotingEnquiry.customerName}`}
        >
          <form onSubmit={handleSendQuote} className="space-y-4">
            <div className="p-4 bg-zinc-50 rounded-2xl text-sm sm:text-base text-zinc-700 space-y-1.5 border border-zinc-200 font-medium">
              <p><strong>Target Scope:</strong> {quotingEnquiry.budgetRange}</p>
              <p><strong>Category:</strong> {quotingEnquiry.category}</p>
            </div>

            <Input
              label="Quote Amount (₹ INR)"
              required
              type="number"
              placeholder="e.g. 1850000"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
            />

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs sm:text-sm font-bold text-zinc-700 tracking-wide">
                Scope & Deliverables
              </label>
              <textarea
                rows={3}
                placeholder="Camera package, shoot days, sound rights, and delivery format..."
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                className="w-full bg-white text-sm sm:text-base text-zinc-900 rounded-xl border border-zinc-200 p-3 outline-none resize-none focus:border-yellow-500 placeholder:text-zinc-400"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                variant="ghost"
                size="md"
                type="button"
                onClick={() => setQuotingEnquiry(null)}
                className="text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                leftIcon={<Send className="w-4 h-4" />}
                className="text-sm font-bold"
              >
                Submit Quote
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Portfolio Modal */}
      <Modal
        isOpen={addPortfolioModalOpen}
        onClose={() => setAddPortfolioModalOpen(false)}
        title="Add Project to Portfolio"
        description="Showcase your best commercial work, indie film, or creative reel."
      >
        <form onSubmit={handleCreatePortfolioItem} className="space-y-4">
          <Input
            label="Project Title"
            required
            placeholder="e.g. Midnight Monsoon Fashion Reel"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Client or Brand Name"
              required
              placeholder="e.g. Subculture Threads"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
            />
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs sm:text-sm font-bold text-zinc-700 tracking-wide">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-white text-sm sm:text-base text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none cursor-pointer focus:border-yellow-500 transition-colors"
              >
                <option value="Video Production">Video Production</option>
                <option value="Digital Advertisement">Digital Advertisement</option>
              </select>
            </div>
          </div>

          <Input
            label="Thumbnail Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs sm:text-sm font-bold text-zinc-700 tracking-wide">Description & Execution</label>
            <textarea
              rows={2}
              placeholder="Cinematography style, location, and storytelling approach..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-white text-sm sm:text-base text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none resize-none focus:border-yellow-500 placeholder:text-zinc-400"
            />
          </div>

          <Input
            label="Metric / Result (Optional)"
            placeholder="e.g. +340% Impressions or Viral Video"
            value={newMetrics}
            onChange={(e) => setNewMetrics(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              variant="ghost"
              size="md"
              type="button"
              onClick={() => setAddPortfolioModalOpen(false)}
              className="text-sm font-semibold"
            >
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" className="text-sm font-bold">
              Save Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Service Modal */}
      <Modal
        isOpen={addServiceModalOpen}
        onClose={() => setAddServiceModalOpen(false)}
        title="Add Commercial Service"
        description="List a service package with clear starting rates and deliverables."
      >
        <form onSubmit={handleCreateService} className="space-y-4">
          <Input
            label="Service Title"
            required
            placeholder="e.g. Indie Ad Film Package or Social Video Reels"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs sm:text-sm font-bold text-zinc-700 tracking-wide">
              Description & Deliverables
            </label>
            <textarea
              rows={2}
              placeholder="Detail what is included (e.g. 1 day shoot, 4K edit, color grading)..."
              value={serviceDesc}
              onChange={(e) => setServiceDesc(e.target.value)}
              className="w-full bg-white text-sm sm:text-base text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none resize-none focus:border-yellow-500 placeholder:text-zinc-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Starting Price (₹ INR)"
              required
              type="number"
              placeholder="e.g. 50000"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
            />

            <Input
              label="Turnaround Time (Days)"
              required
              type="number"
              placeholder="e.g. 10"
              value={serviceDays}
              onChange={(e) => setServiceDays(e.target.value)}
            />
          </div>

          <Input
            label="Tags (Comma separated)"
            placeholder="e.g. 4K Master, Color Graded, Quick Turnaround"
            value={serviceTags}
            onChange={(e) => setServiceTags(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-2.5">
            <Button
              variant="ghost"
              size="md"
              type="button"
              onClick={() => setAddServiceModalOpen(false)}
              className="text-sm font-semibold"
            >
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" className="text-sm font-bold">
              Save Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
