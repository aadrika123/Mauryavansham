import { Badge } from '@/src/components/ui/badge';
import { CheckCircle, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

type VerificationLevel = 'unverified' | 'basic' | 'verified' | 'elite_verified';

interface VerificationBadgeProps {
  level: VerificationLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const levelConfig = {
  unverified: {
    label: 'Not Verified',
    icon: ShieldAlert,
    color: 'bg-gray-100 text-gray-600 border-gray-300',
    iconColor: 'text-gray-500'
  },
  basic: {
    label: 'Basic Verified',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    iconColor: 'text-blue-600'
  },
  verified: {
    label: 'Verified',
    icon: ShieldCheck,
    color: 'bg-green-100 text-green-700 border-green-300',
    iconColor: 'text-green-600'
  },
  elite_verified: {
    label: 'Elite Verified',
    icon: Shield,
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    iconColor: 'text-purple-600'
  }
};

const sizeConfig = {
  sm: { iconSize: 'w-3 h-3', textSize: 'text-xs', padding: 'px-2 py-0.5' },
  md: { iconSize: 'w-4 h-4', textSize: 'text-sm', padding: 'px-2 py-1' },
  lg: { iconSize: 'w-5 h-5', textSize: 'text-base', padding: 'px-3 py-1.5' }
};

export function VerificationBadge({ level, showLabel = true, size = 'md', className = '' }: VerificationBadgeProps) {
  const config = levelConfig[level];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  if (level === 'unverified' && !showLabel) return null;

  return (
    <Badge className={`${config.color} ${sizeStyles.padding} ${sizeStyles.textSize} border font-semibold ${className}`}>
      <Icon className={`${sizeStyles.iconSize} ${config.iconColor} ${showLabel ? 'mr-1' : ''}`} />
      {showLabel && config.label}
    </Badge>
  );
}
