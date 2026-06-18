import React, { useState, useEffect } from 'react';
import { Bell, Menu, Download } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface TopBarProps {
  title: string;
  onMenuToggle?: () => void;
  notificationCount?: number;
}

const TopBar: React.FC<TopBarProps> = ({ title, onMenuToggle, notificationCount = 0 }) => {
  const { organization } = useAuthStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <header className="h-16 bg-[#1A1A1A] border-b border-[#2A2A2A] flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-[#FAFAFA]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-[#A1A1AA] hidden sm:block">{organization?.name}</span>
        
        {/* PWA Install Button */}
        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black text-sm font-medium rounded-btn transition-colors"
            title="Ilovani o'rnatish"
          >
            <Download size={16} />
            <span className="hidden sm:inline">O&apos;rnatish</span>
          </button>
        )}

        <button className="relative w-9 h-9 bg-[#2A2A2A] rounded-btn flex items-center justify-center text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F59E0B] rounded-full text-black text-[10px] font-bold flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
