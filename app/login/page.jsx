'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, Building2, Briefcase, UserCircle2, ArrowRight, ShieldCheck, Sparkles, MapPin, Eye, EyeOff, Check, CheckCircle2 } from 'lucide-react';
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
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(
        searchParams.get('registered') === 'true'
            ? 'Account created successfully! Please sign in with your credentials to continue.'
            : ''
    );
    const [isLoading, setIsLoading] = useState(false);
    const { login, signup } = useAuth();
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
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter (A-Z).');
            return;
        }
        if (!/[^A-Za-z0-9\s]/.test(password)) {
            setError('Password must contain at least one special symbol (e.g. !@#$%^&*).');
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
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter (A-Z).');
            return;
        }
        if (!/[^A-Za-z0-9\s]/.test(password)) {
            setError('Password must contain at least one special symbol (e.g. !@#$%^&*).');
            return;
        }
        if (!agreeTerms) {
            setError('You must accept the terms to continue.');
            return;
        }
        setIsLoading(true);
        try {
            await signup(email, name, role, companyName, location);
            setPassword('');
            setShowPassword(false);
            setSuccessMessage(`Account created successfully! Please log in as ${role === 'customer' ? 'Business' : 'Production House'} to continue.`);
            setMode('login');
            router.push(`/login?role=${role}&registered=true`);
        }
        catch {
            setError('Failed to create account. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (
      <div
        className="relative min-h-screen py-10 sm:py-16 flex items-center justify-center px-4 bg-cover  bg-center bg-no-repeat text-zinc-900 overflow-x-hidden"
        style={{ backgroundImage: "url('/login-bg.png')",
          backgroundPosition: "900px -200px"
         }}
      >
        {/* Subtle dark backdrop overlay to ensure crisp contrast and readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </h1>
            <p className="text-xs text-zinc-200 max-w-xs mx-auto drop-shadow-xs font-medium">
              {mode === 'login'
              ? `Sign in to your ${role === 'customer' ? 'Business' : 'Production House'} account`
              : `Join as a ${role === 'customer' ? 'Business to commission work' : 'Production House to receive briefs'}`}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/60 shadow-2xl space-y-5 animate-in fade-in duration-200">
          
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
              <button type="button" onClick={() => { setRole('customer'); setError(''); setSuccessMessage(''); }} className={`py-2.5 px-3 text-xs font-semibold rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${role === 'customer'
            ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80 font-bold'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'}`}>
                <div className="flex items-center gap-1.5">
                  <Briefcase className={`w-4 h-4 ${role === 'customer' ? 'text-amber-600' : 'text-zinc-400'}`}/>
                  <span>Business</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-normal">Brands & Agencies</span>
              </button>

              <button type="button" onClick={() => { setRole('production_house'); setError(''); setSuccessMessage(''); }} className={`py-2.5 px-3 text-xs font-semibold rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${role === 'production_house'
            ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80 font-bold'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'}`}>
                <div className="flex items-center gap-1.5">
                  <Building2 className={`w-4 h-4 ${role === 'production_house' ? 'text-amber-600' : 'text-zinc-400'}`}/>
                  <span>Production House</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-normal">Commercial & Local Indie Studios</span>
              </button>
            </div>
          </div>

          {/* Verification is Optional Notice for Production Houses */}
          {role === 'production_house' && (
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Verification is completely optional</p>
                <p className="text-zinc-600 leading-relaxed">
                  Local production houses and independent creators that are not registered yet can build a full profile, showcase their best work, and win client briefs.
                </p>
              </div>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && mode === 'login' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (<div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>)}

          {/* LOGIN FORM */}
          {mode === 'login' && (<form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <Input label={role === 'customer' ? 'Business Work Email' : 'Production House Work Email'} type="email" required placeholder={role === 'customer' ? 'business@aurorabev.in' : 'contact@studiobombayfilms.in'} value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4"/>}/>

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4"/>}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-zinc-400 hover:text-zinc-700 p-1 -mr-1 rounded-md transition-colors cursor-pointer focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  }
                />
                <div className="flex justify-end mt-1">
                  <Link href="/forgot-password" className="text-[12px] text-amber-800 hover:text-amber-900 hover:underline font-medium">
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

              {role === 'production_house' && (
                <Input label="Studio Base City / Region" placeholder="e.g. Pune, Jaipur, Bandra Mumbai, Bengaluru" value={location} onChange={(e) => setLocation(e.target.value)} leftIcon={<MapPin className="w-4 h-4"/>}/>
              )}

              <Input label={role === 'customer' ? 'Business Email' : 'Production House Email'} type="email" required placeholder={role === 'customer' ? 'vikram@company.com' : 'contact@cinecraft.in'} value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4"/>}/>

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4"/>}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-zinc-400 hover:text-zinc-700 p-1 -mr-1 rounded-md transition-colors cursor-pointer focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  }
                />
                <div className="mt-2 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1 text-[11px]">
                  <span className="text-zinc-500 font-semibold block">Password must contain:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-0.5">
                    <span className={`inline-flex items-center gap-1 font-medium transition-colors ${password.length >= 6 ? 'text-emerald-700' : 'text-zinc-400'}`}>
                      <Check className={`w-3 h-3 ${password.length >= 6 ? 'text-emerald-600' : 'text-zinc-300'}`} />
                      Min 6 characters
                    </span>
                    <span className={`inline-flex items-center gap-1 font-medium transition-colors ${/[A-Z]/.test(password) ? 'text-emerald-700' : 'text-zinc-400'}`}>
                      <Check className={`w-3 h-3 ${/[A-Z]/.test(password) ? 'text-emerald-600' : 'text-zinc-300'}`} />
                      1 Uppercase (A-Z)
                    </span>
                    <span className={`inline-flex items-center gap-1 font-medium transition-colors ${/[^A-Za-z0-9\s]/.test(password) ? 'text-emerald-700' : 'text-zinc-400'}`}>
                      <Check className={`w-3 h-3 ${/[^A-Za-z0-9\s]/.test(password) ? 'text-emerald-600' : 'text-zinc-300'}`} />
                      1 Special symbol
                    </span>
                  </div>
                </div>
              </div>

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
                setSuccessMessage('');
                setShowPassword(false);
                setMode('signup');
            }} className="text-amber-800 hover:text-amber-950 font-bold underline underline-offset-2 transition-colors cursor-pointer ml-1">
                  Sign Up
                </button>
              </p>) : (<p>
                Already have an account?{' '}
                <button type="button" onClick={() => {
                setError('');
                setSuccessMessage('');
                setShowPassword(false);
                setMode('login');
            }} className="text-amber-800 hover:text-amber-950 font-bold underline underline-offset-2 transition-colors cursor-pointer ml-1">
                  Log In
                </button>
              </p>)}
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-300 drop-shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400"/>
          <span>Encrypted production credentials • Zero spam</span>
        </div>
      </div>
    </div>);
}
export default function LoginPage() {
    return (<Suspense fallback={<div className="min-h-screen bg-zinc-950"/>}>
      <AuthForm initialMode="login"/>
    </Suspense>);
}
