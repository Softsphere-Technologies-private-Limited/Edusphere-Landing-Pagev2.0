import React, { useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  Scale,
  Building2,
  Users,
  Lock,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  CreditCard,
  Ban,
  Cpu,
} from 'lucide-react';

interface LegalPageProps {
  onNavigateHome: () => void;
  onOpenDemoModal?: () => void;
}

export const TermsOfServicePage: React.FC<LegalPageProps> = ({ onNavigateHome, onOpenDemoModal }) => {
  useEffect(() => {
    // Dynamic SEO Title & Meta Description update
    document.title = 'Terms of Service | EduSphere';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Read the Terms of Service governing access to and use of the EduSphere smart school platform, website, applications, and related services.'
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const tableOfContents = [
    { id: 'acceptance-of-terms', title: '1. Acceptance of Terms' },
    { id: 'about-edusphere', title: '2. About EduSphere' },
    { id: 'eligibility-and-authorized-use', title: '3. Eligibility & Authorized Use' },
    { id: 'account-registration', title: '4. Account Registration' },
    { id: 'use-of-the-platform', title: '5. Use of the Platform' },
    { id: 'school-and-educational-data', title: '6. School & Educational Data' },
    { id: 'subscription-and-fees', title: '7. Subscription & Fees' },
    { id: 'intellectual-property', title: '8. Intellectual Property' },
    { id: 'user-content', title: '9. User Content' },
    { id: 'third-party-services', title: '10. Third-Party Services' },
    { id: 'availability-and-changes', title: '11. Availability & Changes' },
    { id: 'support', title: '12. Support' },
    { id: 'suspension-or-termination', title: '13. Suspension or Termination' },
    { id: 'disclaimers', title: '14. Disclaimers' },
    { id: 'limitation-of-liability', title: '15. Limitation of Liability' },
    { id: 'indemnification', title: '16. Indemnification' },
    { id: 'governing-law', title: '17. Governing Law & Jurisdiction' },
    { id: 'changes-to-terms', title: '18. Changes to Terms' },
    { id: 'contact-information', title: '19. Contact Information' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pt-28 pb-20 relative bg-[#06151B] min-h-screen text-slate-200">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-emerald-400" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Last Updated: September 2026
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="mb-14 text-left border-b border-slate-800/80 pb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code uppercase tracking-[0.2em] text-emerald-400 mb-4">
            <Scale className="w-3.5 h-3.5" />
            Terms & Conditions
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-[1.15] mb-4">
            Terms of Service
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl font-normal leading-relaxed">
            These Terms of Service govern your access to and use of the <strong>EduSphere</strong> website, platform, applications, and related services.
          </p>
        </div>

        {/* Layout with Table of Contents + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl max-h-[80vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Table of Contents
            </h3>
            <nav className="space-y-1 text-xs">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 transition truncate cursor-pointer"
                >
                  {item.title}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-5 border-t border-slate-800 text-[11px] text-slate-400">
              Need assistance? Email{' '}
              <a
                href="mailto:support@eduspherebharat.com"
                className="text-emerald-400 hover:underline font-semibold"
              >
                support@eduspherebharat.com
              </a>
            </div>
          </aside>

          {/* Main Legal Content */}
          <div className="lg:col-span-8 space-y-12 leading-relaxed text-slate-300 text-sm sm:text-base">

            {/* Section 1: Acceptance of Terms */}
            <section id="acceptance-of-terms" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">1.</span>
                Acceptance of Terms
              </h2>
              <p>
                By accessing or using the EduSphere website, web application, mobile applications, or institutional ERP modules (collectively, the <strong>"Services"</strong>), you agree to be bound by these Terms of Service (<strong>"Terms"</strong>). If you are entering into these Terms on behalf of a school, educational trust, society, or corporate entity, you represent that you possess the requisite authority to bind such entity.
              </p>
              <p className="text-xs text-slate-400">
                If you do not agree with any part of these Terms, you must refrain from accessing or utilizing our Services.
              </p>
            </section>

            {/* Section 2: About EduSphere */}
            <section id="about-edusphere" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">2.</span>
                About EduSphere
              </h2>
              <p>
                <strong>EduSphere</strong> (<em>Bharat's Next Generation Smart School Platform</em>) is an integrated cloud-based educational technology and institutional management solution designed to streamline school administration, attendance, academic planning, parent communication, and digital operations for schools and educators across India.
              </p>
            </section>

            {/* Section 3: Eligibility and Authorized Use */}
            <section id="eligibility-and-authorized-use" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">3.</span>
                Eligibility & Authorized Use
              </h2>
              <p>
                Access to EduSphere is provided to authorized representatives of educational institutions, teachers, administrative staff, students, and parents under authorized school licenses. Users must ensure that account access is strictly restricted to designated individuals.
              </p>
            </section>

            {/* Section 4: Account Registration */}
            <section id="account-registration" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">4.</span>
                Account Registration & Credentials
              </h2>
              <p>To use our platform, institutions and designated users must maintain active accounts. You agree to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-400 pl-2">
                <li>Provide accurate, current, and complete registration information</li>
                <li>Maintain the security and confidentiality of login credentials and passwords</li>
                <li>Promptly notify EduSphere upon discovering any unauthorized account access</li>
                <li>Remain responsible for all activities and transactions performed under your login</li>
              </ul>
            </section>

            {/* Section 5: Use of the Platform */}
            <section id="use-of-the-platform" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">5.</span>
                Use of the Platform (Permitted & Prohibited Activities)
              </h2>
              <p>
                You agree to use EduSphere solely for legitimate educational, academic, and school administrative functions. You are strictly prohibited from engaging in:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Unlawful, fraudulent, or unauthorized activities',
                  'Attempting to breach security or access controls',
                  'Reverse engineering or decompiling platform code',
                  'Introducing malware, viruses, or destructive scripts',
                  'Automated scraping, crawling, or data extraction',
                  'Impersonating other users or sharing administrative accounts',
                  'Uploading infringing, defamatory, or unlawful content',
                  'Violating intellectual property or third-party privacy rights',
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-red-950/10 border border-red-900/30 flex items-start gap-2 text-xs sm:text-sm">
                    <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: School and Educational Data */}
            <section id="school-and-educational-data" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">6.</span>
                School & Educational Data
              </h2>
              <p>
                Participating schools and educational institutions retain full authority and ownership of the educational records they upload into EduSphere. Subscribing institutions are solely responsible for:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-400 pl-2">
                <li>The accuracy, integrity, and legality of student, parent, and staff data uploaded</li>
                <li>Obtaining all necessary consents, permissions, or notices required under applicable Indian laws</li>
                <li>Ensuring appropriate administrative use of student and parent contact details</li>
                <li>Promptly archiving or modifying records upon student or staff departure</li>
              </ul>
            </section>

            {/* Section 7: Subscription and Fees */}
            <section id="subscription-and-fees" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">7.</span>
                Subscription & Commercial Terms
              </h2>
              <p>
                EduSphere offers tiered monthly and annual subscription plans based on student enrollment brackets and institutional requirements.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-400 pl-2">
                <li>Commercial terms, student enrollment brackets, billing cycles, and payment schedules are governed by the relevant subscription plan or institutional order form.</li>
                <li>All published subscription rates are exclusive of applicable Goods and Services Tax (GST) unless explicitly noted otherwise.</li>
                <li>Custom enterprise pricing applies to multi-campus networks and institutions with 2,500+ students.</li>
                <li>Subscription renewal terms, adjustments, and billing changes follow the agreed institutional contract.</li>
              </ul>
            </section>

            {/* Section 8: Intellectual Property */}
            <section id="intellectual-property" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">8.</span>
                Intellectual Property
              </h2>
              <p>
                EduSphere, its software architecture, user interface designs, logos, trademarks, database structures, documentation, and underlying code are the exclusive intellectual property of EduSphere and its licensors. Subscribing institutions are granted a non-exclusive, non-transferable, revocable license to access and use the platform solely for authorized institutional operations.
              </p>
            </section>

            {/* Section 9: User Content */}
            <section id="user-content" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">9.</span>
                User Content
              </h2>
              <p>
                Institutions retain ownership of all institutional content, logos, circulars, and data uploaded to the platform. By uploading content, you grant EduSphere a limited, worldwide license to host, store, process, and transmit such content strictly for the purpose of operating and delivering the Services.
              </p>
            </section>

            {/* Section 10: Third-Party Services */}
            <section id="third-party-services" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">10.</span>
                Third-Party Services
              </h2>
              <p>
                EduSphere may integrate with third-party tools (such as communication channels, messaging gateways, or external analytics). Your use of such third-party features is subject to the independent terms and policies of those service providers.
              </p>
            </section>

            {/* Section 11: Availability and Service Changes */}
            <section id="availability-and-changes" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">11.</span>
                Availability & Service Modifications
              </h2>
              <p>
                We strive to provide reliable and high-quality software access. However, EduSphere does not warrant that the Services will be uninterrupted, completely bug-free, or error-free at all times unless otherwise specified in an explicit written Service Level Agreement (SLA). We reserve the right to perform scheduled maintenance, upgrades, and feature updates.
              </p>
            </section>

            {/* Section 12: Support */}
            <section id="support" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">12.</span>
                Customer Support
              </h2>
              <p>
                EduSphere provides standard technical support to assist institutions with setup, onboarding, and ongoing software inquiries. Support may be reached via:
              </p>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm flex flex-col sm:flex-row gap-4">
                <div>
                  <strong className="text-white block">Email Support</strong>
                  <a href="mailto:support@eduspherebharat.com" className="text-emerald-400 hover:underline">
                    support@eduspherebharat.com
                  </a>
                </div>
                <div>
                  <strong className="text-white block">Helpline</strong>
                  <a href="tel:+918742935355" className="text-slate-300 hover:text-white">
                    +91 87429 35355
                  </a>
                </div>
              </div>
            </section>

            {/* Section 13: Suspension or Termination */}
            <section id="suspension-or-termination" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">13.</span>
                Suspension or Termination
              </h2>
              <p>
                EduSphere may temporarily suspend or terminate user accounts or institutional access in cases of material breach of these Terms, unpaid subscription fees, security vulnerabilities, fraudulent activity, or as required by applicable law or judicial orders.
              </p>
            </section>

            {/* Section 14: Disclaimers */}
            <section id="disclaimers" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">14.</span>
                Disclaimers
              </h2>
              <p className="text-sm text-slate-300">
                Except as expressly provided in an institutional agreement, the platform and services are provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied. EduSphere does not guarantee specific academic performance outcomes, admission numbers, examination grades, or revenue results.
              </p>
            </section>

            {/* Section 15: Limitation of Liability */}
            <section id="limitation-of-liability" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">15.</span>
                Limitation of Liability
              </h2>
              <p className="text-sm text-slate-300">
                To the maximum extent permitted by applicable Indian law, EduSphere and its directors, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, loss of business goodwill, or loss of profits arising from or relating to your use of the platform.
              </p>
            </section>

            {/* Section 16: Indemnification */}
            <section id="indemnification" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">16.</span>
                Indemnification
              </h2>
              <p className="text-sm text-slate-300">
                You agree to indemnify and hold harmless EduSphere, its affiliates, and representatives from and against any claims, liabilities, damages, losses, or legal expenses resulting from your misuse of the platform, violation of these Terms, or unauthorized transmission of third-party personal data.
              </p>
            </section>

            {/* Section 17: Governing Law and Jurisdiction */}
            <section id="governing-law" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">17.</span>
                Governing Law & Jurisdiction
              </h2>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-sm">
                <p>
                  These Terms shall be governed by and interpreted in accordance with the applicable laws of India.
                </p>
                <p className="text-slate-400 text-xs">
                  Subject to applicable law, disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Ghaziabad, Uttar Pradesh, India</strong>.
                </p>
              </div>
            </section>

            {/* Section 18: Changes to Terms */}
            <section id="changes-to-terms" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">18.</span>
                Changes to Terms
              </h2>
              <p>
                EduSphere reserves the right to revise these Terms from time to time. When updates are published, the "Last Updated" date will be refreshed. Continued use of our Services following the posting of modifications indicates your acknowledgment and acceptance of the revised Terms.
              </p>
            </section>

            {/* Section 19: Contact Information */}
            <section id="contact-information" className="scroll-mt-32 pt-4">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 mb-2">
                    <span className="text-emerald-400 font-mono text-lg">19.</span>
                    Contact Information
                  </h2>
                  <p className="text-sm text-slate-400">
                    For inquiries, clarifications, or contract matters regarding these Terms of Service:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">EduSphere</strong>
                      <span className="text-slate-400">Ghaziabad, Uttar Pradesh, India</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                    <Mail className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Email</strong>
                      <a href="mailto:support@eduspherebharat.com" className="text-emerald-400 hover:underline">
                        support@eduspherebharat.com
                      </a>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                    <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Phone</strong>
                      <a href="tel:+918742935355" className="text-slate-300 hover:text-white">
                        +91 87429 35355
                      </a>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                    <Globe className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Website</strong>
                      <a href="https://www.eduspherebharat.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white">
                        www.eduspherebharat.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="mailto:support@eduspherebharat.com"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-[1.02] transition-all shadow-lg shadow-emerald-500/20 text-center cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </a>

                  {onOpenDemoModal && (
                    <button
                      onClick={onOpenDemoModal}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer border border-slate-700 hover:border-emerald-400"
                    >
                      Schedule Product Demo
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Legal Advisory Disclaimer Note */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-500 italic text-center leading-relaxed">
              This document is provided for general informational purposes and should be reviewed by qualified legal counsel before being adopted as the company's final legal policy.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
