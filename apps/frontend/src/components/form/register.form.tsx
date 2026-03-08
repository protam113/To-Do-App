'use client';

import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { registerFormSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRegister } from '../../hooks/auth/useRegister';
import { useState, useEffect } from 'react';
import { Heading } from '../design/heading.design';
import { Container } from '../wrappers/container';

export default function RegisterForm() {
  const { mutate: registerAccount, isPending, isSuccess } = useRegister();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      lastName: '',
      firstName: '',
      phone_number: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    if (values.password.length < 8) {
      setError('password', {
        type: 'manual',
        message: 'Password must be at least 8 characters.',
      });
      return;
    }

    registerAccount(values);
  };

  const isLoading = isSubmitting || isPending;
  return (
    <Container className="w-full space-y-8">
      <Heading name="Create User Account" />

      <div className="space-y-4">
        {isSuccess && (
          <div className="bg-green-50 border border-green-200   p-4 text-center">
            <p className="text-green-700 font-medium">
              ✓ User Created Successfully!
            </p>
            <p className="text-sm text-green-600 mt-1">
              The user account has been created and is ready to use.
            </p>
            <p className="text-xs text-green-500 mt-2">
              Redirecting to user list...
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              className={`text-sm text-gray-500 ${
                isLoading ? 'opacity-50' : ''
              }`}
              htmlFor="firstName"
            >
              First Name
            </label>
            <Input
              id="firstName"
              placeholder="First name"
              className={`w-full p-2 bg-white border h-14   ${
                isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
              }`}
              disabled={isLoading}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className={`text-sm text-gray-500 ${
                isLoading ? 'opacity-50' : ''
              }`}
              htmlFor="lastName"
            >
              Last Name
            </label>
            <Input
              id="lastName"
              placeholder="Last name"
              className={`w-full p-2 bg-white border h-14   ${
                isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
              }`}
              disabled={isLoading}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label
            className={`text-sm text-gray-500 ${isLoading ? 'opacity-50' : ''}`}
            htmlFor="username"
          >
            Username
          </label>
          <Input
            id="username"
            placeholder="Input your username"
            className={`w-full bg-white p-2 border h-14   ${
              isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
            }`}
            disabled={isLoading}
            {...register('username')}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className={`text-sm text-gray-500 ${isLoading ? 'opacity-50' : ''}`}
            htmlFor="email"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Input your email"
            className={`w-full bg-white p-2 border h-14   ${
              isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
            }`}
            disabled={isLoading}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className={`text-sm text-gray-500 ${isLoading ? 'opacity-50' : ''}`}
            htmlFor="phone_number"
          >
            Phone Number (Optional)
          </label>
          <Input
            id="phone_number"
            type="tel"
            placeholder="Input your phone number"
            className={`w-full bg-white p-2 border h-14   ${
              isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
            }`}
            disabled={isLoading}
            {...register('phone_number')}
          />
          {errors.phone_number && (
            <p className="text-sm text-red-500">
              {errors.phone_number.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className={`text-sm text-gray-500 ${isLoading ? 'opacity-50' : ''}`}
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Input your password"
              className={`w-full bg-white p-2 pr-12 border   h-14 ${
                isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
              }`}
              disabled={isLoading}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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

        {errors.root && (
          <p className="text-sm text-red-500 text-center">
            {errors.root.message}
          </p>
        )}

        <Button
          type="button"
          onClick={(e) => {
            handleSubmit(onSubmit)(e);
          }}
          className={`w-full font-bold h-[60px]   text-xl bg-main hover:bg-main/70 text-white ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
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
              Creating user...
            </span>
          ) : (
            'Create User'
          )}
        </Button>
      </div>
    </Container>
  );
}
