'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { EnquiryStatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatINR } from '@/lib/format';
import { Building2, CheckCircle2, AlertCircle, IndianRupee, Plus, Trash2, TrendingUp, Check, Send } from 'lucide-react';
export default function ProductionHouseDashboardPage()
 {
  const { user, enquiries, productionHouses, updateEnquiryStatus, updateProductionHouse, addPortfolioItem, deletePortfolioItem } = useAuth();
  const studioId = user?.role === 'production_house' && user?.id ? user.id : 'ph-1';
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
  // Profile Settings Form State
  const [studioTagline, setStudioTagline] = useState(studio.tagline);
  const [studioAvailability, setStudioAvailability] = useState(studio.availability);
  const [studioMinBudget, setStudioMinBudget] = useState(studio.minBudget.toString());
  const studioEnquiries = enquiries.filter((e) => e.productionHouseId === studio.id || e.productionHouseId === 'ph-1');
  const pendingEnquiries = studioEnquiries.filter((e) => e.status === 'pending');
  const activeProjects = studioEnquiries.filter((e) => e.status === 'in_progress' || e.status === 'under_review');
  const totalRevenue = studioEnquiries
    .filter((e) => e.quotedAmount)
    .reduce((sum, e) => sum + (e.quotedAmount || 0), 0);
  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!quotingEnquiry)
      return;
    updateEnquiryStatus(quotingEnquiry.id, 'quoted', Number(quoteAmount) || 1500000, quoteNotes || 'Standard proposal with full broadcast deliverables.');
    setQuotingEnquiry(null);
    setQuoteAmount('');
    setQuoteNotes('');
  };
  const handleCreatePortfolioItem = (e) => {
    e.preventDefault();
    if (!newTitle.trim())
      return;
    addPortfolioItem(studio.id, {
      title: newTitle,
      clientName: newClient || 'Commercial Client',
      category: newCategory,
      thumbnailUrl: newImageUrl,
      description: newDescription || 'Commercial campaign deliverables delivered with excellence.',
      metrics: newMetrics || '+250% Engagement',
      year: 2026,
    });
    setAddPortfolioModalOpen(false);
    setNewTitle('');
    setNewClient('');
    setNewDescription('');
    setNewMetrics('');
  };
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateProductionHouse(studio.id, {
      tagline: studioTagline,
      availability: studioAvailability,
      minBudget: Number(studioMinBudget) || 500000,
    });
  };
  return (<div className="bg-[#FAFAFA] text-zinc-900 min-h-screen py-8 sm:py-12 border-b border-zinc-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img src={studio.logoUrl} alt={studio.name} className="w-14 h-14 rounded-xl object-cover border border-zinc-200 bg-zinc-50 shrink-0" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">{studio.name}</h1>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Studio
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {studio.location} • Commercial Video & Film
            </p>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 sm:w-64 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 font-medium">Profile Strength</span>
            <span className="font-bold text-amber-800">85%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full w-[85%]" />
          </div>
        </div>
      </div>

      {/* Studio Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-zinc-200/90 shadow-soft">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>Total Enquiries</span>
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <p className="text-2xl font-black text-zinc-900">{studioEnquiries.length}</p>
          <span className="text-[11px] text-zinc-500">+4 this week</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200/90 shadow-soft">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>Pending Action</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingEnquiries.length}</p>
          <span className="text-[11px] text-zinc-500">Awaiting quote</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200/90 shadow-soft">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>In Production</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{activeProjects.length}</p>
          <span className="text-[11px] text-zinc-500">Active sets</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200/90 shadow-soft">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>Pipeline Value</span>
            <IndianRupee className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <p className="text-2xl font-black text-zinc-900">
            {formatINR(totalRevenue)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Active quotes</span>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-2 overflow-x-auto">
        {[
          { id: 'enquiries', label: `Enquiries (${studioEnquiries.length})` },
          { id: 'portfolio', label: `Portfolio (${studio.portfolio.length})` },
          { id: 'services', label: `Services (${studio.services.length})` },
          { id: 'settings', label: 'Settings' },
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
          ? 'bg-zinc-900 text-white shadow-xs'
          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}>
          {tab.label}
        </button>))}
      </div>

      {/* 1. ENQUIRIES PIPELINE MANAGEMENT */}
      {activeTab === 'enquiries' && (<div className="space-y-3">
        {studioEnquiries.map((enq) => (<div key={enq.id} className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-soft space-y-3 hover:border-zinc-300 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-zinc-900">{enq.projectTitle}</h4>
                <EnquiryStatusBadge status={enq.status} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span>Client: <strong className="text-zinc-800">{enq.customerName}</strong></span>
                {enq.customerCompany && (<>
                  <span className="text-zinc-300">•</span>
                  <span>Company: <strong className="text-zinc-800">{enq.customerCompany}</strong></span>
                </>)}
                <span className="text-zinc-300">•</span>
                <span className="text-amber-800 font-semibold">{enq.category}</span>
                <span className="text-zinc-300">•</span>
                <span>{enq.location}</span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">Budget Scope</span>
              <span className="text-sm font-bold text-zinc-900">
                {enq.budgetRange}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-200/70 leading-relaxed">
            {enq.description}
          </p>

          {enq.quotedAmount && (<div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <div>
              <strong>Formal Quote:</strong> {formatINR(enq.quotedAmount)}
              {enq.quoteNotes && <span className="ml-2 text-zinc-600">({enq.quoteNotes})</span>}
            </div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">
              Active
            </span>
          </div>)}

          {/* Action Pipeline Buttons */}
          <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-zinc-500">
              Received {enq.createdAt.split('T')[0]} • Target: {enq.deadline}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {enq.status === 'pending' && (<>
                <Button variant="primary" size="sm" onClick={() => {
                  setQuotingEnquiry(enq);
                  setQuoteAmount('1850000');
                }} leftIcon={<IndianRupee className="w-3.5 h-3.5" />} className="text-xs">
                  Send Quote
                </Button>
                <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-rose-600 text-xs" onClick={() => updateEnquiryStatus(enq.id, 'declined')}>
                  Decline
                </Button>
              </>)}

              {enq.status === 'quoted' && (<Button variant="secondary" size="sm" onClick={() => updateEnquiryStatus(enq.id, 'in_progress')} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />} className="text-xs">
                Start Production
              </Button>)}

              {enq.status === 'in_progress' && (<Button variant="primary" size="sm" onClick={() => updateEnquiryStatus(enq.id, 'completed')} leftIcon={<Check className="w-3.5 h-3.5" />} className="text-xs">
                Mark Completed
              </Button>)}
            </div>
          </div>
        </div>))}
      </div>)}

      {/* 2. PORTFOLIO MANAGEMENT TAB */}
      {activeTab === 'portfolio' && (<div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Portfolio Showcases</h3>
            <p className="text-xs text-zinc-500">
              Featured campaigns visible to advertising clients.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setAddPortfolioModalOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />} className="text-xs">
            Add Project
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studio.portfolio.map((item) => (<div key={item.id} className="bg-white rounded-xl border border-zinc-200/90 shadow-soft overflow-hidden flex flex-col justify-between">
            <div className="relative h-40 w-full bg-zinc-100">
              <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2">
                <button onClick={() => deletePortfolioItem(studio.id, item.id)} className="p-1.5 rounded-lg bg-white/90 hover:bg-rose-50 text-zinc-600 hover:text-rose-600 border border-zinc-200 shadow-xs transition-colors cursor-pointer" title="Delete project">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="text-amber-800 font-semibold">{item.category}</span>
                <span>{item.clientName}</span>
              </div>
              <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{item.title}</h4>
              <p className="text-xs text-zinc-600 line-clamp-2">{item.description}</p>
              {item.metrics && (<span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {item.metrics}
              </span>)}
            </div>
          </div>))}
        </div>
      </div>)}

      {/* 3. SERVICES & PRICING TAB */}
      {activeTab === 'services' && (<div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-soft space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Commercial Services</h3>
          <p className="text-xs text-zinc-500">
            Service rates displayed on your profile.
          </p>
        </div>

        <div className="space-y-3">
          {studio.services.map((service) => (<div key={service.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-zinc-900">{service.name}</h4>
              <p className="text-xs text-zinc-600 max-w-xl">{service.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {service.tags.map((t) => (<span key={t} className="text-[10px] bg-white text-zinc-700 px-2 py-0.5 rounded border border-zinc-200 shadow-xs">
                  {t}
                </span>))}
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">Starting</span>
              <span className="text-sm font-bold text-zinc-900">
                {formatINR(service.startingPrice)}
              </span>
              <span className="text-[10px] text-amber-800 block font-semibold">
                ~{service.turnaroundDays}d Delivery
              </span>
            </div>
          </div>))}
        </div>
      </div>)}

      {/* 4. SETTINGS & AVAILABILITY TAB */}
      {activeTab === 'settings' && (<div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-soft max-w-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Studio Parameters</h3>
          <p className="text-xs text-zinc-500">
            Update status, tagline, and intake budget threshold.
          </p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-3">
          <Input label="Headline" value={studioTagline} onChange={(e) => setStudioTagline(e.target.value)} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-semibold text-zinc-700">
                Availability
              </label>
              <select value={studioAvailability} onChange={(e) => setStudioAvailability(e.target.value)} className="w-full bg-white text-xs text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none cursor-pointer focus:border-yellow-500 transition-colors">
                <option value="Available Now">Available Now</option>
                <option value="Next 2 Weeks">Next 2 Weeks</option>
                <option value="Waitlist">Waitlist</option>
              </select>
            </div>

            <Input label="Minimum Budget (₹ INR)" type="number" value={studioMinBudget} onChange={(e) => setStudioMinBudget(e.target.value)} />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" type="submit" className="text-xs">
              Save Changes
            </Button>
          </div>
        </form>
      </div>)}
    </div>

    {/* Quote Proposal Modal */}
    {quotingEnquiry && (<Modal isOpen={Boolean(quotingEnquiry)} onClose={() => setQuotingEnquiry(null)} title={`Quote for "${quotingEnquiry.projectTitle}"`} description={`Submit official proposal to ${quotingEnquiry.customerName}`}>
      <form onSubmit={handleSendQuote} className="space-y-3">
        <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-700 space-y-1 border border-zinc-200">
          <p><strong>Target Scope:</strong> {quotingEnquiry.budgetRange}</p>
          <p><strong>Category:</strong> {quotingEnquiry.category}</p>
        </div>

        <Input label="Quote Amount (₹ INR)" required type="number" placeholder="e.g. 1850000" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} />

        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs font-semibold text-zinc-700">
            Scope & Deliverables
          </label>
          <textarea rows={3} placeholder="Camera package, shoot days, sound rights, and delivery format..." value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} className="w-full bg-white text-xs text-zinc-900 rounded-xl border border-zinc-200 p-3 outline-none resize-none focus:border-yellow-500 placeholder:text-zinc-400" />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={() => setQuotingEnquiry(null)} className="text-xs">
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" leftIcon={<Send className="w-3.5 h-3.5" />} className="text-xs">
            Submit Quote
          </Button>
        </div>
      </form>
    </Modal>)}

    {/* Add Portfolio Modal */}
    <Modal isOpen={addPortfolioModalOpen} onClose={() => setAddPortfolioModalOpen(false)} title="Add Project" description="Showcase a commercial client campaign.">
      <form onSubmit={handleCreatePortfolioItem} className="space-y-3">
        <Input label="Project Title" required placeholder="e.g. Broadcast Commercial" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Client" required placeholder="e.g. Spotify India" value={newClient} onChange={(e) => setNewClient(e.target.value)} />
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-zinc-700">Category</label>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-white text-xs text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none cursor-pointer focus:border-yellow-500 transition-colors">
              <option value="Video Production">Video Production</option>
              <option value="Digital Advertising">Digital Advertising</option>
              <option value="Outdoor Advertising">Outdoor Advertising</option>
            </select>
          </div>
        </div>

        <Input label="Image URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />

        <div className="flex flex-col gap-1 text-left">
          <label className="text-xs font-semibold text-zinc-700">Description</label>
          <textarea rows={2} placeholder="Creative brief and deliverables..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full bg-white text-xs text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none resize-none focus:border-yellow-500 placeholder:text-zinc-400" />
        </div>

        <Input label="Metric / Result (Optional)" placeholder="e.g. +340% Impressions" value={newMetrics} onChange={(e) => setNewMetrics(e.target.value)} />

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={() => setAddPortfolioModalOpen(false)} className="text-xs">
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" className="text-xs">
            Save Project
          </Button>
        </div>
      </form>
    </Modal>
  </div>);
}
