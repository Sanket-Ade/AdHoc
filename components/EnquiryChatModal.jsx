'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { EnquiryStatusBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/format';
import {
  Send,
  Paperclip,
  Building2,
  User,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  FileText,
  CheckCheck,
  Zap,
  Film,
  X,
  Bot,
  Trash2,
  Lock,
} from 'lucide-react';

export const EnquiryChatModal = ({ isOpen, onClose, enquiryId }) => {
  const { user, enquiries, productionHouses, sendEnquiryMessage, deleteEnquiry } = useAuth();
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Find the enquiry from live state
  const enquiry = enquiries.find((e) => e.id === enquiryId);
  const studio = productionHouses.find((h) => h.id === enquiry?.productionHouseId);

  // Determine current user's perspective
  const isStudioUser = user?.role === 'production_house';
  const isStudioVerified = Boolean(studio?.verified);
  const otherPartyName = isStudioUser
    ? enquiry?.customerName || 'Business Client'
    : enquiry?.productionHouseName || 'Production House';
  const otherPartySub = isStudioUser
    ? (enquiry?.customerCompany || 'Client Representative')
    : (studio?.location || 'Production House');

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, enquiry?.messages?.length]);

  if (!isOpen || !enquiry) return null;

  const messages = enquiry.messages || [];

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    setIsSending(true);
    sendEnquiryMessage(enquiry.id, inputText, attachedFile);
    setInputText('');
    setAttachedFile(null);
    setIsSending(false);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleQuickReply = (text) => {
    sendEnquiryMessage(enquiry.id, text);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddSampleAttachment = () => {
    if (attachedFile) {
      setAttachedFile(null);
    } else {
      setAttachedFile({
        name: isStudioUser ? 'Production_Treatment_Deck_v1.pdf' : 'Brand_Moodboard_Visuals.pdf',
        size: '3.4 MB',
      });
    }
  };

  // Quick suggestion chips based on who is typing
  const quickSuggestions = isStudioUser
    ? [
      'We reviewed your creative brief!',
      'What is your target shoot window?',
      'We can schedule a recce this week.',
      'Camera package & crew are confirmed.',
    ]
    : [
      'When is the earliest recce possible?',
      'Does the quote include 9:16 cuts?',
      'Can you share director references?',
      'We have brand guidelines ready.',
    ];

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Main Chat Dialog Box */}
      <div className="relative w-full max-w-3xl bg-white text-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 z-10 flex flex-col h-[90vh] max-h-[820px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* ========================================================================= */}
        {/* 1. CHAT HEADER                                                           */}
        {/* ========================================================================= */}
        <div className="px-5 py-4 bg-zinc-900 text-white border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            {/* Avatar / Logo */}
            <div className="relative shrink-0">
              {isStudioUser ? (
                <div className="w-11 h-11 rounded-xl bg-yellow-300 text-zinc-950 font-black flex items-center justify-center text-base shadow-xs">
                  {(enquiry.customerName || 'C')[0].toUpperCase()}
                </div>
              ) : (
                <img
                  src={studio?.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80'}
                  alt={otherPartyName}
                  className="w-11 h-11 rounded-xl object-cover border border-zinc-700 bg-zinc-800 shrink-0"
                />
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-900" />
            </div>

            {/* Other Party Info */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                  {otherPartyName}
                </h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-zinc-800 text-amber-300 border border-zinc-700">
                  {isStudioUser ? 'Client' : 'Studio'}
                </span>
              </div>

            </div>
          </div>

          {/* Project Title & Close button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-right">

              <div className="flex items-center gap-1.5 mt-0.5">
                <EnquiryStatusBadge status={enquiry.status} />
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete enquiry "${enquiry.projectTitle}"?`)) {
                  deleteEnquiry(enquiry.id);
                  onClose();
                }
              }}
              className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              title="Delete enquiry"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Project Context Strip */}
        <div className="px-5 py-2.5 bg-zinc-50 border-b border-zinc-200/90 flex flex-wrap items-center justify-between text-xs text-zinc-600 gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-900 flex items-center gap-1">
              <Film className="w-3.5 h-3.5 text-amber-600" />
              {enquiry.projectTitle}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              {enquiry.category}
            </span>
          </div>


        </div>

        {/* ========================================================================= */}
        {/* 2. MESSAGES SCROLL AREA                                                  */}
        {/* ========================================================================= */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAFAFA]">
          {/* Initial Creative Brief Reference Card */}
          <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-soft text-xs text-zinc-600 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 font-semibold border-b border-zinc-100 pb-2">
              <span className="flex items-center gap-1.5 text-zinc-700 font-bold">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                Original Creative Brief Submission
              </span>
              <span>{enquiry.createdAt ? enquiry.createdAt.split('T')[0] : 'Initiated'}</span>
            </div>
            <p className="text-zinc-700 leading-relaxed font-normal">
              {enquiry.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-zinc-500 font-medium">
              <span>Target Scope: <strong className="text-zinc-800">{enquiry.budgetRange}</strong></span>
              <span>•</span>
              <span>Deadline: <strong className="text-zinc-800">{enquiry.deadline || 'Flexible'}</strong></span>
              {enquiry.location && (
                <>
                  <span>•</span>
                  <span>Location: <strong className="text-zinc-800">{enquiry.location}</strong></span>
                </>
              )}
            </div>
          </div>

          {/* Conversation Bubbles */}
          {messages.map((msg) => {
            // Determine if current logged in perspective sent this message
            const isMe = isStudioUser
              ? msg.senderRole === 'production_house'
              : msg.senderRole === 'customer';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-200`}
              >
                {/* Sender Tag */}
                <div className="flex items-center gap-1.5 px-1 text-[11px] text-zinc-400 font-semibold">
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{formatTime(msg.timestamp)}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-soft transition-all ${isMe
                      ? 'bg-zinc-900 text-white rounded-tr-xs'
                      : 'bg-white text-zinc-900 border border-zinc-200/90 rounded-tl-xs'
                    }`}
                >
                  <p className="whitespace-pre-wrap font-normal">{msg.content}</p>

                  {/* Attachment Pill if present */}
                  {msg.attachment && (
                    <div
                      className={`mt-2.5 p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${isMe
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className={`w-4 h-4 ${isMe ? 'text-amber-400' : 'text-amber-600'}`} />
                        <span className="truncate max-w-[180px]">{msg.attachment.name}</span>
                      </div>
                      <span className="text-[10px] opacity-70 shrink-0">{msg.attachment.size}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* ========================================================================= */}
        {/* 3. QUICK SUGGESTION CHIPS                                                */}
        {/* ========================================================================= */}
        {(!isStudioUser || isStudioVerified) && (
          <div className="px-5 py-2.5 bg-white border-t border-zinc-100 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[11px] uppercase font-bold text-zinc-400 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Replies:
            </span>
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleQuickReply(suggestion)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-yellow-100 text-zinc-700 hover:text-amber-950 border border-zinc-200/80 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. CHAT INPUT BAR                                                        */}
        {/* ========================================================================= */}
        <div className="p-4 bg-white border-t border-zinc-200 shrink-0 space-y-2">
          {/* Attachment preview banner if attached */}
          {attachedFile && (
            <div className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-950 font-medium">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Ready to attach: <strong>{attachedFile.name}</strong> ({attachedFile.size})</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="p-1 text-amber-700 hover:text-amber-900 cursor-pointer"
                title="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {isStudioUser && !isStudioVerified ? (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Document verification (GST or Udyam Certificate) is strictly required before messaging clients. Please verify your credentials in your studio dashboard.</span>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex items-center gap-2">
              {/* Attachment Button */}
              <button
                type="button"
                onClick={handleAddSampleAttachment}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${attachedFile
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 border-zinc-200'
                  }`}
                title="Attach moodboard or treatment deck"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Input field */}
              <input
                type="text"
                placeholder={`Write a message to ${otherPartyName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white text-sm text-zinc-900 px-4 py-2.5 rounded-xl border border-zinc-200 outline-none focus:border-amber-400 transition-colors placeholder:text-zinc-400"
              />

              {/* Send Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputText.trim() && !attachedFile}
                rightIcon={<Send className="w-4 h-4" />}
                className="font-bold text-sm px-5 py-2.5 shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
              >
                Send
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};