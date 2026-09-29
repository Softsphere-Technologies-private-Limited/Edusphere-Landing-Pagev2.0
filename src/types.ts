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

export type LeadStatus =
  | 'NEW'
  | 'VERIFIED_OTP'
  | 'PHONE_OTP_PENDING'
  | 'CONTACTED'
  | 'DEMO_SCHEDULED'
  | 'PROPOSAL_SENT'
  | 'CONVERTED'
  | 'DISQUALIFIED';

export type LeadPriority = 'HOT' | 'WARM' | 'COLD';

export interface LeadActivityNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  type: 'NOTE' | 'CALL' | 'MEETING' | 'WHATSAPP' | 'EMAIL' | 'STATUS_CHANGE';
}

export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  city?: string;
  studentCount?: number;
  role?: string;
  status: LeadStatus;
  priority?: LeadPriority;
  source?: string;
  assignedTo?: string;
  estimatedValue?: number;
  notes?: string;
  activityHistory?: LeadActivityNote[];
  verifiedAt?: any;
  createdAt?: any;
  emailDispatchedTo?: string;
  lastContactedAt?: string;
}

export type DealStage =
  | 'QUALIFICATION'
  | 'DEMO_SCHEDULED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export interface CrmDeal {
  id: string;
  title: string;
  schoolName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  stage: DealStage;
  amount: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  notes?: string;
  leadId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export type ActivityType = 'CALL' | 'VISIT' | 'DEMO' | 'EMAIL' | 'TASK' | 'WHATSAPP';
export type ActivityStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
export type ActivityPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CrmActivity {
  id: string;
  title: string;
  type: ActivityType;
  schoolName: string;
  contactName: string;
  dueDate: string;
  dueTime?: string;
  priority: ActivityPriority;
  status: ActivityStatus;
  assignedTo: string;
  notes?: string;
  leadId?: string;
  dealId?: string;
  createdAt?: any;
  completedAt?: string;
}

export interface CrmSchool {
  id: string;
  name: string;
  city: string;
  state?: string;
  studentCount: number;
  decisionMaker: string;
  decisionMakerRole: string;
  email: string;
  phone: string;
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  status: 'LEAD' | 'OPPORTUNITY' | 'ACTIVE_CUSTOMER' | 'CHURNED';
  createdAt?: any;
}

