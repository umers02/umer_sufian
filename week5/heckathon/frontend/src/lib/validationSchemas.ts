import * as yup from 'yup';

export const loginSchema = yup.object({
  identifier: yup
    .string()
    .required('Email or username is required')
    .min(3, 'Must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\d{10,15}$/, 'Please enter a valid mobile number'),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

export const sellCarSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  vin: yup
    .string()
    .required('VIN is required')
    .length(17, 'VIN must be exactly 17 characters')
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/, 'Please enter a valid VIN'),
  year: yup
    .string()
    .required('Year is required'),
  make: yup
    .string()
    .required('Make is required'),
  model: yup
    .string()
    .required('Model is required'),
  maxBid: yup
    .string()
    .required('Starting price is required')
    .matches(/^\$?\d+(\.\d{2})?$/, 'Please enter a valid price'),
  startDate: yup
    .string()
    .required('Start date is required')
    .test('future-date', 'Start date must be in the future', function(value) {
      if (!value) return false;
      return new Date(value) > new Date();
    }),
  endDate: yup
    .string()
    .required('End date is required')
    .test('after-start', 'End date must be after start date', function(value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return false;
      return new Date(value) > new Date(startDate);
    }),
  mileage: yup
    .string()
    .matches(/^\d*$/, 'Mileage must be a number'),
  notes: yup
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters'),
});

export const bidSchema = yup.object({
  amount: yup
    .number()
    .required('Bid amount is required')
    .positive('Bid amount must be positive')
    .min(1, 'Minimum bid is $1')
    .test('increment', 'Bid must be higher than current highest bid', function(value) {
      // This will be validated on the frontend with current bid data
      return true;
    }),
});

export const contactSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  subject: yup
    .string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters'),
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
});

export const profileUpdateSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  mobileNumber: yup
    .string()
    .required('Mobile number is required')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid mobile number'),
});