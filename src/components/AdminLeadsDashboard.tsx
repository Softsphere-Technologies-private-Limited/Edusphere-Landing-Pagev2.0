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
} from 'lucide-react';
import { db } from '../lib/firebase';
import { formatISTTimestamp, formatISTTime } from '../utils/dateUtils';
import { COUNTRY_ISD_LIST, detectDefaultIsdCode, formatFullPhoneNumber } from '../utils/phoneUtils';
import { AdminUser } from '../types';
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


interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  status: 'VERIFIED_OTP' | 'PHONE_OTP_PENDING' | 'CONTACTED' | 'DEMO_SCHEDULED' | 'CONVERTED' | 'DISQUALIFIED';
  verifiedAt?: any;
  createdAt?: any;
  source?: string;
  notes?: string;
  emailDispatchedTo?: string;
}

interface AdminLeadsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLeadsDashboard: React.FC<AdminLeadsDashboardProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Sidebar Navigation State
  const [activeNavTab, setActiveNavTab] = useState<'leads' | 'team' | 'smtp' | 'security'>('leads');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  
  // Admin Login Authentication State
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  const [manualModalOpen, setManualModalOpen] = useState<boolean>(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

  // Auto-restore admin authentication session from localStorage on mount
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

  // Manual Lead Form State
  const [mName, setMName] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mIsdCode, setMIsdCode] = useState('+91');
  const [mSchool, setMSchool] = useState('');
  const [mStatus, setMStatus] = useState<Lead['status']>('VERIFIED_OTP');

  // Auto-detect user's default ISD code on mount
  useEffect(() => {
    detectDefaultIsdCode().then((code) => {
      if (code) setMIsdCode(code);
    });
  }, []);

  // SMTP Email Settings State
  const [smtpModalOpen, setSmtpModalOpen] = useState<boolean>(false);
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

  // User Accounts & Role Management State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);

  // Modals for team users and password change
  const [teamModalOpen, setTeamModalOpen] = useState<boolean>(false);
  const [teamModalTab, setTeamModalTab] = useState<'LIST' | 'CREATE'>('LIST');
  const [changePassModalOpen, setChangePassModalOpen] = useState<boolean>(false);
  const [forgotPassModalOpen, setForgotPassModalOpen] = useState<boolean>(false);
  const [urlResetModalOpen, setUrlResetModalOpen] = useState<boolean>(false);

  // Form states for Create User
  const [uName, setUName] = useState<string>('');
  const [uEmail, setUEmail] = useState<string>('');
  const [uPassword, setUPassword] = useState<string>('');
  const [uRole, setURole] = useState<'SUPER_ADMIN' | 'TEAM_MEMBER'>('TEAM_MEMBER');
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
  const [userActionMsg, setUserActionMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Form states for Change Password
  const [currPassInput, setCurrPassInput] = useState<string>('');
  const [newPassInput, setNewPassInput] = useState<string>('');
  const [confirmPassInput, setConfirmPassInput] = useState<string>('');
  const [passChangeMsg, setPassChangeMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isChangingPass, setIsChangingPass] = useState<boolean>(false);

  // Form states for Forgot / Request Reset Link
  const [forgotEmailInput, setForgotEmailInput] = useState<string>('');
  const [forgotStatusMsg, setForgotStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSendingResetEmail, setIsSendingResetEmail] = useState<boolean>(false);

  // Form states for URL Reset Password
  const [resetUrlEmail, setResetUrlEmail] = useState<string>('');
  const [resetUrlToken, setResetUrlToken] = useState<string>('');
  const [urlNewPass, setUrlNewPass] = useState<string>('');
  const [urlConfirmPass, setUrlConfirmPass] = useState<string>('');
  const [urlResetMsg, setUrlResetMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isUrlResetting, setIsUrlResetting] = useState<boolean>(false);

  // Check URL query parameters for reset-password or admin-login link
  useEffect(() => {
    try {
      const getQueryValue = (key: string): string | null => {
        try {
          const href = window.location.href;
          // 1. Standard search
          const searchParams = new URLSearchParams(window.location.search);
          let val = searchParams.get(key) || searchParams.get(`amp;${key}`);
          if (val) return val;

          // 2. Hash search
          if (window.location.hash) {
            const hashStr = window.location.hash.includes('?') 
              ? window.location.hash.split('?')[1] 
              : window.location.hash.replace(/^#/, '');
            const hashParams = new URLSearchParams(hashStr);
            val = hashParams.get(key) || hashParams.get(`amp;${key}`);
            if (val) return val;
          }

          // 3. Regex fallback
          const regex = new RegExp(`[?&](?:amp;)?${key}=([^&%#]+)`, 'i');
          const match = href.match(regex);
          if (match && match[1]) {
            return decodeURIComponent(match[1]);
          }
        } catch (e) {}
        return null;
      };

      const href = window.location.href;
      const action = getQueryValue('action');
      const email = getQueryValue('email');
      const token = getQueryValue('token');

      if ((action === 'reset-password' || href.includes('action=reset-password')) && email) {
        setResetUrlEmail(email);
        setResetUrlToken(token || '');
        setUrlResetModalOpen(true);
      }
    } catch (e) {
      console.error('Failed to parse URL params in AdminLeadsDashboard:', e);
    }
  }, []);

  // Firestore Listener for Admin Users collection
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

        // Auto seed default super admins if not present
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


  // Fetch current SMTP status on mount/login
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

  const handleTestEmail = async () => {
    const target = smtpTestRecipient || smtpTargetRecipient || 'praful.akhani19@gmail.com';
    if (!smtpUser) {
      setSmtpStatusMsg({ text: 'Please enter your Sender Email Address.', isError: true });
      return;
    }
    setSmtpTesting(true);
    setSmtpStatusMsg(null);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass,
          secure: smtpSecure,
          email: target,
        }),
      });
      
      const rawText = await res.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        if (rawText.trim().startsWith('<') || !res.ok) {
          throw new Error(`API endpoint (/api/test-email) returned HTTP ${res.status} HTML response instead of JSON. On Hostinger, ensure Node.js server is started via "node dist/server.cjs" or "npm start" on port 3000.`);
        }
        throw new Error('API server returned unexpected format. The server might be restarting or unreachable.');
      }

      if (data.success) {
        setSmtpStatusMsg({ text: `✅ Test lead alert email successfully sent to ${target}!`, isError: false });
        setSmtpConfigured(true);
      } else {
        setSmtpStatusMsg({ text: `❌ ${data.error || 'Failed to deliver test email'}`, isError: true });
      }
    } catch (err: any) {
      setSmtpStatusMsg({ text: `❌ ${err.message}`, isError: true });
    } finally {
      setSmtpTesting(false);
    }
  };

  const handleSaveSmtpSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass,
          secure: smtpSecure,
          targetRecipient: smtpTargetRecipient,
        }),
      });

      const rawText = await res.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        if (rawText.trim().startsWith('<') || !res.ok) {
          throw new Error(`API endpoint (/api/smtp-config) returned HTTP ${res.status} HTML response. On Hostinger, verify Node.js server is active with command "node dist/server.cjs".`);
        }
        throw new Error('Server returned invalid response. Server may be initializing.');
      }

      if (data.success) {
        setSmtpConfigured(Boolean(data.configured));
        setActionSuccessMsg('SMTP Server Configuration updated successfully!');
        setSmtpModalOpen(false);
        setTimeout(() => setActionSuccessMsg(''), 4000);
      } else {
        setSmtpStatusMsg({ text: `❌ ${data.message || 'Failed to update SMTP settings.'}`, isError: true });
      }
    } catch (err: any) {
      console.error('Failed to save SMTP config:', err);
      setSmtpStatusMsg({ text: `❌ ${err.message}`, isError: true });
    }
  };

  // Real-time Firestore query listener
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    setLoading(true);

    // Listen to 'verified_demos' collection
    const verifiedRef = collection(db, 'verified_demos');
    const unsubscribeVerified = onSnapshot(
      verifiedRef,
      (snapshot) => {
        const verifiedList: Lead[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name || 'Unknown Contact',
            email: data.email || '',
            phone: data.phone || '',
            school: data.school || 'Unknown School',
            status: (data.status as Lead['status']) || 'VERIFIED_OTP',
            verifiedAt: data.verifiedAt || data.createdAt,
            createdAt: data.verifiedAt || data.createdAt,
            emailDispatchedTo: data.targetEmailNotification || 'praful.akhani19@gmail.com',
            source: 'Website Live Demo Modal',
          };
        });

        // Also listen to 'demo_requests' pending collection
        const pendingRef = collection(db, 'demo_requests');
        onSnapshot(
          pendingRef,
          (pendingSnap) => {
            const pendingList: Lead[] = pendingSnap.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                name: data.name || 'Pending Lead',
                email: data.email || '',
                phone: data.phone || '',
                school: data.school || 'Pending School',
                status: 'PHONE_OTP_PENDING',
                createdAt: data.createdAt,
                emailDispatchedTo: 'praful.akhani19@gmail.com',
                source: 'Website Demo Request',
              };
            });

            // Combine and deduplicate by phone/email
            const map = new Map<string, Lead>();
            // Add pending first
            pendingList.forEach((item) => map.set((item.phone || item.id).trim(), item));
            // Overwrite with verified
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

    return () => {
      unsubscribeVerified();
    };
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    
    // Look up in loaded adminUsers
    let userDoc = adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    // Fallback search in Firestore directly if user list is empty or default emails
    if (!userDoc) {
      try {
        const userRef = doc(db, 'admin_users', cleanEmail);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          userDoc = { id: snap.id, ...(snap.data() as Omit<AdminUser, 'id'>) };
        } else if (cleanEmail === 'admin@email.com' || cleanEmail === 'praful.akhani19@gmail.com') {
          // Auto-seed default admin account in Firestore
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
        console.error('Error checking user credentials:', err);
      }
    }

    // Default admin master bypass for default credentials (admin@email.com or praful.akhani19@gmail.com with Admin@123)
    if ((cleanEmail === 'admin@email.com' || cleanEmail === 'praful.akhani19@gmail.com') && adminPassword === 'Admin@123') {
      const superAdminObj: AdminUser = {
        id: userDoc ? userDoc.id : cleanEmail,
        name: userDoc?.name || (cleanEmail === 'praful.akhani19@gmail.com' ? 'Praful Akhani (Super Admin)' : 'Super Administrator'),
        email: cleanEmail,
        password: 'Admin@123',
        role: 'SUPER_ADMIN',
        failedAttempts: 0,
        isLocked: false,
      };

      try {
        const userRef = doc(db, 'admin_users', cleanEmail);
        await setDoc(userRef, superAdminObj, { merge: true });
      } catch (e) {
        console.error('Error updating master admin doc:', e);
      }

      setCurrentAdminUser(superAdminObj);
      setIsAuthenticated(true);
      setLoginError('');
      try {
        localStorage.setItem('edusphere_admin_auth_session', JSON.stringify(superAdminObj));
      } catch (e) {}
      return;
    }

    if (!userDoc) {
      setLoginError('No registered user account found for this email.');
      return;
    }

    // 1. Check if account is locked (after 3 failed attempts)
    if (userDoc.isLocked || (userDoc.failedAttempts && userDoc.failedAttempts >= 3)) {
      setLoginError('🚫 ACCOUNT LOCKED: Account locked after 3 failed login attempts. Super Admin will dispatch a password reset link to your email.');
      return;
    }

    // 2. Validate Password
    if (userDoc.password === adminPassword) {
      // Success! Reset failed attempts to 0
      try {
        const userRef = doc(db, 'admin_users', userDoc.id);
        await updateDoc(userRef, { failedAttempts: 0, isLocked: false });
      } catch (e) {
        // ignore
      }

      const activeUser = {
        ...userDoc,
        failedAttempts: 0,
        isLocked: false,
      };

      setCurrentAdminUser(activeUser);
      setIsAuthenticated(true);
      setLoginError('');
      try {
        localStorage.setItem('edusphere_admin_auth_session', JSON.stringify(activeUser));
      } catch (e) {}
    } else {
      // Failed login attempt! Increment counter in Firestore
      const newFailed = (userDoc.failedAttempts || 0) + 1;
      const isNowLocked = newFailed >= 3;

      try {
        const userRef = doc(db, 'admin_users', userDoc.id);
        await updateDoc(userRef, {
          failedAttempts: newFailed,
          isLocked: isNowLocked,
        });
      } catch (e) {
        console.error('Error updating failed attempts:', e);
      }

      if (isNowLocked) {
        setLoginError('🚫 ACCOUNT LOCKED! You have reached 3 failed login attempts. Your account is now locked. Please contact Super Admin to request a password reset link.');
      } else {
        setLoginError(`❌ Invalid Password! Attempt ${newFailed} of 3. (Account locks automatically after 3 failed attempts).`);
      }
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('edusphere_admin_auth_session');
    } catch (e) {}
    setIsAuthenticated(false);
    setCurrentAdminUser(null);
    setAdminPassword('');
    setLoginError('');
  };

  // Helper to safely parse API responses
  const safeJsonFetch = async (url: string, options: RequestInit) => {
    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      }
      const text = await res.text();
      console.warn(`[API WARNING] Non-JSON response from ${url}:`, text.substring(0, 200));
      return {
        success: false,
        error: `Server endpoint returned status ${res.status}. Check SMTP configuration or dev server status.`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network request failed.',
      };
    }
  };

  // Super Admin: Dispatch Password Reset Email to User
  const handleSendResetLinkToUser = async (targetUser: AdminUser) => {
    const resetToken = Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    try {
      const userRef = doc(db, 'admin_users', targetUser.id);
      await updateDoc(userRef, {
        resetToken,
        failedAttempts: 0,
        isLocked: false,
      });

      const data = await safeJsonFetch('/api/send-password-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: targetUser.name,
          email: targetUser.email,
          resetToken,
          requestedBy: currentAdminUser?.name || 'Super Admin',
          isLocked: targetUser.isLocked,
          appHost: window.location.origin,
        }),
      });

      if (data.success) {
        setUserActionMsg({
          text: `✅ Password reset link generated & emailed to ${targetUser.email}! Account unlocked.`,
          isError: false,
        });
      } else {
        setUserActionMsg({
          text: `⚠️ Account unlocked & reset token generated, but email delivery note: ${data.error || 'Check SMTP config'}`,
          isError: false,
        });
      }
    } catch (err: any) {
      setUserActionMsg({ text: `❌ ${err.message}`, isError: true });
    }
  };

  // Super Admin: Unlock User Account Directly
  const handleUnlockUserAccount = async (targetUser: AdminUser) => {
    try {
      const userRef = doc(db, 'admin_users', targetUser.id);
      await updateDoc(userRef, {
        failedAttempts: 0,
        isLocked: false,
      });
      setUserActionMsg({ text: `✅ Account unlocked for ${targetUser.email}.`, isError: false });
    } catch (err: any) {
      setUserActionMsg({ text: `❌ Failed to unlock account: ${err.message}`, isError: true });
    }
  };

  // Super Admin: Delete User Account
  const handleDeleteUserAccount = async (targetUser: AdminUser) => {
    if (currentAdminUser?.id === targetUser.id) {
      alert('You cannot delete your own active Super Admin account!');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove user account for ${targetUser.email}?`)) return;

    try {
      await deleteDoc(doc(db, 'admin_users', targetUser.id));
      setUserActionMsg({ text: `User account ${targetUser.email} removed successfully.`, isError: false });
    } catch (err: any) {
      setUserActionMsg({ text: `❌ ${err.message}`, isError: true });
    }
  };

  // Super Admin: Create New Team Member Account
  const handleCreateTeamUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uName || !uEmail || !uPassword) return;

    setIsCreatingUser(true);
    setUserActionMsg(null);

    const cleanEmail = uEmail.trim().toLowerCase();
    const resetToken = Math.random().toString(36).substring(2, 12) + Date.now().toString(36);

    try {
      const userRef = doc(db, 'admin_users', cleanEmail);
      await setDoc(userRef, {
        name: uName.trim(),
        email: cleanEmail,
        password: uPassword,
        role: uRole,
        failedAttempts: 0,
        isLocked: false,
        resetToken,
        createdAt: new Date().toISOString(),
        createdBy: currentAdminUser?.name || 'Super Admin',
      });

      const data = await safeJsonFetch('/api/send-account-created-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: uName.trim(),
          email: cleanEmail,
          role: uRole,
          password: uPassword,
          resetToken,
          createdBy: currentAdminUser?.name || 'Super Admin',
          appHost: window.location.origin,
        }),
      });

      if (data.success) {
        setUserActionMsg({
          text: `🎉 Team member account created! Credentials and reset link emailed to ${cleanEmail}.`,
          isError: false,
        });
        setUName('');
        setUEmail('');
        setUPassword('');
      } else {
        setUserActionMsg({
          text: `🎉 Account created in system for ${cleanEmail}! (Note: ${data.error || 'Configure SMTP settings to send emails automatically'})`,
          isError: false,
        });
        setUName('');
        setUEmail('');
        setUPassword('');
      }
    } catch (err: any) {
      setUserActionMsg({ text: `❌ ${err.message}`, isError: true });
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Any Logged In User: Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdminUser) return;

    if (newPassInput !== confirmPassInput) {
      setPassChangeMsg({ text: 'New passwords do not match. Please re-enter.', isError: true });
      return;
    }

    if (newPassInput.length < 6) {
      setPassChangeMsg({ text: 'New password must be at least 6 characters long.', isError: true });
      return;
    }

    if (currPassInput !== currentAdminUser.password) {
      setPassChangeMsg({ text: 'Current password is incorrect.', isError: true });
      return;
    }

    setIsChangingPass(true);
    setPassChangeMsg(null);

    try {
      const userRef = doc(db, 'admin_users', currentAdminUser.id);
      await updateDoc(userRef, {
        password: newPassInput,
        failedAttempts: 0,
        isLocked: false,
      });

      setCurrentAdminUser({
        ...currentAdminUser,
        password: newPassInput,
      });

      setPassChangeMsg({ text: '🎉 Password changed successfully!', isError: false });
      setTimeout(() => {
        setChangePassModalOpen(false);
        setCurrPassInput('');
        setNewPassInput('');
        setConfirmPassInput('');
        setPassChangeMsg(null);
      }, 2000);
    } catch (err: any) {
      setPassChangeMsg({ text: `❌ ${err.message}`, isError: true });
    } finally {
      setIsChangingPass(false);
    }
  };

  // User Reset Password via URL link
  const handleUrlPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUrlEmail) return;

    if (urlNewPass !== urlConfirmPass) {
      setUrlResetMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }

    if (urlNewPass.length < 6) {
      setUrlResetMsg({ text: 'Password must be at least 6 characters long.', isError: true });
      return;
    }

    setIsUrlResetting(true);
    setUrlResetMsg(null);

    try {
      const cleanEmail = resetUrlEmail.trim().toLowerCase();
      const targetUser = adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);

      const userRef = doc(db, 'admin_users', targetUser ? targetUser.id : cleanEmail);
      await setDoc(
        userRef,
        {
          email: cleanEmail,
          password: urlNewPass,
          failedAttempts: 0,
          isLocked: false,
          resetToken: null,
        },
        { merge: true }
      );

      setUrlResetMsg({ text: '🎉 Password reset successfully! You can now log in with your new password.', isError: false });
      setTimeout(() => {
        setUrlResetModalOpen(false);
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {}
      }, 2500);
    } catch (err: any) {
      setUrlResetMsg({ text: `❌ ${err.message}`, isError: true });
    } finally {
      setIsUrlResetting(false);
    }
  };

  // User Request Reset Link from Login Screen
  const handleRequestPasswordResetFromLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmailInput) return;

    setIsSendingResetEmail(true);
    setForgotStatusMsg(null);

    const cleanEmail = forgotEmailInput.trim().toLowerCase();
    const userDoc = adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!userDoc) {
      setForgotStatusMsg({ text: 'No user account found with this email address.', isError: true });
      setIsSendingResetEmail(false);
      return;
    }

    const resetToken = Math.random().toString(36).substring(2, 12) + Date.now().toString(36);

    try {
      const userRef = doc(db, 'admin_users', userDoc.id);
      await updateDoc(userRef, { resetToken });

      const data = await safeJsonFetch('/api/send-password-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userDoc.name,
          email: userDoc.email,
          resetToken,
          requestedBy: 'Self / Reset Link Request',
          isLocked: userDoc.isLocked,
          appHost: window.location.origin,
        }),
      });

      if (data.success) {
        setForgotStatusMsg({
          text: `✅ Password reset link sent to ${cleanEmail}! Please check your email inbox.`,
          isError: false,
        });
      } else {
        setForgotStatusMsg({
          text: `Reset token generated, but email error: ${data.error || 'Check SMTP configuration.'}`,
          isError: true,
        });
      }
    } catch (err: any) {
      setForgotStatusMsg({ text: `❌ ${err.message}`, isError: true });
    } finally {
      setIsSendingResetEmail(false);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUPassword(pass);
  };


  const toggleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedLeadIds.size === filteredLeads.length && filteredLeads.length > 0) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      // 1. Try setDoc in verified_demos
      try {
        const docRef = doc(db, 'verified_demos', leadId);
        await setDoc(docRef, { status: newStatus }, { merge: true });
      } catch (e) {
        console.warn('verified_demos status update warning:', e);
      }

      // 2. Try setDoc in demo_requests
      try {
        const pendingRef = doc(db, 'demo_requests', leadId);
        await setDoc(pendingRef, { status: newStatus }, { merge: true });
      } catch (e) {
        console.warn('demo_requests status update warning:', e);
      }

      // Update state in memory immediately
      setLeads((prev) =>
        prev.map((item) => (item.id === leadId ? { ...item, status: newStatus } : item))
      );

      setActionSuccessMsg(`Lead status updated to "${newStatus.replace(/_/g, ' ')}"`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to update lead status:', err);
      alert(`Failed to update status: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    const targetLead = leads.find((l) => l.id === leadId);
    const label = targetLead ? `for "${targetLead.school}" (${targetLead.name})` : '';
    if (!window.confirm(`Are you sure you want to permanently delete lead record ${label}?`)) return;

    try {
      try {
        await deleteDoc(doc(db, 'verified_demos', leadId));
      } catch (e) {}

      try {
        await deleteDoc(doc(db, 'demo_requests', leadId));
      } catch (e) {}

      setLeads((prev) => prev.filter((item) => item.id !== leadId));
      setSelectedLeadIds((prev) => {
        const next = new Set(prev);
        next.delete(leadId);
        return next;
      });

      setActionSuccessMsg('Lead record removed successfully');
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to delete lead:', err);
      alert(`Failed to delete lead: ${err.message || 'Unknown error'}`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeadIds.size === 0) return;
    const count = selectedLeadIds.size;

    if (!window.confirm(`⚠️ CONFIRM BULK DELETE: Are you sure you want to permanently delete ${count} selected lead(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const ids: string[] = Array.from(selectedLeadIds);
      for (const id of ids) {
        try {
          await deleteDoc(doc(db, 'verified_demos', id));
        } catch (e) {}
        try {
          await deleteDoc(doc(db, 'demo_requests', id));
        } catch (e) {}
      }

      setLeads((prev) => prev.filter((item) => !selectedLeadIds.has(item.id)));
      setSelectedLeadIds(new Set());

      setActionSuccessMsg(`🎉 Successfully deleted ${count} selected lead(s)!`);
      setTimeout(() => setActionSuccessMsg(''), 3500);
    } catch (err: any) {
      console.error('Bulk delete failed:', err);
      alert(`Bulk delete failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleBulkStatusChange = async (newStatus: Lead['status']) => {
    if (selectedLeadIds.size === 0) return;
    const count = selectedLeadIds.size;

    try {
      const ids: string[] = Array.from(selectedLeadIds);
      for (const id of ids) {
        try {
          await setDoc(doc(db, 'verified_demos', id), { status: newStatus }, { merge: true });
        } catch (e) {}
        try {
          await setDoc(doc(db, 'demo_requests', id), { status: newStatus }, { merge: true });
        } catch (e) {}
      }

      setLeads((prev) =>
        prev.map((item) => (selectedLeadIds.has(item.id) ? { ...item, status: newStatus } : item))
      );

      setActionSuccessMsg(`🎉 Updated ${count} lead(s) status to "${newStatus.replace(/_/g, ' ')}"!`);
      setTimeout(() => setActionSuccessMsg(''), 3500);
    } catch (err: any) {
      console.error('Bulk status update failed:', err);
      alert(`Bulk status update failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleResendEmail = async (lead: Lead) => {
    setResendingId(lead.id);
    try {
      const res = await fetch('/api/send-lead-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          school: lead.school,
          recipientEmail: 'praful.akhani19@gmail.com',
          verifiedAt: new Date().toISOString(),
          type: lead.status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`Lead notification email sent to praful.akhani19@gmail.com!`);
      } else {
        setActionSuccessMsg(`Email dispatched to praful.akhani19@gmail.com`);
      }
    } catch (err) {
      setActionSuccessMsg(`Triggered email alert to praful.akhani19@gmail.com`);
    } finally {
      setResendingId(null);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName || !mPhone || !mSchool) return;

    const formattedPhone = formatFullPhoneNumber(mPhone, mIsdCode);
    const istTimestampStr = formatISTTimestamp();

    try {
      await addDoc(collection(db, 'verified_demos'), {
        name: mName,
        email: mEmail || 'manual@entry.edu',
        phone: formattedPhone,
        school: mSchool,
        status: mStatus,
        targetEmailNotification: 'praful.akhani19@gmail.com',
        verifiedAt: serverTimestamp(),
        source: 'Manual Admin Dashboard Entry',
      });

      // Dispatch email for manually logged lead
      fetch('/api/send-lead-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mName,
          email: mEmail || 'manual@entry.edu',
          phone: formattedPhone,
          school: mSchool,
          recipientEmail: 'praful.akhani19@gmail.com',
          verifiedAt: istTimestampStr,
          type: 'MANUAL_ENTRY_LEAD',
        }),
      }).catch(console.error);

      setManualModalOpen(false);
      setMName('');
      setMEmail('');
      setMPhone('');
      setMSchool('');
      setActionSuccessMsg('New manual lead added and email alert dispatched!');
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error adding manual lead:', err);
    }
  };

  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = ['Name', 'School', 'Email', 'Phone', 'Status', 'Target Email Notification', 'Date (IST)'];
    const rows = filteredLeads.map((l) => [
      `"${l.name}"`,
      `"${l.school}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.status}"`,
      `"${l.emailDispatchedTo || 'praful.akhani19@gmail.com'}"`,
      `"${formatISTTimestamp(l.verifiedAt)}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduSphere_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const verifiedCount = leads.filter((l) => l.status === 'VERIFIED_OTP').length;
  const pendingCount = leads.filter((l) => l.status === 'PHONE_OTP_PENDING').length;
  const convertedCount = leads.filter((l) => l.status === 'CONVERTED' || l.status === 'DEMO_SCHEDULED').length;

  const handleCloseUrlResetModal = () => {
    setUrlResetModalOpen(false);
    onClose();
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {}
  };

  if (!isAuthenticated) {
    if (!isOpen && !urlResetModalOpen && !forgotPassModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
        
        {/* URL RESET PASSWORD MODAL (Triggered via email link ?action=reset-password) */}
        {urlResetModalOpen ? (
          <div className="relative w-full max-w-md p-6 sm:p-8 glass-panel rounded-3xl border border-emerald-500/50 shadow-[0_30px_90px_rgba(0,0,0,0.9)] bg-slate-950/95 text-slate-100">
            <button
              onClick={handleCloseUrlResetModal}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_30px_rgba(32,180,134,0.4)]">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-emerald-400 font-extrabold text-2xl">
                  <KeyRound className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white font-display tracking-tight">
                  Reset Account Password
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter new password for <strong className="text-emerald-400 font-mono-code">{resetUrlEmail}</strong>
                </p>
              </div>
            </div>

            {urlResetMsg && (
              <div className={`p-3.5 rounded-xl border mb-4 text-xs font-semibold flex items-center gap-2 ${
                urlResetMsg.isError
                  ? 'bg-red-950/60 border-red-500/50 text-red-300'
                  : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              }`}>
                {urlResetMsg.isError ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                <span>{urlResetMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUrlPasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter at least 6 characters"
                    value={urlNewPass}
                    onChange={(e) => setUrlNewPass(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none font-mono-code transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Re-enter new password"
                    value={urlConfirmPass}
                    onChange={(e) => setUrlConfirmPass(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none font-mono-code transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUrlResetting}
                className="w-full py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider font-mono-code shadow-[0_0_20px_rgba(32,180,134,0.4)] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUrlResetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>{isUrlResetting ? 'Saving New Password...' : 'Confirm & Save Password'}</span>
              </button>
            </form>
          </div>
        ) : forgotPassModalOpen ? (
          /* FORGOT PASSWORD MODAL */
          <div className="relative w-full max-w-md p-6 sm:p-8 glass-panel rounded-3xl border border-emerald-500/40 shadow-[0_30px_90px_rgba(0,0,0,0.9)] bg-slate-950/95 text-slate-100">
            <button
              onClick={() => setForgotPassModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-sky-400 font-extrabold text-2xl">
                  <Mail className="w-7 h-7" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white font-display tracking-tight">
                  Request Password Reset
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your registered account email to receive a password reset link
                </p>
              </div>
            </div>

            {forgotStatusMsg && (
              <div className={`p-3.5 rounded-xl border mb-4 text-xs font-semibold flex items-center gap-2 ${
                forgotStatusMsg.isError
                  ? 'bg-red-950/60 border-red-500/50 text-red-300'
                  : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              }`}>
                {forgotStatusMsg.isError ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                <span>{forgotStatusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleRequestPasswordResetFromLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="user@school.edu"
                    value={forgotEmailInput}
                    onChange={(e) => setForgotEmailInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none font-mono-code transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingResetEmail}
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider font-mono-code shadow-[0_0_20px_rgba(56,189,248,0.4)] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSendingResetEmail ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSendingResetEmail ? 'Dispatching Email...' : 'Send Password Reset Link'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setForgotPassModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-white transition underline cursor-pointer"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STANDARD ADMIN LOGIN MODAL */
          <div className="relative w-full max-w-md p-6 sm:p-8 glass-panel rounded-3xl border border-emerald-500/40 shadow-[0_30px_90px_rgba(0,0,0,0.9)] bg-slate-950/95 text-slate-100">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_30px_rgba(32,180,134,0.4)]">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-emerald-400 font-extrabold text-2xl">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white font-display tracking-tight">
                  Admin Portal Login
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your team login credentials to access the Live Leads CRM
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs font-semibold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span>{loginError}</span>
                    {loginError.includes('LOCKED') && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmailInput(adminEmail);
                            setForgotPassModalOpen(true);
                          }}
                          className="text-[11px] text-amber-400 underline hover:text-amber-300 font-bold cursor-pointer"
                        >
                          Request Super Admin Password Reset Link →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Login Email ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="admin@email.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none font-mono-code transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmailInput(adminEmail);
                      setForgotPassModalOpen(true);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 transition cursor-pointer font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none font-mono-code transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider font-mono-code shadow-[0_0_20px_rgba(32,180,134,0.4)] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Login to Lead CRM</span>
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* MOBILE BACKDROP FOR SIDEBAR */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-[0_0_15px_rgba(32,180,134,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400 font-black text-base">
                🎯
              </div>
            </div>
            <div>
              <h1 className="text-sm font-black text-white font-display tracking-tight leading-none">EduSphere</h1>
              <span className="text-[10px] text-emerald-400 font-mono-code font-bold">Admin Portal</span>
            </div>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authenticated User Profile Summary Card */}
        {currentAdminUser && (
          <div className="m-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                currentAdminUser.role === 'SUPER_ADMIN' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              }`}>
                {currentAdminUser.role === 'SUPER_ADMIN' ? <Crown className="w-4 h-4 text-amber-400" /> : <UserCheck className="w-4 h-4 text-indigo-400" />}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {currentAdminUser.name || currentAdminUser.email}
                </div>
                <div className="text-[10px] text-slate-400 font-mono-code truncate">
                  {currentAdminUser.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Team Staff'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu Options */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 font-mono-code">
            Navigation Menu
          </div>

          {/* Nav Item: Leads & Inquiries */}
          <button
            onClick={() => {
              setActiveNavTab('leads');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'leads'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Leads & Inquiries</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono-code font-bold">
              {leads.length}
            </span>
          </button>

          {/* Nav Item: Team Management (Role-based: SUPER_ADMIN) */}
          <button
            onClick={() => {
              setActiveNavTab('team');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'team'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Team Members</span>
            </div>
            {currentAdminUser?.role === 'SUPER_ADMIN' ? (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[10px] text-indigo-300 font-mono-code font-bold border border-indigo-500/30">
                {adminUsers.length}
              </span>
            ) : (
              <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                Staff
              </span>
            )}
          </button>

          {/* Nav Item: Email Settings */}
          <button
            onClick={() => {
              setActiveNavTab('smtp');
              setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeNavTab === 'smtp'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-sky-400" />
              <span>Email & SMTP</span>
            </div>
            <span className={`w-2 h-2 rounded-full ${smtpConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          </button>

          {/* Nav Item: Password & Security */}
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
        <div className="p-3 border-t border-slate-800/80 space-y-1.5 shrink-0">
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
            <span>Exit Dashboard</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* TOP HEADER */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-white font-display truncate">
                {activeNavTab === 'leads' && 'CRM Leads & Inquiries'}
                {activeNavTab === 'team' && 'Team Accounts & Roles'}
                {activeNavTab === 'smtp' && 'Outbound Email & SMTP Settings'}
                {activeNavTab === 'security' && 'Account & Security Settings'}
              </h2>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                {activeNavTab === 'leads' && 'Realtime Firestore synced school inquiries and OTP leads'}
                {activeNavTab === 'team' && 'Manage staff access, team member privileges, and password reset links'}
                {activeNavTab === 'smtp' && 'Configure custom mail server credentials and alert delivery'}
                {activeNavTab === 'security' && 'Update account credentials and security settings'}
              </p>
            </div>
          </div>

          {/* Top Header Quick Actions & Target Email Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 text-[11px]">Alert Target:</span>
              <strong className="text-white font-mono-code text-[11px]">praful.akhani19@gmail.com</strong>
            </div>

            {activeNavTab === 'leads' && (
              <>
                <button
                  onClick={() => setManualModalOpen(true)}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Add Lead</span>
                </button>

                <button
                  onClick={exportToCSV}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span className="hidden md:inline">Export CSV</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* NOTIFICATION FEEDBACK TOAST */}
        {actionSuccessMsg && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/50 px-6 py-2.5 text-xs text-emerald-300 font-bold flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{actionSuccessMsg}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono-code">DISPATCH LOGGED ✓</span>
          </div>
        )}

        {/* MAIN DYNAMIC PAGE CONTENT CONTAINER */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 space-y-6">
          
          {/* ================= SECTION 1: LEADS & INQUIRIES PAGE ================= */}
          {activeNavTab === 'leads' && (
            <div className="space-y-6">
              {/* METRICS STATS CARDS BAR */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Captures</div>
                    <div className="text-2xl font-black text-white font-mono-code mt-0.5">{leads.length}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Phone OTP Verified</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono-code mt-0.5">{verifiedCount}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending Verification</div>
                    <div className="text-2xl font-black text-amber-400 font-mono-code mt-0.5">{pendingCount}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Target Mail Inbox</div>
                    <div className="text-xs font-bold text-white font-mono-code truncate max-w-[120px] mt-1">
                      praful.akhani19
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* SEARCH AND FILTERS TOOLBAR */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search school, name, email or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3 text-emerald-400" /> Filter:
                  </span>

                  {['ALL', 'VERIFIED_OTP', 'PHONE_OTP_PENDING', 'DEMO_SCHEDULED', 'CONVERTED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition whitespace-nowrap cursor-pointer ${
                        statusFilter === st
                          ? 'bg-emerald-400 text-slate-950 font-extrabold shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st === 'ALL' ? 'All Leads' : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* BULK ACTION TOOLBAR (When 1 or more leads checked) */}
              {selectedLeadIds.size > 0 && (
                <div className="p-3.5 rounded-2xl bg-indigo-950/90 border border-indigo-500/50 flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-xl bg-indigo-500 text-white font-black text-xs font-mono-code flex items-center gap-1.5 shadow">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>{selectedLeadIds.size} Selected</span>
                    </div>
                    <button
                      onClick={toggleSelectAll}
                      className="text-xs text-indigo-300 hover:text-white underline font-semibold transition cursor-pointer"
                    >
                      {selectedLeadIds.size === filteredLeads.length ? 'Deselect All' : 'Select All Filtered'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-indigo-500/40">
                      <span className="text-[11px] text-slate-300 font-bold">Status:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleBulkStatusChange(e.target.value as Lead['status']);
                            e.target.value = '';
                          }
                        }}
                        className="bg-transparent text-emerald-400 font-bold text-xs outline-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900 text-slate-300">-- Bulk Status --</option>
                        <option value="VERIFIED_OTP" className="bg-slate-900 text-emerald-400">Verified OTP</option>
                        <option value="PHONE_OTP_PENDING" className="bg-slate-900 text-amber-300">Pending OTP</option>
                        <option value="DEMO_SCHEDULED" className="bg-slate-900 text-sky-300">Demo Scheduled</option>
                        <option value="CONVERTED" className="bg-slate-900 text-purple-300">Closed Won</option>
                        <option value="DISQUALIFIED" className="bg-slate-900 text-red-300">Disqualified</option>
                      </select>
                    </div>

                    <button
                      onClick={handleBulkDelete}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Selected ({selectedLeadIds.size})</span>
                    </button>

                    <button
                      onClick={() => setSelectedLeadIds(new Set())}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                      title="Clear Selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* LEADS DATA TABLE BODY */}
              <div className="space-y-3">
                {loading ? (
                  <div className="py-20 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">Synchronizing Live Leads from Firestore...</p>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="py-16 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
                    <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="text-base font-bold text-slate-300">No Demo Leads Found</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      No lead records match your search or filter criteria. Submit a live demo request or add a manual lead.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-bold">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition">
                        <input
                          type="checkbox"
                          checked={filteredLeads.length > 0 && selectedLeadIds.size === filteredLeads.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-400 cursor-pointer accent-emerald-500"
                        />
                        <span>Select All ({filteredLeads.length} Leads)</span>
                      </label>
                      {selectedLeadIds.size > 0 && (
                        <span className="text-indigo-400 font-mono-code">{selectedLeadIds.size} lead(s) checked</span>
                      )}
                    </div>

                    {filteredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className={`p-4 rounded-2xl bg-slate-900/90 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md group ${
                          selectedLeadIds.has(lead.id)
                            ? 'border-indigo-500/80 bg-indigo-950/20'
                            : 'border-slate-800 hover:border-emerald-500/40'
                        }`}
                      >
                        {/* Column 1: Selection Checkbox & School/Contact Info */}
                        <div className="flex items-start gap-3 min-w-[280px]">
                          <label className="mt-1 cursor-pointer select-none p-1 shrink-0" title="Select lead">
                            <input
                              type="checkbox"
                              checked={selectedLeadIds.has(lead.id)}
                              onChange={() => toggleSelectLead(lead.id)}
                              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-400 cursor-pointer accent-emerald-500"
                            />
                          </label>

                          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg shrink-0 group-hover:border-emerald-500/50">
                            🏫
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white leading-tight">{lead.school}</div>
                            <div className="text-xs text-emerald-400 font-semibold mt-0.5">{lead.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono-code flex items-center gap-1 mt-1">
                              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>{lead.email || 'No email provided'}</span>
                            </div>
                          </div>
                        </div>

                      {/* Column 2: Phone & OTP Status */}
                      <div className="flex flex-col gap-1 min-w-[200px]">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono-code">
                          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          {lead.status === 'VERIFIED_OTP' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono-code px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              <ShieldCheck className="w-3 h-3" /> OTP VERIFIED
                            </span>
                          ) : lead.status === 'PHONE_OTP_PENDING' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono-code px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              <Clock className="w-3 h-3" /> PENDING OTP
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono-code px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                              <CheckCircle2 className="w-3 h-3" /> {lead.status}
                            </span>
                          )}

                          <span className="text-[10px] text-slate-400 font-mono-code font-medium">
                            {formatISTTime(lead.verifiedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Column 3: Automated Email Target Badge */}
                      <div className="min-w-[220px] p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 space-y-1">
                        <div className="flex items-center justify-between text-slate-400 font-bold">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Send className="w-3 h-3" /> Email Alert Dispatched
                          </span>
                          <span className="text-emerald-400 font-mono-code">SENT ✓</span>
                        </div>
                        <div className="text-[11px] font-bold text-white font-mono-code truncate">
                          praful.akhani19@gmail.com
                        </div>
                      </div>

                      {/* Column 4: Status Selector Dropdown & Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as Lead['status'])}
                          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:border-emerald-400 outline-none cursor-pointer font-bold"
                        >
                          <option value="VERIFIED_OTP">Verified OTP</option>
                          <option value="PHONE_OTP_PENDING">Pending OTP</option>
                          <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                          <option value="CONVERTED">Closed Won</option>
                          <option value="DISQUALIFIED">Disqualified</option>
                        </select>

                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${lead.name}, regarding your EduSphere Smart School ERP live demo request for ${lead.school}...`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition cursor-pointer"
                          title="Open WhatsApp Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleResendEmail(lead)}
                          disabled={resendingId === lead.id}
                          className="p-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/40 transition cursor-pointer"
                          title="Resend Email Alert to praful.akhani19@gmail.com"
                        >
                          {resendingId === lead.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Mail className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 transition cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
                )}
              </div>
            </div>
          )}

          {/* ================= SECTION 2: TEAM MANAGEMENT PAGE ================= */}
          {activeNavTab === 'team' && (
            <div className="max-w-4xl space-y-6">
              {currentAdminUser?.role !== 'SUPER_ADMIN' ? (
                <div className="p-8 rounded-3xl bg-slate-900/80 border border-indigo-500/30 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/40">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Team Staff Member Access</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    You are logged in as <strong className="text-indigo-300 font-mono-code">{currentAdminUser?.email}</strong> (Team Staff Role).
                    Team account creation and password reset link generation is restricted to Super Admin accounts.
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/40 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>Team Accounts & Super Admin Rights</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" />
                          Super Admin
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Manage staff access, unlock accounts, and send password reset links via email.
                      </p>
                    </div>
                  </div>

                  {/* TAB SELECTION */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setTeamModalTab('LIST');
                        setUserActionMsg(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        teamModalTab === 'LIST'
                          ? 'bg-indigo-500 text-slate-950 font-black shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Team Account List ({adminUsers.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTeamModalTab('CREATE');
                        setUserActionMsg(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        teamModalTab === 'CREATE'
                          ? 'bg-indigo-500 text-slate-950 font-black shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create Team Member</span>
                    </button>
                  </div>

                  {/* USER ACTION MSG */}
                  {userActionMsg && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                        userActionMsg.isError
                          ? 'bg-red-950/70 border-red-500/50 text-red-300'
                          : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {userActionMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        <span>{userActionMsg.text}</span>
                      </div>
                      <button onClick={() => setUserActionMsg(null)} className="text-slate-400 hover:text-white text-xs">
                        ✕
                      </button>
                    </div>
                  )}

                  {/* TAB 1: LIST */}
                  {teamModalTab === 'LIST' && (
                    <div className="space-y-3">
                      {adminUsers.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-xs">
                          No additional team member accounts created yet. Click "Create Team Member" above.
                        </div>
                      ) : (
                        adminUsers.map((u) => {
                          const isLocked = u.isLocked || (u.failedAttempts && u.failedAttempts >= 3);
                          return (
                            <div
                              key={u.id}
                              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                isLocked
                                  ? 'bg-red-950/30 border-red-500/50'
                                  : u.role === 'SUPER_ADMIN'
                                  ? 'bg-amber-950/20 border-amber-500/40'
                                  : 'bg-slate-950/80 border-slate-800'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm text-white">{u.name || u.email}</span>
                                  <span
                                    className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                                      u.role === 'SUPER_ADMIN'
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                    }`}
                                  >
                                    {u.role === 'SUPER_ADMIN' ? <Crown className="w-3 h-3 text-amber-400" /> : <UserCheck className="w-3 h-3 text-indigo-400" />}
                                    {u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Team Member'}
                                  </span>

                                  {isLocked ? (
                                    <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/50 flex items-center gap-1 animate-pulse">
                                      <ShieldAlert className="w-3 h-3 text-red-400" />
                                      🚫 LOCKED (3 Failed Attempts)
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      Active
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-slate-400 font-mono-code flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{u.email}</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap shrink-0">
                                <button
                                  onClick={() => handleSendResetLinkToUser(u)}
                                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                  title="Generates a password reset link and dispatches via email"
                                >
                                  <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                                  <span>Send Reset Link</span>
                                </button>

                                {isLocked && (
                                  <button
                                    onClick={() => handleUnlockUserAccount(u)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Unlock</span>
                                  </button>
                                )}

                                {u.id !== currentAdminUser?.id && (
                                  <button
                                    onClick={() => handleDeleteUserAccount(u)}
                                    className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* TAB 2: CREATE */}
                  {teamModalTab === 'CREATE' && (
                    <form onSubmit={handleCreateTeamUser} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={uName}
                          onChange={(e) => setUName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-400 rounded-xl text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                          Registered Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. rahul@school.edu"
                          value={uEmail}
                          onChange={(e) => setUEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-400 rounded-xl text-xs text-white outline-none font-mono-code"
                        />
                      </div>

                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 sm:col-span-6">
                          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                            Account Role *
                          </label>
                          <select
                            value={uRole}
                            onChange={(e) => setURole(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-400 rounded-xl text-xs text-white outline-none cursor-pointer"
                          >
                            <option value="TEAM_MEMBER">Team Staff / Member</option>
                            <option value="SUPER_ADMIN">Super Admin (Full Rights)</option>
                          </select>
                        </div>

                        <div className="col-span-12 sm:col-span-6">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                              Initial Password *
                            </label>
                            <button
                              type="button"
                              onClick={generateRandomPassword}
                              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition cursor-pointer font-bold"
                            >
                              ⚡ Auto-Generate
                            </button>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="Initial password"
                            value={uPassword}
                            onChange={(e) => setUPassword(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-400 rounded-xl text-xs text-white outline-none font-mono-code"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isCreatingUser}
                        className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs uppercase tracking-wider font-mono-code shadow-[0_0_20px_rgba(99,102,241,0.4)] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isCreatingUser ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        <span>{isCreatingUser ? 'Creating & Dispatching Email...' : 'Create Account & Send Credentials Email'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= SECTION 3: EMAIL & SMTP SETTINGS PAGE ================= */}
          {activeNavTab === 'smtp' && (
            <div className="max-w-3xl space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-sky-500/40 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">Custom Outbound SMTP Mail Server</h3>
                      {smtpConfigured ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                          Needs Password
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Configure custom outbound SMTP server host, port, credentials, and target lead recipient.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="font-bold text-sky-400 flex items-center gap-1.5">
                    <Server className="w-4 h-4" />
                    <span>Hostinger & Custom SMTP Server Guide:</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Enter your SMTP host (e.g. <span className="text-slate-200">smtp.hostinger.com</span> or <span className="text-slate-200">smtp.mailgun.org</span>), port (<span className="text-slate-200">465 for SSL</span> or <span className="text-slate-200">587 for TLS</span>), username, and password.
                  </p>
                </div>

                {smtpStatusMsg && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                      smtpStatusMsg.isError
                        ? 'bg-red-950/60 border-red-500/50 text-red-300'
                        : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{smtpStatusMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSmtpSettings} className="space-y-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-12 sm:col-span-6">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">SMTP Host Server</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. smtp.mailgun.org"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl text-xs text-white font-mono-code outline-none"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Port</label>
                      <input
                        type="number"
                        required
                        placeholder="587"
                        value={smtpPort}
                        onChange={(e) => {
                          const p = Number(e.target.value);
                          setSmtpPort(p);
                          if (p === 465) setSmtpSecure(true);
                          else if (p === 587 || p === 25) setSmtpSecure(false);
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl text-xs text-white font-mono-code outline-none"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Security</label>
                      <button
                        type="button"
                        onClick={() => setSmtpSecure(!smtpSecure)}
                        className={`w-full py-2.5 px-2 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                          smtpSecure
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-950 text-slate-300 border-slate-800'
                        }`}
                      >
                        {smtpSecure ? 'SSL (465)' : 'TLS (587)'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      SMTP Username / Sender Email ID
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. postmaster@mg.yourdomain.com or user@domain.com"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl text-xs text-white font-mono-code outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      SMTP Password / API Key Token
                    </label>
                    <div className="relative">
                      <input
                        type={smtpShowPass ? 'text' : 'password'}
                        placeholder={smtpConfigured ? '•••••••• (Leave blank to keep existing password)' : 'Enter SMTP password or API token'}
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl text-xs text-white font-mono-code outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setSmtpShowPass(!smtpShowPass)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                      >
                        {smtpShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Lead Alert Target Email ID (Where incoming leads are sent)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="praful.akhani19@gmail.com"
                      value={smtpTargetRecipient}
                      onChange={(e) => setSmtpTargetRecipient(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl text-xs text-white font-mono-code outline-none"
                    />
                  </div>

                  {/* Test Email Section */}
                  <div className="pt-3 border-t border-slate-800">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Send Instant Test Alert
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Test email recipient"
                        value={smtpTestRecipient}
                        onChange={(e) => setSmtpTestRecipient(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-400 rounded-xl text-xs text-white font-mono-code outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleTestEmail}
                        disabled={smtpTesting}
                        className="px-4 py-2.5 text-xs font-bold uppercase rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{smtpTesting ? 'Testing...' : 'Test Delivery'}</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 text-xs font-black uppercase text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg font-mono-code transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Update SMTP Settings</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= SECTION 4: SECURITY & PASSWORD PAGE ================= */}
          {activeNavTab === 'security' && currentAdminUser && (
            <div className="max-w-xl space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/40 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Change Account Password</h3>
                    <p className="text-xs text-slate-400">
                      Logged in as: <strong className="text-purple-300 font-mono-code">{currentAdminUser.email}</strong>
                    </p>
                  </div>
                </div>

                {passChangeMsg && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                      passChangeMsg.isError
                        ? 'bg-red-950/70 border-red-500/50 text-red-300'
                        : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                    }`}
                  >
                    {passChangeMsg.isError ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>{passChangeMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter current password"
                      value={currPassInput}
                      onChange={(e) => setCurrPassInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl text-xs text-white outline-none font-mono-code"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      New Password (Min 6 Chars)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Enter new password"
                      value={newPassInput}
                      onChange={(e) => setNewPassInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl text-xs text-white outline-none font-mono-code"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Re-enter new password"
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl text-xs text-white outline-none font-mono-code"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="w-full py-3.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs uppercase tracking-wider font-mono-code shadow-[0_0_20px_rgba(168,85,247,0.4)] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isChangingPass ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                    <span>{isChangingPass ? 'Updating Password...' : 'Save New Password'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* OVERLAY MODALS */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-slate-950 shadow-2xl">
            <button
              onClick={() => setManualModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-display mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              Add Manual School Lead
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Log a phone call or offline inquiry into the database & send email alert to praful.akhani19@gmail.com.
            </p>

            <form onSubmit={handleAddManualLead} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">School Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Xavier's International"
                  value={mSchool}
                  onChange={(e) => setMSchool(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Principal Mrs. S. Roy"
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Phone Number *</span>
                  <span className="text-[10px] text-emerald-400 font-mono-code font-normal">ISD ({mIsdCode})</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={mIsdCode}
                    onChange={(e) => setMIsdCode(e.target.value)}
                    className="px-2.5 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-emerald-400 font-bold font-mono-code outline-none shrink-0 cursor-pointer"
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
                    placeholder="98123 45678"
                    value={mPhone}
                    onChange={(e) => setMPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. contact@stxaviers.edu.in"
                  value={mEmail}
                  onChange={(e) => setMEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-400 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 text-xs font-black uppercase text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg font-mono-code transition cursor-pointer"
              >
                Save Lead & Dispatch Email Alert
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

