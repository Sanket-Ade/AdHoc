'use client';
import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '@/context/AuthContext';
import { POPULAR_CATEGORIES } from '@/lib/mock-data';
import { Send, CheckCircle2, Clock, MessageSquare, ShieldAlert, Lock } from 'lucide-react';
import { EnquiryChatModal } from './EnquiryChatModal';
import Link from 'next/link';
export const SendEnquiryModal = ({ isOpen, onClose, productionHouse, initialCategory, initialTitle = '', initialDescription = '', initialBudget = '₹50,000 - ₹2,00,000', }) => {
    const { user, addEnquiry } = useAuth();
    const [title, setTitle] = useState(initialTitle);
    const [category, setCategory] = useState(initialCategory || productionHouse?.services[0]?.name || 'Video Production');
    const [description, setDescription] = useState(initialDescription);
    const [budgetRange, setBudgetRange] = useState(initialBudget);
    const [deadline, setDeadline] = useState('');
    const [location, setLocation] = useState(user?.location || 'Mumbai / Remote');
    const [contactName, setContactName] = useState(user?.name || '');
    const [contactEmail, setContactEmail] = useState(user?.email || '');
    const [companyName, setCompanyName] = useState(user?.companyName || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedEnquiryId, setSubmittedEnquiryId] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    // Sync state when props change
    React.useEffect(() => {
        if (initialTitle)
            setTitle(initialTitle);
        if (initialDescription)
            setDescription(initialDescription);
        if (initialCategory)
            setCategory(initialCategory);
        if (initialBudget)
            setBudgetRange(initialBudget);
    }, [initialTitle, initialDescription, initialCategory, initialBudget]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productionHouse)
            return;
        setIsSubmitting(true);
        try {
            // Dynamic import canvas-confetti
            const confetti = (await import('canvas-confetti')).default;
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#5B9DF9', '#3578E5', '#D6E9FF', '#10B981'],
            });
        }
        catch {
            // Confetti fallback
        }
        const created = addEnquiry({
            customerId: user?.id || 'guest-user',
            customerName: contactName || 'Client',
            customerEmail: contactEmail || 'client@example.com',
            customerCompany: companyName || undefined,
            productionHouseId: productionHouse.id,
            productionHouseName: productionHouse.name,
            projectTitle: title,
            category,
            budgetRange,
            deadline: deadline || 'Within 4-6 weeks',
            location,
            description,
        });
        setIsSubmitting(false);
        setSubmittedEnquiryId(created.id);
    };
    const handleResetAndClose = () => {
        setSubmittedEnquiryId(null);
        onClose();
    };
    if (!productionHouse)
        return null;
    return (<>
      <Modal isOpen={isOpen} onClose={handleResetAndClose} maxWidth="2xl" title={submittedEnquiryId ? undefined : `Send Enquiry to ${productionHouse.name}`} description={submittedEnquiryId
            ? undefined
            : 'Share your advertising requirements to receive a structured quote and timeline proposal.'}>
      {submittedEnquiryId ? (<div className="py-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-9 h-9"/>
          </div>
          <h3 className="text-xl font-bold text-zinc-900">Enquiry Sent Successfully</h3>
          <p className="text-sm text-zinc-600 max-w-md mt-1.5 mb-6">
            Directly transmitted to{' '}
            <strong className="text-zinc-900">{productionHouse.name}</strong>. Response expected within{' '}
            <strong className="text-amber-800">
              {productionHouse.responseRateHours} hours
            </strong>
            .
          </p>

          <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-left text-xs mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">Project:</span>
              <span className="font-semibold text-zinc-900">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Category:</span>
              <span className="font-semibold text-amber-800">{category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Budget:</span>
              <span className="font-semibold text-zinc-900">{budgetRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Reference:</span>
              <span className="font-mono text-zinc-600">{submittedEnquiryId}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <Button
              variant="primary"
              className="flex-1 font-bold text-sm"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => setIsChatOpen(true)}
            >
              Message {productionHouse.name}
            </Button>
            <Link href="/dashboard/customer" className="flex-1">
              <Button variant="outline" className="w-full text-sm font-semibold" onClick={handleResetAndClose}>
                Track in Dashboard
              </Button>
            </Link>
          </div>
        </div>) : (<form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Production House Summary Box */}
          <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
            <img src={productionHouse.logoUrl} alt={productionHouse.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-200 shrink-0"/>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-zinc-900 truncate">{productionHouse.name}</h4>
                {productionHouse.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="GST/Udyam Verified Studio" />
                )}
              </div>
              <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400"/>
                Response: ~{productionHouse.responseRateHours}h • {productionHouse.location}
              </p>
            </div>
          </div>

          {/* Unverified Studio Warning */}
          {!productionHouse.verified && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-950">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Verification Incomplete — Direct Intake Paused</span>
              </div>
              <p className="text-rose-700 leading-relaxed font-normal">
                This studio has not yet completed mandatory document verification (GST or Udyam Certificate). Project enquiry submissions are disabled until genuine business credentials are confirmed.
              </p>
            </div>
          )}

          <Input label="Project Title" required placeholder="e.g. 30s Brand Commercial for Summer Launch" value={title} onChange={(e) => setTitle(e.target.value)}/>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold text-zinc-700 tracking-wide">
                Service Category
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white text-zinc-900 text-sm rounded-xl border border-zinc-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 px-3.5 py-2.5 outline-none cursor-pointer">
                {POPULAR_CATEGORIES.map((cat) => (<option key={cat.name} value={cat.name} className="bg-white text-zinc-900">
                    {cat.name}
                  </option>))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold text-zinc-700 tracking-wide">
                Estimated Budget Range
              </label>
              <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className="w-full bg-white text-zinc-900 text-sm rounded-xl border border-zinc-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 px-3.5 py-2.5 outline-none cursor-pointer">
                <option value="₹50,000 - ₹1,00,000" className="bg-white text-zinc-900">₹50,000 - ₹1,00,000 (Starter / Social & Digital Ads)</option>
                <option value="₹1,00,000 - ₹5,00,000" className="bg-white text-zinc-900">₹1,00,000 - ₹5,00,000 (Mid-tier Shoot / Digital Video)</option>
                <option value="₹5,00,000 - ₹15,00,000" className="bg-white text-zinc-900">₹5,00,000 - ₹15,00,000 (Digital Ad Film / Brand)</option>
                <option value="₹15,00,000 - ₹35,00,000" className="bg-white text-zinc-900">₹15,00,000 - ₹35,00,000 (Broadcast TVC / Digital Campaign)</option>
                <option value="₹35,00,000 - ₹75,00,000" className="bg-white text-zinc-900">₹35,00,000 - ₹75,00,000 (National Campaign)</option>
                <option value="₹75,00,000+" className="bg-white text-zinc-900">₹75,00,000+ (Multi-City Rollout)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-zinc-700 tracking-wide flex justify-between">
              <span>Project Requirements & Scope</span>
              <span className="text-[11px] text-zinc-400 font-normal">
                Goals & deliverables
              </span>
            </label>
            <textarea required rows={3} placeholder="Describe deliverables, target channels, shoot dates, and references..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white text-zinc-900 placeholder-zinc-400 text-sm rounded-xl border border-zinc-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 p-3.5 outline-none resize-none"/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Target Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
            <Input label="Production Location" placeholder="e.g. Mumbai, Delhi, or Remote" value={location} onChange={(e) => setLocation(e.target.value)}/>
          </div>

          <div className="pt-2 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Your Name" required placeholder="Full name" value={contactName} onChange={(e) => setContactName(e.target.value)}/>
            <Input label="Your Email" type="email" required placeholder="work@company.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}/>
            <Input label="Company / Brand" placeholder="e.g. Brand Co." value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={handleResetAndClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!productionHouse.verified || isSubmitting}
              isLoading={isSubmitting}
              leftIcon={productionHouse.verified ? <Send className="w-4 h-4"/> : <Lock className="w-4 h-4" />}
            >
              {productionHouse.verified ? 'Submit Project Enquiry' : 'Studio Unverified'}
            </Button>
          </div>
        </form>)}
    </Modal>
    {isChatOpen && submittedEnquiryId && (
      <EnquiryChatModal
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          handleResetAndClose();
        }}
        enquiryId={submittedEnquiryId}
      />
    )}
    </>);
};
