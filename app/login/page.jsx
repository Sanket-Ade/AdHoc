'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, Building2, Briefcase, UserCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
export function AuthForm({ initialMode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Mode: 'login' or 'signup'
    const queryMode = searchParams.get('mode');
    const [mode, setMode] = useState(initialMode || (queryMode === 'signup' ? 'signup' : 'login'));
    // Role: 'customer' (Business) or 'production_house' (Production House)
    const queryRole = searchParams.get('role');
    const [role, setRole] = useState(queryRole === 'production_house' ? 'production_house' : 'customer');
    // Form states
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, signup, loginAsDemo } = useAuth();
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please provide your work email and password.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setIsLoading(true);
        try {
            await login(email, role);
            if (role === 'production_house') {
                router.push('/dashboard/production-house');
            }
            else {
                router.push('/dashboard/customer');
            }
        }
        catch {
            setError('Invalid credentials. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (role === 'production_house' && !companyName) {
            setError('Please provide your Production House / Studio name.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (!agreeTerms) {
            setError('You must accept the terms to continue.');
            return;
        }
        setIsLoading(true);
        try {
            await signup(email, name, role, companyName);
            if (role === 'production_house') {
                router.push('/dashboard/production-house');
            }
            else {
                router.push('/dashboard/customer');
            }
        }
        catch {
            setError('Failed to create account. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDemoLogin = (demoRole) => {
        loginAsDemo(demoRole);
        if (demoRole === 'production_house') {
            router.push('/dashboard/production-house');
        }
        else {
            router.push('/dashboard/customer');
        }
    };
    return (<div className="bg-[#FAFAFA] text-zinc-900 min-h-screen py-10 sm:py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-yellow-300 border border-yellow-400 flex items-center justify-center text-zinc-950 font-black text-base shadow-glow-yellow transition-transform group-hover:scale-105">
              ad
            </div>
            <span className="text-2xl font-black text-zinc-900 tracking-tight font-sans">
              adhoc<span className="text-amber-500">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </h1>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            {mode === 'login'
            ? `Sign in to your ${role === 'customer' ? 'Business' : 'Production House'} account`
            : `Join as a ${role === 'customer' ? 'Business to commission work' : 'Production House to receive briefs'}`}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-soft space-y-5 animate-in fade-in duration-200">
          
          {/* Role Selector Tabs (Business vs Production House) */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Select Account Type
              </span>
              <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                {role === 'customer' ? 'Business' : 'Production House'}
              </span>
            </div>

            <div className="grid grid-cols-2 p-1.5 bg-zinc-100 rounded-xl border border-zinc-200/60 gap-1">
              <button type="button" onClick={() => setRole('customer')} className={`py-2.5 px-3 text-xs font-semibold rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${role === 'customer'
            ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80 font-bold'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'}`}>
                <div className="flex items-center gap-1.5">
                  <Briefcase className={`w-4 h-4 ${role === 'customer' ? 'text-amber-600' : 'text-zinc-400'}`}/>
                  <span>Business</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-normal">Brands & Agencies</span>
              </button>

              <button type="button" onClick={() => setRole('production_house')} className={`py-2.5 px-3 text-xs font-semibold rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${role === 'production_house'
            ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80 font-bold'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'}`}>
                <div className="flex items-center gap-1.5">
                  <Building2 className={`w-4 h-4 ${role === 'production_house' ? 'text-amber-600' : 'text-zinc-400'}`}/>
                  <span>Production House</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-normal">Studios & Creators</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Login Option (Available in login mode for fast review) */}
          {mode === 'login' && (<div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 text-center space-y-2">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-zinc-600">
                <Sparkles className="w-3.5 h-3.5 text-amber-600"/>
                <span>Instant Demo Access</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleDemoLogin('customer')} className="flex-1 py-1.5 px-2 bg-white hover:bg-yellow-50 hover:border-yellow-300 text-zinc-700 text-xs font-semibold rounded-lg border border-zinc-200 shadow-xs transition-colors cursor-pointer">
                  Demo as Business
                </button>
                <button type="button" onClick={() => handleDemoLogin('production_house')} className="flex-1 py-1.5 px-2 bg-white hover:bg-yellow-50 hover:border-yellow-300 text-zinc-700 text-xs font-semibold rounded-lg border border-zinc-200 shadow-xs transition-colors cursor-pointer">
                  Demo as Production House
                </button>
              </div>
            </div>)}

          {/* Error Message */}
          {error && (<div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>)}

          {/* LOGIN FORM */}
          {mode === 'login' && (<form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <Input label={role === 'customer' ? 'Business Work Email' : 'Production House Work Email'} type="email" required placeholder={role === 'customer' ? 'business@aurorabev.in' : 'contact@studiobombayfilms.in'} value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4"/>}/>

              <div>
                <Input label="Password" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock className="w-4 h-4"/>}/>
                <div className="flex justify-end mt-1">
                  <Link href="/forgot-password" className="text-[11px] text-amber-800 hover:text-amber-900 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2 text-xs font-bold" isLoading={isLoading} rightIcon={<ArrowRight className="w-3.5 h-3.5"/>}>
                Log In as {role === 'customer' ? 'Business' : 'Production House'}
              </Button>
            </form>)}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (<form onSubmit={handleSignUpSubmit} className="space-y-3.5 animate-in fade-in duration-200">
              <Input label="Full Name" required placeholder="e.g. Vikram Malhotra" value={name} onChange={(e) => setName(e.target.value)} leftIcon={<UserCircle2 className="w-4 h-4"/>}/>

              <Input label={role === 'production_house'
                ? 'Production House / Studio Name'
                : 'Business or Company Name (Optional)'} required={role === 'production_house'} placeholder={role === 'production_house'
                ? 'e.g. CineCraft Studios'
                : 'e.g. Tata Consumer Products'} value={companyName} onChange={(e) => setCompanyName(e.target.value)} leftIcon={<Building2 className="w-4 h-4"/>}/>

              <Input label={role === 'customer' ? 'Business Email' : 'Production House Email'} type="email" required placeholder={role === 'customer' ? 'vikram@company.com' : 'contact@cinecraft.in'} value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4"/>}/>

              <Input label="Password (min 6 chars)" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock className="w-4 h-4"/>}/>

              <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer pt-1">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="rounded accent-amber-500 cursor-pointer"/>
                <span>I agree to marketplace SLA and production terms</span>
              </label>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2 text-xs font-bold" isLoading={isLoading} rightIcon={<ArrowRight className="w-3.5 h-3.5"/>}>
                Create {role === 'customer' ? 'Business' : 'Production House'} Account
              </Button>
            </form>)}

          {/* Toggle between Login and Signup */}
          <div className="pt-3 border-t border-zinc-100 text-center text-xs text-zinc-600">
            {mode === 'login' ? (<p>
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => {
                setError('');
                setMode('signup');
            }} className="text-amber-800 hover:text-amber-950 font-bold underline underline-offset-2 transition-colors cursor-pointer ml-1">
                  Sign Up
                </button>
              </p>) : (<p>
                Already have an account?{' '}
                <button type="button" onClick={() => {
                setError('');
                setMode('login');
            }} className="text-amber-800 hover:text-amber-950 font-bold underline underline-offset-2 transition-colors cursor-pointer ml-1">
                  Log In
                </button>
              </p>)}
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600"/>
          <span>Encrypted production credentials • Zero spam</span>
        </div>
      </div>
    </div>);
}
export default function LoginPage() {
    return (<Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]"/>}>
      <AuthForm initialMode="login"/>
    </Suspense>);
}
