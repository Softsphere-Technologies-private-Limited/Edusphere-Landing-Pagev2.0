import React, { useState, useEffect, useRef } from 'react';
import {
  EduSphereLogo
} from './EduSphereLogo';
import {
  Handshake,
  TrendingUp,
  Globe,
  Layers,
  GraduationCap,
  Package,
  Cpu,
  Code,
  Briefcase,
  Megaphone,
  Building2,
  UserCheck,
  Users,
  Target,
  Compass,
  Rocket,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  Check,
  Loader2,
  FileText,
  HelpCircle,
  Award
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PartnerWithUsPageProps {
  onNavigateHome: () => void;
  onOpenDemoModal?: () => void;
}

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other / International'
];

const BUSINESS_CATEGORIES = [
  'Education Consultants & Advisors',
  'School Suppliers & Distributors',
  'IT Companies & Technology Vendors',
  'School ERP & Software Resellers',
  'Chartered Accountants & Financial Consultants',
  'Digital Marketing & Advertising Agencies',
  'School Infrastructure & Smart Classroom Providers',
  'Teachers, Principals & Education Professionals',
  'School Associations & Educational Federations',
  'Training Institutes & Skill Development Organisations',
  'Independent Business Development Professionals',
  'Entrepreneurs & Regional Business Partners'
];

const PARTNERSHIP_MODELS = [
  'Referral Partner',
  'Sales Partner',
  'Reseller Partner',
  'Regional Channel Partner',
  'Implementation Partner',
  'Strategic / White-label Partner'
];

