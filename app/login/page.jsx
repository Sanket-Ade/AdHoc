'use client';
import React, { useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Mail, Lock, Building2, Briefcase, UserCircle2, ArrowRight, ShieldCheck, Sparkles, MapPin, Eye, EyeOff, Check, CheckCircle2, Camera } from 'lucide-react';
export function AuthForm({ initialMode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Mode: 'login' or 'signup'
    const queryMode = searchParams.get('mode');
    const [mode, setMode] = useState(initialMode || (queryMode === 'signup' ? 'signup' : 'login'));
    // Role: 'customer' (Business) or 'production_house' (Production House)
    const queryRole = searchParams.get('role');
    const [role, setRole] = useState(queryRole === 'production_house' ? 'production_house' : 'customer');
    // Category for Production House: 'freelancer' (Freelancer / Individual) or 'business' (Production House Business)
    const queryCategory = searchParams.get('category');
    const [category, setCategory] = useState(queryCategory === 'freelancer' ? 'freelancer' : 'business');
    // Form states
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [profilePic, setProfilePic] = useState('');
    const signupFileInputRef = useRef(null);
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
        setIsLoading(true);
        try {
            await login(email, role, undefined, category, password);
            if (role === 'production_house') {
                router.push('/dashboard/production-house');
            }
            else {
                router.push('/dashboard/customer');
            }
        }
        catch (err) {
            setError(err?.message || 'Invalid email or Password');
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
        if (role === 'production_house' && category === 'business' && !companyName) {
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
            await signup(email, name, role, companyName, location, category, password, profilePic);
            setPassword('');
            setProfilePic('');
            setShowPassword(false);
            const accountTypeLabel = role === 'customer'
                ? 'Business'
                : category === 'freelancer'
                    ? 'Freelancer / Individual'
                    : 'Production House Business';
            setSuccessMessage(`Account created successfully! ${category === 'freelancer' ? 'No documentation required — instant access unlocked. ' : ''}Please log in as ${accountTypeLabel} to continue.`);
            setMode('login');
            router.push(`/login?role=${role}&category=${category}&registered=true`);
        }
        catch {
            setError('Failed to create account. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };

    const fillDemoCredentials = (demoType) => {
        setError('');
        setSuccessMessage('');
        if (demoType === 'customer') {
            setRole('customer');
            setEmail('sarah@aurorabev.in');
            setPassword('Password123!');
        } else if (demoType === 'business') {
            setRole('production_house');
            setCategory('business');
            setEmail('production@studiobombayfilms.in');
            setPassword('Password123!');
        } else if (demoType === 'freelancer') {
            setRole('production_house');
            setCategory('freelancer');
            setEmail('aman.freelance@adhoc.in');
            setPassword('Password123!');
        }
    };
    return (
      <div className="min-h-screen py-12 sm:py-16 flex items-center justify-center px-4 bg-[#FAFAFA] text-zinc-900">
        <div className="w-full max-w-md space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto font-normal">
              {mode === 'login'
                ? role === 'customer'
                  ? 'Access your Business account'
                  : category === 'freelancer'
                    ? 'Access your Freelancer / Individual creator account'
                    : 'Access your Production House Business account'
                : role === 'customer'
                  ? 'Join as a Business to commission commercial work'
                  : category === 'freelancer'
                    ? 'Join as a Freelancer / Individual (No documentation needed)'
                    : 'Join as a Production House Business to receive briefs'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/90 shadow-soft space-y-5 animate-in fade-in duration-200">
          
          {/* Role Selector Tabs (Business vs Production House) */}
          <div className="space-y-3">
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
                  <span className="text-[10px] text-zinc-600 font-normal">Studios & Freelancers</span>
                </button>
              </div>
            </div>

            {/* Production House Category Selector: Freelancer/Individual vs Production House Business */}
            {role === 'production_house' && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Production Category
                  </span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    category === 'freelancer'
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      : 'text-amber-800 bg-amber-50 border-amber-200/60'
                  }`}>
                    {category === 'freelancer' ? 'Freelancer / Individual' : 'Production House Business'}
                  </span>
                </div>

                <div className="grid grid-cols-2 p-1.5 bg-zinc-100 rounded-xl border border-zinc-200/60 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setCategory('freelancer'); setError(''); setSuccessMessage(''); }}
                    className={`py-2 px-2.5 text-xs font-semibold rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      category === 'freelancer'
                        ? 'bg-white text-zinc-950 shadow-sm border border-emerald-300 font-bold'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <UserCircle2 className={`w-4 h-4 ${category === 'freelancer' ? 'text-emerald-600' : 'text-zinc-400'}`} />
                      <span>Freelancer / Individual</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium">No Documentation Required</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCategory('business'); setError(''); setSuccessMessage(''); }}
                    className={`py-2 px-2.5 text-xs font-semibold rounded-lg flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      category === 'business'
                        ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80 font-bold'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Building2 className={`w-4 h-4 ${category === 'business' ? 'text-amber-600' : 'text-zinc-400'}`} />
                      <span>Production House Business</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-normal">GST / Udyam Verified Studio</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notice for Production House Business (Mandatory GST/Udyam verification) */}
          {role === 'production_house' && category === 'business' && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5 animate-in fade-in duration-200">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-rose-900">Document verification is mandatory for Businesses</p>
                <p className="text-rose-700 leading-relaxed text-[11px]">
                  To confirm genuine business credentials, every production house business must verify with a valid GST or Udyam Certificate. Without verification, you cannot send quotes, message clients, or receive bookings.
                </p>
              </div>
            </div>
          )}

          {/* Notice for Freelancer / Individual (NO DOCUMENTATION REQUIRED) */}
          {role === 'production_house' && category === 'freelancer' && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5 animate-in fade-in duration-200">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-emerald-900">Instant Access — No Documentation Required</p>
                <p className="text-emerald-700 leading-relaxed text-[11px]">
                  As a Freelancer or Individual creator, you do not have to go through any documentation or GST/Udyam verification process. Enjoy instant active status to send quotes, receive briefs, and message clients immediately.
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
              <Input
                label={role === 'customer' ? 'Business Work Email' : category === 'freelancer' ? 'Freelancer / Creator Email' : 'Production House Business Email'}
                type="email"
                required
                placeholder={role === 'customer' ? 'business@aurorabev.in' : category === 'freelancer' ? 'aman.freelance@adhoc.in' : 'contact@studiobombayfilms.in'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4"/>}
              />

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
                Log In as {role === 'customer' ? 'Business' : category === 'freelancer' ? 'Freelancer / Individual' : 'Production House Business'}
              </Button>
            </form>)}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (<form onSubmit={handleSignUpSubmit} className="space-y-3.5 animate-in fade-in duration-200">
              <Input label="Full Name" required placeholder="e.g. Vikram Malhotra" value={name} onChange={(e) => setName(e.target.value)} leftIcon={<UserCircle2 className="w-4 h-4"/>}/>

              <Input
                label={role === 'production_house'
                  ? (category === 'freelancer' ? 'Portfolio / Creator Brand Name (Optional)' : 'Production House / Studio Name')
                  : 'Business or Company Name (Optional)'}
                required={role === 'production_house' && category === 'business'}
                placeholder={role === 'production_house'
                  ? (category === 'freelancer' ? 'e.g. Aman Deshmukh Films or leave blank' : 'e.g. CineCraft Studios')
                  : 'e.g. Tata Consumer Products'}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                leftIcon={<Building2 className="w-4 h-4"/>}
              />

              {role === 'production_house' && (
                <Input
                  label={category === 'freelancer' ? 'Your Base City / Location' : 'Studio Base City / Region'}
                  placeholder={category === 'freelancer' ? 'e.g. Bandra Mumbai, Bengaluru, Delhi NCR' : 'e.g. Pune, Jaipur, Bandra Mumbai, Bengaluru'}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4"/>}
                />
              )}

              {role === 'production_house' && (
                <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/80 flex items-center gap-3">
                  <Avatar
                    src={profilePic}
                    name={companyName || name || 'Studio'}
                    className="w-12 h-12 rounded-xl text-lg shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => signupFileInputRef.current?.click()}
                        className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                      >
                        {profilePic ? 'Change Photo' : 'Upload Profile Picture (Optional)'}
                      </button>
                      {profilePic && (
                        <button
                          type="button"
                          onClick={() => setProfilePic('')}
                          className="text-xs text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {profilePic
                        ? 'Profile picture selected'
                        : `Leave empty to use initial "${((companyName || name || 'P').trim().charAt(0) || 'P').toUpperCase()}"`}
                    </p>
                    <input
                      ref={signupFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          setError('Image too large. Please select an image under 5MB.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (typeof ev.target?.result === 'string') {
                            setProfilePic(ev.target.result);
                          }
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              <Input
                label={role === 'customer' ? 'Business Email' : category === 'freelancer' ? 'Freelancer Email' : 'Production House Email'}
                type="email"
                required
                placeholder={role === 'customer' ? 'vikram@company.com' : category === 'freelancer' ? 'aman.films@gmail.com' : 'contact@cinecraft.in'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4"/>}
              />

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
                <span>I agree to marketplace SLA and {category === 'freelancer' ? 'creator terms (no documentation needed)' : 'production terms'}</span>
              </label>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2 text-xs font-bold" isLoading={isLoading} rightIcon={<ArrowRight className="w-3.5 h-3.5"/>}>
                Create {role === 'customer' ? 'Business' : category === 'freelancer' ? 'Freelancer / Individual' : 'Production House Business'} Account
              </Button>
            </form>)}

          {/* Quick Demo Fill Shortcut */}
          <div className="pt-3 border-t border-zinc-100">
            <div className="text-[11px] font-semibold text-zinc-400 mb-1.5 text-center uppercase tracking-wider">
              Quick Test Sign In
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemoCredentials('customer')}
                className="px-2 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium border border-zinc-200/80 transition-colors cursor-pointer text-center truncate"
              >
                Client (Sarah)
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('business')}
                className="px-2 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium border border-zinc-200/80 transition-colors cursor-pointer text-center truncate"
              >
                Studio (Bombay)
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('freelancer')}
                className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold transition-colors cursor-pointer text-center truncate"
                title="Freelancer / Individual - No documentation needed"
              >
                Freelancer (Aman)
              </button>
            </div>
          </div>

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
        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600"/>
          <span>Encrypted authentication • Verified production marketplace</span>
        </div>
      </div>
    </div>);
}
export default function LoginPage() {
    return (<Suspense fallback={<div className="min-h-screen bg-zinc-950"/>}>
      <AuthForm initialMode="login"/>
    </Suspense>);
}
