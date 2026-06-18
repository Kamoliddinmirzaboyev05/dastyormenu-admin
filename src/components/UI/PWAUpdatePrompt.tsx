import React from 'react';
import { RefreshCw, X } from 'lucide-react';
import Button from './Button';

interface PWAUpdatePromptProps {
  show: boolean;
  onUpdate: () => void;
  onClose: () => void;
}

const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({ show, onUpdate, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-[#1A1A1A] border border-[#F59E0B] rounded-card p-4 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F59E0B]/20 rounded-full flex items-center justify-center">
              <RefreshCw size={16} className="text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#FAFAFA]">Yangilanish mavjud</h3>
              <p className="text-xs text-[#A1A1AA]">Yangi versiya tayyor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <p className="text-xs text-[#A1A1AA] mb-3">
          Ilovaning yangi versiyasi mavjud. Yangilash uchun tugmani bosing.
        </p>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={onClose}
          >
            Keyinroq
          </Button>
          <Button
            size="sm"
            fullWidth
            onClick={onUpdate}
            icon={RefreshCw}
          >
            Yangilash
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;
