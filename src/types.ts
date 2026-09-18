export interface MetricStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  description: string;
  icon: string;
  color: string;
}

export interface ErpModuleStep {
  id: number;
  title: string;
  tagline: string;
  subtitle: string;
  description: string;
  keyFeatures: string[];
  metrics: { label: string; val: string }[];
  color: string;
  icon: string;
  demoType: 'admission' | 'fee' | 'transport' | 'reportCard';
}

export interface UserRole {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  avatar: string;
  benefits: string[];
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  interactiveFeature: {
    type: 'analytics' | 'attendance' | 'feePay' | 'timetable';
    title: string;
  };
}

export interface BentoFeature {
  id: string;
  title: string;
  category: string;
  description: string;
  size: 'small' | 'medium' | 'large' | 'full';
  icon: string;
  accentColor: string;
  interactiveComponent?: string;
}

export interface CaseStudyData {
  schoolName: string;
  location: string;
  studentCount: number;
  highlightStats: {
    metric: string;
    label: string;
    trend: string;
  }[];
  monthlyGrowthData: { month: string; inquiries: number; conversions: number; feeCollected: number }[];
}

export interface DemoFormData {
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  city: string;
  studentCount: number;
  role: string;
  preferredDate: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'SUPER_ADMIN' | 'TEAM_MEMBER';
  failedAttempts: number;
  isLocked: boolean;
  resetToken?: string | null;
  resetTokenExpiry?: string | null;
  createdAt?: any;
  createdBy?: string;
}

