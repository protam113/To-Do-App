'use client';

import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '../../store';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { loginFormSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { cn } from '@/utils';

export default function LoginForm({
  onReportClick,
}: {
  onReportClick?: () => void;
}) {
  const { login, checkAuth, loading } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    const { username, password } = values;

    if (password.length < 8) {
      setError('password', {
        type: 'manual',
        message: 'Password must be at least 8 characters.',
      });
      return;
    }

    try {
      const result = await login(username, password);

      // // If 2FA is required, the form will show OTP input
      // if (useAuthStore.getState().requiresTwoFactor) {
      //   return;
      // }

      if (result) {
        await checkAuth();

        const authState = useAuthStore.getState();

        if (!authState.isAuthenticated) {
          console.error('  Not authenticated after login and checkAuth');
          setError('root', {
            type: 'manual',
            message: 'Invalid username or password',
          });
          return;
        }

        router.push('/');
      } else {
        console.error('  Login function returned false');
        setError('root', {
          type: 'manual',
          message: 'Invalid username or password',
        });
      }
    } catch (err) {
      console.error('  Login error:', err);
      setError('root', {
        type: 'manual',
        message: 'Login failed. Please try again.',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting && !loading) {
      e.preventDefault();

      handleSubmit(onSubmit)();
    }
  };

  // Normal Login Form
  return (
    <div className="w-full max-w-md space-y-8" onKeyDown={handleKeyDown}>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="text-xl font-bold text-gray-900">ATOM</span>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Đăng nhập</h2>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="username"
          >
            Email
          </label>
          <Input
            id="username"
            type="text"
            placeholder="Nhập email của bạn"
            className={cn(
              'w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg',
              'focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white',
              'placeholder:text-gray-400',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
            disabled={isSubmitting}
            {...register('username')}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu của bạn"
              className={cn(
                'w-full h-12 px-4 pr-12 bg-gray-50 border border-gray-200 rounded-lg',
                'focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white',
                'placeholder:text-gray-400',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
              disabled={isSubmitting}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Error Message */}
        {errors.root && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.root.message}</p>
          </div>
        )}

        {/* Login Button */}
        <Button
          type="button"
          onClick={(e) => {
            handleSubmit(onSubmit)(e);
          }}
          className={cn(
            'w-full h-12 font-medium text-white',
            'bg-teal-700 hover:bg-teal-800',
            'rounded-lg transition-colors',
            isSubmitting && 'opacity-70 cursor-not-allowed'
          )}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang đăng nhập...
            </span>
          ) : (
            'Đăng nhập'
          )}
        </Button>

        {/* Report Issue Link */}
        <p className="text-center text-sm text-gray-500">
          Gặp vấn đề?{' '}
          <button
            type="button"
            onClick={onReportClick}
            className="text-gray-700 hover:text-gray-900 hover:underline font-medium"
          >
            Báo cáo tại đây
          </button>
        </p>
      </div>
    </div>
  );
}
