import React, { useState, useEffect, useCallback } from 'react';
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
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';

type AppRoute = 'home' | 'privacy-policy' | 'terms-of-service';

export default function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [leadsDashboardOpen, setLeadsDashboardOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');

  // Resolve current route from window.location
  const resolveRouteFromLocation = useCallback(() => {
    try {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const host = window.location.hostname.toLowerCase();
      const search = window.location.search.toLowerCase();

      // Check CRM/Admin modal triggers
      const isCrmRoute =
        pathname.includes('/crm') ||
        pathname.includes('/admin') ||
        pathname.includes('/dashboard') ||
        pathname.includes('/cpanel') ||
        pathname.includes('/leads') ||
        pathname.includes('/pipeline') ||
        hash.includes('crm') ||
        hash.includes('admin') ||
        hash.includes('dashboard') ||
        hash.includes('cpanel') ||
        host.startsWith('crm.') ||
        host.startsWith('admin.') ||
        host.startsWith('cpanel.') ||
        host.startsWith('dashboard.') ||
        search.includes('crm') ||
        search.includes('admin') ||
        search.includes('action=reset-password') ||
        search.includes('action=admin-login') ||
        search.includes('reset-password');

      if (isCrmRoute) {
        setLeadsDashboardOpen(true);
      }

      // Check Legal Routes
      if (pathname.includes('/privacy-policy') || pathname === '/privacy') {
        setCurrentRoute('privacy-policy');
      } else if (
        pathname.includes('/terms-of-service') ||
        pathname.includes('/terms') ||
        pathname.includes('/tos')
      ) {
        setCurrentRoute('terms-of-service');
      } else {
        setCurrentRoute('home');
      }
    } catch (e) {
      console.error('Error resolving route in App.tsx:', e);
    }
  }, []);

  useEffect(() => {
    resolveRouteFromLocation();

    const handlePopState = () => {
      resolveRouteFromLocation();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolveRouteFromLocation]);

  const navigate = (path: string) => {
    try {
      if (path === '/privacy-policy') {
        window.history.pushState({ page: 'privacy-policy' }, '', '/privacy-policy');
        setCurrentRoute('privacy-policy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '/terms-of-service') {
        window.history.pushState({ page: 'terms-of-service' }, '', '/terms-of-service');
        setCurrentRoute('terms-of-service');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path.startsWith('/#') || path.startsWith('#')) {
        const targetId = path.replace(/^\/?#/, '');
        if (currentRoute !== 'home') {
          window.history.pushState({ page: 'home' }, '', '/' + (targetId ? '#' + targetId : ''));
          setCurrentRoute('home');
          setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.history.pushState({ page: 'home' }, '', '/');
        setCurrentRoute('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      console.error('Navigation error:', e);
    }
  };

  const handleOpenAdmin = () => {
    setLeadsDashboardOpen(true);
    try {
      if (!window.location.pathname.includes('/crm')) {
        window.history.pushState({ page: 'crm' }, '', '/crm');
      }
    } catch (e) {}
  };

  const handleCloseAdmin = () => {
    setLeadsDashboardOpen(false);
    try {
      if (
        window.location.pathname.includes('/crm') ||
        window.location.pathname.includes('/admin') ||
        window.location.hash.includes('crm') ||
        window.location.hash.includes('admin')
      ) {
        const target = currentRoute === 'home' ? '/' : '/' + currentRoute;
        window.history.pushState({ page: currentRoute }, '', target);
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
        onNavigate={navigate}
        currentPath={currentRoute === 'home' ? '/' : '/' + currentRoute}
      />

      {/* Main Content Sections */}
      <main>
        {currentRoute === 'privacy-policy' ? (
          <PrivacyPolicyPage
            onNavigateHome={() => navigate('/')}
            onOpenDemoModal={() => setDemoModalOpen(true)}
          />
        ) : currentRoute === 'terms-of-service' ? (
          <TermsOfServicePage
            onNavigateHome={() => navigate('/')}
            onOpenDemoModal={() => setDemoModalOpen(true)}
          />
        ) : (
          <>
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

            {/* Section 9: Pricing & Subscriptions */}
            <PricingPhilosophySection onOpenDemoModal={() => setDemoModalOpen(true)} />

            {/* Section 10: Mission */}
            <MissionSection />

            {/* Section 11: Download Mobile App */}
            <DownloadAppSection />
          </>
        )}

        {/* Global Call to Action & Footer */}
        <CtaFooter
          onOpenDemoModal={() => setDemoModalOpen(true)}
          onOpenLeadsDashboard={handleOpenAdmin}
          onNavigate={navigate}
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
