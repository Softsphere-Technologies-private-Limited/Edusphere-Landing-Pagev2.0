import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  RefreshCw,
  Plus,
  ShieldCheck,
  Lock,
  Unlock,
  TrendingUp,
  UserCheck,
  Zap,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  Server,
  Users,
  UserPlus,
  KeyRound,
  Key,
  ShieldAlert,
  Copy,
  Check,
  RotateCcw,
  UserX,
  Crown,
  BadgeAlert,
  LayoutDashboard,
  LogOut,
  Menu,
  ChevronRight,
  Briefcase,
  CalendarCheck,
  School,
  Sparkles,
  Flame,
} from 'lucide-react';
import { db } from '../lib/firebase';
import { formatISTTimestamp, formatISTTime } from '../utils/dateUtils';
import { COUNTRY_ISD_LIST, detectDefaultIsdCode, formatFullPhoneNumber } from '../utils/phoneUtils';
import {
  AdminUser,
  CrmLead,
  LeadStatus,
  LeadPriority,
  LeadActivityNote,
  CrmDeal,
  DealStage,
  CrmActivity,
  ActivityType,
  ActivityStatus,
  ActivityPriority,
  CrmSchool,
} from '../types';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

// CRM Sub-Tab Components
import { CrmOverviewTab } from './crm/CrmOverviewTab';
import { CrmLeadsTab } from './crm/CrmLeadsTab';
import { CrmDealsTab } from './crm/CrmDealsTab';
import { CrmActivitiesTab } from './crm/CrmActivitiesTab';
import { CrmSchoolsTab } from './crm/CrmSchoolsTab';
import { CrmLeadDetailModal } from './crm/CrmLeadDetailModal';

// Initial Mock Deals
const DEFAULT_DEALS: CrmDeal[] = [
  {
    id: 'deal-101',
    title: 'Delhi Heritage Public School - ERP Suite',
    schoolName: 'Delhi Heritage Public School',
    contactName: 'Dr. Ramesh Sharma',
    contactEmail: 'ramesh.sharma@delhiheritage.edu',
    contactPhone: '+91 98101 23456',
    stage: 'NEGOTIATION',
    amount: 240000,
    probability: 80,
    expectedCloseDate: '2026-09-30',
    assignedTo: 'Super Admin',
    notes: 'Management meeting completed. Custom fees and GPS tracking modules requested.',
  },
  {
    id: 'deal-102',
    title: 'St. Xavier High School - Standard ERP',
    schoolName: 'St. Xavier High School',
    contactName: 'Sister Maria Fernandez',
    contactEmail: 'admin@stxavier.edu',
    contactPhone: '+91 98230 45678',
    stage: 'DEMO_SCHEDULED',
    amount: 150000,
    probability: 60,
    expectedCloseDate: '2026-10-10',
    assignedTo: 'Sales Team',
    notes: 'Online demo scheduled for trustee board.',
  },
  {
    id: 'deal-103',
    title: 'Aavkar Global Academy - Enterprise AI',
    schoolName: 'Aavkar Global Academy',
    contactName: 'Sunil Patel',
    contactEmail: 'principal@aavkarglobal.org',
    contactPhone: '+91 98791 88231',
    stage: 'CLOSED_WON',
    amount: 320000,
    probability: 100,
    expectedCloseDate: '2026-09-15',
    assignedTo: 'Super Admin',
    notes: 'Contract signed and onboarding initiated.',
  },
];

// Initial Mock Activities
const DEFAULT_ACTIVITIES: CrmActivity[] = [
  {
    id: 'act-201',
    title: 'Conduct Online ERP Live Demo',
    type: 'DEMO',
    schoolName: 'St. Xavier High School',
    contactName: 'Sister Maria Fernandez',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '03:30 PM',
    priority: 'HIGH',
    status: 'PENDING',
    assignedTo: 'Sales Team',
    notes: 'Demonstrate fee receipt generation & parent mobile app.',
  },
  {
    id: 'act-202',
    title: 'Follow-up Call regarding Annual License Quotation',
    type: 'CALL',
    schoolName: 'Delhi Heritage Public School',
    contactName: 'Dr. Ramesh Sharma',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '11:00 AM',
    priority: 'HIGH',
    status: 'PENDING',
    assignedTo: 'Super Admin',
    notes: 'Discuss 10% multi-year discount requested by trustee.',
  },
  {
    id: 'act-203',
    title: 'Campus In-Person Visit & Hardware Inspection',
    type: 'VISIT',
    schoolName: 'Bright Future Academy',
    contactName: 'Prof. Alok Verma',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '10:00 AM',
    priority: 'MEDIUM',
    status: 'PENDING',
    assignedTo: 'Sales Rep',
    notes: 'Check biometric machine compatibility at main gate.',
  },
];

// Initial Mock Schools
const DEFAULT_SCHOOLS: CrmSchool[] = [
  {
    id: 'sch-301',
    name: 'Delhi Heritage Public School',
    city: 'New Delhi',
    state: 'Delhi',
    studentCount: 2100,
    decisionMaker: 'Dr. Ramesh Sharma',
    decisionMakerRole: 'Principal',
    email: 'ramesh.sharma@delhiheritage.edu',
    phone: '+91 98101 23456',
    tier: 'ENTERPRISE',
    status: 'OPPORTUNITY',
  },
  {
    id: 'sch-302',
    name: 'Aavkar Global Academy',
    city: 'Ahmedabad',
    state: 'Gujarat',
    studentCount: 1450,
    decisionMaker: 'Sunil Patel',
    decisionMakerRole: 'Managing Trustee',
    email: 'principal@aavkarglobal.org',
    phone: '+91 98791 88231',
    tier: 'PREMIUM',
    status: 'ACTIVE_CUSTOMER',
  },
  {
    id: 'sch-303',
    name: 'St. Xavier High School',
    city: 'Mumbai',
    state: 'Maharashtra',
    studentCount: 1800,
    decisionMaker: 'Sister Maria Fernandez',
    decisionMakerRole: 'Vice Principal',
    email: 'admin@stxavier.edu',
    phone: '+91 98230 45678',
    tier: 'PREMIUM',
    status: 'OPPORTUNITY',
  },
];

interface AdminLeadsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLeadsDashboard: React.FC<AdminLeadsDashboardProps> = ({ isOpen, onClose }) => {
  // Navigation State
  const [activeNavTab, setActiveNavTab] = useState<
    'overview' | 'leads' | 'deals' | 'activities' | 'schools' | 'team' | 'smtp' | 'security'
  >('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Core Data States
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [deals, setDeals] = useState<CrmDeal[]>(DEFAULT_DEALS);
  const [activities, setActivities] = useState<CrmActivity[]>(DEFAULT_ACTIVITIES);
  const [schools, setSchools] = useState<CrmSchool[]>(DEFAULT_SCHOOLS);
  const [loading, setLoading] = useState<boolean>(true);

  // Authentication State
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);

