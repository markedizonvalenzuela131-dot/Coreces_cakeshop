// ============================================================================
// SweetCrumb Bakery - Register Page
// ============================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button, Input, Alert, Card, Badge } from '@/components/ui';
import { FormField, FormInput, FormActions, FormLayout, FormSection } from '@/components/forms';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context';
import { clsx } from 'clsx';
import { containerPage } from '@/styles';

// -----------------------------------------------------------------------------
// Validation Schema
// -----------------------------------------------------------------------------

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be at most 20 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.boolean().refine(val => val, 'You must accept the terms and conditions'),
  newsletter: z.boolean().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// -----------------------------------------------------------------------------
// Password Strength Meter
// -----------------------------------------------------------------------------

function PasswordStrength({ password }: { password: string }) {
  const [strength, setStrength] = useState(0);

  React.useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setStrength(score);
  }, [password]);

  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-rose-500', 'bg-rose-400', 'bg-warm-500', 'bg-sage-400', 'bg-sage-600'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1 h-1.5" role="progressbar" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={5}>
        {[1, 2, 3, 4, 5].map(level => (
          <div
            key={level}
            className={clsx(
              'flex-1 rounded transition-colors',
              level <= strength ? colors[strength - 1] : 'bg-charcoal-100'
            )}
          />
        ))}
      </div>
      <p className="text-caption text-text-muted">{labels[strength] || ''}</p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Register Page
// -----------------------------------------------------------------------------

export function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      username: '',
      password: '',
      confirmPassword: '',
      terms: false,
      newsletter: false,
    },
  });

  const password = form.watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        contactNumber: data.phone,
        address: data.address,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate('/catalog'), 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <Card className="p-12 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-sage-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-sage-600" />
            </div>
            <h1 className="text-display-md font-display font-medium text-charcoal-900">Account Created!</h1>
            <p className="text-body text-text-muted">Welcome to SweetCrumb, {form.getValues('firstName')}!</p>
            <Alert variant="success">
              Your account has been created successfully. Redirecting to catalog...
            </Alert>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-warm-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
              </svg>
            </div>
          </Link>
          <h1 className="text-display-md font-display font-medium text-charcoal-900">Create Your Account</h1>
          <p className="text-body text-text-muted mt-2">Join SweetCrumb and start ordering delicious cakes</p>
        </div>

        {/* Register Card */}
        <Card className="p-8 space-y-6">
          {error && (
            <Alert variant="error" dismissible onDismiss={() => setError(null)}>
              <AlertCircle className="w-5 h-5" />
              {error}
            </Alert>
          )}

          <FormLayout onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection title="Personal Information">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  name="firstName"
                  control={form.control}
                  label="First Name"
                >
                  {({ field, fieldState }) => <Input {...field} placeholder="Maria" error={fieldState.error?.message} leftIcon={<User className="w-5 h-5" />} />}
                </FormField>
                <FormField
                  name="lastName"
                  control={form.control}
                  label="Last Name"
                >
                  {({ field, fieldState }) => <Input {...field} placeholder="Santos" error={fieldState.error?.message} />}
                </FormField>
              </div>

              <FormField
                name="email"
                control={form.control}
                label="Email Address"
              >
                {({ field, fieldState }) => <Input {...field} type="email" placeholder="you@example.com" error={fieldState.error?.message} leftIcon={<Mail className="w-5 h-5" />} />}
              </FormField>

              <FormField
                name="phone"
                control={form.control}
                label="Phone Number"
              >
                {({ field, fieldState }) => <Input {...field} type="tel" placeholder="+63 9XX XXX XXXX" error={fieldState.error?.message} leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} />}
              </FormField>

              <FormField
                name="address"
                control={form.control}
                label="Address"
              >
                {({ field, fieldState }) => <Input {...field} placeholder="123 Main St, City, Province" error={fieldState.error?.message} leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17 7c.588.677.888 1.485.986 2.36A8 8 0 1122 13c-.5.77-.99 1.583-1.343 2.36a13.977 13.977 0 01-3.657-1.343z" /></svg>} />}
              </FormField>
            </FormSection>

            <FormSection title="Account Credentials">
              <FormField
                name="username"
                control={form.control}
                label="Username"
              >
                {({ field, fieldState }) => <Input {...field} placeholder="mariasweet" error={fieldState.error?.message} leftIcon={<User className="w-5 h-5" />} />}
              </FormField>

              <FormField
                name="password"
                control={form.control}
                label="Password"
              >
                {({ field, fieldState }) => (
                  <div className="space-y-1">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      error={fieldState.error?.message}
                      leftIcon={<Lock className="w-5 h-5" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-text-muted hover:text-text-primary"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                    />
                    <PasswordStrength password={password} />
                  </div>
                )}
              </FormField>

              <FormField
                name="confirmPassword"
                control={form.control}
                label="Confirm Password"
              >
                {({ field, fieldState }) => (
                  <Input
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    error={fieldState.error?.message}
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-text-muted hover:text-text-primary"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                  />
                )}
              </FormField>
            </FormSection>

            <FormSection title="Preferences">
              <FormField
                name="newsletter"
                control={form.control}
              >
                {({ field }) => (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...field}
                      className="h-4 w-4 rounded border-border-strong text-primary focus:ring-2 focus:ring-focus/20"
                    />
                    <span className="text-body-sm text-text-secondary">Subscribe to newsletter for promotions & updates</span>
                  </label>
                )}
              </FormField>
            </FormSection>

            <FormSection title="Terms & Conditions">
              <FormField
                name="terms"
                control={form.control}
              >
                {({ field, fieldState }) => (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...field}
                      className="h-4 w-4 mt-0.5 rounded border-border-strong text-primary focus:ring-2 focus:ring-focus/20"
                    />
                    <div className="text-body-sm text-text-secondary">
                      I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      {fieldState.error && <p className="text-error text-caption mt-1">You must accept the terms and conditions</p>}
                    </div>
                  </label>
                )}
              </FormField>
            </FormSection>

            <FormActions
              submitText="Create Account"
              submitting={form.formState.isSubmitting || authLoading}
              variant="primary"
            >
              <div className="w-full text-center">
                <p className="text-caption text-text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
                </p>
              </div>
            </FormActions>
          </FormLayout>
        </Card>

        {/* Benefits */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white border border-border">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-sage-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-sage-600" />
            </div>
            <p className="text-caption font-medium text-charcoal-900">Free Pickup</p>
            <p className="text-[11px] text-text-muted">No delivery fees</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-border">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-warm-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-warm-600" />
            </div>
            <p className="text-caption font-medium text-charcoal-900">Quality Guaranteed</p>
            <p className="text-[11px] text-text-muted">Fresh daily</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-border">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-rose-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-600" />
            </div>
            <p className="text-caption font-medium text-charcoal-900">Made with Love</p>
            <p className="text-[11px] text-text-muted">Handcrafted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to import icons
import { Truck, Shield, Heart } from 'lucide-react';