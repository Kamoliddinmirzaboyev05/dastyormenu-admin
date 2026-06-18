import React, { createContext, useContext, useState, useCallback } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastItem {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((type: 'success' | 'error', message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const success = useCallback((msg: string) => add('success', msg), [add]);
  const error = useCallback((msg: string) => add('error', msg), [add]);

  return (
    <ToastContext.Provider value={{ success, error }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map(t => (
          <RadixToast.Root
            key={t.id}
            open
            onOpenChange={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            className="flex items-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-card px-4 py-3 shadow-xl data-[state=open]:animate-slideIn"
          >
            {t.type === 'success'
              ? <CheckCircle size={18} className="text-green-400 shrink-0" />
              : <XCircle size={18} className="text-red-400 shrink-0" />
            }
            <RadixToast.Description className="text-sm text-[#FAFAFA] flex-1">
              {t.message}
            </RadixToast.Description>
            <RadixToast.Close className="text-[#A1A1AA] hover:text-[#FAFAFA]">
              <X size={14} />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999] w-80" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
};