  // Lead Modal & Detail States
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<CrmLead | null>(null);
  const [isLeadDetailModalOpen, setIsLeadDetailModalOpen] = useState<boolean>(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState<boolean>(false);
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState<boolean>(false);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState<boolean>(false);
  const [isAddSchoolModalOpen, setIsAddSchoolModalOpen] = useState<boolean>(false);

  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Add Lead Form State
  const [mName, setMName] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mIsdCode, setMIsdCode] = useState('+91');
  const [mSchool, setMSchool] = useState('');
  const [mCity, setMCity] = useState('');
  const [mStudentCount, setMStudentCount] = useState<number>(500);
  const [mStatus, setMStatus] = useState<LeadStatus>('VERIFIED_OTP');
  const [mPriority, setMPriority] = useState<LeadPriority>('WARM');
  const [mSource, setMSource] = useState('Direct Sales Call');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // SMTP Settings State
  const [smtpHost, setSmtpHost] = useState<string>('smtp.mailgun.org');
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [smtpUser, setSmtpUser] = useState<string>('praful.akhani19@gmail.com');
  const [smtpPass, setSmtpPass] = useState<string>('');
  const [smtpSecure, setSmtpSecure] = useState<boolean>(false);
  const [smtpTargetRecipient, setSmtpTargetRecipient] = useState<string>('praful.akhani19@gmail.com');
  const [smtpShowPass, setSmtpShowPass] = useState<boolean>(false);
  const [smtpTestRecipient, setSmtpTestRecipient] = useState<string>('praful.akhani19@gmail.com');
  const [smtpTesting, setSmtpTesting] = useState<boolean>(false);
  const [smtpStatusMsg, setSmtpStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [smtpConfigured, setSmtpConfigured] = useState<boolean>(false);

  // Team & User Management State
  const [uName, setUName] = useState<string>('');
  const [uEmail, setUEmail] = useState<string>('');
  const [uPassword, setUPassword] = useState<string>('');
  const [uRole, setURole] = useState<'SUPER_ADMIN' | 'TEAM_MEMBER'>('TEAM_MEMBER');
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
  const [userActionMsg, setUserActionMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Security & Password States
  const [currPassInput, setCurrPassInput] = useState<string>('');
  const [newPassInput, setNewPassInput] = useState<string>('');
  const [confirmPassInput, setConfirmPassInput] = useState<string>('');
  const [passChangeMsg, setPassChangeMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState<boolean>(false);

  // Forgot password states
  const [forgotPassModalOpen, setForgotPassModalOpen] = useState<boolean>(false);
  const [forgotEmailInput, setForgotEmailInput] = useState<string>('');
  const [forgotStatusMsg, setForgotStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState<boolean>(false);

  // Auto-restore admin authentication session from localStorage
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('edusphere_admin_auth_session');
      if (savedSession) {
        const parsedUser = JSON.parse(savedSession) as AdminUser;
        if (parsedUser && parsedUser.email) {
          setCurrentAdminUser(parsedUser);
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.error('Failed to restore saved admin session:', e);
    }
  }, []);

  // Detect ISD code on mount
  useEffect(() => {
    detectDefaultIsdCode().then((code) => {
      if (code) setMIsdCode(code);
    });
  }, []);

  // Preset SMTP Config Helper
  const applySmtpPreset = (preset: 'gmail' | 'mailgun' | 'brevo' | 'sendgrid' | 'hostinger') => {
    if (preset === 'gmail') {
      setSmtpHost('smtp.gmail.com');
      setSmtpPort(587);
      setSmtpSecure(false);
      if (!smtpUser) setSmtpUser('praful.akhani19@gmail.com');
      showToast('Applied Gmail SMTP preset (Port 587 TLS)');
    } else if (preset === 'mailgun') {
      setSmtpHost('smtp.mailgun.org');
      setSmtpPort(587);
      setSmtpSecure(false);
      showToast('Applied Mailgun SMTP preset (Port 587)');
    } else if (preset === 'brevo') {
      setSmtpHost('smtp-relay.brevo.com');
      setSmtpPort(587);
      setSmtpSecure(false);
      showToast('Applied Brevo SMTP preset (Port 587)');
    } else if (preset === 'sendgrid') {
      setSmtpHost('smtp.sendgrid.net');
      setSmtpPort(587);
      setSmtpSecure(false);
      setSmtpUser('apikey');
      showToast('Applied SendGrid preset (User: apikey)');
    } else if (preset === 'hostinger') {
      setSmtpHost('smtp.hostinger.com');
      setSmtpPort(465);
      setSmtpSecure(true);
      showToast('Applied Hostinger SMTP preset (Port 465 SSL)');
    }
  };

  // Save SMTP Config to Server
  const handleSaveSmtpConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpStatusMsg(null);

    try {
      const res = await fetch('/api/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost.trim(),
          port: Number(smtpPort),
          user: smtpUser.trim(),
          pass: smtpPass.trim(),
          secure: Boolean(smtpSecure),
          targetRecipient: smtpTargetRecipient.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSmtpConfigured(Boolean(data.configured));
        setSmtpStatusMsg({ text: '✅ SMTP Configuration successfully saved and applied to the server!', isError: false });
        showToast('SMTP Settings updated successfully!');
      } else {
        setSmtpStatusMsg({ text: `❌ Failed to save: ${data.message || 'Unknown error'}`, isError: true });
      }
    } catch (err: any) {
      setSmtpStatusMsg({ text: `❌ Server communication error: ${err.message}`, isError: true });
    }
  };

  // Test Outbound SMTP Connection & Test Email
  const handleTestSmtpConnection = async () => {
    if (!smtpHost || !smtpUser || (!smtpPass && !smtpConfigured)) {
      setSmtpStatusMsg({ text: '⚠️ Please enter SMTP Host, Username and Password before testing.', isError: true });
      return;
    }

    setSmtpTesting(true);
    setSmtpStatusMsg(null);

    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost.trim(),
          port: Number(smtpPort),
          user: smtpUser.trim(),
          pass: smtpPass.trim(),
          secure: Boolean(smtpSecure),
          email: smtpTestRecipient.trim() || smtpTargetRecipient.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSmtpConfigured(true);
        setSmtpStatusMsg({
          text: `🎉 Success! Test email delivered to ${smtpTestRecipient.trim() || smtpTargetRecipient.trim()}. Your SMTP credentials and OTP verification system are working perfectly!`,
          isError: false,
        });
        showToast('Test email sent successfully!');
      } else {
        setSmtpStatusMsg({
          text: `❌ SMTP Connection Failed: ${data.error || 'Check your credentials and port'}`,
          isError: true,
        });
      }
    } catch (err: any) {
      setSmtpStatusMsg({ text: `❌ Network error while testing SMTP: ${err.message}`, isError: true });
    } finally {
      setSmtpTesting(false);
    }
  };

