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
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Upload,
  FileCheck,
  FileText,
  AlertTriangle,
  RotateCcw,
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
    verifyStudioDocuments,
    revokeVerification,
    showToast,
  } = useAuth();

  const studioId =
    (user?.role === 'production_house' && (user?.productionHouseId || user?.id)) || 'ph-1';
  const studio = productionHouses.find((h) => h.id === studioId) || productionHouses[0];

  const isStudioVerified = Boolean(studio?.verified);

  // Default to verification tab if studio is unverified
  const [activeTab, setActiveTab] = useState(isStudioVerified ? 'enquiries' : 'verification');

  // Active chat modal
  const [activeChatEnquiryId, setActiveChatEnquiryId] = useState(null);

  // Quote modal state
  const [quotingEnquiry, setQuotingEnquiry] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  // Add Portfolio Item modal state
  const [addPortfolioModalOpen, setAddPortfolioModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCategory, setNewCategory] = useState('Video Production');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80'
  );
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
  const [studioMinBudget, setStudioMinBudget] = useState(
    studio?.minBudget ? studio.minBudget.toString() : '50000'
  );
  const [studioPhone, setStudioPhone] = useState(studio?.phone || '');
  const [studioWebsite, setStudioWebsite] = useState(studio?.website || '');
  const [studioTeamSize, setStudioTeamSize] = useState(studio?.teamSize || '5-15 Crew');
  const [studioEquipment, setStudioEquipment] = useState(
    studio?.equipmentFacilities
      ? Array.isArray(studio.equipmentFacilities)
        ? studio.equipmentFacilities.join('\n')
        : studio.equipmentFacilities
      : studio?.equipment || ''
  );

  // Document Verification Form State
  const [docType, setDocType] = useState('gst'); // 'gst' | 'udyam'
  const [docNumber, setDocNumber] = useState('');
  const [legalName, setLegalName] = useState(studio?.name || '');
  const [signatoryName, setSignatoryName] = useState(user?.name || 'Studio Principal');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState('');
  const [agreedDeclaration, setAgreedDeclaration] = useState(false);
  const [isVerifyingDoc, setIsVerifyingDoc] = useState(false);
  const [verificationError, setVerificationError] = useState('');

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
      setLegalName(studio.name || '');
      const equip = studio.equipmentFacilities
        ? Array.isArray(studio.equipmentFacilities)
          ? studio.equipmentFacilities.join('\n')
          : studio.equipmentFacilities
        : studio.equipment || '';
      setStudioEquipment(equip);
    }
  }, [studio]);

  const studioEnquiries = enquiries.filter(
    (e) => e.productionHouseId === studio.id || (studio.id === 'ph-1' && e.productionHouseId === 'ph-1')
  );
  const pendingEnquiries = studioEnquiries.filter((e) => e.status === 'pending');
  const activeProjects = studioEnquiries.filter((e) => e.status === 'in_progress');
  const totalRevenue = studioEnquiries
    .filter((e) => e.status === 'in_progress' || e.status === 'completed')
    .reduce((acc, curr) => acc + (curr.quotedAmount || 0), 0);

  // Verification Form Helpers
  const handleFillSampleGST = () => {
    setDocType('gst');
    setDocNumber('27AAACP0123M1ZT');
    setLegalName(studio?.name ? `${studio.name} Private Limited` : 'Commercial Studio Films Pvt Ltd');
    setSignatoryName(user?.name || 'Karan Singhal');
    setSelectedFileName('gst_registration_certificate_2026.pdf');
    setSelectedFileSize('1.4 MB');
    setAgreedDeclaration(true);
    setVerificationError('');
  };

  const handleFillSampleUdyam = () => {
    setDocType('udyam');
    setDocNumber('UDYAM-MH-01-0028491');
    setLegalName(studio?.name ? `${studio.name} Motion Media Enterprise` : 'Studio Motion Media MSME');
    setSignatoryName(user?.name || 'Director / Producer');
    setSelectedFileName('udyam_msme_registration_cert.pdf');
    setSelectedFileSize('920 KB');
    setAgreedDeclaration(true);
    setVerificationError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setSelectedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setVerificationError('');
    }
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    setVerificationError('');

    const cleanNum = docNumber.trim().toUpperCase();

    if (!cleanNum) {
      setVerificationError(`Please provide your ${docType === 'gst' ? '15-character GSTIN' : 'Udyam Registration Number'}.`);
      return;
    }

    if (docType === 'gst') {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(cleanNum)) {
        setVerificationError('Invalid GSTIN format. Valid Indian GSTIN format is 15 alphanumeric characters (e.g. 27AAACP0123M1ZT).');
        return;
      }
    } else {
      const udyamRegex = /^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/;
      if (!udyamRegex.test(cleanNum)) {
        setVerificationError('Invalid Udyam Number format. Valid format is UDYAM-XX-00-0000000 (e.g. UDYAM-MH-01-0028491).');
        return;
      }
    }

    if (!legalName.trim()) {
      setVerificationError('Legal Entity Name as per certificate is required.');
      return;
    }

    if (!agreedDeclaration) {
      setVerificationError('You must confirm the legal authenticity declaration to proceed.');
      return;
    }

    setIsVerifyingDoc(true);

    // Simulate real-time registry check
    setTimeout(async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#10B981', '#34D399', '#FDE047', '#09090B'],
        });
      } catch {
        // Confetti fallback
      }

      verifyStudioDocuments(studio.id, {
        docType,
        docNumber: cleanNum,
        legalName: legalName.trim(),
        signatoryName: signatoryName.trim() || 'Principal Director',
        fileName: selectedFileName || `${docType}_verified_certificate.pdf`,
        fileSize: selectedFileSize || '1.2 MB',
      });

      setIsVerifyingDoc(false);
      setActiveTab('enquiries');
    }, 1200);
  };

  // Lock Guard Handlers
  const handleOpenQuotingModal = (enq) => {
    if (!isStudioVerified) {
      showToast('Action Blocked: Document verification is mandatory to submit quotes.', 'error');
      setActiveTab('verification');
      return;
    }
    setQuotingEnquiry(enq);
    setQuoteAmount('1850000');
  };

  const handleOpenChat = (enqId) => {
    if (!isStudioVerified) {
      showToast('Action Blocked: Document verification is mandatory to message clients.', 'error');
      setActiveTab('verification');
      return;
    }
    setActiveChatEnquiryId(enqId);
  };

  const handleOpenAddPortfolio = () => {
    if (!isStudioVerified) {
      showToast('Action Blocked: Document verification is mandatory to add portfolio showcases.', 'error');
      setActiveTab('verification');
      return;
    }
    setAddPortfolioModalOpen(true);
  };

  const handleOpenAddService = () => {
    if (!isStudioVerified) {
      showToast('Action Blocked: Document verification is mandatory to publish services.', 'error');
      setActiveTab('verification');
      return;
    }
    setAddServiceModalOpen(true);
  };

  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!isStudioVerified) {
      showToast('Verification Required: Submit GST or Udyam documents before quoting.', 'error');
      setActiveTab('verification');
      return;
    }
    if (!quotingEnquiry) return;
    updateEnquiryStatus(
      quotingEnquiry.id,
      'quoted',
      Number(quoteAmount) || 0,
      quoteNotes || 'Standard scope quote submitted.'
    );
    setQuotingEnquiry(null);
    setQuoteAmount('');
    setQuoteNotes('');
  };

  const handleCreatePortfolio = (e) => {
    e.preventDefault();
    if (!isStudioVerified) {
      showToast('Verification Required: Submit GST or Udyam documents before adding work.', 'error');
      setActiveTab('verification');
      return;
    }
    if (!newTitle) return;
    addPortfolioItem(studio.id, {
      title: newTitle,
      clientName: newClient || 'Client Showcase',
      category: newCategory,
      thumbnailUrl: newImageUrl,
      description: newDescription || 'Commercial film portfolio showcase.',
      metrics: newMetrics || undefined,
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
    if (!isStudioVerified) {
      showToast('Verification Required: Submit GST or Udyam documents before adding services.', 'error');
      setActiveTab('verification');
      return;
    }
    if (!serviceName) return;
    addService(studio.id, {
      name: serviceName,
      description: serviceDesc,
      startingPrice: Math.max(50000, Number(servicePrice) || 50000),
      turnaroundDays: Number(serviceDays) || 10,
      tags: serviceTags ? serviceTags.split(',').map((t) => t.trim()) : ['Commercial Video'],
    });
    setAddServiceModalOpen(false);
    setServiceName('');
    setServiceDesc('');
    setServicePrice('');
    setServiceTags('');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!isStudioVerified) {
      showToast('Verification Required: Verify documents before updating public settings.', 'error');
      setActiveTab('verification');
      return;
    }
    const equipmentList = studioEquipment
      ? studioEquipment
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean)
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
      minBudget: Math.max(50000, Number(studioMinBudget) || 50000),
      phone: studioPhone,
      website: studioWebsite,
      teamSize: studioTeamSize,
    });
  };

  return (
    <div className="bg-[#FAFAFA] text-zinc-900 min-h-screen py-8 sm:py-12 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={studio.logoUrl}
              alt={studio.name}
              className="w-16 h-16 rounded-2xl object-cover border border-zinc-200 bg-zinc-50 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
                  {studio.name}
                </h1>

                {/* Verification Status Pill */}
                {isStudioVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Genuine ({studio.verificationDocument?.docType?.toUpperCase() || 'GST'})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Unverified — Operations Locked
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 font-normal">
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
                className="text-xs sm:text-sm font-semibold"
              >
                View Public Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* MANDATORY VERIFICATION ALERT BANNER (When Unverified) */}
        {!isStudioVerified && (
          <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-5 sm:p-6 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-rose-950 flex items-center gap-2">
                  <span>Mandatory Verification Required — All Operations Locked</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-200/80 text-rose-900 uppercase">
                    Strict Requirement
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-rose-800 max-w-3xl leading-relaxed">
                  To confirm that your production house is genuine and protect clients, official government documents (GST Certificate or Udyam Registration) are strictly mandatory. <strong>Without verification, you cannot submit quotes, message clients, add portfolio items, or receive bookings.</strong>
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setActiveTab('verification')}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              className="text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 shadow-xs"
            >
              Verify Documents Now
            </Button>
          </div>
        )}

        {/* Studio Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Total Enquiries</p>
              <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">{studioEnquiries.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-zinc-100 text-zinc-700 border border-zinc-200 flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Pending Action</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{pendingEnquiries.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">Active Production</p>
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
            {
              id: 'verification',
              label: 'Document Verification',
              badge: isStudioVerified ? 'Verified' : 'Required',
              badgeStyle: isStudioVerified
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-100 text-rose-800 font-bold border border-rose-300',
            },
            {
              id: 'enquiries',
              label: 'Enquiries & Quotes',
              count: studioEnquiries.length,
              isLocked: !isStudioVerified,
            },
            {
              id: 'portfolio',
              label: 'Portfolio Showcases',
              count: studio.portfolio?.length || 0,
              isLocked: !isStudioVerified,
            },
            {
              id: 'services',
              label: 'Services & Pricing',
              count: studio.services?.length || 0,
              isLocked: !isStudioVerified,
            },
            {
              id: 'settings',
              label: 'Profile Parameters',
              isLocked: !isStudioVerified,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {tab.isLocked && <Lock className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tab.badgeStyle}`}>
                    {tab.badge}
                  </span>
                )}
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

        {/* ========================================================================= */}
        {/* TAB 1: DOCUMENT VERIFICATION (CORE GENUINE VERIFICATION PORTAL)            */}
        {/* ========================================================================= */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            {isStudioVerified ? (
              /* ALREADY VERIFIED: DISPLAY OFFICIAL CERTIFICATE CARD */
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/90 shadow-soft space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-black text-zinc-900">
                          Business Credentials Verified Genuine
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active & Confirmed
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                        Your production house is officially confirmed authentic. All operations, quote submissions, client messaging, and directory listings are active.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeVerification(studio.id, 'User requested document update')}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5 text-zinc-500" />}
                    className="text-xs text-zinc-600 hover:text-rose-700 shrink-0"
                  >
                    Re-Verify / Update Document
                  </Button>
                </div>

                {/* Document Record Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                    <span className="text-[11px] text-zinc-400 uppercase font-semibold block">Document Type</span>
                    <span className="font-bold text-zinc-900">
                      {studio.verificationDocument?.docType === 'gst'
                        ? 'GSTIN Registration Certificate'
                        : 'Udyam MSME Registration Certificate'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                    <span className="text-[11px] text-zinc-400 uppercase font-semibold block">Registration Number</span>
                    <span className="font-mono font-bold text-zinc-900 text-sm">
                      {studio.verificationDocument?.docNumber || (studio.gstRegistered ? '27AAACP0123M1ZT' : 'UDYAM-MH-01-0028491')}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                    <span className="text-[11px] text-zinc-400 uppercase font-semibold block">Legal Entity Name</span>
                    <span className="font-bold text-zinc-900 truncate block">
                      {studio.verificationDocument?.legalName || `${studio.name} Pvt Ltd`}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                    <span className="text-[11px] text-zinc-400 uppercase font-semibold block">Verified Date</span>
                    <span className="font-medium text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {studio.verificationDocument?.verifiedAt
                        ? studio.verificationDocument.verifiedAt.split('T')[0]
                        : '2026-03-15'}
                    </span>
                  </div>
                </div>

                {/* Attached Document File Summary */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <span className="font-semibold text-emerald-950 block">
                        {studio.verificationDocument?.fileName || 'official_business_certificate.pdf'}
                      </span>
                      <span className="text-emerald-700 text-[11px]">
                        Validated with National Registry • Tamper-proof record
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                    STATUS: GENUINE
                  </span>
                </div>
              </div>
            ) : (
              /* NOT VERIFIED: INTERACTIVE DOCUMENT SUBMISSION PORTAL */
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/90 shadow-soft max-w-3xl space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                      Mandatory Business Verification
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Required
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                    Verify Production House Documents
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
                    Submit your government-issued GST Certificate or Udyam (MSME) Registration Certificate to confirm your production house is genuine. All operations (submitting quotes, messaging clients, publishing services, and accepting briefs) will be unlocked immediately upon verification.
                  </p>
                </div>

                {/* Quick Auto-Fill Helpers for Testing */}
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <span className="font-semibold text-zinc-600">Quick Test Helpers:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleFillSampleGST}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                    >
                      Fill Valid GST (27AAACP0123M1ZT)
                    </button>
                    <button
                      type="button"
                      onClick={handleFillSampleUdyam}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                    >
                      Fill Valid Udyam (UDYAM-MH-01-0028491)
                    </button>
                  </div>
                </div>

                {verificationError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitVerification} className="space-y-5">
                  {/* Step 1: Select Document Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      1. Select Business Document Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setDocType('gst');
                          setVerificationError('');
                        }}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          docType === 'gst'
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                            : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">GST Registration Certificate</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${docType === 'gst' ? 'bg-zinc-800 text-yellow-300' : 'bg-zinc-100 text-zinc-600'}`}>
                            GSTIN (15 Chars)
                          </span>
                        </div>
                        <p className={`text-xs mt-1 leading-snug ${docType === 'gst' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          Official Goods and Services Tax registration under Ministry of Finance.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDocType('udyam');
                          setVerificationError('');
                        }}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          docType === 'udyam'
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                            : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">Udyam Registration Certificate</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${docType === 'udyam' ? 'bg-zinc-800 text-yellow-300' : 'bg-zinc-100 text-zinc-600'}`}>
                            MSME Registry
                          </span>
                        </div>
                        <p className={`text-xs mt-1 leading-snug ${docType === 'udyam' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          Official MSME registration under Ministry of Micro, Small & Medium Enterprises.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Document Numbers & Entity Details */}
                  <div className="space-y-3.5 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      2. Certificate Identifiers & Legal Details
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <Input
                        label={docType === 'gst' ? 'GSTIN (15 Alphanumeric Characters)' : 'Udyam Registration Number'}
                        required
                        placeholder={docType === 'gst' ? 'e.g. 27AAACP0123M1ZT' : 'e.g. UDYAM-MH-01-0028491'}
                        value={docNumber}
                        onChange={(e) => {
                          setDocNumber(e.target.value);
                          setVerificationError('');
                        }}
                      />

                      <Input
                        label="Legal Business Entity Name"
                        required
                        placeholder="e.g. Studio Bombay Films Pvt Ltd"
                        value={legalName}
                        onChange={(e) => setLegalName(e.target.value)}
                      />
                    </div>

                    <Input
                      label="Authorized Signatory / Director Name"
                      required
                      placeholder="e.g. Karan Singhal (Founder / Executive Producer)"
                      value={signatoryName}
                      onChange={(e) => setSignatoryName(e.target.value)}
                    />
                  </div>

                  {/* Step 3: Certificate Document File Upload */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
                      3. Upload Certificate Document File
                    </label>

                    <div className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-2xl p-6 text-center bg-zinc-50/50 transition-colors">
                      <input
                        type="file"
                        id="document-file-input"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="document-file-input" className="cursor-pointer space-y-2 block">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 text-zinc-600 flex items-center justify-center mx-auto shadow-xs">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-zinc-900">
                            {selectedFileName ? (
                              <span className="text-emerald-700 font-bold">{selectedFileName}</span>
                            ) : (
                              'Click to browse or drag and drop certificate file'
                            )}
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            PDF, PNG, or JPG (max 10MB) • Official government certificate copy
                          </p>
                        </div>
                        {selectedFileSize && (
                          <span className="inline-block text-[11px] font-mono text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded">
                            {selectedFileSize}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Step 4: Declaration Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedDeclaration}
                        onChange={(e) => setAgreedDeclaration(e.target.checked)}
                        className="accent-zinc-900 w-4 h-4 mt-0.5 shrink-0"
                      />
                      <span className="text-xs text-zinc-600 leading-relaxed font-normal">
                        I hereby declare and affirm that the provided <strong>{docType === 'gst' ? 'GST Certificate' : 'Udyam Certificate'}</strong> is genuine, officially issued by the Government of India, and represents our legal business entity. I acknowledge that falsified records will lead to immediate permanent ban and legal reporting.
                      </span>
                    </label>
                  </div>

                  {/* Step 5: Verification Action Button */}
                  <div className="pt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isVerifyingDoc}
                      leftIcon={<ShieldCheck className="w-5 h-5" />}
                      className="w-full text-sm sm:text-base font-bold py-3 shadow-md"
                    >
                      {isVerifyingDoc ? 'Verifying with National Registry...' : 'Verify Documents & Unlock Studio'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ENQUIRIES PIPELINE MANAGEMENT                                      */}
        {/* ========================================================================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {!isStudioVerified && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Submitting quotes and messaging clients is locked until document verification is approved.</span>
                </span>
                <button
                  onClick={() => setActiveTab('verification')}
                  className="font-bold underline text-amber-950 cursor-pointer ml-2 shrink-0"
                >
                  Verify Now →
                </button>
              </div>
            )}

            {studioEnquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-zinc-200 shadow-soft space-y-3">
                <Inbox className="w-10 h-10 text-zinc-400 mx-auto" />
                <h4 className="text-base font-bold text-zinc-800">No Enquiries Yet</h4>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
                  Clients discover verified production houses through the directory. Once your documents are verified, briefs will arrive here.
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
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
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

                  <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed font-normal">
                    {enq.description}
                  </p>

                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        Received {enq.createdAt ? enq.createdAt.split('T')[0] : 'Recently'}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span>
                        Deadline: <strong className="text-zinc-700 font-medium">{enq.deadline || 'Flexible'}</strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Message Client Action */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!isStudioVerified}
                        onClick={() => handleOpenChat(enq.id)}
                        leftIcon={isStudioVerified ? <MessageSquare className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-zinc-400" />}
                        className={`text-xs sm:text-sm font-semibold ${!isStudioVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isStudioVerified ? 'Message Client' : 'Chat (Locked)'}
                      </Button>

                      {/* Quoting / Status Actions */}
                      {enq.status === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={!isStudioVerified}
                            onClick={() => handleOpenQuotingModal(enq)}
                            leftIcon={isStudioVerified ? <IndianRupee className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            className={`text-xs sm:text-sm font-bold py-2 ${!isStudioVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isStudioVerified ? 'Send Quote' : 'Quote (Locked)'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={!isStudioVerified}
                            className="text-zinc-500 hover:text-rose-600 text-xs sm:text-sm font-semibold"
                            onClick={() => updateEnquiryStatus(enq.id, 'declined')}
                          >
                            Decline
                          </Button>
                        </>
                      )}

                      {enq.status === 'quoted' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={!isStudioVerified}
                          onClick={() => updateEnquiryStatus(enq.id, 'in_progress')}
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          className="text-xs sm:text-sm font-bold"
                        >
                          Start Production
                        </Button>
                      )}

                      {enq.status === 'in_progress' && (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!isStudioVerified}
                          onClick={() => updateEnquiryStatus(enq.id, 'completed')}
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                          className="text-xs sm:text-sm font-bold"
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

        {/* ========================================================================= */}
        {/* TAB 3: PORTFOLIO SHOWCASES                                                */}
        {/* ========================================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">Portfolio Showcases</h3>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Showcase high-impact commercial reels, brand films, and social video work.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                disabled={!isStudioVerified}
                onClick={handleOpenAddPortfolio}
                leftIcon={isStudioVerified ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                className={`text-xs sm:text-sm font-bold shadow-xs shrink-0 ${!isStudioVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isStudioVerified ? 'Add Project' : 'Add Project (Locked)'}
              </Button>
            </div>

            {!isStudioVerified && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>⚠️ Document verification is required to add or edit portfolio projects.</span>
                <button
                  onClick={() => setActiveTab('verification')}
                  className="font-bold underline text-amber-950 cursor-pointer"
                >
                  Verify Now →
                </button>
              </div>
            )}

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
                        disabled={!isStudioVerified}
                        onClick={() => deletePortfolioItem(studio.id, item.id)}
                        className={`p-2 rounded-xl bg-white/90 hover:bg-rose-50 text-zinc-600 hover:text-rose-600 border border-zinc-200 shadow-xs transition-colors cursor-pointer ${!isStudioVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isStudioVerified ? 'Delete project' : 'Locked'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-500 font-semibold">
                      <span className="text-zinc-800 font-bold">{item.category}</span>
                      <span>{item.clientName}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-zinc-900 line-clamp-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">{item.description}</p>
                    {item.metrics && (
                      <span className="inline-block text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {item.metrics}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SERVICES & PRICING                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">Commercial Services & Rate Cards</h3>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Define your studio deliverables and starting pricing (starting from ₹50,000).
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                disabled={!isStudioVerified}
                onClick={handleOpenAddService}
                leftIcon={isStudioVerified ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                className={`text-xs sm:text-sm font-bold shadow-xs shrink-0 ${!isStudioVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isStudioVerified ? 'Add Service' : 'Add Service (Locked)'}
              </Button>
            </div>

            {!isStudioVerified && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>⚠️ Document verification is required to add, update, or publish service rate cards.</span>
                <button
                  onClick={() => setActiveTab('verification')}
                  className="font-bold underline text-amber-950 cursor-pointer"
                >
                  Verify Now →
                </button>
              </div>
            )}

            <div className="space-y-3.5">
              {(studio.services || []).map((service) => (
                <div
                  key={service.id}
                  className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between sm:justify-start gap-3">
                      <h4 className="text-base sm:text-lg font-bold text-zinc-900">{service.name}</h4>
                      <button
                        type="button"
                        disabled={!isStudioVerified}
                        onClick={() => deleteService(studio.id, service.id)}
                        className={`text-zinc-400 hover:text-rose-600 p-1 cursor-pointer ${!isStudioVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isStudioVerified ? 'Remove service' : 'Locked'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-600 max-w-xl leading-relaxed">{service.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {service.tags &&
                        service.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-white text-zinc-700 px-2.5 py-0.5 rounded-md border border-zinc-200 shadow-xs font-medium"
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs text-zinc-400 uppercase font-semibold block mb-0.5">Starting</span>
                    <span className="text-base sm:text-lg font-bold text-zinc-900">
                      {formatINR(service.startingPrice)}
                    </span>
                    <span className="text-xs text-zinc-500 block font-medium mt-0.5">
                      ~{service.turnaroundDays}d Delivery
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SETTINGS & PROFILE PARAMETERS                                      */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-soft max-w-2xl space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900">Studio Profile Parameters</h3>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Customize your public studio profile as displayed to brands and agencies.
              </p>
            </div>

            {!isStudioVerified && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>⚠️ Document verification is required to publish parameter changes.</span>
                <button
                  onClick={() => setActiveTab('verification')}
                  className="font-bold underline text-amber-950 cursor-pointer"
                >
                  Verify Now →
                </button>
              </div>
            )}

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
                placeholder="e.g. Commercial TVCs, Brand Films & Performance Video"
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
                  className="w-full bg-white text-sm text-zinc-900 rounded-xl border border-zinc-200 p-3 outline-none resize-none focus:border-zinc-900 placeholder:text-zinc-400"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs sm:text-sm font-bold text-zinc-700 tracking-wide">
                  Equipment Facilities
                </label>
                <textarea
                  rows={3}
                  value={studioEquipment}
                  onChange={(e) => setStudioEquipment(e.target.value)}
                  placeholder="e.g. ARRI Alexa Mini LF, Sony FX6 / FX9, Cooke Anamorphic Primes..."
                  className="w-full bg-white text-sm text-zinc-900 rounded-xl border border-zinc-200 p-3 outline-none resize-none focus:border-zinc-900 placeholder:text-zinc-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Studio Location"
                  value={studioLocation}
                  onChange={(e) => setStudioLocation(e.target.value)}
                  placeholder="e.g. Bandra, Mumbai or FC Road, Pune"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />

                <Input
                  label="City / Hub"
                  value={studioCity}
                  onChange={(e) => setStudioCity(e.target.value)}
                  placeholder="e.g. Mumbai, Bengaluru, Pune"
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
                    className="w-full bg-white text-sm text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none cursor-pointer focus:border-zinc-900 transition-colors"
                  >
                    <option value="Available Now">Available Now</option>
                    <option value="Next 2 Weeks">Next 2 Weeks</option>
                    <option value="Waitlist">Waitlist</option>
                  </select>
                </div>

                <Input
                  label="Starting Budget (₹ INR - Min 50,000)"
                  type="number"
                  min="50000"
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
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={!isStudioVerified}
                  leftIcon={!isStudioVerified ? <Lock className="w-4 h-4" /> : undefined}
                  className={`text-xs sm:text-sm font-bold px-6 py-2.5 shadow-xs ${!isStudioVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isStudioVerified ? 'Save Changes' : 'Save Changes (Locked)'}
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
            <div className="p-4 bg-zinc-50 rounded-2xl text-xs sm:text-sm text-zinc-700 space-y-1.5 border border-zinc-200">
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
              <label className="text-xs font-bold text-zinc-700 tracking-wide">
                Scope & Deliverables
              </label>
              <textarea
                rows={3}
                placeholder="Camera package, shoot days, sound rights, and delivery format..."
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                className="w-full bg-white text-sm text-zinc-900 rounded-xl border border-zinc-200 p-3 outline-none resize-none focus:border-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                variant="ghost"
                size="md"
                type="button"
                onClick={() => setQuotingEnquiry(null)}
                className="text-xs sm:text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                leftIcon={<Send className="w-4 h-4" />}
                className="text-xs sm:text-sm font-bold"
              >
                Submit Quote
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Portfolio Modal */}
      {addPortfolioModalOpen && (
        <Modal
          isOpen={addPortfolioModalOpen}
          onClose={() => setAddPortfolioModalOpen(false)}
          title="Add Portfolio Showcase"
          description="Highlight a verified ad campaign or commercial reel."
        >
          <form onSubmit={handleCreatePortfolio} className="space-y-4">
            <Input
              label="Project Title"
              required
              placeholder="e.g. Premium Brew Brand Commercial"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Client / Brand Name"
                placeholder="e.g. Third Wave Coffee"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
              />

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-zinc-700 tracking-wide">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-white text-sm text-zinc-900 rounded-xl border border-zinc-200 p-2.5 outline-none cursor-pointer focus:border-zinc-900"
                >
                  <option value="Video Production">Commercial Video Production</option>
                  <option value="Digital Advertisement">Digital Advertisement & Reels</option>
                </select>
              </div>
            </div>

            <Input
              label="Thumbnail Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-zinc-700 tracking-wide">Project Summary</label>
              <textarea
                rows={3}
                placeholder="Describe camera gear, shoot days, visual direction..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-white text-sm text-zinc-900 rounded-xl border border-zinc-200 p-3 outline-none resize-none focus:border-zinc-900"
              />
            </div>

            <Input
              label="Key Highlight / Result"
              placeholder="e.g. Shot on ARRI Alexa LF • 2.5M Views"
              value={newMetrics}
              onChange={(e) => setNewMetrics(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setAddPortfolioModalOpen(false)}
                className="text-xs sm:text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="text-xs sm:text-sm font-bold">
                Publish Project
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Service Modal */}
      {addServiceModalOpen && (
        <Modal
          isOpen={addServiceModalOpen}
          onClose={() => setAddServiceModalOpen(false)}
          title="Add Commercial Service"
          description="Publish a standard commercial package and starting price."
        >
          <form onSubmit={handleCreateService} className="space-y-4">
            <Input
              label="Service Name"
              required
              placeholder="e.g. High-Velocity Social Video Ads"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-zinc-700 tracking-wide">Service Scope</label>
              <textarea
                rows={3}
                placeholder="Detail deliverables, resolution, revisions..."
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                className="w-full bg-white text-sm text-zinc-900 rounded-xl border border-zinc-200 p-3 outline-none resize-none focus:border-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Starting Price (₹ INR - Min 50,000)"
                required
                type="number"
                min="50000"
                placeholder="50000"
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
              />

              <Input
                label="Est. Turnaround Days"
                type="number"
                placeholder="10"
                value={serviceDays}
                onChange={(e) => setServiceDays(e.target.value)}
              />
            </div>

            <Input
              label="Service Tags (comma separated)"
              placeholder="Broadcast TVC, OTT Ad, 4K Master"
              value={serviceTags}
              onChange={(e) => setServiceTags(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setAddServiceModalOpen(false)}
                className="text-xs sm:text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="text-xs sm:text-sm font-bold">
                Publish Rate Card
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Enquiry Chat Modal */}
      {activeChatEnquiryId && (
        <EnquiryChatModal
          isOpen={Boolean(activeChatEnquiryId)}
          onClose={() => setActiveChatEnquiryId(null)}
          enquiryId={activeChatEnquiryId}
        />
      )}
    </div>
  );
}
