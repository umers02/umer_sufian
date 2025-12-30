'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { sellCarSchema } from '@/lib/validationSchemas';
import { useCreateCar } from '@/hooks/useCars';
import { useAuthStore } from '@/stores/authStore';

interface SellCarFormData {
  partyType: 'dealer' | 'private';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vin: string;
  year: string;
  make: string;
  model: string;
  mileage: string;
  engineSize: string;
  paint: string;
  gccSpecs: string;
  notes: string;
  accidentHistory: string;
  serviceHistory: string;
  modified: 'stock' | 'modified' | '';
  maxBid: string;
  startDate: string;
  endDate: string;
  photos?: FileList | null;
}

export function SellCarForm() {
  const createCarMutation = useCreateCar();
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SellCarFormData>({
    resolver: yupResolver(sellCarSchema),
    defaultValues: {
      partyType: 'dealer',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      vin: '',
      year: '',
      make: '',
      model: '',
      mileage: '',
      engineSize: '',
      paint: '',
      gccSpecs: '',
      notes: '',
      accidentHistory: '',
      serviceHistory: '',
      modified: '',
      maxBid: '',
      startDate: '',
      endDate: '',
      photos: null,
    },
  });

  const partyType = watch('partyType');
  const modified = watch('modified');
  const startDate = watch('startDate');

  const onSubmit = async (data: SellCarFormData) => {
    try {
      const payload = {
        sellerId: user?._id,
        title: `${data.year} ${data.make} ${data.model}`.trim(),
        description: data.notes || undefined,
        make: data.make,
        model: data.model,
        year: data.year ? Number(data.year) : 2020,
        bodyType: 'sedan' as const,
        category: undefined,
        photos: data.photos?.length
          ? Array.from(data.photos).map((f) => f.name)
          : [],
        startingPrice: data.maxBid
          ? Number(String(data.maxBid).replace(/[^0-9.-]+/g, ''))
          : 1000,
        startTime: data.startDate || new Date().toISOString(),
        endTime: data.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await createCarMutation.mutateAsync({
        data: payload,
        files: data.photos || undefined,
      });
    } catch (error: any) {
      // Error is already handled by the mutation with toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black" noValidate>
      {createCarMutation.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {createCarMutation.error.response?.data?.message || createCarMutation.error.message || 'Submission failed'}
        </div>
      )}

      <section className="bg-[#DBE8FF] border border-slate-200 rounded-lg p-5">
        <div className="mb-3 border-b pb-2">
          <div className="inline-block border-b-[5px] border-[#FFC300] pb-2">
            <h2 className="text-2xl font-bold">Your Info</h2>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xl font-medium mb-2">
            Dealer or Private party?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue('partyType', 'dealer')}
              className={`px-5 py-1.5 rounded-sm border text-sm ${
                partyType === 'dealer'
                  ? 'bg-white border-sky-700 shadow-sm'
                  : 'bg-white border-[#929292]'
              }`}
            >
              Dealer
            </button>
            <button
              type="button"
              onClick={() => setValue('partyType', 'private')}
              className={`px-5 py-1.5 rounded-sm border text-sm ${
                partyType === 'private'
                  ? 'bg-white border-sky-700 shadow-sm'
                  : 'bg-white border-[#929292]'
              }`}
            >
              Private party
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xl font-medium">
              First name*
            </label>
            <Input
              {...register('firstName')}
              className={`mt-1 block w-full rounded-sm border px-3 py-2 text-sm bg-white ${
                errors.firstName ? 'border-red-500' : 'border-[#929292]'
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xl font-medium">
              Last name*
            </label>
            <Input
              {...register('lastName')}
              className={`mt-1 block w-full rounded-sm bg-white border px-3 py-2 text-sm ${
                errors.lastName ? 'border-red-500' : 'border-[#929292]'
              }`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xl font-medium">
              Email*
            </label>
            <Input
              {...register('email')}
              type="email"
              className={`mt-1 block w-full rounded-sm bg-white border px-3 py-2 text-sm ${
                errors.email ? 'border-red-500' : 'border-[#929292]'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xl font-medium">
              Phone number*
            </label>
            <Input
              {...register('phone')}
              className={`mt-1 block w-full rounded-sm bg-white border px-3 py-2 text-sm ${
                errors.phone ? 'border-red-500' : 'border-[#929292]'
              }`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#DBE8FF] border border-slate-200 rounded-lg p-5">
        <div className="mb-3 border-b pb-2">
          <div className="inline-block border-b-[5px] border-[#FFC300] pb-2">
            <h2 className="text-2xl font-bold">Car Details</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xl font-medium">
              VIN*
            </label>
            <Input
              {...register('vin')}
              className={`mt-1 block w-full rounded-sm bg-white border px-3 py-2 text-sm ${
                errors.vin ? 'border-red-500' : 'border-[#929292]'
              }`}
              placeholder="Enter 17-character VIN"
              maxLength={17}
            />
            {errors.vin && (
              <p className="text-xs text-red-600 mt-1">{errors.vin.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Year*
            </label>
            <select
              {...register('year')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.year ? 'border-red-500' : 'border-[#929292]'
              }`}
            >
              <option value="">Select Year</option>
              {Array.from({ length: 30 }).map((_, i) => {
                const y = 2025 - i;
                return (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                );
              })}
            </select>
            {errors.year && (
              <p className="text-xs text-red-600 mt-1">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Make*
            </label>
            <select
              {...register('make')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.make ? 'border-red-500' : 'border-[#929292]'
              }`}
            >
              <option value="">Select Make</option>
              <option value="toyota">Toyota</option>
              <option value="bmw">BMW</option>
              <option value="honda">Honda</option>
              <option value="ford">Ford</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
            {errors.make && (
              <p className="text-xs text-red-600 mt-1">{errors.make.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Model*
            </label>
            <select
              {...register('model')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.model ? 'border-red-500' : 'border-[#929292]'
              }`}
            >
              <option value="">Select Model</option>
              <option value="corolla">Corolla</option>
              <option value="civic">Civic</option>
              <option value="3series">3 Series</option>
              <option value="camry">Camry</option>
              <option value="accord">Accord</option>
            </select>
            {errors.model && (
              <p className="text-xs text-red-600 mt-1">{errors.model.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Mileage (in miles)
            </label>
            <Input
              {...register('mileage')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.mileage ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Enter mileage"
            />
            {errors.mileage && (
              <p className="text-xs text-red-600 mt-1">{errors.mileage.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Engine size
            </label>
            <select
              {...register('engineSize')}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
            >
              <option value="">Select</option>
              <option value="1.6">1.6 L</option>
              <option value="2.0">2.0 L</option>
              <option value="3.0">3.0 L</option>
              <option value="4.0">4.0 L</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Paint
            </label>
            <select
              {...register('paint')}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
            >
              <option value="">Select</option>
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="silver">Silver</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Has GCC Specs
            </label>
            <select
              {...register('gccSpecs')}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">
            Noteworthy options/features
          </label>
          <Textarea
            {...register('notes')}
            rows={5}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
              errors.notes ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Describe any special features, modifications, or noteworthy aspects..."
          />
          {errors.notes && (
            <p className="text-xs text-red-600 mt-1">{errors.notes.message}</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Accident History
            </label>
            <select
              {...register('accidentHistory')}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
            >
              <option value="">Select</option>
              <option value="none">None</option>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Full Service History
            </label>
            <select
              {...register('serviceHistory')}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
            >
              <option value="">Select</option>
              <option value="full">Full</option>
              <option value="partial">Partial</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-end md:gap-4 gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700">
              Has the car been modified?
            </label>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setValue('modified', 'stock')}
                className={`px-3 py-1.5 rounded-md border text-sm ${
                  modified === 'stock' ? 'border-sky-700 shadow-sm' : 'border-slate-300'
                }`}
              >
                Completely stock
              </button>
              <button
                type="button"
                onClick={() => setValue('modified', 'modified')}
                className={`px-3 py-1.5 rounded-md border text-sm ${
                  modified === 'modified' ? 'border-sky-700 shadow-sm' : 'border-slate-300'
                }`}
              >
                Modified
              </button>
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700">
              Starting Price*
            </label>
            <Input
              {...register('maxBid')}
              placeholder="$1000"
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.maxBid ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.maxBid && (
              <p className="text-xs text-red-600 mt-1">{errors.maxBid.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Auction Start Date*
            </label>
            <input
              {...register('startDate')}
              type="datetime-local"
              min={new Date().toISOString().slice(0, 16)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.startDate ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.startDate && (
              <p className="text-xs text-red-600 mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Auction End Date*
            </label>
            <input
              {...register('endDate')}
              type="datetime-local"
              min={startDate || new Date().toISOString().slice(0, 16)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                errors.endDate ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.endDate && (
              <p className="text-xs text-red-600 mt-1">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">
            Upload Photos
          </label>
          <input
            {...register('photos')}
            type="file"
            accept="image/*"
            multiple
            className="mt-2 text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload multiple photos to showcase your car (JPG, PNG, max 5MB each)
          </p>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={isSubmitting || createCarMutation.isPending}
            className={`inline-flex items-center px-4 py-2 rounded-md text-white font-medium ${
              isSubmitting || createCarMutation.isPending
                ? 'bg-slate-400'
                : 'bg-sky-800 hover:bg-sky-700'
            }`}
          >
            {isSubmitting || createCarMutation.isPending ? 'Submitting…' : 'Submit Car for Auction'}
          </Button>
        </div>
      </section>
    </form>
  );
}