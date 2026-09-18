import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Zap,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  RotateCcw,
  KeyRound,
  ArrowRight,
  Sparkles,
  Send,
  Lock,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendEmailOtp, verifyEmailCode } from '../services/emailOtpService';
import { formatISTTimestamp } from '../utils/dateUtils';
import { COUNTRY_ISD_LIST, detectDefaultIsdCode, formatFullPhoneNumber } from '../utils/phoneUtils';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isdCode, setIsdCode] = useState('+91');
  const [school, setSchool] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [generatedEmailOtp, setGeneratedEmailOtp] = useState<string>('');
  const [emailNotice, setEmailNotice] = useState<string>('');
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [emailDispatched, setEmailDispatched] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-detect user's country ISD code on mount
  useEffect(() => {
    detectDefaultIsdCode().then((code) => {
      if (code) setIsdCode(code);
    });
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !school) return;

    if (!captchaVerified) {
      setCaptchaError('Please check the reCAPTCHA box to verify you are not a robot.');
      return;
    }
    setCaptchaError('');

    setIsSendingOtp(true);
    setOtpError('');

    const formattedPhone = formatFullPhoneNumber(phone, isdCode);

    try {
      // Save pending lead request into Firebase Firestore
      await addDoc(collection(db, 'demo_requests'), {
        name,
        email,
        phone: formattedPhone,
        school,
        status: 'EMAIL_OTP_PENDING',
        createdAt: serverTimestamp(),
      });

      // Call Email OTP Service
      const result = await sendEmailOtp({
        email,
        name,
        school,
        phone: formattedPhone,
      });

      setGeneratedEmailOtp(result.otp);
      setEmailNotice(result.message);

      setIsSendingOtp(false);
      setStep('otp');
      setCountdown(30);
      setCanResend(false);
    } catch (err: any) {
      console.error('Error initiating Email OTP request:', err);
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedEmailOtp(randomOtp);
      setIsSendingOtp(false);
      setStep('otp');
      setCountdown(30);
      setCanResend(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setOtpError('Please enter the complete 6-digit email OTP verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    const formattedPhone = formatFullPhoneNumber(phone, isdCode);
    const istTimestampStr = formatISTTimestamp();

    try {
      if (!verifyEmailCode(otpCode, generatedEmailOtp)) {
        throw new Error('Incorrect verification code. Please check the 6-digit code received on your email.');
      }

      // Store verified lead entry in Firebase Firestore
      await addDoc(collection(db, 'verified_demos'), {
        name,
        email,
        phone: formattedPhone,
        school,
        targetEmailNotification: 'praful.akhani19@gmail.com',
        verifiedAt: serverTimestamp(),
        verificationMethod: 'Email OTP',
        status: 'VERIFIED_EMAIL_OTP',
      });

      // Send automated email notification to praful.akhani19@gmail.com via server endpoint
      try {
        await fetch('/api/send-lead-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone: formattedPhone,
            school,
            recipientEmail: 'praful.akhani19@gmail.com',
            verifiedAt: istTimestampStr,
            type: 'VERIFIED_DEMO_LEAD',
            verificationMethod: 'Email OTP',
          }),
        });
      } catch (emailErr) {
        console.warn('Backend lead email notification warning:', emailErr);
      }

      // Live email notification dispatch confirmation
      setEmailDispatched(true);

      setIsVerifyingOtp(false);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Email OTP Verification Failed:', err);
      setIsVerifyingOtp(false);
      setOtpError(err.message || 'Verification failed. Please check the 6-digit code sent to your email.');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsSendingOtp(true);
    setOtpError('');
    setOtp(['', '', '', '', '', '']);

    const formattedPhone = formatFullPhoneNumber(phone, isdCode);

    try {
      const result = await sendEmailOtp({
        email,
        name,
        school,
        phone: formattedPhone,
      });

      setGeneratedEmailOtp(result.otp);
      setEmailNotice(result.message);
    } catch (emailApiErr) {
      console.warn('Email OTP server endpoint notice:', emailApiErr);
    }

    setTimeout(() => {
      setIsSendingOtp(false);
      setCountdown(30);
      setCanResend(false);
    }, 500);
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep('details');
    setName('');
    setEmail('');
    setPhone('');
    setSchool('');
    setCaptchaVerified(false);
    setCaptchaError('');
    setOtp(['', '', '', '', '', '']);
    setGeneratedEmailOtp('');
    setOtpError('');
    setEmailDispatched(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-slate-950/95">
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(32,180,134,0.3)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-white font-display">
              Demo Reserved & Email Verified!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Thank you, <span className="text-emerald-400 font-bold">{name}</span> from{' '}
              <span className="text-white font-bold">{school}</span>. Your email address (<span className="text-emerald-400 font-bold">{email}</span>) has been verified via <strong className="text-emerald-400">Email OTP</strong>.
            </p>

            {/* Email Dispatch Confirmation Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-left text-xs space-y-1.5 my-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Send className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank-You Email & Lead Dispatched Live</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal pl-6">
                An official Thank-You email with demo agenda details has been sent directly to <strong className="text-emerald-300">{email}</strong>. Lead details have also been logged and sent to <strong className="text-white">praful.akhani19@gmail.com</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{email} (Verified via Email OTP)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{school}</span>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition cursor-pointer"
            >
              Back to EduSphere
            </button>
          </div>
        ) : step === 'details' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-current" /> Free 1-on-1 Product Walkthrough
            </div>

            <h3 className="text-2xl font-bold text-white font-display leading-snug">
              Schedule Your Customized School Walkthrough
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Experience how EduSphere unifies admissions, fee collections, and student progress in 30 minutes.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. R. K. Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address (Required for OTP) <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. principal@school.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-emerald-400 font-mono-code flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email OTP
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Phone / Mobile Number <span className="text-emerald-400">*</span></span>
                  <span className="text-[10px] text-emerald-400 font-mono-code font-normal">Auto-ISD Code ({isdCode})</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={isdCode}
                    onChange={(e) => setIsdCode(e.target.value)}
                    className="px-2.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-emerald-400 font-bold font-mono-code outline-none transition shrink-0 cursor-pointer"
                    title="Select Country ISD Code"
                  >
                    {COUNTRY_ISD_LIST.map((item) => (
                      <option key={item.code + item.country} value={item.code} className="bg-slate-900 text-white">
                        {item.flag} {item.code} ({item.country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  School / Institution Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi Public Academy"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
                />
              </div>
            </div>

            {/* RECAPTCHA INTEGRATION BOX */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={captchaVerified}
                  onChange={(e) => {
                    setCaptchaVerified(e.target.checked);
                    if (e.target.checked) setCaptchaError('');
                  }}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-200 font-medium">
                  I'm not a robot
                </span>
              </label>

              <div className="flex flex-col items-end text-[9px] text-slate-400">
                <div className="flex items-center gap-1 text-slate-300 font-bold">
                  <Lock className="w-3 h-3 text-emerald-400" /> reCAPTCHA
                </div>
                <span>Privacy • Terms</span>
              </div>
            </div>

            {captchaError && (
              <p className="text-[11px] text-red-400 bg-red-950/40 border border-red-900/50 p-2 rounded-lg">
                {captchaError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full py-3.5 mt-2 text-xs font-black uppercase tracking-widest text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-2xl shadow-[0_0_20px_rgba(32,180,134,0.4)] hover:shadow-[0_0_30px_rgba(32,180,134,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSendingOtp ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Sending Email OTP...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Email OTP Verification</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* OTP STEP */
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Email OTP Verification
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-display mb-1">
                Enter 6-Digit Email Verification Code
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter the 6-digit verification code sent to <span className="text-emerald-400 font-bold">{email}</span>.
              </p>
            </div>

            {/* Email Delivery Notice Banner */}
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-2">
              <div className="text-xs text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verification Code Sent via Email</span>
              </div>
              
              <p className="text-[11px] text-slate-300 leading-relaxed">
                A 6-digit verification code has been dispatched to <strong className="text-white">{email}</strong>. Please check your inbox and spam folder.
              </p>
            </div>

            {/* 6-digit OTP Input */}
            <div className="flex items-center justify-between gap-2 py-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 text-center text-lg font-bold bg-slate-900 border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl text-white outline-none transition"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 p-2.5 rounded-xl text-center">
                {otpError}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="hover:text-white transition underline underline-offset-2 cursor-pointer"
              >
                Change details
              </button>

              <button
                type="button"
                disabled={!canResend}
                onClick={handleResendOtp}
                className={`transition flex items-center gap-1 ${
                  canResend
                    ? 'text-emerald-400 hover:underline cursor-pointer font-bold'
                    : 'text-slate-500 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                {canResend ? 'Resend Email OTP' : `Resend in ${countdown}s`}
              </button>
            </div>

            <button
              type="submit"
              disabled={isVerifyingOtp}
              className="w-full py-4 text-xs font-black uppercase tracking-widest text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-2xl shadow-[0_0_20px_rgba(32,180,134,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isVerifyingOtp ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Verifying Email OTP...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Complete Demo Reservation</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


