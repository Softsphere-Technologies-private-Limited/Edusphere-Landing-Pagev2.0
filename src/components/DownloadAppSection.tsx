import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  QrCode,
  Sparkles,
  Star,
  ShieldCheck,
  Bell,
  CreditCard,
  UserCheck,
  Download,
  X,
} from 'lucide-react';

export const DownloadAppSection: React.FC = () => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'parents' | 'teachers' | 'students'>('parents');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const triggerDownloadNotice = (storeName: string) => {
    setDownloadToast(`Redirecting to EduSphere App on ${storeName}...`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 4000);
  };

  return (
    <section id="download-app" className="relative py-20 bg-slate-950 text-slate-100 overflow-hidden border-t border-slate-800/80">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#20B486]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#20B486]/10 border border-[#20B486]/30 text-[#20B486] text-xs font-mono-code font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Access Anywhere</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-tight">
            Take Your School Experience <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20B486] via-emerald-400 to-teal-300">
              In Your Pocket
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Stay connected in real time. Access attendance, instant fee payments, live transport tracking, and academic progress reports for Parents, Teachers, and Principals.
          </p>
        </div>

        {/* Main Card Grid Layout */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#20B486] via-indigo-500 to-teal-400" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Download Buttons & Features */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Role Toggle Selector */}
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-950 border border-slate-800 gap-1">
                {(['parents', 'teachers', 'students'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#20B486] text-slate-950 shadow-md shadow-[#20B486]/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    For {tab}
                  </button>
                ))}
              </div>

              {/* Dynamic Feature Highlights based on activeTab */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeTab === 'parents' && (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-[#20B486]/10 text-[#20B486] shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Live Attendance Alerts</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">Instant push notifications when your child arrives or leaves school.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">1-Click Fee Payments</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">Pay via UPI, Cards, or NetBanking with instant GST receipts.</p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'teachers' && (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-[#20B486]/10 text-[#20B486] shrink-0">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Rapid Mark Attendance</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">Mark class attendance in 10 seconds with facial/tap selection.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">AI Homework Assistant</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">Generate quizzes, class updates, and broadcast messages instantly.</p>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'students' && (
                  <>
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-[#20B486]/10 text-[#20B486] shrink-0">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Digital Homework & Diary</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">Submit assignments and track timetable schedules on time.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">e-Library & Exam Results</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">Access study material, term report cards, and leaderboard badges.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* DOWNLOAD STORE BUTTONS */}
              <div className="pt-2">
                <p className="text-xs font-mono-code uppercase tracking-widest text-slate-400 mb-4 font-bold flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#20B486]" />
                  <span>Download Free App On Android & iOS</span>
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Google Play Store Badge */}
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerDownloadNotice('Google Play Store');
                    }}
                    className="group relative inline-flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-700/80 hover:border-[#20B486] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#20B486]/15 cursor-pointer"
                  >
                    {/* Google Play Vector Icon */}
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full" viewBox="0 0 512 512" fill="none">
                        <path
                          d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"
                          fill="#EA4335"
                        />
                        <path
                          d="M47 38.8C43.1 43.1 41 49.6 41 57.9v396.2c0 8.3 2.1 14.8 6 19.1l208.8-208.8L47 38.8z"
                          fill="#4285F4"
                        />
                        <path
                          d="M325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z"
                          fill="#34A853"
                        />
                        <path
                          d="M471 236.8l-85.6-49.3-60.1 60.1 60.1 60.1L471 258.4c12-6.9 12-14.7 0-21.6z"
                          fill="#FBBC04"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                        GET IT ON
                      </div>
                      <div className="text-base font-extrabold text-white group-hover:text-[#20B486] transition-colors leading-tight mt-0.5 font-display">
                        Google Play
                      </div>
                    </div>
                  </a>

                  {/* Apple App Store Badge */}
                  <a
                    href="https://apple.com/app-store"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerDownloadNotice('Apple App Store');
                    }}
                    className="group relative inline-flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-700/80 hover:border-[#20B486] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#20B486]/15 cursor-pointer"
                  >
                    {/* Apple Vector Icon */}
                    <div className="w-7 h-7 flex items-center justify-center shrink-0 text-white group-hover:text-[#20B486] transition-colors">
                      <svg className="w-full h-full fill-current" viewBox="0 0 384 512">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 125.7 107.2 124.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91zm-56.2-162c31.5-38.2 28.1-73.2 26.6-86.7-27.7 1.5-60.2 18.5-78.2 39.6-20 22.8-29.4 53.6-26.6 86 31 2.3 61.1-15.1 78.2-38.9z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                        Download on the
                      </div>
                      <div className="text-base font-extrabold text-white group-hover:text-[#20B486] transition-colors leading-tight mt-0.5 font-display">
                        App Store
                      </div>
                    </div>
                  </a>

                  {/* QR Code Quick Scan Button */}
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer"
                    title="Scan QR Code to Download"
                  >
                    <QrCode className="w-5 h-5 text-[#20B486]" />
                    <span>Scan QR</span>
                  </button>
                </div>
              </div>

              {/* Store Ratings & Social Proof */}
              <div className="flex items-center gap-6 pt-2 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-white">4.9 / 5.0</span>
                  <span>(12k+ Reviews)</span>
                </div>
                <div className="hidden sm:block text-slate-700">•</div>
                <div className="hidden sm:flex items-center gap-1 text-slate-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#20B486]" />
                  <span>50,000+ Downloads</span>
                </div>
              </div>

            </div>

            {/* Right Column: Visual App Phone Preview Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[9/18] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-800 shadow-2xl shadow-[#20B486]/20 group hover:border-[#20B486]/50 transition-all duration-500">
                {/* Phone Top Speaker Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                  <div className="w-3 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Inner Screen Canvas */}
                <div className="w-full h-full bg-slate-900 rounded-[34px] overflow-hidden flex flex-col pt-8 p-4 relative border border-slate-800">
                  {/* App Header Inside Phone */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-[#20B486] flex items-center justify-center text-slate-950 font-black text-xs">
                        E
                      </div>
                      <div>
                        <div className="text-[11px] font-extrabold text-white leading-tight">EduSphere</div>
                        <div className="text-[9px] text-emerald-400 font-medium">Smart Parent App</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">Live</span>
                  </div>

                  {/* Student Quick Profile Card */}
                  <div className="my-3 p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-extrabold text-xs">
                      A
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">Aarav Sharma</div>
                      <div className="text-[10px] text-slate-400">Class 7-A • Roll #14</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#20B486] block">98% Present</span>
                    </div>
                  </div>

                  {/* Quick Action Tiles */}
                  <div className="grid grid-cols-2 gap-2 my-1">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">Today Status</div>
                      <div className="text-xs font-black text-emerald-400 mt-0.5">PRESENT ✓</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">Pending Fee</div>
                      <div className="text-xs font-black text-white mt-0.5">₹ 0.00 (Paid)</div>
                    </div>
                  </div>

                  {/* Feed Notification Item */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#20B486]/10 border border-[#20B486]/30 text-left space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-[#20B486] font-bold">
                      <span>🔔 NEW NOTICE</span>
                      <span>10m ago</span>
                    </div>
                    <div className="text-[11px] font-bold text-white">Science Exhibition Tomorrow</div>
                    <div className="text-[9px] text-slate-300 leading-tight">Please check project guidelines in homework tab.</div>
                  </div>

                  {/* Bottom App Navigation Bar inside Phone */}
                  <div className="mt-auto pt-3 border-t border-slate-800/80 flex justify-around text-slate-400 text-[10px] font-bold">
                    <span className="text-[#20B486]">Home</span>
                    <span>Fees</span>
                    <span>Diary</span>
                    <span>Chat</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#20B486]/10 text-[#20B486] flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white font-display">Scan to Install App</h3>
            <p className="text-xs text-slate-400 mt-1">Open your smartphone camera to download EduSphere Mobile App.</p>

            {/* Generated QR Code SVG */}
            <div className="my-5 p-4 bg-white rounded-2xl inline-block shadow-lg border-4 border-emerald-500/30">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                {/* Top-left position marker */}
                <rect x="10" y="10" width="25" height="25" fill="#06151B" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#20B486" />

                {/* Top-right position marker */}
                <rect x="65" y="10" width="25" height="25" fill="#06151B" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#20B486" />

                {/* Bottom-left position marker */}
                <rect x="10" y="65" width="25" height="25" fill="#06151B" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#20B486" />

                {/* Data modules */}
                <rect x="42" y="12" width="6" height="6" fill="#06151B" />
                <rect x="52" y="18" width="6" height="6" fill="#20B486" />
                <rect x="42" y="28" width="6" height="6" fill="#06151B" />

                <rect x="12" y="42" width="6" height="6" fill="#06151B" />
                <rect x="24" y="48" width="6" height="6" fill="#20B486" />
                <rect x="36" y="42" width="6" height="6" fill="#06151B" />
                <rect x="48" y="48" width="6" height="6" fill="#06151B" />
                <rect x="60" y="42" width="6" height="6" fill="#20B486" />
                <rect x="72" y="48" width="6" height="6" fill="#06151B" />
                <rect x="84" y="42" width="6" height="6" fill="#06151B" />

                <rect x="42" y="62" width="6" height="6" fill="#20B486" />
                <rect x="54" y="68" width="6" height="6" fill="#06151B" />
                <rect x="66" y="62" width="6" height="6" fill="#06151B" />
                <rect x="78" y="68" width="6" height="6" fill="#20B486" />

                <rect x="42" y="82" width="6" height="6" fill="#06151B" />
                <rect x="52" y="82" width="6" height="6" fill="#20B486" />
                <rect x="62" y="82" width="6" height="6" fill="#06151B" />
                <rect x="78" y="82" width="6" height="6" fill="#06151B" />
              </svg>
            </div>

            <div className="text-xs font-mono-code text-[#20B486] font-bold">
              Compatible with Android 8+ & iOS 14+
            </div>
          </div>
        </div>
      )}

      {/* Download Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#20B486] text-slate-950 font-bold text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Download className="w-5 h-5 animate-bounce" />
          <span>{downloadToast}</span>
        </div>
      )}
    </section>
  );
};
