'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/Button';
import { Sparkles, Menu, X, Building2, UserCircle2, LogOut, LogIn } from 'lucide-react';
export const Navbar = () => {
    const pathname = usePathname();
    const { role, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navLinks = [
        { label: 'Home', shortLabel: 'Home', href: '/' },
        { label: 'Explore Studios', shortLabel: 'Explore', href: '/explore' },
        { label: 'AI Assistant', shortLabel: 'AI Assistant', href: '/ai-assistant' },
    ];
    return (<header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo on the Left */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-yellow-300 border border-yellow-400/90 flex items-center justify-center text-zinc-950 shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <span className="font-black text-lg sm:text-xl tracking-tighter">ad</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 font-sans leading-tight">
                adhoc<span className="text-amber-500">.</span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-zinc-500 leading-none mt-0.5">
                Production Marketplace
              </span>
            </div>
          </Link>

          {/* All Other Items on the Right (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-5">
            {/* Navigation Links */}
            <nav className="flex items-center gap-0.5 lg:gap-1.5">
              {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (<Link key={link.href} href={link.href} className={`px-2.5 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${isActive
                    ? 'text-zinc-900 bg-yellow-100/60 font-semibold border border-yellow-300/60'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'} ${link.highlight ? 'text-amber-800 font-semibold' : ''}`}>
                    {link.highlight && <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0"/>}
                    {link.shortLabel ? (<>
                        <span className="hidden xl:inline">{link.label}</span>
                        <span className="xl:hidden">{link.shortLabel}</span>
                      </>) : (<span>{link.label}</span>)}
                  </Link>);
        })}
            </nav>

            {/* Subtle Divider */}
            <div className="h-5 w-px bg-zinc-200 shrink-0"/>

            {/* Action Area */}
            <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
              {isAuthenticated ? (<div className="flex items-center gap-2">
                  <Link href={role === 'production_house'
                ? '/dashboard/production-house'
                : '/dashboard/customer'}>
                    <Button variant="secondary" size="sm" className="gap-1.5 lg:gap-2 whitespace-nowrap">
                      {role === 'production_house' ? (<>
                          <Building2 className="w-4 h-4 text-amber-600"/>
                          <span className="hidden lg:inline">Studio Dashboard</span>
                          <span className="lg:hidden">Studio</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full font-bold">
                            85%
                          </span>
                        </>) : (<>
                          <UserCircle2 className="w-4 h-4 text-amber-600"/>
                          <span className="hidden lg:inline">Business Dashboard</span>
                          <span className="lg:hidden">Dashboard</span>
                        </>)}
                    </Button>
                  </Link>

                  <button onClick={logout} className="p-1.5 lg:p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer" title="Logout">
                    <LogOut className="w-4 h-4"/>
                  </button>
                </div>) : (<Link href="/login">
                  <Button variant="primary" size="sm" leftIcon={<LogIn className="w-3.5 h-3.5"/>} className="whitespace-nowrap font-bold">
                    Login
                  </Button>
                </Link>)}
            </div>
          </div>

          {/* Mobile Actions: Login shortcut + Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {!isAuthenticated && (<Link href="/login">
                <Button variant="primary" size="sm" className="text-xs px-3 py-1.5 font-bold" leftIcon={<LogIn className="w-3.5 h-3.5"/>}>
                  Login
                </Button>
              </Link>)}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer" aria-label="Toggle navigation">
              {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (<div className="md:hidden border-t border-zinc-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (<Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${isActive
                        ? 'text-zinc-900 bg-yellow-100/70 font-semibold border border-yellow-300/70'
                        : 'text-zinc-700 hover:bg-yellow-50 hover:text-amber-900'}`}>
                  <span>{link.label}</span>
                  {link.highlight && <Sparkles className="w-4 h-4 text-amber-600"/>}
                </Link>);
            })}
          </nav>

          <div className="pt-3 border-t border-zinc-200 flex flex-col gap-2.5">
            {isAuthenticated ? (<>
                <Link href={role === 'production_house'
                    ? '/dashboard/production-house'
                    : '/dashboard/customer'} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Open {role === 'production_house' ? 'Studio' : 'Business'} Dashboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={logout} className="w-full justify-center">
                  Sign Out
                </Button>
              </>) : (<Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-center font-bold" leftIcon={<LogIn className="w-4 h-4"/>}>
                  Login
                </Button>
              </Link>)}
          </div>
        </div>)}
    </header>);
};
