'use client';

import { Switch } from '@/components/ui/switch';

interface PermissionToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function PermissionToggle({
  title,
  description,
  checked,
  onChange,
}: PermissionToggleProps) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1 pr-4">
        <h4 className="text-base font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
