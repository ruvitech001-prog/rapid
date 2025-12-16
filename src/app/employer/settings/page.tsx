'use client';

import { useState } from 'react';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Gift,
  Receipt,
  Clock,
  Calendar,
  CalendarDays,
  Users,
  ShieldCheck,
  Package,
  Pencil,
  Upload,
  Plus,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type SettingsSection,
  type ProfileSettings,
  type SalarySettings,
  type StockOptionsSettings,
  type BonusSettings,
  type ExpenseSettings,
  type ProbationSettings,
  type HolidaySettings,
  type LeaveSettings,
  type PortalSettings,
  type BGVSettings,
  type WelcomeKitSettings,
} from './types';
import { colors } from '@/lib/design-tokens';

// Navigation items for settings sidebar
const settingsNavItems = [
  { id: 'profile' as SettingsSection, label: 'Profile', icon: Building2 },
  { id: 'salary' as SettingsSection, label: 'Salary', icon: DollarSign },
  { id: 'stock-options' as SettingsSection, label: 'Stock options', icon: TrendingUp },
  { id: 'bonus' as SettingsSection, label: 'Bonus', icon: Gift },
  { id: 'expense' as SettingsSection, label: 'Expense', icon: Receipt },
  { id: 'probation-notice' as SettingsSection, label: 'Probation & notice period', icon: Clock },
  { id: 'holiday-calendar' as SettingsSection, label: 'Holiday calendar', icon: Calendar },
  { id: 'leave-policy' as SettingsSection, label: 'Leave policy', icon: CalendarDays },
  { id: 'portal-management' as SettingsSection, label: 'Portal management', icon: Users },
  { id: 'background-verification' as SettingsSection, label: 'Background verification', icon: ShieldCheck },
  { id: 'welcome-kit' as SettingsSection, label: 'Welcome kit', icon: Package },
];

// Default data
const defaultProfile: ProfileSettings = {
  legalEntityName: 'Stripe, Inc.',
  entityType: 'Banking, Financial Services and Insurance',
  country: 'India',
  addressLine1: '105-UDB Landmark',
  addressLine2: 'Gopalpura, Tonk Road, Gopalpura, Tonk, Near Bus stand',
  pinCode: '302020',
  city: 'Jaipur',
  state: 'Rajasthan',
  phoneNumber: '+91 8989898989',
  email: 'contactus@stripe.com',
  taxId: '12345678909',
  logos: [],
};

const defaultSalary: SalarySettings = {
  range: {
    minimum: 200000,
    maximum: 1000000,
    average: 600000,
  },
  templates: [
    {
      id: 'template-1',
      name: 'Template 1',
      isRapidRecommended: false,
      components: [
        { id: '1', name: 'Basic salary', value: 50, type: 'percentage', maxConstraint: 'Max 50% of CTC' },
        { id: '2', name: 'House rent allowance', value: 36, type: 'percentage', maxConstraint: 'Max 40% of CTC' },
        { id: '3', name: 'Leave travel allowance', value: 8, type: 'percentage', maxConstraint: 'Max 8.33% of basic' },
        { id: '4', name: 'Special allowance', value: 2000, type: 'fixed', maxConstraint: 'No cap' },
      ],
    },
    {
      id: 'template-2',
      name: 'Template 2',
      isRapidRecommended: false,
      components: [
        { id: '1', name: 'Basic salary', value: 50, type: 'percentage', maxConstraint: 'Max 50% of CTC' },
        { id: '2', name: 'House rent allowance', value: 36, type: 'percentage', maxConstraint: 'Max 40% of CTC' },
        { id: '3', name: 'Leave travel allowance', value: 8, type: 'percentage', maxConstraint: 'Max 8.33% of basic' },
        { id: '4', name: 'Special allowance', value: 2000, type: 'fixed', maxConstraint: 'No cap' },
        { id: '5', name: 'Mobile/Internet expenses', value: 2200, type: 'fixed', maxConstraint: 'Max 5000 per month' },
      ],
    },
    {
      id: 'rapid-recommended',
      name: 'Rapid recommended',
      isRapidRecommended: true,
      components: [
        { id: '1', name: 'Basic salary', value: 50, type: 'percentage', maxConstraint: 'Max 50% of CTC' },
        { id: '2', name: 'House rent allowance', value: 36, type: 'percentage', maxConstraint: 'Max 40% of CTC' },
        { id: '3', name: 'Leave travel allowance', value: 8, type: 'percentage', maxConstraint: 'Max 8.33% of basic' },
        { id: '4', name: 'Food coupons', value: 2200, type: 'fixed', maxConstraint: 'Max 2200 per month' },
        { id: '5', name: 'Health club facility', value: 4000, type: 'fixed', maxConstraint: 'Max 5000 per month' },
        { id: '6', name: 'Car & driver remuneration', value: 1200, type: 'fixed', maxConstraint: 'Max 2700 pm or 3300 pm (for 1.6L+ capacity vehicles)' },
        { id: '7', name: 'Mobile/Internet expenses', value: 2000, type: 'fixed', maxConstraint: 'Max 5000 per month' },
        { id: '8', name: 'Gift card', value: 4500, type: 'fixed', maxConstraint: 'Max 5000 per month' },
        { id: '9', name: 'Special allowance', value: 2000, type: 'fixed', maxConstraint: 'No cap' },
        { id: '10', name: 'Professional development allowance', value: 3000, type: 'fixed', maxConstraint: 'Max 10000 per month' },
      ],
    },
  ],
  activeTemplateId: 'rapid-recommended',
};

