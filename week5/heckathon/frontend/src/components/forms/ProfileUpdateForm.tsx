'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { profileUpdateSchema } from '@/lib/validationSchemas';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface ProfileUpdateFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  country?: string;
  city?: string;
  address1?: string;
  address2?: string;
  landLineNumber?: string;
  poBox?: string;
}

interface ProfileUpdateFormProps {
  onSuccess?: () => void;
}

export function ProfileUpdateForm({ onSuccess }: ProfileUpdateFormProps) {
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateFormData>({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      mobileNumber: user?.mobileNumber || '',
      nationality: user?.nationality || '',
      idType: user?.idType || '',
      idNumber: user?.idNumber || '',
      country: user?.country || '',
      city: user?.city || '',
      address1: user?.address1 || '',
      address2: user?.address2 || '',
      landLineNumber: user?.landLineNumber || '',
      poBox: user?.poBox || '',
    },
  });

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      const response = await fetch('http://localhost:4000/users/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        toast.success('Profile updated successfully!');
        onSuccess?.();
        window.location.reload();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              {...register('fullName')}
              className={`w-full ${errors.fullName ? 'border-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              {...register('email')}
              type="email"
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <Input
              {...register('mobileNumber')}
              type="tel"
              className={`w-full ${errors.mobileNumber ? 'border-red-500' : ''}`}
              placeholder="Enter your mobile number"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality
            </label>
            <Input
              {...register('nationality')}
              className="w-full"
              placeholder="Enter nationality"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Type
            </label>
            <Input
              {...register('idType')}
              className="w-full"
              placeholder="Enter ID type"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Number
            </label>
            <Input
              {...register('idNumber')}
              className="w-full"
              placeholder="Enter ID number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <Input
              {...register('country')}
              className="w-full"
              placeholder="Enter country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <Input
              {...register('city')}
              className="w-full"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address 1
            </label>
            <Input
              {...register('address1')}
              className="w-full"
              placeholder="Enter address line 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address 2
            </label>
            <Input
              {...register('address2')}
              className="w-full"
              placeholder="Enter address line 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Line Number
            </label>
            <Input
              {...register('landLineNumber')}
              className="w-full"
              placeholder="Enter land line number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              P.O Box
            </label>
            <Input
              {...register('poBox')}
              className="w-full"
              placeholder="Enter P.O Box"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white"
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => window.location.reload()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}