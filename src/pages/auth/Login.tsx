// ============================================================================
// SweetCrumb Bakery - Login Page
// ============================================================================

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button, Input, Alert, Card } from '@/components/ui';
import { FormField, FormInput, FormActions, FormLayout } from '@/components/forms';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context';


// -----------------------------------------------------------------------------
// Validation Schema
// -----------------------------------------------------------------------------

const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// -----------------------------------------------------------------------------
// Login Page
// -----------------------------------------------------------------------------

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirect = searchParams.get('redirect') || '/';
  const isAdmin = searchParams.get('admin') === 'true';

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(
        { username: data.username, password: data.password },
        isAdmin ? 'admin' : 'customer'
      );
      navigate(redirect, { replace: true });
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
  };

  const handleDemoLogin = async (role: 'customer' | 'admin') => {
    setError(null);
    try {
      await login(
        { username: role === 'admin' ? 'admin' : 'demo', password: 'demo123' },
        role
      );
      navigate(role === 'admin' ? '/admin/dashboard' : '/', { replace: true });
    } catch (err) {
      setError('Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-warm-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
              </svg>
            </div>
          </Link>
          <h1 className="text-display-md font-display font-medium text-charcoal-900">
            {isAdmin ? 'Admin Login' : 'Welcome Back'}
          </h1>
          <p className="text-body text-text-muted mt-2">
            {isAdmin
              ? 'Sign in to access the admin dashboard'
              : 'Sign in to your SweetCrumb account'}
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 space-y-6">
          {error && (
            <Alert variant="error" dismissible onDismiss={() => setError(null)}>
              <AlertCircle className="w-5 h-5" />
              {error}
            </Alert>
          )}

          <FormLayout onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                name="username"
                control={form.control}
                label={isAdmin ? 'Username' : 'Username or Email'}
              >
                {({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="text"
                    leftIcon={<Mail className="w-5 h-5" />}
                    placeholder={isAdmin ? 'admin' : 'Enter username or email'}
                    error={fieldState.error?.message}
                    autoComplete="username"
                    autoFocus
                  />
                )}
              </FormField>

              <FormField
                name="password"
                control={form.control}
                label="Password"
              >
                {({ field, fieldState }) => (
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
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
                    placeholder="Enter your password"
                    error={fieldState.error?.message}
                    autoComplete="current-password"
                  />
                )}
              </FormField>

              <div className="flex items-center justify-between">
                <FormField
                  name="remember"
                  control={form.control}
                >
                  {({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...field}
                        className="h-4 w-4 rounded border-border-strong text-primary focus:ring-2 focus:ring-focus/20"
                      />
                      <span className="text-body-sm text-text-secondary">Remember me</span>
                    </label>
                  )}
                </FormField>

                <Link
                  to={isAdmin ? '/admin/forgot-password' : '/forgot-password'}
                  className="text-body-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <FormActions
              submitText="Sign In"
              submitting={form.formState.isSubmitting || authLoading}
              variant="primary"
            >
              <div className="w-full text-center">
                <p className="text-caption text-text-muted">
                  By signing in, you agree to our{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </FormActions>
          </FormLayout>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-text-muted">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => handleDemoLogin(isAdmin ? 'admin' : 'customer')}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
              </svg>
              Demo {isAdmin ? 'Admin' : 'Customer'}
            </Button>
            <Button variant="outline">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.703 1.028 1.597 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </Button>
          </div>
        </Card>

        {/* Register Link */}
        <p className="text-center text-body text-text-muted mt-6">
          Don't have an account?{' '}
          <Link to={isAdmin ? '/admin/register' : '/register'} className="font-medium text-primary hover:underline">
            {isAdmin ? 'Request admin access' : 'Create one'}
          </Link>
        </p>

        {/* Demo Credentials Hint */}
        <Alert variant="info" className="mt-6 text-body-sm">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0">ℹ️</span>
            <div>
              <p className="font-medium">Demo Credentials:</p>
              <p className="font-mono text-xs bg-charcoal-100 px-2 py-1 rounded mt-1">
                {isAdmin ? 'Username: admin | Password: admin123' : 'Username: demo | Password: demo123'}
              </p>
            </div>
          </div>
        </Alert>
      </div>
    </div>
  );
}