const defaultStockOptions: StockOptionsSettings = {
  stockType: 'Incentive Stock Options (ISOx)',
  currency: 'INR (India)',
  strikePrice: 130,
  cliffPeriod: '12 months',
  vestingFrequency: 'Monthly',
};

const defaultBonus: BonusSettings = {
  bonusType: 'flat_rate',
  performanceBonus: { enabled: true, description: 'Annual performance-based bonus' },
  joiningBonus: { enabled: true, amount: 10000 },
  referralBonus: { enabled: true, description: 'Referral bonus for successful hires' },
  spotBonus: { enabled: true, description: 'Instant recognition bonus' },
  recovery: {
    duration: 6,
    percentage: 50,
  },
};

const defaultExpense: ExpenseSettings = {
  categories: [
    { id: '1', name: 'Travel', type: 'travel', useRapidStandard: true },
    { id: '2', name: 'Work equipments', type: 'equipment', useRapidStandard: true },
    { id: '3', name: 'Food', type: 'food', useRapidStandard: true },
    { id: '4', name: 'Business meeting', type: 'meeting', useRapidStandard: true },
    { id: '5', name: 'Phone & utilities', type: 'phone', useRapidStandard: true },
    { id: '6', name: 'Home office', type: 'home_office', useRapidStandard: true },
    { id: '7', name: 'Education & training', type: 'education', useRapidStandard: true },
    { id: '8', name: 'Others', type: 'others', useRapidStandard: true },
  ],
};

const defaultProbation: ProbationSettings = {
  probationPeriod: 15,
  noticePeriod: {
    duringProbation: { resigned: 15, terminated: 15 },
    afterProbation: { resigned: 60, terminated: 7 },
  },
  requireConfirmation: true,
};

const defaultHoliday: HolidaySettings = {
  totalHolidays: 17,
  maxHolidays: 20,
  fixedHolidays: [
    { id: '1', date: '2024-01-26', name: 'Republic Day' },
    { id: '2', date: '2024-03-25', name: 'Holi' },
    { id: '3', date: '2024-08-15', name: 'Independence Day' },
    { id: '4', date: '2024-10-02', name: 'Gandhi Jayanti' },
    { id: '5', date: '2024-10-31', name: 'Diwali' },
    { id: '6', date: '2024-11-01', name: 'Diwali Holiday' },
    { id: '7', date: '2024-12-25', name: 'Christmas' },
  ],
  floatingHolidays: [
    { id: '8', date: '2024-01-14', name: 'Makar Sankranti' },
    { id: '9', date: '2024-04-11', name: 'Ugadi' },
    { id: '10', date: '2024-04-14', name: 'Ambedkar Jayanti' },
    { id: '11', date: '2024-04-17', name: 'Ram Navami' },
    { id: '12', date: '2024-04-21', name: 'Mahavir Jayanti' },
    { id: '13', date: '2024-05-23', name: 'Buddha Purnima' },
    { id: '14', date: '2024-06-17', name: 'Eid ul-Fitr' },
    { id: '15', date: '2024-07-17', name: 'Muharram' },
    { id: '16', date: '2024-08-26', name: 'Janmashtami' },
    { id: '17', date: '2024-11-15', name: 'Guru Nanak Jayanti' },
  ],
};

const defaultLeave: LeaveSettings = {
  leaveTypes: [
    { id: '1', name: 'Earned leaves', days: 15, carryForward: { enabled: true, validTillDays: 90, maxPercentage: 33.33 } },
    { id: '2', name: 'Casual leaves', days: 7, carryForward: { enabled: true, validTillDays: 90, maxPercentage: 33.33 } },
    { id: '3', name: 'Sick leaves', days: 7 },
    { id: '4', name: 'Maternity leaves', days: 60 },
    { id: '5', name: 'Paternity leaves', days: 7 },
    { id: '6', name: 'Bereavement leaves', days: 0 },
    { id: '7', name: 'Marriage leaves', days: 0 },
    { id: '8', name: 'Compensatory leaves', days: 0 },
  ],
};

const defaultPortal: PortalSettings = {
  managers: [
    { id: '1', name: 'Prithviraj Singh Hada', email: 'prithviraj@company.com', role: 'UX Lead', team: 'Design', privilegeLevel: 'Admin' },
    { id: '2', name: 'Raghav Sudarshan', email: 'raghav@company.com', role: 'VP Engineering', team: 'Engineering', privilegeLevel: 'Admin' },
    { id: '3', name: 'Vidushi Maheshwari', email: 'vidushi@company.com', role: 'Lead Product Designer', team: 'Design', privilegeLevel: 'Manager' },
  ],
};

