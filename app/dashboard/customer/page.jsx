'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { EnquiryStatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { EnquiryChatModal } from '@/components/EnquiryChatModal';
import { formatINR } from '@/lib/format';
import { Heart, Sparkles, FileText, Calendar, MapPin, PlayCircle, CheckCircle2, MessageSquare, ArrowRight, Trash2, AlertTriangle, LogIn } from 'lucide-react';

export default function CustomerDashboardPage() {
    const router = useRouter();
    const { user, role, isAuthenticated, isLoadingAuth, enquiries, savedHouseIds, productionHouses, toggleSaveHouse, deleteEnquiry } = useAuth();
    const [activeTab, setActiveTab] = useState('enquiries');
    const [enquiryModalHouse, setEnquiryModalHouse] = useState(null);
    const [activeChatEnquiryId, setActiveChatEnquiryId] = useState(null);
    const [deletingEnquiry, setDeletingEnquiry] = useState(null);

    // Route Protection: Business must be logged in
    useEffect(() => {
        if (!isLoadingAuth) {
            if (!user) {
                router.replace('/login?role=customer');
            } else if (user.role === 'production_house') {
                router.replace('/dashboard/production-house');
            }
        }
    }, [user, isLoadingAuth, router]);

    if (isLoadingAuth || !user || user.role !== 'customer') {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-300 border border-yellow-400 flex items-center justify-center text-zinc-950 font-black text-xl animate-pulse shadow-xs mb-4">
                    ad
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-1">
                    {isLoadingAuth ? 'Checking authentication...' : 'Redirecting to login...'}
                </h3>
                <p className="text-xs text-zinc-500 mb-4">
                    Business accounts must be signed in to access the client dashboard.
                </p>
                {!isLoadingAuth && !user && (
                    <Link href="/login?role=customer">
                        <Button variant="primary" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                            Go to Business Login
                        </Button>
                    </Link>
                )}
            </div>
        );
    }

    const customerEnquiries = enquiries.filter((e) => e.customerId === user.id || e.customerEmail === user.email || (user.id === 'cust-1' && e.customerId === 'cust-1'));
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
              
              </div>
              <p className="text-sm sm:text-base text-zinc-500 font-medium">
                {user?.companyName || 'Aurora Consumer Goods India'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
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
            { id: 'messages', label: 'Studio Messages', count: customerEnquiries.filter(e => (e.messages?.length || 0) > 0).length },
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
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-sm sm:text-base text-emerald-950 flex flex-wrap items-center justify-between gap-2 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="  font-bold text-emerald-800">Proposal Notes:</span>
                        <span className="text-[12px] sm:text-base text-emerald-900">{enq.quoteNotes}</span>

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

                    <div className="flex flex-wrap items-center gap-2.5">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => setActiveChatEnquiryId(enq.id)}
                        leftIcon={<MessageSquare className="w-4 h-4" />}
                        className="text-sm font-bold py-2 shadow-xs cursor-pointer"
                      >
                        Chat with Studio {(enq.messages?.length || 0) > 1 ? `(${enq.messages.length})` : ''}
                      </Button>
                      <Link href={`/production-houses/${enq.productionHouseId}`}>
                        <Button variant="outline" size="md" className="text-sm font-semibold py-2">
                          View Studio
                        </Button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeletingEnquiry(enq)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-zinc-200 transition-colors cursor-pointer"
                        title="Delete enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 1.5 STUDIO MESSAGES & DISCUSSIONS TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {customerEnquiries.filter((e) => (e.messages?.length || 0) > 0).length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No Active Conversations"
                description="Once you send an enquiry to a production house, direct messages with the studio will appear here."
                actionText="Explore Studios"
                onAction={() => router.push('/explore')}
              />
            ) : (
              customerEnquiries
                .filter((e) => (e.messages?.length || 0) > 0)
                .map((enq) => {
                  const lastMsg = enq.messages[enq.messages.length - 1];
                  const studioMatch = productionHouses.find((h) => h.id === enq.productionHouseId);

                  return (
                    <div
                      key={enq.id}
                      onClick={() => setActiveChatEnquiryId(enq.id)}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/90 shadow-soft hover:border-zinc-300 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <img
                          src={studioMatch?.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80'}
                          alt={enq.productionHouseName}
                          className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 bg-zinc-50 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-amber-800 transition-colors">
                              {enq.productionHouseName}
                            </h4>
                            <span className="text-xs bg-amber-50 text-amber-900 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200/60">
                              {enq.projectTitle}
                            </span>
                            <EnquiryStatusBadge status={enq.status} />
                          </div>
                          <p className="text-sm text-zinc-600 line-clamp-1">
                            <strong className="text-zinc-800 font-medium">{lastMsg?.senderName}:</strong>{' '}
                            {lastMsg?.content}
                          </p>
                          <span className="text-[11px] text-zinc-400 font-medium block">
                            {lastMsg?.timestamp ? new Date(lastMsg.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<MessageSquare className="w-4 h-4" />}
                          className="text-xs font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveChatEnquiryId(enq.id);
                          }}
                        >
                          Open Chat ({enq.messages.length})
                        </Button>
                      </div>
                    </div>
                  );
                })
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

      {/* Modals */}
      <SendEnquiryModal isOpen={Boolean(enquiryModalHouse)} onClose={() => setEnquiryModalHouse(null)} productionHouse={enquiryModalHouse}/>
      {activeChatEnquiryId && (
        <EnquiryChatModal
          isOpen={Boolean(activeChatEnquiryId)}
          onClose={() => setActiveChatEnquiryId(null)}
          enquiryId={activeChatEnquiryId}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingEnquiry && (
        <Modal
          isOpen={Boolean(deletingEnquiry)}
          onClose={() => setDeletingEnquiry(null)}
          title="Delete Creative Enquiry"
          description={`Withdraw and delete "${deletingEnquiry.projectTitle}" sent to ${deletingEnquiry.productionHouseName}?`}
        >
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed font-normal">
              This action will permanently delete this enquiry, including all messages and scope records from your dashboard.
            </p>

            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600 space-y-1">
              <div><strong>Project:</strong> {deletingEnquiry.projectTitle}</div>
              <div><strong>Production House:</strong> {deletingEnquiry.productionHouseName}</div>
              <div><strong>Status:</strong> <span className="capitalize">{deletingEnquiry.status.replace('_', ' ')}</span></div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                variant="ghost"
                size="md"
                type="button"
                onClick={() => setDeletingEnquiry(null)}
                className="text-sm font-semibold"
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={() => {
                  deleteEnquiry(deletingEnquiry.id);
                  setDeletingEnquiry(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs cursor-pointer transition-colors"
              >
                Yes, Delete Enquiry
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>);
}