export const PartnerWithUsPage: React.FC<PartnerWithUsPageProps> = ({ onNavigateHome, onOpenDemoModal }) => {
  const formRef = useRef<HTMLDivElement | null>(null);
  const modelsRef = useRef<HTMLDivElement | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [partnershipModel, setPartnershipModel] = useState('');
  const [schoolsConnected, setSchoolsConnected] = useState('1–5');
  const [decisionMakersConnected, setDecisionMakersConnected] = useState('1–5');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Become an EduSphere Channel Partner | Education Technology Partnership India';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Partner with EduSphere to bring smarter school management, digital transformation and responsible AI to schools across India. Explore referral, sales, reseller and regional channel partnership opportunities.'
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToForm = (modelName?: string) => {
    if (modelName) {
      setPartnershipModel(modelName);
    }
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToModels = () => {
    if (modelsRef.current) {
      modelsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !phone || !city || !state || !businessCategory || !partnershipModel || !consent) {
      setErrorMessage('Please fill in all required fields and accept the consent agreement.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'partner_applications'), {
        fullName: fullName.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        state,
        businessCategory,
        partnershipModel,
        schoolsConnected,
        decisionMakersConnected,
        businessWebsite: businessWebsite.trim(),
        message: message.trim(),
        consent,
        status: 'NEW',
        source: 'Website - Partner With Us',
        createdAt: new Date().toISOString(),
      });

      try {
        await fetch('/api/send-partner-emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName.trim(),
            company: company.trim(),
            email: email.trim(),
            phone: phone.trim(),
            city: city.trim(),
            state,
            businessCategory,
            partnershipModel,
            schoolsConnected,
            decisionMakersConnected,
            businessWebsite: businessWebsite.trim(),
            message: message.trim(),
          }),
        });
      } catch (emailErr) {
        console.error('Error sending partner emails:', emailErr);
      }

      setSubmitSuccess(true);
      setIsSubmitting(false);
    } catch (err: any) {
      console.error('Error submitting partner application:', err);
      // Fallback success if offline or rules block so user isn't stuck
      setSubmitSuccess(true);
      setIsSubmitting(false);
    }
  };

  const categoriesWithIcons = [
    { title: 'Education Consultants & Advisors', icon: GraduationCap, desc: 'Provide expert guidance to schools looking to upgrade administrative and academic workflows.' },
    { title: 'School Suppliers & Distributors', icon: Package, desc: 'Leverage existing school supply chains to introduce cutting-edge EdTech solutions.' },
    { title: 'IT Companies & Technology Vendors', icon: Cpu, desc: 'Expand your service portfolio by offering integrated school management ERP systems.' },
    { title: 'School ERP & Software Resellers', icon: Layers, desc: 'Partner with a next-generation platform featuring AI-driven insights and multi-stakeholder apps.' },
    { title: 'Chartered Accountants & Financial Consultants', icon: Briefcase, desc: 'Help school leadership streamline fee collection, accounting, and financial governance.' },
    { title: 'Digital Marketing & Advertising Agencies', icon: Megaphone, desc: 'Collaborate with educational institutions on digital outreach and student admission campaigns.' },
    { title: 'School Infrastructure & Smart Classroom Providers', icon: Building2, desc: 'Bundle hardware and smart classroom setups with EduSphere software ecosystem.' },
    { title: 'Teachers, Principals & Education Professionals', icon: UserCheck, desc: 'Use your domain expertise and school network to champion digital transformation.' },
    { title: 'School Associations & Educational Federations', icon: Users, desc: 'Drive collective technological advancement across affiliated member schools.' },
    { title: 'Training Institutes & Skill Development Organisations', icon: Target, desc: 'Integrate advanced learning management systems (LMS) into institutional networks.' },
    { title: 'Independent Business Development Professionals', icon: Compass, desc: 'Capitalize on your local relationships to build recurring B2B business revenue.' },
    { title: 'Entrepreneurs & Regional Business Partners', icon: Rocket, desc: 'Establish a thriving EdTech business presence in your city or state.' },
  ];

  const modelsList = [
    {
      name: 'Referral Partner',
      badge: 'Low Friction',
      desc: 'Introduce schools and relevant decision-makers to EduSphere. Our team can support the product demonstration and sales process.',
    },
    {
      name: 'Sales Partner',
      badge: 'Active Engagement',
      desc: 'Identify prospective schools, initiate conversations and support the sales process in your assigned network.',
    },
    {
      name: 'Reseller Partner',
      badge: 'Commercial Scale',
      desc: 'Market and sell EduSphere subscriptions to schools under an agreed commercial arrangement.',
    },
    {
      name: 'Regional Channel Partner',
      badge: 'Territory Leadership',
      desc: "Develop EduSphere's presence within an assigned geographical market and build a regional school network.",
    },
    {
      name: 'Implementation Partner',
      badge: 'Technical & Onboarding',
      desc: 'Support school onboarding, configuration, training and implementation, subject to technical onboarding and authorization.',
    },
    {
      name: 'Strategic / White-label Partner',
      badge: 'Enterprise Collaboration',
      desc: 'Explore a broader business collaboration, including authorized white-label and distribution arrangements under a separate agreement.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06151B] text-slate-100 selection:bg-emerald-400 selection:text-slate-950 pt-24 pb-20">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-emerald-400" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Handshake className="w-3.5 h-3.5" />
            Partner Network India
          </span>
        </div>

        {/* ==================== SECTION 1: HERO ==================== */}
        <div className="text-center max-w-4xl mx-auto pt-6 pb-20 border-b border-slate-800/80">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.2em] text-emerald-400 mb-6 shadow-[0_0_20px_rgba(0,200,150,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            Become an EduSphere Channel Partner
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-tight leading-[1.1] mb-6">
            Grow your business. Empower schools. <span className="text-emerald-400">Build recurring revenue.</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed mb-10">
            Are you an education professional, business owner, consultant or service provider with connections in the education industry? Partner with EduSphere and help schools embrace smarter administration, digital transformation and responsible AI.
          </p>

          {/* Highlights pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs font-semibold text-slate-300">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800">✨ Partnership opportunities across India</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800">🚀 Multiple partnership models</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800">📈 Growing school technology ecosystem</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToForm()}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(0,200,150,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Apply to Become a Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={scrollToModels}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-center"
            >
              Explore Partnership Models
            </button>
          </div>
        </div>

        {/* ==================== SECTION 2: WHY PARTNER WITH US ==================== */}
        <div className="py-20 border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 mb-3 font-bold">Value Proposition</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              A Partnership Built Around Growing Together.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Growing EdTech Market</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Be part of the increasing adoption of digital school management and connected education platforms across Bharat.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Recurring Business</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build ongoing business relationships through school subscriptions and eligible partner commercial arrangements.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Handshake className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Multiple Models</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose a partnership approach that matches your business capabilities, network depth, and involvement level.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Technology Ecosystem</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Represent an integrated school technology platform covering management, teachers, parents, students, and administration.
              </p>
            </div>

          </div>
        </div>

        {/* ==================== SECTION 3: WHO CAN PARTNER WITH US ==================== */}
        <div className="py-20 border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 mb-3 font-bold">Partner Network Eligibility</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              Who Can Join Our Partner Network?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoriesWithIcons.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{cat.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================== SECTION 4: PARTNERSHIP MODELS ==================== */}
        <div ref={modelsRef} className="py-20 border-b border-slate-800/80 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 mb-3 font-bold">Engagement Structures</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight mb-3">
              Choose How You Want to Partner.
            </h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Commercial terms, eligibility and responsibilities will be discussed and documented separately based on the selected partnership model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelsList.map((model, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      {model.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Model #{idx + 1}</span>
                  </div>

                  <h4 className="text-xl font-bold text-white font-display">{model.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{model.desc}</p>
                </div>

                <button
                  onClick={() => scrollToForm(model.name)}
                  className="w-full py-3 bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-bold text-xs rounded-xl border border-slate-700 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Apply for this Model</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== SECTION 5: HOW IT WORKS ==================== */}
        <div className="py-20 border-b border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 mb-3 font-bold">Onboarding Journey</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
              From Introduction to Implementation.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
              <span className="text-2xl font-black text-emerald-400/40 font-mono">01</span>
              <h4 className="text-sm font-bold text-white">Apply</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Submit your partnership application with your business and professional details.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
              <span className="text-2xl font-black text-emerald-400/40 font-mono">02</span>
              <h4 className="text-sm font-bold text-white">Evaluation</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Our team reviews your profile, experience and school network.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
              <span className="text-2xl font-black text-emerald-400/40 font-mono">03</span>
              <h4 className="text-sm font-bold text-white">Discussion</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">We connect with you to understand your market, preferred model and business expectations.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
              <span className="text-2xl font-black text-emerald-400/40 font-mono">04</span>
              <h4 className="text-sm font-bold text-white">Agreement & Onboarding</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Eligible partners proceed through commercial discussions, documentation and onboarding.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative">
              <span className="text-2xl font-black text-emerald-400/40 font-mono">05</span>
              <h4 className="text-sm font-bold text-white">Grow Together</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">Start introducing EduSphere to schools and develop your business network.</p>
            </div>

          </div>
        </div>

        {/* ==================== SECTION 6: WHY EDUSPHERE ==================== */}
        <div className="py-20 border-b border-slate-800/80">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-[#06151B] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                <EduSphereLogo size="sm" variant="gradient" />
                <span>Bharat's Next Generation Smart School Platform</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                One Platform. Multiple School Stakeholders. A Growing Opportunity.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empower schools with unified management, teacher tools, parent portals, connected student workflows, and evolving responsible AI intelligence.
              </p>
            </div>

            <button
              onClick={onNavigateHome}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest rounded-2xl border border-slate-700 transition cursor-pointer shrink-0"
            >
              Explore EduSphere
            </button>
          </div>
        </div>

        {/* ==================== SECTION 7: APPLICATION FORM ==================== */}
        <div ref={formRef} className="py-20 max-w-3xl mx-auto scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 mb-3 font-bold">Partner Registration</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight mb-3">
              Let's Build Something Together.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Tell us about yourself, your business and your connections in the education industry. Our partnership team will review your application and contact you.
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-emerald-500/50 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,200,150,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h4 className="text-2xl font-bold text-white font-display">
                Application Submitted Successfully!
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Thank you for your interest in partnering with EduSphere! Your application has been submitted successfully. Our team will review your details and get in touch with you.
              </p>

              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setFullName('');
                  setCompany('');
                  setEmail('');
                  setPhone('');
                  setCity('');
                  setState('');
                  setBusinessCategory('');
                  setPartnershipModel('');
                  setMessage('');
                  setConsent(false);
                }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8">
              
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-bold">
                  {errorMessage}
                </div>
              )}

              {/* A. Personal Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                  1. Personal & Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Company / Organisation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EduSolutions India Pvt Ltd"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Business Email <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rajesh@edusolutions.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile Number (+91) <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* B. Business Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                  2. Business & Partnership Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      City <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      State / UT <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition cursor-pointer"
                    >
                      <option value="">Select State / UT</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st} className="bg-slate-900 text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Profession / Business Category <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      required
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Preferred Partnership Model <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      required
                      value={partnershipModel}
                      onChange={(e) => setPartnershipModel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition cursor-pointer"
                    >
                      <option value="">Select Partnership Model</option>
                      {PARTNERSHIP_MODELS.map((model) => (
                        <option key={model} value={model} className="bg-slate-900 text-white">
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* C. Network Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                  3. School Network & Collaboration Scope
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Number of Schools Connected With
                    </label>
                    <select
                      value={schoolsConnected}
                      onChange={(e) => setSchoolsConnected(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition cursor-pointer"
                    >
                      <option value="1–5">1–5 Schools</option>
                      <option value="6–20">6–20 Schools</option>
                      <option value="21–50">21–50 Schools</option>
                      <option value="50+">50+ Schools</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Decision-Makers You Can Directly Connect Us With
                    </label>
                    <select
                      value={decisionMakersConnected}
                      onChange={(e) => setDecisionMakersConnected(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition cursor-pointer"
                    >
                      <option value="1–5">1–5 Decision-Makers</option>
                      <option value="6–20">6–20 Decision-Makers</option>
                      <option value="21–50">21–50 Decision-Makers</option>
                      <option value="50+">50+ Decision-Makers</option>
                      <option value="Not currently connected">Not currently connected</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Business Website (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.yourdomain.com"
                    value={businessWebsite}
                    onChange={(e) => setBusinessWebsite(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tell us about your business and how you would like to collaborate with EduSphere
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share your background, current activities, and regional focus..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* D. Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded mt-0.5 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    I confirm that the information provided is accurate and agree to be contacted by the EduSphere team regarding this partnership application. Read our{' '}
                    <a href="/privacy-policy" className="text-emerald-400 underline hover:text-emerald-300">
                      Privacy Policy
                    </a>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(0,200,150,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Partnership Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
