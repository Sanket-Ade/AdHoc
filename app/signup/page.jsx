'use client';
import React, { Suspense } from 'react';
import { AuthForm } from '../login/page';
export default function SignUpPage() {
    return (<Suspense fallback={<div className="min-h-screen bg-zinc-950"/>}>
      <AuthForm initialMode="signup"/>
    </Suspense>);
}
