import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, UtensilsCrossed,
  Armchair, Users, Settings, LogOut, Crown
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/manager',          icon: LayoutDashboard,  label: 'Bosh sahifa',     end: true },
  { to: '/manager/orders',   icon: ClipboardList,    label: 'Buyurtmalar' },
  { to: '/manager/menu',     icon: UtensilsCrossed,  label: 'Menyu' },
  { to: '/manager/tables',   icon: Armchair,         label: 'Stollar va QR' },
  { to: '/manager/staff',    icon: Users,            label: 'Xodimlar' },
  { to: '/manager/settings', icon: Settings,         label: 'Sozlamalar' },
];

const planLabels: Record<string, string> = {
  trial: 'Sinov',
  basic: 'Oddiy',
  pro: 'Professional',
  enterprise: 'Korporativ',
};

const Sidebar: React.FC = () => {
  const { user, organization, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const expiresAt = organization?.subscription_expires_at
    ? new Date(organization.subscription_expires_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          {organization?.logo_url ? (
            <img src={organization.logo_url} alt="logo" className="w-9 h-9 rounded-btn object-cover" />
          ) : (
            <div className="w-9 h-9 bg-[#F59E0B] rounded-btn flex items-center justify-center">
              <span className="text-black font-bold text-sm">D</span>
            </div>
          )}
          <div>
            <p className="text-[#FAFAFA] font-semibold text-sm leading-tight">Dastyor</p>
            <p className="text-[#A1A1AA] text-xs truncate max-w-[130px]">{organization?.name ?? '...'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/20'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#2A2A2A]'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-[#2A2A2A] space-y-3">
        {/* Subscription */}
        {organization && (
          <div className="bg-[#0F0F0F] rounded-btn px-3 py-2.5">
            <div className="flex items-center gap-2 mb-1">
              <Crown size={13} className="text-[#F59E0B]" />
              <span className="text-xs font-semibold text-[#F59E0B]">
                {planLabels[organization.subscription_plan] ?? organization.subscription_plan}
              </span>
            </div>
            {expiresAt && (
              <p className="text-xs text-[#A1A1AA]">Tugaydi: {expiresAt}</p>
            )}
          </div>
        )}

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F59E0B]/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#F59E0B] text-xs font-bold">
              {user?.full_name?.charAt(0).toUpperCase() ?? 'M'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#FAFAFA] truncate">{user?.full_name ?? 'Manager'}</p>
            <p className="text-xs text-[#A1A1AA] capitalize">{user?.role ?? 'manager'}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-[#A1A1AA] hover:text-red-400 transition-colors p-1"
            title="Chiqish"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
