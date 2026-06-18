import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeLabel, icon: Icon, loading }) => {
  if (loading) {
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-5 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-24 bg-[#2A2A2A] rounded" />
          <div className="w-10 h-10 bg-[#2A2A2A] rounded-btn" />
        </div>
        <div className="h-8 w-32 bg-[#2A2A2A] rounded mb-2" />
        <div className="h-3 w-20 bg-[#2A2A2A] rounded" />
      </div>
    );
  }

  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-5 hover:border-[#F59E0B]/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-[#A1A1AA] font-medium">{title}</p>
        <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-btn flex items-center justify-center">
          <Icon size={18} className="text-[#F59E0B]" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#FAFAFA] mb-1">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive
            ? <TrendingUp size={13} className="text-green-400" />
            : <TrendingDown size={13} className="text-red-400" />
          }
          <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
          {changeLabel && <span className="text-xs text-[#A1A1AA]">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
