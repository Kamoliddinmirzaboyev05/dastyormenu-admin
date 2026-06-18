import React from 'react';
import { OrderStatus } from '../../lib/types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string; dot: string }> = {
  pending:   { label: 'Kutilmoqda',     className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' },
  cooking:   { label: 'Tayyorlanmoqda', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',       dot: 'bg-blue-400' },
  ready:     { label: 'Tayyor',         className: 'bg-green-500/20 text-green-400 border-green-500/30',    dot: 'bg-green-400' },
  completed: { label: 'Tugallangan',    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',       dot: 'bg-gray-400' },
  cancelled: { label: 'Bekor qilindi',  className: 'bg-red-500/20 text-red-400 border-red-500/30',          dot: 'bg-red-400' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${cfg.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