const defaultBGV: BGVSettings = {
  enabled: true,
  currentPlan: 'pro',
};

const defaultWelcomeKit: WelcomeKitSettings = {
  enabled: true,
  currentPlan: 'pro',
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  // State for all settings
  const [profile, setProfile] = useState<ProfileSettings>(defaultProfile);
  const [salary, setSalary] = useState<SalarySettings>(defaultSalary);
  const [stockOptions, setStockOptions] = useState<StockOptionsSettings>(defaultStockOptions);
  const [bonus, setBonus] = useState<BonusSettings>(defaultBonus);
  const [expense] = useState<ExpenseSettings>(defaultExpense);
  const [probation, setProbation] = useState<ProbationSettings>(defaultProbation);
  const [holiday] = useState<HolidaySettings>(defaultHoliday);
  const [leave] = useState<LeaveSettings>(defaultLeave);
  const [portal] = useState<PortalSettings>(defaultPortal);
  const [bgv, setBgv] = useState<BGVSettings>(defaultBGV);
  const [welcomeKit, setWelcomeKit] = useState<WelcomeKitSettings>(defaultWelcomeKit);

  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editSalaryRangeOpen, setEditSalaryRangeOpen] = useState(false);
  const [editStockOpen, setEditStockOpen] = useState(false);
  const [editBonusOpen, setEditBonusOpen] = useState(false);
  const [editProbationOpen, setEditProbationOpen] = useState(false);
  const [inviteManagerOpen, setInviteManagerOpen] = useState(false);

  // Temp states for editing
  const [tempProfile, setTempProfile] = useState<ProfileSettings>(profile);
  const [tempSalaryRange, setTempSalaryRange] = useState(salary.range);
  const [tempStockOptions, setTempStockOptions] = useState<StockOptionsSettings>(stockOptions);
  const [tempBonus, setTempBonus] = useState<BonusSettings>(bonus);
  const [tempProbation, setTempProbation] = useState<ProbationSettings>(probation);

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}, ${dateNum}/${month}/${year}`;
  };

  // Render active section content
  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'salary':
        return <SalarySection />;
      case 'stock-options':
        return <StockOptionsSection />;
      case 'bonus':
        return <BonusSection />;
      case 'expense':
        return <ExpenseSection />;
      case 'probation-notice':
        return <ProbationSection />;
      case 'holiday-calendar':
        return <HolidaySection />;
      case 'leave-policy':
        return <LeaveSection />;
      case 'portal-management':
        return <PortalSection />;
      case 'background-verification':
        return <BGVSection />;
      case 'welcome-kit':
        return <WelcomeKitSection />;
      default:
        return <ProfileSection />;
    }
  };

  // Profile Section
  const ProfileSection = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Basic details</h3>
              <p className="text-sm text-[#6B7280]">Update your company details here</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTempProfile(profile);
                setEditProfileOpen(true);
              }}
              className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit details
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Legal entity name</p>
              <p className="text-sm font-medium text-gray-900">{profile.legalEntityName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Entity type</p>
              <p className="text-sm font-medium text-gray-900">{profile.entityType}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Country</p>
              <p className="text-sm font-medium text-gray-900">{profile.country}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Address</p>
              <p className="text-sm font-medium text-gray-900">
                {profile.addressLine1}, {profile.addressLine2}, {profile.city}, {profile.state} - {profile.pinCode}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Phone number</p>
              <p className="text-sm font-medium text-gray-900">{profile.phoneNumber || 'Not available'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Email address</p>
              <p className="text-sm font-medium text-gray-900">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Tax ID</p>
              <p className="text-sm font-medium text-gray-900">{profile.taxId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Logos</h3>
              <p className="text-sm text-[#6B7280]">Multiple logos can be added</p>
            </div>
          </div>
          <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-[#6B7280] mb-2" />
            <p className="text-sm text-[#6B7280]">Click or drag files to upload</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Salary Section
  const SalarySection = () => {
    const activeTemplate = salary.templates.find(t => t.id === salary.activeTemplateId);

    return (
      <div className="space-y-6">
        {/* Salary Range */}
        <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Salary range</h3>
                <p className="text-sm text-[#6B7280]">*all values are in INR</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTempSalaryRange(salary.range);
                  setEditSalaryRangeOpen(true);
                }}
                className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit salary
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Minimum salary</p>
                <p className="text-sm font-semibold text-gray-900">INR {formatCurrency(salary.range.minimum)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Maximum salary</p>
                <p className="text-sm font-semibold text-gray-900">INR {formatCurrency(salary.range.maximum)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Average salary</p>
                <p className="text-sm font-semibold text-gray-900">INR {formatCurrency(salary.range.average)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Structure Templates */}
        <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Salary structure templates</h3>
                <p className="text-sm text-[#6B7280]">Pre defined salary breakups for easy salary calculations</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add new template
                </Button>
              </div>
            </div>

            {/* Template Tabs */}
            <div className="flex gap-2 mb-6">
              {salary.templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSalary({ ...salary, activeTemplateId: template.id })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    salary.activeTemplateId === template.id
                      ? 'bg-[#586AF5] text-white'
                      : 'bg-[#F4F7FA] text-[#6B7280] hover:bg-[#E5E7EB]'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>

            {/* Active Template Components */}
            {activeTemplate && (
              <div className="bg-[#F9FAFB] rounded-xl p-4">
                <p className="text-sm font-medium text-[#6B7280] mb-4">
                  {activeTemplate.isRapidRecommended ? 'Rapid recommended' : activeTemplate.name}
                </p>
                <p className="text-xs text-[#6B7280] mb-4">Pre defined salary breakups for easy salary calculations</p>

                <div className="grid grid-cols-2 gap-4">
                  {activeTemplate.components.map((component) => (
                    <div key={component.id} className="bg-white rounded-lg p-3">
                      <p className="text-xs font-medium text-[#6B7280] mb-1">{component.name}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {component.type === 'percentage' ? `${component.value}%` : formatCurrency(component.value)}
                      </p>
                      {component.maxConstraint && (
                        <p className="text-xs text-[#6B7280] mt-1">{component.maxConstraint}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Stock Options Section
  const StockOptionsSection = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Stock options</h3>
              <p className="text-sm text-[#6B7280]">Configure equity compensation settings</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTempStockOptions(stockOptions);
                setEditStockOpen(true);
              }}
              className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit plan
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Types of stocks</p>
              <p className="text-sm font-medium text-gray-900">{stockOptions.stockType}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Currency</p>
              <p className="text-sm font-medium text-gray-900">{stockOptions.currency}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Strike price</p>
              <p className="text-sm font-medium text-gray-900">{stockOptions.strikePrice}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Cliff period</p>
              <p className="text-sm font-medium text-gray-900">{stockOptions.cliffPeriod}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Vesting frequency</p>
              <p className="text-sm font-medium text-gray-900">{stockOptions.vestingFrequency}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Bonus Section
  const BonusSection = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bonus policy</h3>
              <p className="text-sm text-[#6B7280]">Configure bonus and incentive policies</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTempBonus(bonus);
                setEditBonusOpen(true);
              }}
              className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit policy
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Performance bonus</p>
                <p className="text-sm font-medium text-gray-900">{bonus.performanceBonus.description}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Joining/Sign on bonus</p>
                <p className="text-sm font-medium text-gray-900">INR {formatCurrency(bonus.joiningBonus.amount)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Referral bonus</p>
                <p className="text-sm font-medium text-gray-900">{bonus.referralBonus.description}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B7280] mb-1">Cash rewards/Spot bonus</p>
                <p className="text-sm font-medium text-gray-900">{bonus.spotBonus.description}</p>
              </div>
            </div>

            <div className="bg-[#F9FAFB] rounded-xl p-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Recovery of joining bonus/signing on bonus</h4>
              <p className="text-xs text-[#6B7280] mb-3">
                If the employee leaves before a certain time duration, they will return some percentage of the joining bonus.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-1">Duration</p>
                  <p className="text-sm font-medium text-gray-900">{bonus.recovery.duration} months</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-1">Percentage</p>
                  <p className="text-sm font-medium text-gray-900">{bonus.recovery.percentage}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Expense Section
  const ExpenseSection = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Expense policy</h3>
              <p className="text-sm text-[#6B7280]">Configure expense reimbursement policies</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit policy
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {expense.categories.map((category) => (
              <div key={category.id} className="bg-[#F9FAFB] rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-1">{category.name}</p>
                <p className="text-xs text-[#6B7280]">
                  {category.useRapidStandard ? 'Standard expense by Rapid applied' : `Custom: INR ${formatCurrency(category.customAmount || 0)}`}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Probation Section
  const ProbationSection = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Probation & notice period</h3>
              <p className="text-sm text-[#6B7280]">*all values are in days</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTempProbation(probation);
                setEditProbationOpen(true);
              }}
              className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit policy
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-1">Probation period</p>
              <p className="text-sm font-semibold text-gray-900">{probation.probationPeriod} days</p>
            </div>

            <div className="bg-[#F9FAFB] rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Notice period for resignations and terminations</h4>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-2">During probation</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">If resigned</p>
                      <p className="text-sm font-medium text-gray-900">{probation.noticePeriod.duringProbation.resigned} days</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">If terminated</p>
                      <p className="text-sm font-medium text-gray-900">{probation.noticePeriod.duringProbation.terminated} days</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#6B7280] mb-2">After probation</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">If resigned</p>
                      <p className="text-sm font-medium text-gray-900">{probation.noticePeriod.afterProbation.resigned} days</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-[#6B7280] mb-1">If terminated</p>
                      <p className="text-sm font-medium text-gray-900">{probation.noticePeriod.afterProbation.terminated} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#F9FAFB] rounded-xl p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Confirmation on completion of probation</p>
                <p className="text-xs text-[#6B7280]">Employee needs to be specifically confirmed at the end of the probation</p>
              </div>
              <Switch
                checked={probation.requireConfirmation}
                onCheckedChange={(checked) => setProbation({ ...probation, requireConfirmation: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Holiday Section
  const HolidaySection = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Holiday calendar</h3>
              <p className="text-sm text-[#6B7280]">*all values are in days</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit holidays
            </Button>
          </div>

          <div className="mb-6">
            <div className="bg-[#586AF5] text-white rounded-xl p-4 inline-block">
              <p className="text-xs font-medium opacity-80 mb-1">Total holidays</p>
              <p className="text-2xl font-bold">{holiday.totalHolidays}</p>
              <p className="text-xs opacity-80">Fixed + floating holidays (max {holiday.maxHolidays})</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Fixed Holidays */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Fixed holidays</h4>
                <span className="text-xs font-medium text-[#586AF5] bg-[#586AF5]/10 px-2 py-1 rounded">{holiday.fixedHolidays.length}</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {holiday.fixedHolidays.map((h) => (
                  <div key={h.id} className="bg-[#F9FAFB] rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{h.name}</p>
                      <p className="text-xs text-[#6B7280]">{formatDate(h.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Holidays */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Floating holidays</h4>
                <span className="text-xs font-medium text-[#586AF5] bg-[#586AF5]/10 px-2 py-1 rounded">{holiday.floatingHolidays.length}</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {holiday.floatingHolidays.map((h) => (
                  <div key={h.id} className="bg-[#F9FAFB] rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{h.name}</p>
                      <p className="text-xs text-[#6B7280]">{formatDate(h.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Leave Section
  const LeaveSection = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Leave policy</h3>
              <p className="text-sm text-[#6B7280]">*all values are in days</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#E5E7EB] text-[#586AF5] hover:bg-[#F4F7FA]"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit policy
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {leave.leaveTypes.map((leaveType) => (
              <div key={leaveType.id} className="bg-[#F9FAFB] rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-1">{leaveType.name}</p>
                <p className="text-xl font-bold text-[#586AF5]">{leaveType.days}</p>
                {leaveType.carryForward?.enabled && (
                  <p className="text-xs text-[#6B7280] mt-1">
                    Carry forward allowed till {leaveType.carryForward.validTillDays / 30} months upto {leaveType.carryForward.maxPercentage}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Portal Section
  const PortalSection = () => (
    <div className="space-y-6">
      <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Portal management</h3>
              <p className="text-sm text-[#6B7280]">Manage admin users and team managers</p>
            </div>
            <Button
              onClick={() => setInviteManagerOpen(true)}
              className="bg-[#586AF5] hover:bg-[#4858d4]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Invite managers
            </Button>
          </div>

          <div className="space-y-3">
            {portal.managers.map((manager) => (
              <div key={manager.id} className="flex items-center justify-between bg-[#F9FAFB] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={manager.avatar} />
                    <AvatarFallback className="bg-[#586AF5] text-white text-sm">
                      {manager.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{manager.name}</p>
                    <p className="text-xs text-[#6B7280]">{manager.role}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#586AF5] bg-[#586AF5]/10 px-2 py-1 rounded">
                  {manager.privilegeLevel}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // BGV Section
  const BGVSection = () => {
    const plans = [
      {
        id: 'pro',
        name: 'Pro',
        price: 29,
        features: ['ID (PAN)', 'Court record check', 'Address (Digital verification)'],
      },
      {
        id: 'power',
        name: 'Power',
        price: 49,
        features: ['ID (PAN)', 'Court record check', 'Address (Digital verification)', 'Education (Highest via regional partner)', 'Employment (Last 2 jobs)', 'Global database verification'],
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 79,
        features: ['ID (PAN)', 'Court record check', 'Address (Digital verification)', 'Education (Highest via regional partner)', 'Employment (Last 2 jobs)', 'Global database verification', 'Professional reference (1 person)', 'Credit check', 'Drug test'],
      },
    ];

    return (
      <div className="space-y-6">
        <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Background verification</h3>
                <p className="text-sm text-[#6B7280]">Pre defined background verification templates for a hassle free procedure</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#6B7280]">Activate background verification</span>
                <Switch
                  checked={bgv.enabled}
                  onCheckedChange={(checked) => setBgv({ ...bgv, enabled: checked })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-xl p-4 border-2 transition-all ${
                    bgv.currentPlan === plan.id
                      ? 'border-[#586AF5] bg-[#586AF5]/5'
                      : 'border-[#E5E7EB] hover:border-[#586AF5]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                    {bgv.currentPlan === plan.id && (
                      <span className="text-xs font-medium text-white bg-[#586AF5] px-2 py-1 rounded">Current plan</span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-[#6B7280]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] mb-1">Cost per employee (excluding GST)</p>
                    <p className="text-xl font-bold text-gray-900">${plan.price}</p>
                  </div>

                  {bgv.currentPlan !== plan.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-[#586AF5] text-[#586AF5]"
                      onClick={() => setBgv({ ...bgv, currentPlan: plan.id as 'pro' | 'power' | 'premium' })}
                    >
                      Upgrade plan
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Welcome Kit Section
  const WelcomeKitSection = () => {
    const plans = [
      {
        id: 'pro',
        name: 'Pro',
        merchandiseCost: 44,
        handlingFees: 15,
        totalCost: 59,
        items: ['Unisex Polo T-shirt', 'Cap', 'Stainless Steel Thermo Flask with Cup'],
      },
      {
        id: 'power',
        name: 'Power',
        merchandiseCost: 89,
        handlingFees: 20,
        totalCost: 109,
        items: ['Unisex Polo T-shirt', 'Cap', 'Stainless Steel Thermo Flask with Cup', 'Laptop Bag', 'Hedge Sling Bag'],
      },
      {
        id: 'premium',
        name: 'Premium',
        merchandiseCost: 159,
        handlingFees: 30,
        totalCost: 189,
        items: ['Unisex Polo T-shirt', 'Cap', 'Stainless Steel Thermo Flask with Cup', 'Laptop Bag', 'Hedge Sling Bag', 'Hooded Jacket', 'Coffee Jar', 'Coffee Mug'],
      },
    ];

    return (
      <div className="space-y-6">
        <Card className="rounded-2xl border border-[#E5E7EB] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Welcome kit</h3>
                <p className="text-sm text-[#6B7280]">Choose your welcome kit here</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#6B7280]">Activate welcome kit</span>
                <Switch
                  checked={welcomeKit.enabled}
                  onCheckedChange={(checked) => setWelcomeKit({ ...welcomeKit, enabled: checked })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-xl p-4 border-2 transition-all ${
                    welcomeKit.currentPlan === plan.id
                      ? 'border-[#586AF5] bg-[#586AF5]/5'
                      : 'border-[#E5E7EB] hover:border-[#586AF5]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                    {welcomeKit.currentPlan === plan.id && (
                      <span className="text-xs font-medium text-white bg-[#586AF5] px-2 py-1 rounded">Current plan</span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-[#6B7280]">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB] space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6B7280]">Merchandise cost</span>
                      <span className="font-medium text-gray-900">${plan.merchandiseCost}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#6B7280]">Rapid&apos;s Handling Fees</span>
                      <span className="font-medium text-gray-900">${plan.handlingFees}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-[#E5E7EB]">
                      <span className="font-medium text-[#6B7280]">Cost per employee (One time)</span>
                      <span className="font-bold text-gray-900">${plan.totalCost}</span>
                    </div>
                  </div>

                  {welcomeKit.currentPlan !== plan.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-[#586AF5] text-[#586AF5]"
                      onClick={() => setWelcomeKit({ ...welcomeKit, currentPlan: plan.id as 'pro' | 'power' | 'premium' })}
                    >
                      Upgrade plan
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex gap-6 min-h-[calc(100vh-120px)]">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Card className="rounded-2xl border border-[#E5E7EB] shadow-none sticky top-6 z-10">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 px-3 py-2 mb-2">Company settings</h2>
            <nav className="space-y-1">
              {settingsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#586AF5] text-white'
                        : 'text-[#6B7280] hover:bg-[#F4F7FA] hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {renderSection()}
      </div>

      {/* Edit Profile Modal */}
      <Sheet open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Company profile</SheetTitle>
          </SheetHeader>
          <div className="px-6">
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#6B7280]">Legal entity name</Label>
                <Input value={tempProfile.legalEntityName} disabled className="bg-[#F9FAFB]" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#6B7280]">Country</Label>
                <Input value={tempProfile.country} disabled className="bg-[#F9FAFB]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Address line 1</Label>
              <Input
                value={tempProfile.addressLine1}
                onChange={(e) => setTempProfile({ ...tempProfile, addressLine1: e.target.value })}
                placeholder="Your house/apartment/block/building number"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Address line 2</Label>
              <Input
                value={tempProfile.addressLine2}
                onChange={(e) => setTempProfile({ ...tempProfile, addressLine2: e.target.value })}
                placeholder="Your street name/landmark"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#6B7280]">PIN code</Label>
                <Input
                  value={tempProfile.pinCode}
                  onChange={(e) => setTempProfile({ ...tempProfile, pinCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#6B7280]">City</Label>
                <Input
                  value={tempProfile.city}
                  onChange={(e) => setTempProfile({ ...tempProfile, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#6B7280]">State</Label>
                <Input
                  value={tempProfile.state}
                  onChange={(e) => setTempProfile({ ...tempProfile, state: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#6B7280]">Phone number*</Label>
                <Input
                  value={tempProfile.phoneNumber}
                  onChange={(e) => setTempProfile({ ...tempProfile, phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-[#6B7280]">Email address</Label>
                <Input
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Tax ID</Label>
              <Input
                value={tempProfile.taxId}
                onChange={(e) => setTempProfile({ ...tempProfile, taxId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Upload logo</Label>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 mx-auto text-[#6B7280] mb-2" />
                <p className="text-xs text-[#6B7280]">Click or drag to upload</p>
              </div>
            </div>
          </div>
          <SheetFooter className="px-6 py-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#586AF5] hover:bg-[#4858d4]"
              onClick={() => {
                setProfile(tempProfile);
                setEditProfileOpen(false);
              }}
            >
              Submit
            </Button>
          </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Salary Range Panel */}
      <Sheet open={editSalaryRangeOpen} onOpenChange={setEditSalaryRangeOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Salary range</SheetTitle>
          </SheetHeader>
          <div className="px-6">
          <p className="text-xs text-[#6B7280] pt-4">*all values in INR</p>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Minimum salary</Label>
              <Input
                type="number"
                value={tempSalaryRange.minimum}
                onChange={(e) => setTempSalaryRange({ ...tempSalaryRange, minimum: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Maximum salary</Label>
              <Input
                type="number"
                value={tempSalaryRange.maximum}
                onChange={(e) => setTempSalaryRange({ ...tempSalaryRange, maximum: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Average salary</Label>
              <Input
                type="number"
                value={tempSalaryRange.average}
                onChange={(e) => setTempSalaryRange({ ...tempSalaryRange, average: Number(e.target.value) })}
              />
            </div>
          </div>
          <SheetFooter className="px-6 py-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditSalaryRangeOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#586AF5] hover:bg-[#4858d4]"
              onClick={() => {
                setSalary({ ...salary, range: tempSalaryRange });
                setEditSalaryRangeOpen(false);
              }}
            >
              Submit
            </Button>
          </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Stock Options Panel */}
      <Sheet open={editStockOpen} onOpenChange={setEditStockOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Stock options</SheetTitle>
          </SheetHeader>
          <div className="px-6">
          <p className="text-xs text-[#6B7280] pt-4">*all values in INR</p>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Type of stocks</Label>
              <Select
                value={tempStockOptions.stockType}
                onValueChange={(value) => setTempStockOptions({ ...tempStockOptions, stockType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incentive Stock Options (ISOx)">Incentive Stock Options (ISOx)</SelectItem>
                  <SelectItem value="Non-Qualified Stock Options (NSO)">Non-Qualified Stock Options (NSO)</SelectItem>
                  <SelectItem value="Restricted Stock Units (RSU)">Restricted Stock Units (RSU)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Currency</Label>
              <Select
                value={tempStockOptions.currency}
                onValueChange={(value) => setTempStockOptions({ ...tempStockOptions, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR (India)">INR (India)</SelectItem>
                  <SelectItem value="USD (United States)">USD (United States)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Strike price</Label>
              <Input
                type="number"
                value={tempStockOptions.strikePrice}
                onChange={(e) => setTempStockOptions({ ...tempStockOptions, strikePrice: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Cliff period</Label>
              <Select
                value={tempStockOptions.cliffPeriod}
                onValueChange={(value) => setTempStockOptions({ ...tempStockOptions, cliffPeriod: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="12 months">12 months</SelectItem>
                  <SelectItem value="18 months">18 months</SelectItem>
                  <SelectItem value="24 months">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Vesting frequency</Label>
              <Select
                value={tempStockOptions.vestingFrequency}
                onValueChange={(value) => setTempStockOptions({ ...tempStockOptions, vestingFrequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="px-6 py-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditStockOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#586AF5] hover:bg-[#4858d4]"
              onClick={() => {
                setStockOptions(tempStockOptions);
                setEditStockOpen(false);
              }}
            >
              Submit
            </Button>
          </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Bonus Panel */}
      <Sheet open={editBonusOpen} onOpenChange={setEditBonusOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Bonus policy</SheetTitle>
          </SheetHeader>
          <div className="px-6">
          <p className="text-xs text-[#6B7280] pt-4">*all values in INR</p>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Type of Bonus</Label>
              <Select
                value={tempBonus.bonusType}
                onValueChange={(value: 'flat_rate' | 'fixed') => setTempBonus({ ...tempBonus, bonusType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat_rate">Flat rate</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Performance bonus</Label>
              <Input
                value={tempBonus.performanceBonus.description}
                onChange={(e) => setTempBonus({ ...tempBonus, performanceBonus: { ...tempBonus.performanceBonus, description: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Joining/Sign on bonus</Label>
              <Input
                type="number"
                value={tempBonus.joiningBonus.amount}
                onChange={(e) => setTempBonus({ ...tempBonus, joiningBonus: { ...tempBonus.joiningBonus, amount: Number(e.target.value) } })}
              />
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-gray-900">Recovery of joining bonus/signing on bonus</p>
              <p className="text-xs text-[#6B7280]">If the employee leaves before a certain time duration, they will return some percentage of the joining bonus.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-[#6B7280]">Duration (months)</Label>
                  <Input
                    type="number"
                    value={tempBonus.recovery.duration}
                    onChange={(e) => setTempBonus({ ...tempBonus, recovery: { ...tempBonus.recovery, duration: Number(e.target.value) } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-[#6B7280]">Percentage</Label>
                  <Input
                    type="number"
                    value={tempBonus.recovery.percentage}
                    onChange={(e) => setTempBonus({ ...tempBonus, recovery: { ...tempBonus.recovery, percentage: Number(e.target.value) } })}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Referral bonus</Label>
              <Input
                value={tempBonus.referralBonus.description}
                onChange={(e) => setTempBonus({ ...tempBonus, referralBonus: { ...tempBonus.referralBonus, description: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Cash reward/Spot bonus</Label>
              <Input
                value={tempBonus.spotBonus.description}
                onChange={(e) => setTempBonus({ ...tempBonus, spotBonus: { ...tempBonus.spotBonus, description: e.target.value } })}
              />
            </div>
          </div>
          <SheetFooter className="px-6 py-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditBonusOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#586AF5] hover:bg-[#4858d4]"
              onClick={() => {
                setBonus(tempBonus);
                setEditBonusOpen(false);
              }}
            >
              Update
            </Button>
          </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Probation Panel */}
      <Sheet open={editProbationOpen} onOpenChange={setEditProbationOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Probation & notice period</SheetTitle>
          </SheetHeader>
          <div className="px-6">
          <p className="text-xs text-[#6B7280] pt-4">*all values in days</p>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Probation period</Label>
              <Input
                type="number"
                value={tempProbation.probationPeriod}
                onChange={(e) => setTempProbation({ ...tempProbation, probationPeriod: Number(e.target.value) })}
              />
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-gray-900">Notice period in probation</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-[#6B7280]">If resigned</Label>
                  <Input
                    type="number"
                    value={tempProbation.noticePeriod.duringProbation.resigned}
                    onChange={(e) => setTempProbation({
                      ...tempProbation,
                      noticePeriod: {
                        ...tempProbation.noticePeriod,
                        duringProbation: { ...tempProbation.noticePeriod.duringProbation, resigned: Number(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-[#6B7280]">If terminated</Label>
                  <Input
                    type="number"
                    value={tempProbation.noticePeriod.duringProbation.terminated}
                    onChange={(e) => setTempProbation({
                      ...tempProbation,
                      noticePeriod: {
                        ...tempProbation.noticePeriod,
                        duringProbation: { ...tempProbation.noticePeriod.duringProbation, terminated: Number(e.target.value) }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-gray-900">Notice period after probation</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-[#6B7280]">If resigned</Label>
                  <Input
                    type="number"
                    value={tempProbation.noticePeriod.afterProbation.resigned}
                    onChange={(e) => setTempProbation({
                      ...tempProbation,
                      noticePeriod: {
                        ...tempProbation.noticePeriod,
                        afterProbation: { ...tempProbation.noticePeriod.afterProbation, resigned: Number(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-[#6B7280]">If terminated</Label>
                  <Input
                    type="number"
                    value={tempProbation.noticePeriod.afterProbation.terminated}
                    onChange={(e) => setTempProbation({
                      ...tempProbation,
                      noticePeriod: {
                        ...tempProbation.noticePeriod,
                        afterProbation: { ...tempProbation.noticePeriod.afterProbation, terminated: Number(e.target.value) }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Confirmation on completion of probation</p>
                <p className="text-xs text-[#6B7280]">Employee needs to be specifically confirmed at the end of the probation</p>
              </div>
              <Switch
                checked={tempProbation.requireConfirmation}
                onCheckedChange={(checked) => setTempProbation({ ...tempProbation, requireConfirmation: checked })}
              />
            </div>
          </div>
          <SheetFooter className="px-6 py-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditProbationOpen(false)}>Cancel</Button>
            <Button
              className="bg-[#586AF5] hover:bg-[#4858d4]"
              onClick={() => {
                setProbation(tempProbation);
                setEditProbationOpen(false);
              }}
            >
              Update
            </Button>
          </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* Invite Manager Panel */}
      <Sheet open={inviteManagerOpen} onOpenChange={setInviteManagerOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Invite team managers</SheetTitle>
          </SheetHeader>
          <div className="px-6">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Full name</Label>
              <Input placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Email address</Label>
              <Input type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Team</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-[#6B7280]">Privilege level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select privilege level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="py-4 border-t mt-4">
            <Button variant="outline" onClick={() => setInviteManagerOpen(false)}>Cancel</Button>
            <Button className="bg-[#586AF5] hover:bg-[#4858d4]">
              Send invite
            </Button>
          </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
