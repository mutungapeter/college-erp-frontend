'use client';

import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';
import loginSchema from '@/schemas/auth/login';
import { useLoginMutation } from '@/store/services/auth/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { z } from 'zod';
import SubmitSpinner from '../common/spinners/submitSpinner';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(() => false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  useEffect(() => {
    if (user && isRedirecting) {
      router.push('/dashboard');
    }
  }, [user, isRedirecting, router]);
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await login(data).unwrap();
      console.log('response', response);
      const successMessage = response?.message || 'Login successful';
      toast.success(successMessage);
      setIsRedirecting(true);
      // router.push("/dashboard");
    } catch (error: unknown) {
      setIsRedirecting(false);
      console.log('error', error);
      if (
        error &&
        typeof error === 'object' &&
        'data' in error &&
        'detail' in (error as { data: { detail: string } }).data
      ) {
        const errorMessage = (error as { data: { detail: string } }).data
          .detail;
        console.log('Error Message:', errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error('Failed to Login. Please try again.');
      }
    }
  };

  return (
    <>
      {isRedirecting ? (
        <PageLoadingSpinner />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden bg-slate-100">
          {/* <div className="absolute top-0 left-0 w-72 h-72 opacity-10 pointer-events-none">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        d="M10,50 C20,0 80,0 90,50 C80,100 20,100 10,50 Z"
        stroke="gray"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  </div>

 
  <div className="absolute bottom-0 right-0 w-72 h-72 opacity-10 pointer-events-none">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path
        d="M10,50 C20,0 80,0 90,50 C80,100 20,100 10,50 Z"
        stroke="gray"
        strokeWidth="2"
        fill="none"
        transform="rotate(180 50 50)"
      />
    </svg>
  </div> */}
          <div className="relative z-20  w-full max-w-c-350">
            <div
              className="bg-white  rounded-2xl shadow-lg  
            border border-white/20 p-6 px-3 relative"
            >
              <div className="text-center mb">
                <div className="flex items-center justify-center  mb-2">
                  <div className="w-[120px] h-[120px] flex-shrink-0 ">
                    <Image
                      src="/logo/university_logo.png"
                      alt="logo"
                      width={100}
                      height={100}
                      className="object-cover h-full w-full"
                    />
                  </div>

                  {/* <div className="text-left">
                    <h1 className="text-lg md:text-2xl  font-bold leading-tight uppercase">
                      Kwamwatu
                    </h1>
                  </div> */}
                </div>
              </div>
              <h1 className="text-lg md:text-xl text-center  font-bold leading-tight uppercase">
                Maweng College
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      {...register('username')}
                      className="block w-full px-4  py-2 border border-gray-300 rounded-md text-sm
                       placeholder-gray-500  focus:border-primary focus:outline-none
                        
                        backdrop-blur-sm transition-all duration-200 "
                      placeholder="Enter your username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-2 text-xs text-red-600 font-medium">
                      {String(errors.username.message)}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className="block w-full px-4 py-2 border border-gray-400 rounded-md text-sm placeholder-gray-500 focus:outline-none  
                        focus:border-primary  backdrop-blur-sm transition-all duration-200 hover:bg-white/80"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <IoEyeOutline className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-600 font-medium">
                      {String(errors.password.message)}
                    </p>
                  )}
                </div>

                {/* Options */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-colors"
                    />
                    <span className="ml-2 text-gray-600 font-medium">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/reset-password-request"
                    className="text-primary hover:text-primary-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border 
                  border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary
                   hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <SubmitSpinner />
                      <span className="ml-2">Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
