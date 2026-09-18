import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ImpactMetrics } from './components/ImpactMetrics';
import { ScrollModules } from './components/ScrollModules';
import { UserRolesSection } from './components/UserRolesSection';
import { BentoGrid } from './components/BentoGrid';
import { CaseStudy } from './components/CaseStudy';
import { AiFutureSection } from './components/AiFutureSection';
import { AiRoadmapSection } from './components/AiRoadmapSection';
import { PricingPhilosophySection } from './components/PricingPhilosophySection';
import { MissionSection } from './components/MissionSection';
import { DownloadAppSection } from './components/DownloadAppSection';
import { CtaFooter } from './components/CtaFooter';
import { CustomCursor } from './components/CustomCursor';
import { DemoModal } from './components/DemoModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { AdminLeadsDashboard } from './components/AdminLeadsDashboard';

export default function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [leadsDashboardOpen, setLeadsDashboardOpen] = useState(false);

  // Auto-open Admin Dashboard if URL is on sub-path /admin, /dashboard, /cpanel or query params
  useEffect(() => {
    try {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const host = window.location.hostname.toLowerCase();
      const search = window.location.search.toLowerCase();

      const isAdminRoute =
        pathname.includes('/admin') ||
        pathname.includes('/dashboard') ||
        pathname.includes('/cpanel') ||
        pathname.includes('/leads') ||
        hash.includes('admin') ||
        hash.includes('dashboard') ||
        hash.includes('cpanel') ||
        host.startsWith('admin.') ||
        host.startsWith('cpanel.') ||
        host.startsWith('dashboard.') ||
        search.includes('admin') ||
        search.includes('action=reset-password') ||
        search.includes('action=admin-login') ||
        search.includes('reset-password');

      if (isAdminRoute) {
        setLeadsDashboardOpen(true);
      }
    } catch (e) {
      console.error('Error parsing URL query in App.tsx:', e);
    }
  }, []);

  const handleOpenAdmin = () => {
    setLeadsDashboardOpen(true);
    try {
      if (!window.location.pathname.includes('/admin')) {
        window.history.pushState({ page: 'admin' }, '', '/admin');
      }
    } catch (e) {}
  };

  const handleCloseAdmin = () => {
    setLeadsDashboardOpen(false);
    try {
      if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
        window.history.pushState({ page: 'home' }, '', '/');
      }
    } catch (e) {}
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-400 selection:text-slate-950">
      {/* Custom Mouse Follower */}
      <CustomCursor />

      {/* Top Navbar */}
      <Navbar
        onOpenDemoModal={() => setDemoModalOpen(true)}
        onOpenLeadsDashboard={handleOpenAdmin}
      />

      {/* Main Content Sections */}
      <main>
        {/* Section 1: Hero with Three.js 3D Globe & GSAP Kinetic Text */}
        <HeroSection onOpenDemoModal={() => setDemoModalOpen(true)} />

        {/* Section 2: Impact Metrics Counter */}
        <ImpactMetrics />

        {/* Section 3: Scroll-Driven Pinned ERP Modules Showcase */}
        <ScrollModules />

        {/* Section 4: Target Audience / User Roles */}
        <UserRolesSection />

        {/* Section 5: Core Features Bento Grid */}
        <BentoGrid />

        {/* Section 6: Proven Success Case Study */}
        <CaseStudy />

        {/* Section 7: AI Future Transition Section */}
        <AiFutureSection />

        {/* Section 8: AI Implementation Roadmap */}
        <AiRoadmapSection />

        {/* Section 9: Pricing Philosophy */}
        <PricingPhilosophySection />

        {/* Section 10: Mission */}
        <MissionSection />

        {/* Section 11: Download Mobile App */}
        <DownloadAppSection />

        {/* Section 12: Call to Action & Footer */}
        <CtaFooter
          onOpenDemoModal={() => setDemoModalOpen(true)}
          onOpenLeadsDashboard={handleOpenAdmin}
        />
      </main>

      {/* Interactive Demo Popup Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />

      {/* Back-End Leads CRM Dashboard Modal */}
      <AdminLeadsDashboard
        isOpen={leadsDashboardOpen}
        onClose={handleCloseAdmin}
      />

      {/* Floating WhatsApp Chat Widget */}
      <WhatsAppWidget />
    </div>
  );
}
