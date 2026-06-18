import { create } from 'zustand';
import { UserProfile, Organization } from '../lib/types';
import { authService } from '../lib/authService';

interface AuthState {
  user: UserProfile | null;
  organization: Organization | null;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setOrganization: (org: Organization | null) => void;
  setLoading: (v: boolean) => void;
  signIn: (login: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
  verifyAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  organization: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setOrganization: (organization) => set({ organization }),
  setLoading: (isLoading) => set({ isLoading }),

  signIn: async (login, password) => {
    try {
      const response = await authService.login({ login, password });
      
      if (response.success && response.data) {
        set({ 
          user: response.data.user, 
          organization: response.data.organization 
        });
        return null;
      }
      
      return response.error?.message || 'Login yoki parol noto\'g\'ri';
    } catch (error) {
      console.error('Login error:', error);
      return 'Serverga ulanishda xatolik';
    }
  },

  signOut: async () => {
    await authService.logout();
    set({ user: null, organization: null });
  },

  loadProfile: async () => {
    console.log('🔵 Loading profile from localStorage...');
    set({ isLoading: true });

    try {
      // Check if token exists
      const token = authService.getToken();
      console.log('🔑 Token exists:', !!token);
      
      if (!token) {
        console.log('❌ No token found, user not authenticated');
        set({ user: null, organization: null, isLoading: false });
        return;
      }

      // Load from localStorage
      const stored = authService.getStoredAuth();
      console.log('💾 Stored auth data:', stored);
      
      if (stored && stored.user && stored.organization) {
        console.log('✅ Setting user from localStorage');
        set({ 
          user: stored.user, 
          organization: stored.organization, 
          isLoading: false 
        });

        // Verify with API in background (don't block UI)
        // Only clear auth if token is actually invalid (401)
        authService.verifyAuth().then(isValid => {
          console.log('🔐 Token verification result:', isValid);
          if (!isValid) {
            console.log('❌ Token invalid (401), logging out');
            set({ user: null, organization: null });
          } else {
            console.log('✅ Token valid, updating user data');
            // Refresh user data from API
            const updated = authService.getStoredAuth();
            if (updated) {
              set({ user: updated.user, organization: updated.organization });
            }
          }
        }).catch(error => {
          console.error('⚠️ Verification error (keeping user logged in):', error);
          // Don't clear auth on network error, keep localStorage data
        });
      } else {
        console.log('❌ No stored auth data found');
        set({ user: null, organization: null, isLoading: false });
      }
    } catch (error) {
      console.error('❌ Load profile error:', error);
      // Don't clear localStorage on error
      set({ isLoading: false });
    }
  },

  verifyAuth: async () => {
    return await authService.verifyAuth();
  },
}));
