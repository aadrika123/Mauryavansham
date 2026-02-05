'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

interface SummaryCardProps {
  title: string;
  value: number;
  color?: string;
  icon?: JSX.Element;
}

export default function SummaryCard({ title, value, color = 'text-white', icon }: SummaryCardProps) {
  return (
    <Card className="w-40 h-20 bg-orange-500 text-white rounded-xl shadow-md flex flex-col justify-between p-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xs font-semibold">{title}</CardTitle>
        {icon && <div className="text-lg">{icon}</div>}
      </div>
      <div>
        <div className={`text-xl font-bold leading-none ${color}`}>{value}</div>
        <p className="text-[10px] text-white/80 mt-1">Updated overview</p>
      </div>
    </Card>
  );
}
