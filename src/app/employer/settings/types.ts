// Employer Settings Types

export interface ProfileSettings {
  legalEntityName: string;
  entityType: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  pinCode: string;
  city: string;
  state: string;
  phoneNumber: string;
  email: string;
  taxId: string;
  logos: string[];
}

export interface SalaryRange {
  minimum: number;
  maximum: number;
  average: number;
}

export interface SalaryComponent {
  id: string;
  name: string;
  value: number;
  type: 'percentage' | 'fixed';
  maxConstraint?: string;
}

export interface SalaryTemplate {
  id: string;
  name: string;
  isRapidRecommended: boolean;
  components: SalaryComponent[];
}

export interface SalarySettings {
  range: SalaryRange;
  templates: SalaryTemplate[];
  activeTemplateId: string;
}

export interface StockOptionsSettings {
  stockType: string;
  currency: string;
  strikePrice: number;
  cliffPeriod: string;
  vestingFrequency: string;
}

export interface BonusSettings {
  bonusType: 'flat_rate' | 'fixed';
  performanceBonus: { enabled: boolean; description: string };
  joiningBonus: { enabled: boolean; amount: number };
  referralBonus: { enabled: boolean; description: string };
  spotBonus: { enabled: boolean; description: string };
  recovery: {
    duration: number;
    percentage: number;
  };
}

export interface ExpenseCategory {
  id: string;
  name: string;
  type: 'travel' | 'equipment' | 'food' | 'meeting' | 'phone' | 'home_office' | 'education' | 'others';
  useRapidStandard: boolean;
  customAmount?: number;
}

export interface ExpenseSettings {
  categories: ExpenseCategory[];
}

export interface NoticePeriod {
  resigned: number;
  terminated: number;
}

export interface ProbationSettings {
  probationPeriod: number;
  noticePeriod: {
    duringProbation: NoticePeriod;
    afterProbation: NoticePeriod;
  };
  requireConfirmation: boolean;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
}

export interface HolidaySettings {
  totalHolidays: number;
  maxHolidays: number;
  fixedHolidays: Holiday[];
  floatingHolidays: Holiday[];
}

export interface CarryForwardSettings {
  enabled: boolean;
  validTillDays: number;
  maxPercentage: number;
}

export interface LeaveType {
  id: string;
  name: string;
  days: number;
  carryForward?: CarryForwardSettings;
}

export interface LeaveSettings {
  leaveTypes: LeaveType[];
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  privilegeLevel: string;
  avatar?: string;
}

export interface PortalSettings {
  managers: Manager[];
}

export type BGVPlan = 'pro' | 'power' | 'premium';

export interface BGVSettings {
  enabled: boolean;
  currentPlan: BGVPlan;
}

export type WelcomeKitPlan = 'pro' | 'power' | 'premium';

export interface WelcomeKitSettings {
  enabled: boolean;
  currentPlan: WelcomeKitPlan;
}

export interface CompanySettings {
  profile: ProfileSettings;
  salary: SalarySettings;
  stockOptions: StockOptionsSettings;
  bonus: BonusSettings;
  expense: ExpenseSettings;
  probationNoticePeriod: ProbationSettings;
  holidayCalendar: HolidaySettings;
  leavePolicy: LeaveSettings;
  portalManagement: PortalSettings;
  backgroundVerification: BGVSettings;
  welcomeKit: WelcomeKitSettings;
}

export type SettingsSection =
  | 'profile'
  | 'salary'
  | 'stock-options'
  | 'bonus'
  | 'expense'
  | 'probation-notice'
  | 'holiday-calendar'
  | 'leave-policy'
  | 'portal-management'
  | 'background-verification'
  | 'welcome-kit';
