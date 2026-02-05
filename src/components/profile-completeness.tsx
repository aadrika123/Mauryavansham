'use client';

import { Card } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProfileField {
  field: string;
  label: string;
  isCompleted: boolean;
  weight: number;
}

interface ProfileCompletenessProps {
  completionPercentage: number;
  fields: ProfileField[];
  userId?: string;
}

export function ProfileCompleteness({ completionPercentage, fields, userId }: ProfileCompletenessProps) {
  const router = useRouter();
  const incompleteFields = fields.filter(f => !f.isCompleted);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Profile Completeness</h3>
          <div className="flex items-center gap-3">
            <Progress value={completionPercentage} className="flex-1 h-3" />
            <span className={`text-2xl font-bold ${getProgressColor(completionPercentage)}`}>
              {completionPercentage}%
            </span>
          </div>
        </div>

        {/* Status Message */}
        {completionPercentage < 100 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              Complete your profile to increase visibility and get better recommendations!
            </p>
          </div>
        )}

        {/* Incomplete Fields */}
        {incompleteFields.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Missing Information:</h4>
            <div className="space-y-1">
              {incompleteFields.slice(0, 5).map(field => (
                <div key={field.field} className="flex items-center gap-2 text-sm text-gray-600">
                  <Circle className="w-4 h-4 text-gray-400" />
                  <span>{field.label}</span>
                </div>
              ))}
            </div>
            {incompleteFields.length > 5 && (
              <p className="text-xs text-gray-500">+{incompleteFields.length - 5} more fields...</p>
            )}
          </div>
        )}

        {/* Completed Fields */}
        {fields.some(f => f.isCompleted) && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">Completed:</h4>
            <div className="space-y-1">
              {fields
                .filter(f => f.isCompleted)
                .slice(0, 3)
                .map(field => (
                  <div key={field.field} className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>{field.label}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        {completionPercentage < 100 && userId && (
          <Button
            onClick={() => router.push(`/edit-profile/${userId}`)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            Complete Profile
          </Button>
        )}
      </div>
    </Card>
  );
}
