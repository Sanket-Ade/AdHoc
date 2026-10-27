'use client';
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
export const Footer = () => {
    return (<footer className="bg-white border-t border-zinc-200 pt-12 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Column */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-yellow-300 border border-yellow-400 flex items-center justify-center text-zinc-950 font-black text-base">
                ad
              </div>
              <span className="text-xl font-black text-zinc-900 tracking-tight">
                adhoc<span className="text-amber-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-600 max-w-sm leading-relaxed">
              Verified commercial advertising production directory for brand teams and agencies.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600"/>
                100% Verified Studios
              </span>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-3.5">
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-600">
              <li>
                <Link href="/explore?category=Video+Production" className="hover:text-zinc-900 transition-colors">
                  Commercial Film & Video Production
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Digital+Advertisement" className="hover:text-zinc-900 transition-colors">
                  Digital Advertisement & Motion
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-3.5">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-600">
              <li>
                <Link href="/explore" className="hover:text-zinc-900 transition-colors">
                  Studio Directory
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-zinc-900 transition-colors flex items-center gap-1.5">
                  <span>AI Brief Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600"/>
                </Link>
              </li>
              <li>
                <Link href="/signup?role=production_house" className="hover:text-amber-900 transition-colors font-semibold text-amber-800">
                  List Your Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer" className="hover:text-zinc-900 transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/production-house" className="hover:text-zinc-900 transition-colors">
                  Studio Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-3.5">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-600">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0"/>
                <span>support@adhoc.creative</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0"/>
                <span>+91 22 8900 1234</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
                <span>Bandra West, Mumbai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500">
          <p>© 2026 Adhoc Marketplace Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">GST & Invoicing</a>
          </div>
        </div>
      </div>
    </footer>);
};
