import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.access_token);
      toast.success('Login successful!');
      router.push('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw error;
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      toast.success('Registration successful! Please login to continue.');
      router.push('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      throw error;
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };
};