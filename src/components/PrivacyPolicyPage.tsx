import React, { useEffect } from 'react';
import {
  Shield,
  FileText,
  Lock,
  Eye,
  Database,
  Users,
  Server,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Scale,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface LegalPageProps {
  onNavigateHome: () => void;
  onOpenDemoModal?: () => void;
}

export const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ onNavigateHome, onOpenDemoModal }) => {
  useEffect(() => {
    // Dynamic SEO Title & Meta Description update
    document.title = 'Privacy Policy | EduSphere';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        "Read EduSphere's Privacy Policy to understand how we collect, use, protect, and manage information across our smart school platform and website."
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const tableOfContents = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'information-we-collect', title: '2. Information We Collect' },
    { id: 'how-we-use-information', title: '3. How We Use Information' },
    { id: 'cookies-and-tracking', title: '4. Cookies & Tracking' },
    { id: 'how-we-share-information', title: '5. How We Share Information' },
    { id: 'data-security', title: '6. Data Security' },
    { id: 'data-retention', title: '7. Data Retention' },
    { id: 'user-rights', title: '8. User Rights & Choices' },
    { id: 'children-and-student-data', title: "9. Children's & Student Data" },
    { id: 'third-party-links', title: '10. Third-Party Links' },
    { id: 'data-transfers', title: '11. Data Transfers' },
    { id: 'changes-to-policy', title: '12. Changes to This Policy' },
    { id: 'contact-us', title: '13. Contact Us' },
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
            <Shield className="w-3.5 h-3.5" />
            Legal & Privacy
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-[1.15] mb-4">
            Privacy Policy
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-3xl font-normal leading-relaxed">
            Your privacy matters to us. This Privacy Policy explains how <strong>EduSphere</strong> collects, uses, protects, and manages information when you use our website, platform, applications, and related services.
          </p>
        </div>

        {/* Layout with Table of Contents + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Table of Contents
            </h3>
            <nav className="space-y-1.5 text-xs">
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

            {/* Section 1: Introduction */}
            <section id="introduction" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">1.</span>
                Introduction
              </h2>
              <p>
                EduSphere (<strong>"EduSphere"</strong>, <strong>"we"</strong>, <strong>"us"</strong>, or <strong>"our"</strong>), taglined as <em>Bharat's Next Generation Smart School Platform</em>, provides comprehensive technology, enterprise resource planning (ERP), and digital solutions for schools, educators, administrators, students, parents, and related educational stakeholders.
              </p>
              <p>
                This Privacy Policy applies to our website (<a href="https://www.eduspherebharat.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">www.eduspherebharat.com</a>), mobile applications, software services, administration portals, and any related communications or services provided by EduSphere. By accessing or using our services, you acknowledge that you have read and understood the practices described in this policy.
              </p>
            </section>

            {/* Section 2: Information We Collect */}
            <section id="information-we-collect" className="scroll-mt-32 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">2.</span>
                Information We Collect
              </h2>
              <p>
                We collect information to provide, maintain, and enhance our services. The categories of information we collect include:
              </p>

              {/* Subsection A */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  A. Information Provided Directly by Users
                </h3>
                <p className="text-sm text-slate-300">
                  When you register for an account, request a product walkthrough or live demo, submit enquiries, or communicate with our support team, you may provide:
                </p>
                <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 pl-2">
                  <li>Full name, official designation, and role (e.g., Principal, Administrator, Teacher)</li>
                  <li>Official email address and telephone/mobile number</li>
                  <li>School, institution, or organization name and campus branch</li>
                  <li>Account authentication credentials and security identifiers</li>
                  <li>Enquiry details, message contents, and custom requirements submitted through forms or chat</li>
                </ul>
              </div>

              {/* Subsection B */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-teal-400" />
                  B. Information Collected Automatically
                </h3>
                <p className="text-sm text-slate-300">
                  When you navigate our website or use our cloud platform, certain technical data is recorded automatically by our infrastructure:
                </p>
                <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 pl-2">
                  <li>Internet Protocol (IP) address and approximate network-derived technical location</li>
                  <li>Browser type, version, language settings, and operating system</li>
                  <li>Device identifiers, device hardware characteristics, and screen resolution</li>
                  <li>Platform usage statistics, pages visited, time spent, clickstream data, and referring URLs</li>
                  <li>Session state, cookies, and technical log timestamps</li>
                </ul>
              </div>

              {/* Subsection C */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  C. School / Student / Educational Data
                </h3>
                <p className="text-sm text-slate-300">
                  As an enterprise school management platform, partner schools and authorized educational institutions may upload and manage educational records depending on the specific modules enabled:
                </p>
                <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 pl-2">
                  <li>Student, parent, teacher, and administrative staff profiles</li>
                  <li>Attendance logs, timetable schedules, and classroom allocations</li>
                  <li>Academic marks, report cards, fee records, and institutional communications</li>
                  <li>School transport, library, and examination administrative data</li>
                </ul>
                <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
                  <strong className="text-slate-200">Institutional Responsibility:</strong> Participating schools and authorized institutions act as independent data controllers and are responsible for ensuring they possess the appropriate legal authority, consents, and permissions to provide such information to EduSphere.
                </div>
              </div>
            </section>

            {/* Section 3: How We Use Information */}
            <section id="how-we-use-information" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">3.</span>
                How We Use Information
              </h2>
              <p>We process collected information for legitimate educational, operational, and commercial purposes:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Providing and operating EduSphere services and modules',
                  'Creating, authenticating, and managing secure user accounts',
                  'Delivering customer support and responding to demo requests',
                  'Processing service subscriptions and operational enquiries',
                  'Improving platform speed, user experience, and stability',
                  'Maintaining system security and preventing fraud or abuse',
                  'Communicating important administrative updates and notifications',
                  'Complying with applicable Indian statutory and legal obligations',
                ].map((item, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-2 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-400 pt-2">
                Where permitted by applicable law, we may send service announcements or marketing communications; you may opt out of promotional messages at any time.
              </p>
            </section>

            {/* Section 4: Cookies and Tracking Technologies */}
            <section id="cookies-and-tracking" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">4.</span>
                Cookies & Tracking Technologies
              </h2>
              <p>
                EduSphere uses standard browser cookies, local storage, and session tokens to ensure website responsiveness, manage secure user sign-in sessions, remember user preferences, and analyze aggregate traffic trends.
              </p>
              <p>
                You can manage or disable cookies via your browser settings. Please note that disabling essential authentication cookies may impair your ability to log in or use interactive modules of the platform.
              </p>
            </section>

            {/* Section 5: How We Share Information */}
            <section id="how-we-share-information" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">5.</span>
                How We Share Information
              </h2>
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>We do not sell, rent, or trade your personal or student information to third parties as a commodity.</span>
              </div>
              <p>We may share information only in the following controlled circumstances:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-400 pl-2">
                <li><strong className="text-slate-200">Authorized School Personnel:</strong> Sharing within a school tenant in accordance with configured roles (e.g., Principal, Teacher, Admin).</li>
                <li><strong className="text-slate-200">Cloud Infrastructure & Service Providers:</strong> Trusted hosting, database, email, and technical infrastructure providers who process data strictly under confidentiality agreements.</li>
                <li><strong className="text-slate-200">Professional Advisors:</strong> Legal, financial, or audit professionals when necessary for compliance or advisory services.</li>
                <li><strong className="text-slate-200">Legal Compliance:</strong> Government authorities, courts, or law enforcement where mandated by applicable Indian law or valid legal processes.</li>
                <li><strong className="text-slate-200">Business Transitions:</strong> In connection with any merger, acquisition, restructuring, or transfer of assets, subject to standard confidentiality protections.</li>
              </ul>
            </section>

            {/* Section 6: Data Security */}
            <section id="data-security" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">6.</span>
                Data Security
              </h2>
              <p>
                EduSphere implements reasonable technical, administrative, and organizational safeguards designed to protect personal and institutional data against unauthorized access, loss, misuse, or alteration.
              </p>
              <p className="text-sm text-slate-400">
                These measures include role-based access control (RBAC), multi-tenant isolation, encrypted data transmission over HTTPS/TLS, and secure database configurations. However, no internet transmission or electronic storage method can be guaranteed 100% immune from external risks.
              </p>
            </section>

            {/* Section 7: Data Retention */}
            <section id="data-retention" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">7.</span>
                Data Retention
              </h2>
              <p>
                We retain personal and educational information only for as long as reasonably necessary to fulfill the purposes for which it was collected, to provide ongoing services under active institution agreements, to resolve disputes, and to satisfy applicable statutory, regulatory, tax, or accounting requirements.
              </p>
              <p className="text-sm text-slate-400">
                When data is no longer required, it is securely deleted, aggregated, or anonymized in accordance with our standard data management procedures.
              </p>
            </section>

            {/* Section 8: User Rights and Choices */}
            <section id="user-rights" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">8.</span>
                User Rights & Choices
              </h2>
              <p>Subject to applicable Indian law and contractual agreements, users have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-400 pl-2">
                <li>Request access to personal information maintained about them</li>
                <li>Request correction or updating of inaccurate or incomplete records</li>
                <li>Request deletion of personal data where retention is no longer legally mandated</li>
                <li>Withdraw consent for optional communications or processing activities</li>
                <li>Opt out of marketing emails by clicking unsubscribe or contacting us directly</li>
              </ul>
              <p className="text-xs text-slate-400 pt-1">
                Where EduSphere processes information on behalf of a school, requests regarding student or teacher records should typically be directed to the respective school administrator in the first instance.
              </p>
            </section>

            {/* Section 9: Children's and Student Data */}
            <section id="children-and-student-data" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">9.</span>
                Children's & Student Data
              </h2>
              <p>
                Given the educational focus of EduSphere, student information is managed with heightened diligence:
              </p>
              <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <p className="text-sm text-slate-300">
                  • <strong>Institutional Processor Role:</strong> EduSphere processes student records strictly on behalf of and under the instruction of subscribing schools and educational institutions.
                </p>
                <p className="text-sm text-slate-300">
                  • <strong>Educational Purpose Limitation:</strong> Student data is used exclusively for educational management, academic reporting, communication, and administrative tasks authorized by the school.
                </p>
                <p className="text-sm text-slate-300">
                  • <strong>Parental Inquiries:</strong> Parents and guardians seeking to review, update, or correct student information should contact their student's school administration directly, or contact EduSphere support for assistance.
                </p>
              </div>
            </section>

            {/* Section 10: Third-Party Links and Services */}
            <section id="third-party-links" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">10.</span>
                Third-Party Links & Services
              </h2>
              <p>
                Our platform and website may contain links or integrations with third-party websites or services (e.g., social media channels, messaging integrations, or external educational tools). We are not responsible for the privacy practices, content, or policies of those third-party services.
              </p>
            </section>

            {/* Section 11: Data Transfers */}
            <section id="data-transfers" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">11.</span>
                Data Transfers
              </h2>
              <p>
                Our servers and service providers are located in and operate in accordance with applicable Indian legal standards. If data is transferred or hosted across distributed infrastructure, appropriate technical and contractual safeguards are maintained in compliance with applicable laws.
              </p>
            </section>

            {/* Section 12: Changes to This Privacy Policy */}
            <section id="changes-to-policy" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-mono text-lg">12.</span>
                Changes to This Privacy Policy
              </h2>
              <p>
                We may periodically update this Privacy Policy to reflect enhancements in our platform, evolving business practices, or statutory modifications. When changes are made, the "Last Updated" date at the top will be refreshed. Continued use of our platform constitutes acceptance of the revised policy.
              </p>
            </section>

            {/* Section 13: Contact Us */}
            <section id="contact-us" className="scroll-mt-32 pt-4">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5 mb-2">
                    <span className="text-emerald-400 font-mono text-lg">13.</span>
                    Contact Us
                  </h2>
                  <p className="text-sm text-slate-400">
                    If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact our team:
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
                      Book a Live Demo
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
