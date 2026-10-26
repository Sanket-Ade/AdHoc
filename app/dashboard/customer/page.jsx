'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { EnquiryStatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { formatINR } from '@/lib/format';
import { Heart, Sparkles, FileText } from 'lucide-react';
export default function CustomerDashboardPage() {
    const { user, enquiries, savedHouseIds, productionHouses, toggleSaveHouse } = useAuth();
    const [activeTab, setActiveTab] = useState('enquiries');
    const [enquiryModalHouse, setEnquiryModalHouse] = useState(null);
    const customerEnquiries = enquiries.filter((e) => !user || e.customerId === user.id || e.customerEmail === user.email || e.customerId === 'cust-1');
    const savedHouses = productionHouses.filter((h) => savedHouseIds.includes(h.id));
    const activeProjects = customerEnquiries.filter((e) => e.status === 'in_progress');
    const completedProjects = customerEnquiries.filter((e) => e.status === 'completed');
    return (<div className="bg-[#FAFAFA] text-zinc-900 min-h-screen py-8 sm:py-12 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-yellow-950 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded">
              Brand Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
              {user?.name || 'Client Pipeline'}
            </h1>
            <p className="text-xs text-zinc-500">
              {user?.companyName || 'Aurora Consumer Goods India'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/ai-assistant">
              <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5"/>} className="text-xs">
                AI Brief Builder
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" size="sm" className="text-xs">
                Explore Studios
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <span className="text-xs text-zinc-500">Active Enquiries</span>
            <p className="text-2xl font-black text-zinc-900 mt-1">{customerEnquiries.length}</p>
            <span className="text-[11px] text-amber-800 font-semibold">In pipeline</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <span className="text-xs text-zinc-500">In Production</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{activeProjects.length}</p>
            <span className="text-[11px] text-zinc-400">Active sets</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <span className="text-xs text-zinc-500">Saved Studios</span>
            <p className="text-2xl font-black text-zinc-900 mt-1">{savedHouses.length}</p>
            <span className="text-[11px] text-zinc-400">Bookmarked</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <span className="text-xs text-zinc-500">Delivered</span>
            <p className="text-2xl font-black text-zinc-900 mt-1">{completedProjects.length}</p>
            <span className="text-[11px] text-emerald-600 font-medium">100% SLA met</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-2 overflow-x-auto">
          {[
            { id: 'enquiries', label: `Enquiries (${customerEnquiries.length})` },
            { id: 'saved', label: `Saved Studios (${savedHouses.length})` },
            { id: 'projects', label: `Projects (${activeProjects.length + completedProjects.length})` },
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? 'bg-zinc-900 text-white border border-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'}`}>
              {tab.label}
            </button>))}
        </div>

        {/* 1. ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (<div className="space-y-3">
            {customerEnquiries.length === 0 ? (<EmptyState icon={FileText} title="No Enquiries" description="Explore studios to submit your creative briefs." actionText="Explore Directory" onAction={() => window.location.assign('/explore')}/>) : (customerEnquiries.map((enq) => (<div key={enq.id} className="bg-white rounded-xl p-5 border border-zinc-200 shadow-soft space-y-3 hover:border-zinc-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-900">{enq.projectTitle}</h3>
                        <EnquiryStatusBadge status={enq.status}/>
                      </div>
                      <p className="text-xs text-zinc-500">
                        Studio:{' '}
                        <Link href={`/production-houses/${enq.productionHouseId}`} className="font-medium text-amber-800 hover:underline">
                          {enq.productionHouseName}
                        </Link>{' '}
                        • Category: <span className="text-zinc-700">{enq.category}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      {enq.quotedAmount ? (<div>
                          <span className="text-[10px] text-zinc-500 uppercase font-medium block">Official Quote</span>
                          <span className="text-base font-black text-emerald-600">
                            {formatINR(enq.quotedAmount)}
                          </span>
                        </div>) : (<span className="text-xs text-zinc-600 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200">
                          Scope: {enq.budgetRange}
                        </span>)}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80 leading-relaxed">
                    {enq.description}
                  </p>

                  {enq.quoteNotes && (<div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                      <strong>Studio Scope:</strong> {enq.quoteNotes}
                    </div>)}

                  <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                    <div className="flex items-center gap-3">
                      <span>Target: <strong className="text-zinc-800">{enq.deadline}</strong></span>
                      <span>Region: <strong className="text-zinc-800">{enq.location}</strong></span>
                    </div>

                    <Link href={`/production-houses/${enq.productionHouseId}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Studio
                      </Button>
                    </Link>
                  </div>
                </div>)))}
          </div>)}

        {/* 2. SAVED STUDIOS TAB */}
        {activeTab === 'saved' && (<div className="space-y-4">
            {savedHouses.length === 0 ? (<EmptyState icon={Heart} title="No Saved Studios" description="Bookmark production houses while exploring." actionText="Explore Directory" onAction={() => window.location.assign('/explore')}/>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedHouses.map((house) => (<div key={house.id} className="bg-white rounded-xl border border-zinc-200 shadow-soft p-4 flex flex-col justify-between space-y-3 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={house.logoUrl} alt={house.name} className="w-11 h-11 rounded-xl object-cover border border-zinc-200 bg-white"/>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 group-hover:text-amber-800 transition-colors">
                            {house.name}
                          </h4>
                          <p className="text-[11px] text-zinc-500">{house.location}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleSaveHouse(house.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer" title="Remove bookmark">
                        <Heart className="w-3.5 h-3.5 fill-current"/>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-600 line-clamp-2">
                      {house.tagline}
                    </p>

                    <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
                      <Link href={`/production-houses/${house.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Profile
                        </Button>
                      </Link>
                      <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={() => setEnquiryModalHouse(house)}>
                        Brief
                      </Button>
                    </div>
                  </div>))}
              </div>)}
          </div>)}

        {/* 3. PROJECTS TAB */}
        {activeTab === 'projects' && (<div className="space-y-3">
            <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-soft space-y-3">
              <h3 className="text-sm font-bold text-zinc-900">Active Milestone Tracking</h3>
              <p className="text-xs text-zinc-500">
                Live post-production milestones and review timelines.
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900">
                        Summer Prebiotic TV Commercial
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Post-Production (Grade 2)
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      PixelCraft Studios • Milestone: Audio Mastering & Broadcast Grade
                    </p>
                  </div>

                  <div className="w-full sm:w-44 space-y-1 text-right">
                    <span className="text-xs font-bold text-amber-800">75% Complete</span>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full w-3/4"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>)}
      </div>

      {/* Modal */}
      <SendEnquiryModal isOpen={Boolean(enquiryModalHouse)} onClose={() => setEnquiryModalHouse(null)} productionHouse={enquiryModalHouse}/>
    </div>);
}
