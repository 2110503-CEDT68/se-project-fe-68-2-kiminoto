import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background px-6 py-20 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-card-bg border border-border p-8 md:p-12 shadow-sm text-foreground">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3rem] text-muted mb-2">プライバシーポリシー</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <div className="w-10 h-0.5 bg-accent mx-auto mt-4" />
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
            <p className="mb-4">
              Welcome to our Privacy Policy. This document explains how we collect, use, and protect your personal information when you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-muted">
              <li>Personal Identification Information (Name, email address, phone number)</li>
              <li>Usage Data (Information about how you use our application)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 text-muted">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To monitor the usage of our Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border flex justify-center">
            <Link 
              href="/signup" 
              className="px-6 py-3 bg-accent text-white tracking-widest text-sm font-semibold uppercase hover:opacity-90 transition-all duration-200"
            >
              Return to Sign Up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
