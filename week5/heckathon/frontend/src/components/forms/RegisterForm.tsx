'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries } from '@/lib/countryCodes';
import { useRegister } from '@/hooks/useAuth';
import { registerSchema } from '@/lib/validationSchemas';

interface RegisterFormData {
  fullName: string;
  email: string;
  mobile: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export function RegisterForm() {
  const [selectedCountry, setSelectedCountry] = useState('pk');
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      username: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch('agreeToTerms');
  const mobile = watch('mobile');

  const countryCodes: Record<string, string> = Object.fromEntries(
    countries.map((c) => [c.key, c.dialCode])
  );

  const countryMax: Record<string, number> = Object.fromEntries(
    countries.map((c) => [
      c.key,
      typeof c.maxLength === 'number' ? c.maxLength : 10,
    ])
  );

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const localNumber = (data.mobile || '').toString().replace(/^0+/, '');
      const dial = countryCodes[selectedCountry] ?? '+92';
      const mobileWithCode = `${dial}${localNumber}`;

      const payload = {
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        fullName: data.fullName.trim(),
        mobileNumber: mobileWithCode,
      };
      
      await registerMutation.mutateAsync(payload);
    } catch (error: any) {
      // Error is already handled by the mutation with toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {registerMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {registerMutation.error.response?.data?.message || registerMutation.error.message || 'Registration failed'}
        </div>
      )}
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-medium text-[#4A5FBF] mb-4">
          Personal Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Your Full Name*
            </label>
            <Input
              {...register('fullName')}
              type="text"
              className={`w-full ${errors.fullName ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Email*
              </label>
              <Input
                {...register('email')}
                type="email"
                className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Mobile Number*
              </label>
              <div className="flex">
                <Select
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger className="w-25">
                    <SelectValue>
                      {selectedCountry
                        ? `${selectedCountry} (${countryCodes[selectedCountry] ?? ''})`
                        : 'Select country'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.name} {c.dialCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  {...register('mobile')}
                  type="tel"
                  maxLength={countryMax[selectedCountry] ?? 10}
                  onChange={(e) => {
                    const raw = e.target.value || '';
                    const digits = raw.replace(/\D/g, '');
                    const codeDigits = (countryCodes[selectedCountry] ?? '').replace('+', '');
                    let local = digits;
                    if (local.startsWith(codeDigits)) {
                      local = local.slice(codeDigits.length);
                    }
                    const maxLen = countryMax[selectedCountry] ?? 10;
                    if (local.length > maxLen) local = local.slice(0, maxLen);
                    setValue('mobile', local);
                  }}
                  className={`flex-1 ml-2 ${errors.mobile ? 'border-red-500' : ''}`}
                  placeholder="Mobile number"
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}

          </div>
        </div>
      </div>

      {/* Account Information */}
      <div>
        <h3 className="text-lg font-medium text-[#4A5FBF] mb-4">
          Account Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username*
            </label>
            <div className="flex">
              <Input
                {...register('username')}
                type="text"
                className={`flex-1 ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Choose a username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
              <Button
                type="button"
                variant="outline"
                className="ml-2 text-[#4A5FBF] border-[#4A5FBF] bg-transparent"
              >
                Check Availability
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password*
              </label>
              <Input
                {...register('password')}
                type="password"
                className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password*
              </label>
              <Input
                {...register('confirmPassword')}
                type="password"
                className={`w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => setValue('agreeToTerms', checked as boolean)}
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the{' '}
          <a href="/terms" className="text-[#4A5FBF] hover:underline">
            Terms & Conditions
          </a>
        </label>
      </div>

      <Button
        type="submit"
        disabled={!agreeToTerms || isSubmitting || registerMutation.isPending}
        className={
          agreeToTerms
            ? 'w-full bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white py-3'
            : 'w-full bg-gray-200 text-gray-400 py-3 cursor-not-allowed'
        }
      >
        {isSubmitting || registerMutation.isPending ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}