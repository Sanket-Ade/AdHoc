'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { EnquiryStatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { formatINR } from '@/lib/format';
import { Heart, Sparkles, FileText, Calendar, MapPin, PlayCircle, CheckCircle2 } from 'lucide-react';

export default function CustomerDashboardPage() {
    const router = useRouter();
    const { user, enquiries, savedHouseIds, productionHouses, toggleSaveHouse } = useAuth();
    const [activeTab, setActiveTab] = useState('enquiries');
    const [enquiryModalHouse, setEnquiryModalHouse] = useState(null);
    const customerEnquiries = enquiries.filter((e) => !user || e.customerId === user.id || e.customerEmail === user.email || e.customerId === 'cust-1');
    const savedHouses = productionHouses.filter((h) => savedHouseIds.includes(h.id));
    const activeProjects = customerEnquiries.filter((e) => e.status === 'in_progress');
    const completedProjects = customerEnquiries.filter((e) => e.status === 'completed');

    return (
    <div className="bg-[#FAFAFA] text-zinc-900 min-h-screen py-8 sm:py-12 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-yellow-300 border border-yellow-400 text-zinc-950 flex items-center justify-center font-black text-2xl shadow-xs shrink-0">
              {(user?.name || 'Client')[0].toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900">
                  {user?.name || 'Sarah Chen'}
                </h1>
                <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Verified Client
                </span>
              </div>
              <p className="text-sm sm:text-base text-zinc-500 font-medium">
                {user?.companyName || 'Aurora Consumer Goods India'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/ai-assistant">
              <Button variant="primary" size="md" leftIcon={<Sparkles className="w-4 h-4"/>} className="text-sm font-bold shadow-xs">
                AI Brief Builder
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" size="md" className="text-sm font-semibold">
                Explore Studios
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Active Enquiries</p>
              <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">{customerEnquiries.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5"/>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">In Production</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{activeProjects.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0">
              <PlayCircle className="w-5 h-5"/>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Saved Studios</p>
              <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">{savedHouses.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5"/>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Delivered</p>
              <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">{completedProjects.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5"/>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto">
          {[
            { id: 'enquiries', label: 'Enquiries', count: customerEnquiries.length },
            { id: 'saved', label: 'Saved Studios', count: savedHouses.length },
            { id: 'projects', label: 'Active Projects', count: activeProjects.length + completedProjects.length },
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
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-zinc-800 text-yellow-300' : 'bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 1. ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {customerEnquiries.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No Enquiries Yet"
                description="Explore verified production houses to send your creative briefs."
                actionText="Explore Studios"
                onAction={() => router.push('/explore')}
              />
            ) : (
              customerEnquiries.map((enq) => (
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
                        <Link
                          href={`/production-houses/${enq.productionHouseId}`}
                          className="font-bold text-amber-800 hover:underline"
                        >
                          {enq.productionHouseName}
                        </Link>
                        <span className="text-zinc-300">•</span>
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
                      {enq.quotedAmount ? (
                        <div>
                          <span className="text-xs text-zinc-400 font-medium block">Official Quote</span>
                          <span className="text-base sm:text-lg font-bold text-emerald-600">
                            {formatINR(enq.quotedAmount)}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs text-zinc-400 font-medium block">Budget</span>
                          <span className="text-base sm:text-lg font-bold text-zinc-900">
                            {enq.budgetRange}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-700 bg-zinc-50/80 p-4 rounded-xl border border-zinc-200/70 leading-relaxed font-normal">
                    {enq.description}
                  </p>

                  {enq.quoteNotes && (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-sm sm:text-base text-emerald-950 flex flex-wrap items-center justify-between gap-2 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800">Proposal Notes:</span>
                        <span className="text-sm sm:text-base text-emerald-900">{enq.quoteNotes}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        Deadline: <strong className="text-zinc-700 font-medium">{enq.deadline}</strong>
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

                    <Link href={`/production-houses/${enq.productionHouseId}`}>
                      <Button variant="outline" size="md" className="text-sm font-semibold py-2">
                        View Studio
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. SAVED STUDIOS TAB */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedHouses.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No Saved Studios"
                description="Bookmark production houses while exploring the directory to compare them here."
                actionText="Explore Studios"
                onAction={() => router.push('/explore')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedHouses.map((house) => (
                  <div
                    key={house.id}
                    className="bg-white rounded-2xl border border-zinc-200/90 shadow-soft p-5 flex flex-col justify-between space-y-4 group hover:border-zinc-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={house.logoUrl}
                          alt={house.name}
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-200 bg-white shrink-0 shadow-xs"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base sm:text-lg font-bold text-zinc-900 truncate group-hover:text-amber-800 transition-colors">
                            {house.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-zinc-500 font-medium truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            {house.location}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaveHouse(house.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer shrink-0 transition-colors"
                        title="Remove bookmark"
                      >
                        <Heart className="w-4 h-4 fill-current"/>
                      </button>
                    </div>

                    <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                      {house.tagline}
                    </p>

                    <div className="pt-3 border-t border-zinc-100 flex items-center gap-2.5">
                      <Link href={`/production-houses/${house.id}`} className="flex-1">
                        <Button variant="outline" size="md" className="w-full text-sm font-semibold py-2">
                          View Specs
                        </Button>
                      </Link>
                      <Button
                        variant="primary"
                        size="md"
                        className="flex-1 text-sm font-bold py-2"
                        onClick={() => setEnquiryModalHouse(house)}
                      >
                        Send Brief
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-soft space-y-5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">Active Production Milestones</h3>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-lg font-bold text-zinc-900">
                        Summer Prebiotic TV Commercial
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Grade 2 Post-Production
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 font-medium">
                      Partner: PixelCraft Studios • Milestone: Audio Mastering & Broadcast Handover
                    </p>
                  </div>

                  <div className="w-full sm:w-48 space-y-1.5 text-right">
                    <span className="text-sm font-bold text-amber-800">75% Complete</span>
                    <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full w-3/4"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <SendEnquiryModal isOpen={Boolean(enquiryModalHouse)} onClose={() => setEnquiryModalHouse(null)} productionHouse={enquiryModalHouse}/>
    </div>);
}