  // Test Live OTP Dispatch via SMTP
  const handleTestOtpDispatch = async () => {
    const targetEmail = smtpTestRecipient.trim() || smtpTargetRecipient.trim();
    if (!targetEmail) {
      setSmtpStatusMsg({ text: '⚠️ Please specify a test recipient email address.', isError: true });
      return;
    }

    setSmtpTesting(true);
    setSmtpStatusMsg(null);

    const testOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: 'Test Administrator',
          school: 'EduSphere Demo Verification Lab',
          phone: '+91 98765 43210',
          otpCode: testOtpCode,
        }),
      });

      const data = await res.json();
      if (data.sentViaEmail) {
        setSmtpStatusMsg({
          text: `🚀 Live 6-Digit OTP (${testOtpCode}) successfully dispatched to ${targetEmail} via SMTP! Check your inbox.`,
          isError: false,
        });
        showToast(`Test OTP ${testOtpCode} sent to ${targetEmail}`);
      } else {
        setSmtpStatusMsg({
          text: `⚠️ OTP was generated (${testOtpCode}) but email dispatch failed. Ensure SMTP credentials are saved and valid.`,
          isError: true,
        });
      }
    } catch (err: any) {
      setSmtpStatusMsg({ text: `❌ Error sending test OTP: ${err.message}`, isError: true });
    } finally {
      setSmtpTesting(false);
    }
  };

  // Create New Team Staff User
  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uEmail || !uPassword || !uName) return;

    setIsCreatingUser(true);
    setUserActionMsg(null);

    const cleanEmail = uEmail.trim().toLowerCase();
    const newUser: Omit<AdminUser, 'id'> = {
      name: uName.trim(),
      email: cleanEmail,
      password: uPassword,
      role: uRole,
      failedAttempts: 0,
      isLocked: false,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'admin_users', cleanEmail), newUser);
      setUserActionMsg({ text: `✅ Staff account for ${uName} created successfully!`, isError: false });
      showToast(`User ${uName} added to system`);
      setUName('');
      setUEmail('');
      setUPassword('');
    } catch (err: any) {
      setUserActionMsg({ text: `❌ Failed to create user: ${err.message}`, isError: true });
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Unlock Locked Account
  const handleUnlockUser = async (userId: string) => {
    try {
      const userRef = doc(db, 'admin_users', userId);
      await updateDoc(userRef, {
        failedAttempts: 0,
        isLocked: false,
      });
      showToast('Account unlocked successfully');
    } catch (e: any) {
      showToast('Error unlocking account');
    }
  };

  // Delete Admin Staff User
  const handleDeleteAdminUser = async (userId: string) => {
    if (userId === 'admin@email.com' || userId === 'praful.akhani19@gmail.com') {
      alert('Primary Super Admin accounts cannot be deleted.');
      return;
    }
    if (!window.confirm(`Delete staff user ${userId}?`)) return;

    try {
      await deleteDoc(doc(db, 'admin_users', userId));
      showToast('Staff user deleted successfully');
    } catch (e: any) {
      showToast('Error deleting staff account');
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdminUser) return;

    setPassChangeMsg(null);
    if (newPassInput !== confirmPassInput) {
      setPassChangeMsg({ text: '❌ New password and confirmation do not match.', isError: true });
      return;
    }
    if (newPassInput.length < 6) {
      setPassChangeMsg({ text: '❌ Password must be at least 6 characters long.', isError: true });
      return;
    }

    setIsChangingPass(true);
    try {
      const userRef = doc(db, 'admin_users', currentAdminUser.id);
      await updateDoc(userRef, {
        password: newPassInput,
        failedAttempts: 0,
      });
      setPassChangeMsg({ text: '✅ Password updated successfully! Please use your new password next time.', isError: false });
      setCurrPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      showToast('Password changed successfully');
    } catch (err: any) {
      setPassChangeMsg({ text: `❌ Failed to change password: ${err.message}`, isError: true });
    } finally {
      setIsChangingPass(false);
    }
  };

  // Forgot Password Request Handler
  const handleSendForgotPasswordEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = forgotEmailInput.trim().toLowerCase();
    if (!cleanEmail) return;

    setIsSendingResetEmail(true);
    setForgotStatusMsg(null);

    try {
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const res = await fetch('/api/send-password-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          name: cleanEmail,
          resetToken,
          requestedBy: 'Forgot Password Portal',
          isLocked: false,
        }),
      });

      const data = await res.json();
      if (data.sentViaEmail) {
        setForgotStatusMsg({
          text: `✅ Password reset authorization sent to ${cleanEmail}. Check your inbox or spam folder.`,
          isError: false,
        });
      } else {
        setForgotStatusMsg({
          text: `ℹ️ Password reset link generated: ${data.resetUrl || 'Contact Super Admin (praful.akhani19@gmail.com)'}`,
          isError: false,
        });
      }
    } catch (err: any) {
      setForgotStatusMsg({
        text: `❌ Could not send reset email. Contact Super Admin at praful.akhani19@gmail.com`,
        isError: true,
      });
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  // Firestore Listener for Admin Users
  useEffect(() => {
    const usersRef = collection(db, 'admin_users');
    const unsubscribeUsers = onSnapshot(
      usersRef,
      (snapshot) => {
        const list: AdminUser[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<AdminUser, 'id'>),
        }));
        setAdminUsers(list);

        // Auto seed default super admins if empty
        if (snapshot.empty) {
          const defaultAdminDoc = doc(db, 'admin_users', 'admin@email.com');
          setDoc(defaultAdminDoc, {
            name: 'Super Administrator',
            email: 'admin@email.com',
            password: 'Admin@123',
            role: 'SUPER_ADMIN',
            failedAttempts: 0,
            isLocked: false,
            createdAt: new Date().toISOString(),
          }).catch(console.error);

          const prafulAdminDoc = doc(db, 'admin_users', 'praful.akhani19@gmail.com');
          setDoc(prafulAdminDoc, {
            name: 'Praful Akhani (Super Admin)',
            email: 'praful.akhani19@gmail.com',
            password: 'Admin@123',
            role: 'SUPER_ADMIN',
            failedAttempts: 0,
            isLocked: false,
            createdAt: new Date().toISOString(),
          }).catch(console.error);
        }
      },
      (err) => {
        console.error('Error listening to admin_users:', err);
      }
    );

    return () => unsubscribeUsers();
  }, []);

  // Firestore Listeners for CRM Leads
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    setLoading(true);

    const verifiedRef = collection(db, 'verified_demos');
    const unsubscribeVerified = onSnapshot(
      verifiedRef,
      (snapshot) => {
        const verifiedList: CrmLead[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name || 'Unknown Contact',
            email: data.email || '',
            phone: data.phone || '',
            school: data.school || 'Unknown School',
            city: data.city || '',
            studentCount: data.studentCount || undefined,
            role: data.role || '',
            status: (data.status as LeadStatus) || 'VERIFIED_OTP',
            priority: (data.priority as LeadPriority) || 'WARM',
            verifiedAt: data.verifiedAt || data.createdAt,
            createdAt: data.verifiedAt || data.createdAt,
            emailDispatchedTo: data.targetEmailNotification || 'praful.akhani19@gmail.com',
            source: data.source || 'Website Demo Form',
            notes: data.notes || '',
            activityHistory: data.activityHistory || [],
          };
        });

        // Also listen to pending demo requests
        const pendingRef = collection(db, 'demo_requests');
        onSnapshot(
          pendingRef,
          (pendingSnap) => {
            const pendingList: CrmLead[] = pendingSnap.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                name: data.name || 'Pending Lead',
                email: data.email || '',
                phone: data.phone || '',
                school: data.school || 'Pending School',
                city: data.city || '',
                status: 'PHONE_OTP_PENDING' as LeadStatus,
                priority: 'WARM' as LeadPriority,
                createdAt: data.createdAt,
                emailDispatchedTo: 'praful.akhani19@gmail.com',
                source: 'Website Demo Request',
                activityHistory: [],
              };
            });

            // Combine and deduplicate
            const map = new Map<string, CrmLead>();
            pendingList.forEach((item) => map.set((item.phone || item.id).trim(), item));
            verifiedList.forEach((item) => map.set((item.phone || item.id).trim(), item));

            const combined = Array.from(map.values()).sort((a, b) => {
              const timeA = a.verifiedAt?.seconds || a.createdAt?.seconds || Date.now() / 1000;
              const timeB = b.verifiedAt?.seconds || b.createdAt?.seconds || Date.now() / 1000;
              return timeB - timeA;
            });

            setLeads(combined);
            setLoading(false);
          },
          (err) => {
            console.error('Error fetching pending demo requests:', err);
            setLeads(verifiedList);
            setLoading(false);
          }
        );
      },
      (err) => {
        console.error('Error fetching verified demos:', err);
        setLoading(false);
      }
    );

    return () => unsubscribeVerified();
  }, [isOpen, isAuthenticated]);

  // Firestore Listener for Deals
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    try {
      const dealsRef = collection(db, 'crm_deals');
      const unsubscribe = onSnapshot(
        dealsRef,
        (snap) => {
          if (!snap.empty) {
            const list: CrmDeal[] = snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<CrmDeal, 'id'>),
            }));
            setDeals(list);
          }
        },
        (err) => console.log('Firestore deals listener fallback:', err)
      );
      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, [isOpen, isAuthenticated]);

  // Firestore Listener for Activities
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    try {
      const actRef = collection(db, 'crm_activities');
      const unsubscribe = onSnapshot(
        actRef,
        (snap) => {
          if (!snap.empty) {
            const list: CrmActivity[] = snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<CrmActivity, 'id'>),
            }));
            setActivities(list);
          }
        },
        (err) => console.log('Firestore activities listener fallback:', err)
      );
      return () => unsubscribe();
    } catch (e) {
      console.error(e);
    }
  }, [isOpen, isAuthenticated]);

  // Fetch SMTP status on login
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/smtp-config')
        .then(async (res) => {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return res.json();
          }
          return null;
        })
        .then((data) => {
          if (!data) return;
          if (data.host) setSmtpHost(data.host);
          if (data.port) setSmtpPort(data.port);
          if (data.user) setSmtpUser(data.user);
          if (data.secure !== undefined) setSmtpSecure(Boolean(data.secure));
          if (data.targetRecipient) {
            setSmtpTargetRecipient(data.targetRecipient);
            setSmtpTestRecipient(data.targetRecipient);
          }
          setSmtpConfigured(Boolean(data.configured));
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  // ================= AUTHENTICATION HANDLERS =================
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    let userDoc = adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!userDoc) {
      try {
        const userRef = doc(db, 'admin_users', cleanEmail);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          userDoc = { id: snap.id, ...(snap.data() as Omit<AdminUser, 'id'>) };
        } else if (cleanEmail === 'admin@email.com' || cleanEmail === 'praful.akhani19@gmail.com') {
          const defaultDoc = {
            name: cleanEmail === 'praful.akhani19@gmail.com' ? 'Praful Akhani (Super Admin)' : 'Super Administrator',
            email: cleanEmail,
            password: 'Admin@123',
            role: 'SUPER_ADMIN' as const,
            failedAttempts: 0,
            isLocked: false,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, defaultDoc);
          userDoc = { id: cleanEmail, ...defaultDoc };
        }
      } catch (err) {
        console.error('Error fetching admin user doc on login:', err);
      }
    }

    if (!userDoc) {
      if ((cleanEmail === 'admin@email.com' || cleanEmail === 'praful.akhani19@gmail.com') && adminPassword === 'Admin@123') {
        const fallbackUser: AdminUser = {
          id: cleanEmail,
          name: cleanEmail === 'praful.akhani19@gmail.com' ? 'Praful Akhani (Super Admin)' : 'Super Administrator',
          email: cleanEmail,
          role: 'SUPER_ADMIN',
          failedAttempts: 0,
          isLocked: false,
        };
        setCurrentAdminUser(fallbackUser);
        setIsAuthenticated(true);
        localStorage.setItem('edusphere_admin_auth_session', JSON.stringify(fallbackUser));
        return;
      }
      setLoginError('Invalid Administrator credentials. Please verify your email.');
      return;
    }

    if (userDoc.isLocked) {
      setLoginError('⚠️ This account has been locked due to 5 consecutive failed login attempts. Contact a Super Admin.');
      return;
    }

    if (userDoc.password !== adminPassword) {
      const newAttempts = (userDoc.failedAttempts || 0) + 1;
      const isNowLocked = newAttempts >= 5;

      try {
        const userRef = doc(db, 'admin_users', userDoc.id);
        await updateDoc(userRef, {
          failedAttempts: newAttempts,
          isLocked: isNowLocked,
        });
      } catch (err) {
        console.error('Failed to increment failed attempts in Firestore:', err);
      }

      if (isNowLocked) {
        setLoginError('🚨 Account LOCKED! You exceeded 5 incorrect password attempts. Contact Super Admin.');
      } else {
        setLoginError(`Invalid password. Attempt ${newAttempts} of 5. After 5 attempts, the account will be locked.`);
      }
      return;
    }

    // Success
    try {
      const userRef = doc(db, 'admin_users', userDoc.id);
      await updateDoc(userRef, { failedAttempts: 0 });
    } catch (e) {}

    const sessionUser: AdminUser = { ...userDoc, failedAttempts: 0 };
    setCurrentAdminUser(sessionUser);
    setIsAuthenticated(true);
    localStorage.setItem('edusphere_admin_auth_session', JSON.stringify(sessionUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentAdminUser(null);
    setAdminPassword('');
    localStorage.removeItem('edusphere_admin_auth_session');
  };

  // ================= CRM LEAD HANDLERS =================
  const handleUpdateLeadStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      const ref = doc(db, 'verified_demos', id);
      await updateDoc(ref, { status: newStatus });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      showToast(`Lead status updated to ${newStatus.replace('_', ' ')}`);
    } catch (e) {
      try {
        const reqRef = doc(db, 'demo_requests', id);
        await updateDoc(reqRef, { status: newStatus });
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
        showToast(`Lead status updated to ${newStatus.replace('_', ' ')}`);
      } catch (err) {
        // Fallback local
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
        showToast(`Lead status updated to ${newStatus.replace('_', ' ')}`);
      }
    }
  };

  const handleUpdateLeadPriority = async (id: string, newPriority: LeadPriority) => {
    try {
      const ref = doc(db, 'verified_demos', id);
      await updateDoc(ref, { priority: newPriority });
    } catch (e) {}
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, priority: newPriority } : l)));
    if (selectedLeadForDetail?.id === id) {
      setSelectedLeadForDetail((prev) => (prev ? { ...prev, priority: newPriority } : null));
    }
    showToast(`Lead priority updated to ${newPriority}`);
  };

  const handleAddLeadActivityNote = async (id: string, noteText: string, type: LeadActivityNote['type']) => {
    const newNote: LeadActivityNote = {
      id: `note-${Date.now()}`,
      text: noteText,
      author: currentAdminUser?.name || 'Admin',
      timestamp: new Date().toISOString(),
      type,
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updatedHistory = [newNote, ...(l.activityHistory || [])];
          return { ...l, activityHistory: updatedHistory };
        }
        return l;
      })
    );

    if (selectedLeadForDetail?.id === id) {
      setSelectedLeadForDetail((prev) =>
        prev ? { ...prev, activityHistory: [newNote, ...(prev.activityHistory || [])] } : null
      );
    }

    try {
      const targetLead = leads.find((l) => l.id === id);
      const updatedHistory = [newNote, ...(targetLead?.activityHistory || [])];
      const ref = doc(db, 'verified_demos', id);
      await updateDoc(ref, { activityHistory: updatedHistory });
    } catch (e) {}

    showToast('Activity note logged successfully!');
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'verified_demos', id));
    } catch (e) {
      try {
        await deleteDoc(doc(db, 'demo_requests', id));
      } catch (err) {}
    }
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast('Lead deleted successfully.');
  };

  const handleBulkUpdateStatus = async (newStatus: LeadStatus) => {
    const ids: string[] = Array.from(selectedLeadIds);
    for (const id of ids) {
      await handleUpdateLeadStatus(id, newStatus);
    }
    setSelectedLeadIds(new Set<string>());
    showToast(`Updated status for ${ids.length} leads.`);
  };

  const handleBulkDeleteLeads = async () => {
    if (!window.confirm(`Delete ${selectedLeadIds.size} selected leads?`)) return;
    const ids: string[] = Array.from(selectedLeadIds);
    for (const id of ids) {
      await handleDeleteLead(id);
    }
    setSelectedLeadIds(new Set<string>());
  };

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mPhone || !mSchool) return;

    setIsSubmittingLead(true);
    const fullPhone = formatFullPhoneNumber(mIsdCode, mPhone);

    const newLeadData: CrmLead = {
      id: `manual-${Date.now()}`,
      name: mName.trim(),
      email: mEmail.trim(),
      phone: fullPhone,
      school: mSchool.trim(),
      city: mCity.trim(),
      studentCount: mStudentCount,
      status: mStatus,
      priority: mPriority,
      source: mSource,
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
      activityHistory: [
        {
          id: `note-${Date.now()}`,
          text: `Lead created manually by ${currentAdminUser?.name || 'Admin'}`,
          author: currentAdminUser?.name || 'Admin',
          timestamp: new Date().toISOString(),
          type: 'STATUS_CHANGE',
        },
      ],
    };

    try {
      const docRef = await addDoc(collection(db, 'verified_demos'), {
        ...newLeadData,
        createdAt: serverTimestamp(),
        verifiedAt: serverTimestamp(),
      });
      newLeadData.id = docRef.id;
    } catch (e) {
      console.log('Local fallback lead creation');
    }

    setLeads((prev) => [newLeadData, ...prev]);
    setIsSubmittingLead(false);
    setIsAddLeadModalOpen(false);
    // Reset
    setMName('');
    setMEmail('');
    setMPhone('');
    setMSchool('');
    setMCity('');
    showToast('New lead added to CRM successfully!');
  };

  // ================= CRM DEALS HANDLERS =================
  const handleAddDeal = async (dealData: Omit<CrmDeal, 'id' | 'createdAt'>) => {
    const newDeal: CrmDeal = {
      id: `deal-${Date.now()}`,
      ...dealData,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'crm_deals'), newDeal);
      newDeal.id = docRef.id;
    } catch (e) {}

    setDeals((prev) => [newDeal, ...prev]);
    showToast(`Deal "${dealData.title}" created in pipeline!`);
  };

  const handleUpdateDealStage = async (dealId: string, newStage: DealStage) => {
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));
    try {
      const dealRef = doc(db, 'crm_deals', dealId);
      await updateDoc(dealRef, { stage: newStage });
    } catch (e) {}
    showToast(`Deal moved to stage ${newStage.replace('_', ' ')}`);
  };

  const handleDeleteDeal = async (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    try {
      await deleteDoc(doc(db, 'crm_deals', dealId));
    } catch (e) {}
    showToast('Deal removed from pipeline.');
  };

  const handleConvertLeadToDeal = (lead: CrmLead) => {
    const newDeal: Omit<CrmDeal, 'id' | 'createdAt'> = {
      title: `${lead.school || lead.name} - ERP License`,
      schoolName: lead.school || 'School Client',
      contactName: lead.name,
      contactEmail: lead.email,
      contactPhone: lead.phone,
      stage: 'QUALIFICATION',
      amount: (lead.studentCount || 500) * 120,
      probability: 50,
      expectedCloseDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      assignedTo: currentAdminUser?.name || 'Sales Team',
      notes: `Converted from Lead ${lead.id}. ${lead.notes || ''}`,
      leadId: lead.id,
    };
    handleAddDeal(newDeal);
    handleUpdateLeadStatus(lead.id, 'CONVERTED');
    setActiveNavTab('deals');
  };

  // ================= CRM ACTIVITIES HANDLERS =================
  const handleAddActivity = async (activityData: Omit<CrmActivity, 'id' | 'createdAt'>) => {
    const newAct: CrmActivity = {
      id: `act-${Date.now()}`,
      ...activityData,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'crm_activities'), newAct);
      newAct.id = docRef.id;
    } catch (e) {}

    setActivities((prev) => [newAct, ...prev]);
    showToast(`Activity "${activityData.title}" scheduled!`);
  };

  const handleToggleActivityStatus = async (id: string, currentStatus: ActivityStatus) => {
    const nextStatus: ActivityStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)));
    try {
      const actRef = doc(db, 'crm_activities', id);
      await updateDoc(actRef, { status: nextStatus });
    } catch (e) {}
    showToast(nextStatus === 'COMPLETED' ? 'Activity marked completed ✓' : 'Activity reopened');
  };

  const handleDeleteActivity = async (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteDoc(doc(db, 'crm_activities', id));
    } catch (e) {}
    showToast('Activity deleted.');
  };

  // ================= CRM SCHOOLS HANDLERS =================
  const handleAddSchool = async (schoolData: Omit<CrmSchool, 'id' | 'createdAt'>) => {
    const newSchool: CrmSchool = {
      id: `sch-${Date.now()}`,
      ...schoolData,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'crm_schools'), newSchool);
      newSchool.id = docRef.id;
    } catch (e) {}

    setSchools((prev) => [newSchool, ...prev]);
    showToast(`School "${schoolData.name}" added to directory!`);
  };

  const handleDeleteSchool = async (id: string) => {
    setSchools((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteDoc(doc(db, 'crm_schools', id));
    } catch (e) {}
    showToast('School account removed.');
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3500);
  };

  // Export CSV Helper
  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Name', 'Phone', 'Email', 'School', 'City', 'Status', 'Priority', 'Source', 'Captured At'];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.school || ''}"`,
      `"${l.city || ''}"`,
      `"${l.status || ''}"`,
      `"${l.priority || ''}"`,
      `"${l.source || ''}"`,
      `"${formatISTTimestamp(l.createdAt || l.verifiedAt)}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduSphere_CRM_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CRM leads CSV exported successfully.');
  };

  // ================= RENDER LOGIN SCREEN (If not authenticated) =================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white font-display">EduSphere CRM Portal</h2>
            <p className="text-xs text-slate-400">
              Sign in with your Administrator or Sales account to access pipeline and leads.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Staff Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@email.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotPassModalOpen(true)}
                  className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition cursor-pointer"
            >
              Authenticate & Enter CRM
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">Default Super Admin Credentials:</div>
            <div>Email: <span className="font-mono text-emerald-400">praful.akhani19@gmail.com</span> or <span className="font-mono text-emerald-400">admin@email.com</span></div>
            <div>Password: <span className="font-mono text-emerald-400">Admin@123</span></div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            ← Return to Website
          </button>
        </div>
      </div>
    );
  }

  // ================= RENDER MAIN CRM SUITE =================
  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white font-display">EduSphere CRM</h2>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">OPERATING SYSTEM</span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Card */}
        <div className="p-3 mx-3 mt-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center">
            {currentAdminUser?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{currentAdminUser?.name || 'Administrator'}</div>
            <div className="text-[10px] text-emerald-400 font-mono truncate">{currentAdminUser?.role || 'SUPER_ADMIN'}</div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {/* 1. CRM Overview */}
          <button
            onClick={() => {
              setActiveNavTab('overview');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'overview'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>CRM Overview</span>
            </div>
          </button>

          {/* 2. Leads & Inquiries */}
          <button
            onClick={() => {
              setActiveNavTab('leads');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'leads'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Leads & Inquiries</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-mono">
              {leads.length}
            </span>
          </button>

          {/* 3. Deals Pipeline */}
          <button
            onClick={() => {
              setActiveNavTab('deals');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'deals'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Deals Pipeline</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-indigo-300 font-mono">
              {deals.length}
            </span>
          </button>

          {/* 4. Activities & Follow-ups */}
          <button
            onClick={() => {
              setActiveNavTab('activities');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'activities'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              <span>Follow-ups & Demos</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-amber-400 font-mono">
              {activities.filter((a) => a.status === 'PENDING').length}
            </span>
          </button>

          {/* 5. School Accounts Directory */}
          <button
            onClick={() => {
              setActiveNavTab('schools');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'schools'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <School className="w-4 h-4 text-purple-400" />
              <span>School Accounts</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-purple-300 font-mono">
              {schools.length}
            </span>
          </button>

          <div className="pt-2 pb-1 px-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Settings & Access</div>
          </div>

          {/* 6. Team & Staff Accounts */}
          <button
            onClick={() => {
              setActiveNavTab('team');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'team'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>Team Accounts & Roles</span>
            </div>
          </button>

          {/* 7. SMTP Outbound Alert Config */}
          <button
            onClick={() => {
              setActiveNavTab('smtp');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'smtp'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Outbound SMTP Server</span>
            </div>
          </button>

          {/* 8. Security */}
          <button
            onClick={() => {
              setActiveNavTab('security');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'security'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-purple-400" />
              <span>Security & Password</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-1.5">
          <button
            onClick={handleLogout}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-800 hover:border-red-500/40 text-xs font-bold transition flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Sign Out</span>
            </span>
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={onClose}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition flex items-center justify-between cursor-pointer"
          >
            <span>Exit to Website</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-display truncate">
                {activeNavTab === 'overview' && 'Executive CRM & Pipeline Overview'}
                {activeNavTab === 'leads' && 'School Leads & Demo Inquiries'}
                {activeNavTab === 'deals' && 'School ERP Sales Pipeline'}
                {activeNavTab === 'activities' && 'Follow-up Calls, Visits & Demos'}
                {activeNavTab === 'schools' && 'Institutional Client Directory'}
                {activeNavTab === 'team' && 'Staff Accounts & RBAC Roles'}
                {activeNavTab === 'smtp' && 'Outbound Email & Alert Server'}
                {activeNavTab === 'security' && 'Security & Password Settings'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 text-[11px]">Alert Target:</span>
              <strong className="text-white font-mono text-[11px]">praful.akhani19@gmail.com</strong>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Close CRM"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* TOAST ALERT BANNER */}
        {actionSuccessMsg && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/50 px-6 py-2.5 text-xs text-emerald-300 font-bold flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg('')} className="text-emerald-400 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* SMTP CONFIG WARNING BANNER */}
        {!smtpConfigured && activeNavTab !== 'smtp' && (
          <div className="bg-amber-950/90 border-b border-amber-500/50 px-6 py-3 text-xs text-amber-200 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Outbound SMTP Server Not Configured! Live email OTP verification & lead alert notifications require SMTP settings (e.g. Hostinger SMTP / Gmail App Password).</span>
            </div>
            <button
              onClick={() => setActiveNavTab('smtp')}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition cursor-pointer shrink-0 shadow"
            >
              Configure SMTP & OTP Now ⚙️
            </button>
          </div>
        )}
        {/* SCROLLABLE MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeNavTab === 'overview' && (
            <CrmOverviewTab
              leads={leads}
              deals={deals}
              activities={activities}
              schools={schools}
              onNavigateTab={(tab) => setActiveNavTab(tab)}
              onOpenAddLead={() => setIsAddLeadModalOpen(true)}
              onOpenAddDeal={() => setIsAddDealModalOpen(true)}
              onOpenAddActivity={() => setIsAddActivityModalOpen(true)}
            />
          )}

          {/* TAB 2: LEADS */}
          {activeNavTab === 'leads' && (
            <CrmLeadsTab
              leads={leads}
              loading={loading}
              onOpenLeadDetail={(lead) => {
                setSelectedLeadForDetail(lead);
                setIsLeadDetailModalOpen(true);
              }}
              onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onBulkUpdateStatus={handleBulkUpdateStatus}
              onDeleteLead={handleDeleteLead}
              onBulkDeleteLeads={handleBulkDeleteLeads}
              onExportCSV={exportToCSV}
              selectedLeadIds={selectedLeadIds}
              setSelectedLeadIds={setSelectedLeadIds}
            />
          )}

          {/* TAB 3: DEALS */}
          {activeNavTab === 'deals' && (
            <CrmDealsTab
              deals={deals}
              onAddDeal={handleAddDeal}
              onUpdateDealStage={handleUpdateDealStage}
              onDeleteDeal={handleDeleteDeal}
              isAddModalOpen={isAddDealModalOpen}
              setIsAddModalOpen={setIsAddDealModalOpen}
            />
          )}

          {/* TAB 4: ACTIVITIES */}
          {activeNavTab === 'activities' && (
            <CrmActivitiesTab
              activities={activities}
              onAddActivity={handleAddActivity}
              onToggleStatus={handleToggleActivityStatus}
              onDeleteActivity={handleDeleteActivity}
              isAddModalOpen={isAddActivityModalOpen}
              setIsAddModalOpen={setIsAddActivityModalOpen}
            />
          )}

          {/* TAB 5: SCHOOLS */}
          {activeNavTab === 'schools' && (
            <CrmSchoolsTab
              schools={schools}
              onAddSchool={handleAddSchool}
              onDeleteSchool={handleDeleteSchool}
              isAddModalOpen={isAddSchoolModalOpen}
              setIsAddModalOpen={setIsAddSchoolModalOpen}
            />
          )}

          {/* TAB 6: TEAM & USERS */}
          {activeNavTab === 'team' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-sky-400" />
                      <span>Staff Accounts & RBAC Permissions</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Manage user access roles for sales executives, counselors, and system administrators.
                    </p>
                  </div>
                </div>

                {userActionMsg && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                      userActionMsg.isError
                        ? 'bg-red-950/60 border-red-500/50 text-red-300'
                        : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    }`}
                  >
                    {userActionMsg.isError ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>{userActionMsg.text}</span>
                  </div>
                )}

                {/* Add New Staff Member Form */}
                <form onSubmit={handleCreateAdminUser} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Create New Staff or Admin Account</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={uName}
                        onChange={(e) => setUName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="staff@edusphere.com"
                        value={uEmail}
                        onChange={(e) => setUEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Initial Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={uPassword}
                        onChange={(e) => setUPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Role</label>
                      <select
                        value={uRole}
                        onChange={(e) => setURole(e.target.value as 'SUPER_ADMIN' | 'TEAM_MEMBER')}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-sky-400 cursor-pointer"
                      >
                        <option value="TEAM_MEMBER">Team Member / Sales</option>
                        <option value="SUPER_ADMIN">Super Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isCreatingUser}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isCreatingUser ? 'Creating...' : 'Add Staff Member'}</span>
                    </button>
                  </div>
                </form>

                {/* Existing Users List */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Active Accounts ({adminUsers.length})
                  </div>
                  {adminUsers.map((u) => (
                    <div
                      key={u.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{u.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.role === 'SUPER_ADMIN'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              }`}
                            >
                              {u.role}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {u.isLocked ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 flex items-center gap-1">
                              <BadgeAlert className="w-3.5 h-3.5 text-red-400" />
                              Locked
                            </span>
                            <button
                              onClick={() => handleUnlockUser(u.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition cursor-pointer flex items-center gap-1"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              Unlock
                            </button>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                            Active
                          </span>
                        )}

                        {u.email !== 'praful.akhani19@gmail.com' && u.email !== 'admin@email.com' && (
                          <button
                            onClick={() => handleDeleteAdminUser(u.id)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SMTP OUTBOUND SERVER & EMAIL OTP CONFIGURATION */}
          {activeNavTab === 'smtp' && (
            <div className="space-y-6 max-w-4xl">
              {/* Header Status Card */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Server className="w-5 h-5 text-emerald-400" />
                      <span>Outbound SMTP Server & OTP Verification Gateway</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure your SMTP credentials to send 6-digit OTP verification codes to demo leads and receive instant notifications in your inbox.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        smtpConfigured
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${smtpConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      {smtpConfigured ? 'SMTP Active & Connected' : 'SMTP Not Configured'}
                    </span>
                  </div>
                </div>

                {/* Quick Presets Bar */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Quick Preset One-Click Setup
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => applySmtpPreset('gmail')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center text-center gap-1 cursor-pointer ${
                        smtpHost === 'smtp.gmail.com'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-black text-white">Gmail / Workspace</span>
                      <span className="text-[10px] text-slate-400 font-mono">Port 587 TLS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applySmtpPreset('mailgun')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center text-center gap-1 cursor-pointer ${
                        smtpHost === 'smtp.mailgun.org'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-black text-white">Mailgun</span>
                      <span className="text-[10px] text-slate-400 font-mono">Port 587 TLS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applySmtpPreset('brevo')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center text-center gap-1 cursor-pointer ${
                        smtpHost === 'smtp-relay.brevo.com'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-black text-white">Brevo (Sendinblue)</span>
                      <span className="text-[10px] text-slate-400 font-mono">Port 587 TLS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applySmtpPreset('sendgrid')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center text-center gap-1 cursor-pointer ${
                        smtpHost === 'smtp.sendgrid.net'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-black text-white">SendGrid</span>
                      <span className="text-[10px] text-slate-400 font-mono">Port 587 TLS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applySmtpPreset('hostinger')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center text-center gap-1 cursor-pointer ${
                        smtpHost === 'smtp.hostinger.com'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="font-black text-white">Hostinger Mail</span>
                      <span className="text-[10px] text-slate-400 font-mono">Port 465 SSL</span>
                    </button>
                  </div>
                </div>

                {/* Status Alert Banner */}
                {smtpStatusMsg && (
                  <div
                    className={`p-4 rounded-2xl text-xs font-bold border flex items-start gap-2.5 animate-in fade-in ${
                      smtpStatusMsg.isError
                        ? 'bg-red-950/60 border-red-500/50 text-red-200'
                        : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                    }`}
                  >
                    {smtpStatusMsg.isError ? (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{smtpStatusMsg.text}</span>
                  </div>
                )}

                {/* Main Configuration Form */}
                <form onSubmit={handleSaveSmtpConfig} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* SMTP Host */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300">SMTP Relay Host *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. smtp.gmail.com"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-emerald-400 transition"
                      />
                    </div>

                    {/* SMTP Port */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300">Port *</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          required
                          placeholder="587"
                          value={smtpPort}
                          onChange={(e) => {
                            const p = Number(e.target.value);
                            setSmtpPort(p);
                            if (p === 465) setSmtpSecure(true);
                            if (p === 587 || p === 25 || p === 2525) setSmtpSecure(false);
                          }}
                          className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-emerald-400 transition"
                        />
                        <div className="flex items-center gap-1.5 px-3 bg-slate-950 border border-slate-700 rounded-xl">
                          <input
                            type="checkbox"
                            id="smtpSecureToggle"
                            checked={smtpSecure}
                            onChange={(e) => setSmtpSecure(e.target.checked)}
                            className="rounded border-slate-700 text-emerald-400 focus:ring-0 cursor-pointer"
                          />
                          <label htmlFor="smtpSecureToggle" className="text-[11px] font-bold text-slate-300 cursor-pointer">
                            SSL (465)
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Target Recipient Email */}
                    <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                      <label className="text-[11px] font-bold text-slate-300">Admin Lead Alert Inbox *</label>
                      <input
                        type="email"
                        required
                        placeholder="praful.akhani19@gmail.com"
                        value={smtpTargetRecipient}
                        onChange={(e) => setSmtpTargetRecipient(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-emerald-400 transition"
                      />
                    </div>

                    {/* SMTP Username */}
                    <div className="space-y-1.5 sm:col-span-1 lg:col-span-2">
                      <label className="text-[11px] font-bold text-slate-300">SMTP Username / Sender Email *</label>
                      <input
                        type="text"
                        required
                        placeholder="praful.akhani19@gmail.com"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-emerald-400 transition"
                      />
                    </div>

                    {/* SMTP Password / App Password */}
                    <div className="space-y-1.5 sm:col-span-1 lg:col-span-1">
                      <label className="text-[11px] font-bold text-slate-300">SMTP Password / App Password *</label>
                      <div className="relative">
                        <input
                          type={smtpShowPass ? 'text' : 'password'}
                          placeholder={smtpConfigured ? '••••••••••••••••' : 'Enter 16-char App Password'}
                          value={smtpPass}
                          onChange={(e) => setSmtpPass(e.target.value)}
                          className="w-full px-3.5 py-2.5 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-emerald-400 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setSmtpShowPass(!smtpShowPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {smtpShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-slate-400">
                      💡 For Gmail/Google Workspace, create a 16-character <strong>App Password</strong> under your Google Account Security settings.
                    </p>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save SMTP Settings</span>
                    </button>
                  </div>
                </form>

                {/* Live Diagnostic & Test Section */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Live Testing & Verification Console</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Real-time SMTP Engine</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">Test Recipient Email</label>
                      <input
                        type="email"
                        placeholder="praful.akhani19@gmail.com"
                        value={smtpTestRecipient}
                        onChange={(e) => setSmtpTestRecipient(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-end gap-2.5">
                      <button
                        type="button"
                        onClick={handleTestSmtpConnection}
                        disabled={smtpTesting}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        {smtpTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>Send Test Email</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTestOtpDispatch}
                        disabled={smtpTesting}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Dispatch Test OTP</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gmail App Password Setup Guide */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs text-slate-300">
                  <div className="font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>How to set up Gmail / Google Workspace SMTP:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] pl-1">
                    <li>Go to your <strong>Google Account</strong> (myaccount.google.com) &gt; <strong>Security</strong>.</li>
                    <li>Ensure <strong>2-Step Verification</strong> is switched ON.</li>
                    <li>Search for <strong>App Passwords</strong> in the search bar.</li>
                    <li>Create a new App Password named <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">EduSphere ERP</code>.</li>
                    <li>Copy the 16-letter generated key (without spaces) and paste it into the <strong>SMTP Password</strong> field above.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SECURITY & PASSWORD SETTINGS */}
          {activeNavTab === 'security' && (
            <div className="space-y-6 max-w-xl">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-purple-400" />
                    <span>Account Security & Password Settings</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update your administrator password and manage active login session.
                  </p>
                </div>

                {passChangeMsg && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                      passChangeMsg.isError
                        ? 'bg-red-950/60 border-red-500/50 text-red-300'
                        : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    }`}
                  >
                    {passChangeMsg.isError ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>{passChangeMsg.text}</span>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Session</span>
                  <div className="text-sm font-bold text-white">{currentAdminUser?.name}</div>
                  <div className="text-xs font-mono text-emerald-400">{currentAdminUser?.email}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Role: <span className="font-bold text-purple-300">{currentAdminUser?.role}</span></div>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">New Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassInput}
                      onChange={(e) => setNewPassInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Re-type new password"
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{isChangingPass ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </form>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Current Session</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: LEAD 360 DETAIL MODAL */}
      <CrmLeadDetailModal
        lead={selectedLeadForDetail}
        isOpen={isLeadDetailModalOpen}
        onClose={() => {
          setIsLeadDetailModalOpen(false);
          setSelectedLeadForDetail(null);
        }}
        onUpdateStatus={handleUpdateLeadStatus}
        onUpdatePriority={handleUpdateLeadPriority}
        onAddActivityNote={handleAddLeadActivityNote}
        onConvertToDeal={handleConvertLeadToDeal}
        onDeleteLead={handleDeleteLead}
        currentUserName={currentAdminUser?.name || 'Super Admin'}
      />

      {/* MODAL 2: ADD MANUAL LEAD */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white font-display">Add CRM Lead Record</h3>
              </div>
              <button
                onClick={() => setIsAddLeadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal Rajesh Sharma"
                    value={mName}
                    onChange={(e) => setMName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">School / Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DPS International"
                    value={mSchool}
                    onChange={(e) => setMSchool(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Phone Number *</label>
                  <div className="flex gap-1.5">
                    <select
                      value={mIsdCode}
                      onChange={(e) => setMIsdCode(e.target.value)}
                      className="w-24 px-2 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-mono"
                    >
                      {COUNTRY_ISD_LIST.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={mPhone}
                      onChange={(e) => setMPhone(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Email Address</label>
                  <input
                    type="email"
                    placeholder="principal@school.edu"
                    value={mEmail}
                    onChange={(e) => setMEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">City / District</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={mCity}
                    onChange={(e) => setMCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Status</label>
                  <select
                    value={mStatus}
                    onChange={(e) => setMStatus(e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="VERIFIED_OTP">Verified OTP</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                    <option value="PROPOSAL_SENT">Proposal Sent</option>
                    <option value="CONVERTED">Closed Won</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Priority Score</label>
                  <select
                    value={mPriority}
                    onChange={(e) => setMPriority(e.target.value as LeadPriority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="HOT">🔥 Hot</option>
                    <option value="WARM">⚡ Warm</option>
                    <option value="COLD">❄️ Cold</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black shadow-md cursor-pointer"
                >
                  {isSubmittingLead ? 'Saving...' : 'Add Lead to CRM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FORGOT PASSWORD MODAL */}
      {forgotPassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white font-display">Reset Staff Password</h3>
              </div>
              <button
                onClick={() => {
                  setForgotPassModalOpen(false);
                  setForgotStatusMsg(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter your registered staff email address to receive password reset instructions.
            </p>

            {forgotStatusMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-bold border flex items-start gap-2 ${
                  forgotStatusMsg.isError
                    ? 'bg-red-950/60 border-red-500/50 text-red-300'
                    : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                }`}
              >
                {forgotStatusMsg.isError ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                <span className="leading-relaxed">{forgotStatusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSendForgotPasswordEmail} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Staff Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@email.com"
                  value={forgotEmailInput}
                  onChange={(e) => setForgotEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setForgotPassModalOpen(false);
                    setForgotStatusMsg(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingResetEmail}
                  className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {isSendingResetEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Reset Authorization</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
