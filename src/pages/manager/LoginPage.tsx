import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../lib/toast';

const schema = z.object({
  login: z.string().min(1, "Login kiritilishi shart"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const { signIn } = useAuthStore();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Load saved credentials on mount
  React.useEffect(() => {
    const savedLogin = sessionStorage.getItem('dastyor_saved_login');
    if (savedLogin) {
      setValue('login', savedLogin);
      setRememberMe(true);
    }
  }, [setValue]);

  const handleForgotPassword = () => {
    toastSuccess('Parolni tiklash funksiyasi tez orada qo\'shiladi');
  };

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    
    console.log('🔵 Login attempt:', data.login);
    
    const err = await signIn(data.login, data.password);
    if (err) {
      console.error('❌ Login failed:', err);
      setApiError(err);
      toastError(err);
    } else {
      console.log('✅ Login successful');
      
      // Save login if remember me is checked
      if (rememberMe) {
        sessionStorage.setItem('dastyor_saved_login', data.login);
      } else {
        sessionStorage.removeItem('dastyor_saved_login');
      }
      
      toastSuccess('Muvaffaqiyatli kirdingiz!');
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/manager');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#F59E0B] rounded-card flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">Dastyor</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">Menejer Paneli</p>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-card p-4 mb-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400 mb-1">Xatolik</p>
              <p className="text-xs text-red-300">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">Login yoki Email</label>
              <input
                {...register('login')}
                type="text"
                placeholder="admin yoki email@example.com"
                className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2.5 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#F59E0B]/50 transition-colors"
                autoComplete="username"
              />
              {errors.login && <p className="text-red-400 text-xs mt-1">{errors.login.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">Parol</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-input px-3 py-2.5 pr-10 text-sm text-[#FAFAFA] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#F59E0B]/50 transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#FAFAFA]"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#2A2A2A] bg-[#0F0F0F] text-[#F59E0B] focus:ring-[#F59E0B] focus:ring-offset-0"
                />
                <span className="text-[#A1A1AA]">Eslab qolish</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[#F59E0B] hover:text-[#D97706] transition-colors"
              >
                Parolni unutdim?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold py-2.5 rounded-btn transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Kirish</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#A1A1AA] mt-6">
          Dastyor SaaS © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
