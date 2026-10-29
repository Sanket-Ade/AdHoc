'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SendEnquiryModal } from '@/components/SendEnquiryModal';
import { Bot, Send, Sparkles, CheckCircle2, Copy, RefreshCw, FileText, User, ShieldCheck } from 'lucide-react';
const INITIAL_MESSAGES = [
    {
        id: 'msg-1',
        sender: 'assistant',
        content: "Adhoc AI Assistant active. Specify your campaign category, budget, or timeline to match verified studios & talented local production houses.",
        timestamp: 'Just now',
    },
    {
        id: 'msg-2',
        sender: 'assistant',
        content: "Select a production category to begin brief synthesis:",
        timestamp: 'Just now',
        quickReplies: [
            '30s TV / OTT Commercial Film',
            'Performance Social Video Ads',
            'Brand Narrative Digital Film',
            'Omnichannel Digital Ad Creative',
            'High-Speed Commercial Video',
            'Social Video Creative Engine',
        ],
    },
];
export default function AIAssistantPage() {
    const { productionHouses, showToast } = useAuth();
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [step, setStep] = useState(1);
    const [enquiryModalHouse, setEnquiryModalHouse] = useState(null);
    const [briefState, setBriefState] = useState({
        deliverables: [],
    });
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);
    const handleSendMessage = (textToSend) => {
        const text = (textToSend || inputValue).trim();
        if (!text)
            return;
        const userMsg = {
            id: `user-${Date.now()}`,
            sender: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);
        setTimeout(() => {
            let botResponse;
            if (step === 1) {
                let detectedCategory = 'Video Production';
                if (text.toLowerCase().includes('digital') || text.toLowerCase().includes('social') || text.toLowerCase().includes('performance') || text.toLowerCase().includes('ad') || text.toLowerCase().includes('motion')) {
                    detectedCategory = 'Digital Advertisement';
                } else {
                    detectedCategory = 'Video Production';
                }
                setBriefState((prev) => ({
                    ...prev,
                    title: text,
                    category: detectedCategory,
                }));
                botResponse = {
                    id: `bot-${Date.now()}`,
                    sender: 'assistant',
                    content: `Category locked: ${detectedCategory}. Who is the target audience or primary objective?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    quickReplies: [
                        'Gen-Z & Digital First (18-28)',
                        'B2B Enterprise & Founders',
                        'Pan-India Broadcast Reach',
                        'High-Income Urban Consumer',
                    ],
                };
                setStep(2);
            }
            else if (step === 2) {
                setBriefState((prev) => ({
                    ...prev,
                    targetAudience: text,
                    objective: `Commercial campaign targeting ${text}.`,
                }));
                botResponse = {
                    id: `bot-${Date.now()}`,
                    sender: 'assistant',
                    content: "Specify your planned production budget tier:",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    quickReplies: [
                        '₹50,000 – ₹2,00,000 (Social & Digital Ads)',
                        '₹2,00,000 – ₹8,00,000 (Digital Video & Mid-Tier Shoot)',
                        '₹8,00,000 – ₹25,00,000 (Commercial Film / OTT)',
                        '₹25,00,000+ (High-Impact Broadcast TVC)',
                    ],
                };
                setStep(3);
            }
            else if (step === 3) {
                setBriefState((prev) => ({
                    ...prev,
                    budgetRange: text,
                }));
                botResponse = {
                    id: `bot-${Date.now()}`,
                    sender: 'assistant',
                    content: "Select studio location and delivery window:",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    quickReplies: [
                        'Mumbai (Andheri / Film City) • 4 Weeks',
                        'Bengaluru (Indiranagar) • 3 Weeks',
                        'Delhi NCR (Okhla / Gurugram) • 4-5 Weeks',
                        'Hyderabad (Hitech City / Studios) • 3-4 Weeks',
                    ],
                };
                setStep(4);
            }
            else {
                const category = briefState.category || 'Video Production';
                const finalBrief = {
                    title: briefState.title || 'Commercial Campaign Brief',
                    category: category,
                    objective: briefState.objective || 'Commercial deliverable & customer conversion',
                    targetAudience: briefState.targetAudience || 'Pan-India Commercial Market',
                    budgetRange: briefState.budgetRange || '₹8,00,000 – ₹20,00,000',
                    timeline: text.includes('•') ? text.split('•')[1].trim() : '3-4 Weeks',
                    location: text.includes('•') ? text.split('•')[0].trim() : text,
                    deliverables: [
                        'Master Broadcast Grade Delivery (4K ProRes Master)',
                        '3x Multi-aspect Social Assets (9:16 / 1:1 / 16:9)',
                        'Color Grading & 5.1 Broadcast Sound Mix',
                        'Perpetual Commercial Broadcasting Handover',
                    ],
                };
                const matched = productionHouses.filter((h) => h.services.some((s) => s.name.toLowerCase().includes(category.toLowerCase())));
                botResponse = {
                    id: `bot-${Date.now()}`,
                    sender: 'assistant',
                    content: "Brief structured and matched against studio & local creator capacity index:",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    generatedBrief: finalBrief,
                    recommendedHouseIds: (matched.length > 0 ? matched : productionHouses).slice(0, 2).map((h) => h.id),
                };
                setStep(5);
            }
            setIsTyping(false);
            setMessages((prev) => [...prev, botResponse]);
        }, 700);
    };
    const handleCopyBrief = (brief) => {
        const text = `
PROJECT BRIEF: ${brief.title}
Category: ${brief.category}
Objective: ${brief.objective}
Target Audience: ${brief.targetAudience}
Budget Range: ${brief.budgetRange}
Timeline: ${brief.timeline}
Location: ${brief.location}

Deliverables:
${brief.deliverables.map((d) => `- ${d}`).join('\n')}
    `.trim();
        navigator.clipboard?.writeText(text);
        showToast('Brief copied to clipboard', 'success');
    };
    const restartChat = () => {
        setMessages(INITIAL_MESSAGES);
        setStep(1);
        setBriefState({ deliverables: [] });
    };
    return (<div className="bg-[#FAFAFA] text-zinc-900 min-h-screen py-8 sm:py-12 border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-zinc-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 border border-yellow-300 flex items-center justify-center text-yellow-950">
              <Bot className="w-5 h-5"/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-zinc-900">
                  AI Brief Assistant
                </h1>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Online
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Direct RFP generation & production house matching
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={restartChat} leftIcon={<RefreshCw className="w-3.5 h-3.5 text-zinc-500"/>} className="text-xs">
            Reset
          </Button>
        </div>

        {/* Chat Feed Box */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-6 mb-6 min-h-[500px] flex flex-col justify-between shadow-soft">
          {/* Messages list */}
          <div className="space-y-4 mb-6">
            {messages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';
            return (<div key={msg.id} className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                  {isAssistant && (<div className="w-7 h-7 rounded-lg bg-yellow-100 border border-yellow-300 text-amber-800 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700"/>
                    </div>)}

                  <div className={`max-w-[85%] sm:max-w-[75%] space-y-2.5`}>
                    {/* Bubble Content */}
                    <div className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${isAssistant
                    ? 'bg-zinc-50 text-zinc-800 border border-zinc-200/80 shadow-2xs'
                    : 'bg-yellow-200 text-zinc-950 border border-yellow-300 font-medium shadow-2xs'}`}>
                      {msg.content}
                    </div>

                    {/* Quick Replies Buttons */}
                    {msg.quickReplies && (<div className="flex flex-wrap gap-1.5 pt-0.5">
                        {msg.quickReplies.map((reply) => (<button key={reply} onClick={() => handleSendMessage(reply)} className="px-3 py-1.5 rounded-xl bg-white hover:bg-yellow-50 text-zinc-700 hover:text-amber-950 border border-zinc-200 hover:border-yellow-300 text-xs transition-all cursor-pointer text-left font-medium shadow-2xs">
                            {reply}
                          </button>))}
                      </div>)}

                    {/* Structured Project Brief Card */}
                    {msg.generatedBrief && (<div className="bg-yellow-50/50 rounded-xl border border-yellow-300 p-4 space-y-3 text-left">
                        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-amber-700"/>
                            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                              Commercial Brief Spec
                            </h3>
                          </div>
                          <Badge variant="yellow" size="sm">
                            {msg.generatedBrief.category}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs text-zinc-700">
                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase">Title</span>
                            <span className="font-bold text-sm text-zinc-900">
                              {msg.generatedBrief.title}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="p-2.5 bg-white rounded-xl border border-zinc-200">
                              <span className="text-[10px] text-zinc-500 block uppercase">Budget Tier</span>
                              <span className="font-semibold text-zinc-900">
                                {msg.generatedBrief.budgetRange}
                              </span>
                            </div>
                            <div className="p-2.5 bg-white rounded-xl border border-zinc-200">
                              <span className="text-[10px] text-zinc-500 block uppercase">Window</span>
                              <span className="font-semibold text-zinc-900">
                                {msg.generatedBrief.timeline}
                              </span>
                            </div>
                          </div>

                          <div className="pt-1">
                            <span className="text-[10px] text-zinc-500 block uppercase mb-1">
                              Deliverables
                            </span>
                            <ul className="space-y-1">
                              {msg.generatedBrief.deliverables.map((d, idx) => (<li key={idx} className="flex items-start gap-1.5 text-xs text-zinc-700">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"/>
                                  <span>{d}</span>
                                </li>))}
                            </ul>
                          </div>
                        </div>

                        {/* Brief Actions */}
                        <div className="pt-2.5 border-t border-zinc-200 flex flex-wrap gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleCopyBrief(msg.generatedBrief)} leftIcon={<Copy className="w-3.5 h-3.5"/>} className="text-xs">
                            Copy Brief
                          </Button>
                          <Link href="/explore">
                            <Button variant="outline" size="sm" className="text-xs">
                              Explore Matched
                            </Button>
                          </Link>
                        </div>
                      </div>)}

                    {/* Recommended Matched Studios */}
                    {msg.recommendedHouseIds && msg.recommendedHouseIds.length > 0 && (<div className="space-y-2 pt-1 text-left">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600"/>
                          <span>Matched Studios:</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.recommendedHouseIds.map((id) => {
                        const house = productionHouses.find((h) => h.id === id);
                        if (!house)
                            return null;
                        return (<div key={house.id} className="p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-2 flex flex-col justify-between">
                                <div className="flex items-center gap-2.5">
                                  <img src={house.logoUrl} alt={house.name} className="w-9 h-9 rounded-lg object-cover border border-zinc-200 bg-white shrink-0"/>
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-zinc-900 truncate">
                                      {house.name}
                                    </h4>
                                    <p className="text-[11px] text-zinc-500 truncate">
                                      {house.location} • {house.rating} ★
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-1.5 pt-1">
                                  <Link href={`/production-houses/${house.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full text-xs py-1">
                                      Profile
                                    </Button>
                                  </Link>
                                  <Button variant="primary" size="sm" className="flex-1 text-xs py-1" onClick={() => setEnquiryModalHouse(house)}>
                                    Send Brief
                                  </Button>
                                </div>
                              </div>);
                    })}
                        </div>
                      </div>)}

                    <span className="text-[10px] text-zinc-400 block px-0.5">
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAssistant && (<div className="w-7 h-7 rounded-lg bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                      <User className="w-3.5 h-3.5"/>
                    </div>)}
                </div>);
        })}

            {/* Typing Indicator */}
            {isTyping && (<div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 border border-yellow-300 text-amber-800 flex items-center justify-center text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700"/>
                </div>
                <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce"/>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce [animation-delay:0.2s]"/>
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce [animation-delay:0.4s]"/>
                </div>
              </div>)}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input Bar */}
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
        }} className="flex items-center gap-2 pt-3 border-t border-zinc-100">
            <input type="text" placeholder="Type campaign scope, budget, or specifications..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="flex-1 bg-zinc-50 text-xs text-zinc-900 placeholder-zinc-400 px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-yellow-500 focus:bg-white outline-none transition-all"/>
            <Button type="submit" variant="primary" size="sm" disabled={!inputValue.trim()} className="h-9 px-4 rounded-xl text-xs">
              <Send className="w-3.5 h-3.5"/>
            </Button>
          </form>
        </div>
      </div>

      {/* Enquiry Modal */}
      <SendEnquiryModal isOpen={Boolean(enquiryModalHouse)} onClose={() => setEnquiryModalHouse(null)} productionHouse={enquiryModalHouse} initialTitle={briefState.title} initialCategory={briefState.category} initialBudget={briefState.budgetRange} initialDescription={briefState.objective}/>
    </div>);
}
