import React from 'react';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, XCircle, AlertCircle, ShieldAlert } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
          TRANSPARENCY & INTEGRITY
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-balance">
          Privacy Policy & Architecture
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          VOICE is built on privacy by design. We explain plainly what we collect, what we never collect, and how your safety and identity are protected.
        </p>
      </div>

      {/* Zero-Identity Guarantee Card */}
      <div className="mb-10 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Identity Guarantee</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white leading-snug mb-3">
          Your identity belongs to you.
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          The feedback and anti-bullying reporting system is architected so that neither the SBO Officers nor the Product Developer can look at a submission and trace it back to an individual student.
        </p>
      </div>

      <div className="space-y-8">
        {/* Anti-Bullying Special Protection Details */}
        <section className="bg-rose-50/60 rounded-2xl p-6 sm:p-7 border border-rose-200">
          <div className="flex items-center gap-2.5 mb-3 text-rose-800">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <h3 className="font-bold text-base text-rose-950">
              Anti-Bullying Incident Reports Privacy Protocol
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed mb-3">
            Reports filed through the Safe Haven channel receive immediate priority routing directly to the Guidance Counselor and SBO Student Safety Committee. To ensure no retaliation or exposure:
          </p>
          <ul className="text-xs sm:text-sm text-rose-800 space-y-1.5 pl-1">
            <li>• No tracking of user accounts or school login emails.</li>
            <li>• Bystanders and victims can report without disclosing their identity.</li>
            <li>• Response codes allow students to communicate privately with guidance staff.</li>
          </ul>
        </section>

        {/* Comparison: What we don't ask for vs What is stored */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What we don't ask for */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 text-rose-700">
              <XCircle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-base text-slate-900">What We Don't Ask For</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              We never require, request, or prompt you for any of the following:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Your Name</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Student ID / Number</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Email Address</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Phone Number</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Social Media Account</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Tracking Cookies & Ad Pixels</span>
              </li>
            </ul>
          </div>

          {/* What your feedback contains */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 text-emerald-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">What Your Feedback Contains</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Only the minimal fields necessary to direct and resolve your message:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Feedback ID</strong> (e.g. PV-842911 or SAFE-910482)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Target Recipient</strong> (e.g. SBO, Guidance, Admin)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Feedback Category</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Section</strong>, if you choose to provide it</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Feedback / Incident Details</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong>Lifecycle Status & SBO Responses</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Why section is requested */}
        <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Why is your Section requested?</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Entering your section (e.g. <em>Grade 11 - ICT A</em>) is completely voluntary. It helps the Student Body Organization understand which cohort or cluster is impacted by a given challenge—such as classroom scheduling, facilities maintenance, or grade-level activities.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
            Important: Section information is never linked to class rosters or identity records. Do not type your personal name or student number in the section field.
          </div>
        </section>

        {/* Can SBO see who submitted it? */}
        <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Can the SBO or Principal see who submitted it?</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            <strong>No.</strong> The application is architected so that ordinary feedback submissions are not directly connected to student identities. Officers only see the message, recipient, section, and date.
          </p>

          <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Technical Decoupling Architecture</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Submissions use one-way cryptographic tokens. Response codes (<code className="text-amber-300 font-mono">XXXX-XXXX</code>) are held solely by the student. No server session or user account links the student's device to the database row.
            </p>
          </div>
        </section>

        {/* Real Privacy Limitations & Honesty */}
        <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-800 mb-2">
            <AlertCircle className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Understanding Privacy & Limitations</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            We do not claim that anonymity is mathematically absolute. To protect yourself:
          </p>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-bold">•</span>
              <span><strong>Content Self-Identification:</strong> If you write details that only you could possibly know (e.g. <em>“I sit in seat 4 next to the window in 10-A”</em>), readers might deduce your identity from context.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-bold">•</span>
              <span><strong>Shared Devices:</strong> If you use a shared campus computer lab, remember to close your browser window after copying your Response Code.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-bold">•</span>
              <span><strong>Emergency & Credible Harm:</strong> Threats of violence or illegal conduct will be referred to designated student safety authorities in accordance with school safety rules.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
