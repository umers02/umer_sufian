'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema } from '@/lib/validationSchemas';
import { useState } from 'react';

interface LoginFormData {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        identifier: data.identifier,
        password: data.password,
      });
    } catch (error: any) {
      // Error is already handled by the mutation with toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {loginMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {loginMutation.error.response?.data?.message || loginMutation.error.message || 'Login failed'}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Your Email*
        </label>
        <Input
          {...register('identifier')}
          type="text"
          className={`w-full ${errors.identifier ? 'border-red-500' : ''}`}
          placeholder="Email or username"
        />
        {errors.identifier && (
          <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password*
        </label>
        <div className="relative">
          <Input
            {...register('password')}
            type={showPassword ? "text" : "password"}
            className={`w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
          />
          <label htmlFor="remember" className="text-sm text-gray-600">
            Remember me
          </label>
        </div>
        <a
          href="/forgot-password"
          className="text-sm text-[#4A5FBF] hover:underline"
        >
          Forgot Password
        </a>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white py-3"
        disabled={isSubmitting || loginMutation.isPending}
      >
        {isSubmitting || loginMutation.isPending ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}