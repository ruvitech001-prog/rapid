'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCompanyTeams } from '@/lib/hooks';
import { useAuth } from '@/lib/auth';
import type { OfferFormData } from '@/app/employer/offers/new/page';

interface Props {
  formData: OfferFormData;
  updateFormData: (updates: Partial<OfferFormData>) => void;
  errors: Record<string, string>;
}

export function EmployeeDetailsForm({ formData, updateFormData, errors }: Props) {
  const { user } = useAuth();
  const companyId = user?.companyId;

  // Fetch teams from database
  const { data: teams = [] } = useCompanyTeams(companyId || null);

  // Only show team dropdown if multiple teams exist
  const showTeamDropdown = teams.length > 1;
  const defaultTeam = teams[0]; // First team is default

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Employee Details</h2>
        <p className="text-sm text-gray-500">
          Provide basic information about the new hire
        </p>
      </div>

      <div className="space-y-5">
        {/* Team - Conditional */}
        {showTeamDropdown && (
          <div className="space-y-2">
            <Label htmlFor="team" className="text-gray-700">
              Team*
            </Label>
            <Select
              value={formData.team || defaultTeam?.id}
              onValueChange={(value) => updateFormData({ team: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team, index) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name} {index === 0 && '(Default)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.team && (
              <p className="text-xs text-red-600">{errors.team}</p>
            )}
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700">
              First Name*
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              className="h-12"
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-xs text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName" className="text-gray-700">
              Middle Name
            </Label>
            <Input
              id="middleName"
              type="text"
              value={formData.middleName}
              onChange={(e) => updateFormData({ middleName: e.target.value })}
              className="h-12"
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700">
              Last Name*
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              className="h-12"
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-xs text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* PAN Number */}
        <div className="space-y-2">
          <Label htmlFor="employeePan" className="text-gray-700">
            Employee PAN* <span className="text-xs text-gray-500">(cannot be edited later)</span>
          </Label>
          <Input
            id="employeePan"
            type="text"
            value={formData.employeePan}
            onChange={(e) => updateFormData({ employeePan: e.target.value.toUpperCase() })}
            className="h-12 uppercase"
            placeholder="ABCDE1234F"
            maxLength={10}
          />
          {errors.employeePan && (
            <p className="text-xs text-red-600">{errors.employeePan}</p>
          )}
          <p className="text-xs text-gray-500">
            Format: 10 characters (e.g., ABCDE1234F)
          </p>
        </div>

        {/* Personal Email */}
        <div className="space-y-2">
          <Label htmlFor="personalEmail" className="text-gray-700">
            Employee personal Email*
          </Label>
          <Input
            id="personalEmail"
            type="email"
            value={formData.personalEmail}
            onChange={(e) => updateFormData({ personalEmail: e.target.value })}
            className="h-12"
            placeholder="john.doe@email.com"
          />
          {errors.personalEmail && (
            <p className="text-xs text-red-600">{errors.personalEmail}</p>
          )}
        </div>
      </div>
    </div>
  );
}
