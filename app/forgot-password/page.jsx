'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email)
            return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 500);
    };
    return (<div className="bg-[#FAFAFA] text-zinc-900 min-h-screen py-12 mt-[-60px] sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1.5">
          
          <h1 className="text-2xl font-bold text-zinc-900">Reset Password</h1>
          <p className="text-xs text-zinc-500">
            Enter registered email to receive access instructions.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-soft space-y-5">
          {isSubmitted ? (<div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6"/>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Link Dispatched</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Instructions sent to <strong className="text-zinc-800">{email}</strong>.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>) : (<form onSubmit={handleSubmit} className="space-y-3.5">
              <Input label="Registered Email" type="email" required placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail className="w-4 h-4"/>}/>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2 text-xs" isLoading={isLoading}>
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5"/>
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>)}
        </div>
      </div>
    </div>);
}
