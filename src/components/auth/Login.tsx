"use client";

import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
import loginSchema from "@/schemas/auth/login";
import { useLoginMutation } from "@/store/services/auth/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  IoEyeOffOutline,
  IoEyeOutline
} from "react-icons/io5";
import { toast } from "react-toastify";
import { z } from "zod";
import SubmitSpinner from "../common/spinners/submitSpinner";
const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(() => false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await login(data).unwrap();
      console.log("response", response);
      const successMessage = response?.message || "Login successful";
      toast.success(successMessage);
      setIsRedirecting(true);
      router.push("/dashboard/admin");
    } catch (error: unknown) {
      setIsRedirecting(false);
      console.log("error", error);
      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        "detail" in (error as { data: { detail: string } }).data
      ) {
        const errorMessage = (error as { data: { detail: string } }).data
          .detail;
        console.log("Error Message:", errorMessage);
        toast.error(errorMessage);
      } else {
        toast.error("Failed to Login. Please try again.");
      }
    }
  };

  return (
    <>
      {/* {isRedirecting ? (
        <>
          <PageLoadingSpinner />
        </>
      ) : (
        <div className="bg-[#F4F7FA] min-h-screen flex items-center 
        w-full justify-center md:px-0 px-4 py-4 font-nunito">
          <div className="bg-white rounded-sm shadow-lg -md w-full max-w-c-350 
           overflow-hidden   flex flex-col md:flex-row">
            <div className="p-5 w-full">
              <div className="flex items-center md:items-start justify-center mb-4 ">
                <Link href="/" className="cursor-pointer"></Link>
                <div className="flex flex-col text-center">
                  <h2 className="text-xl font-bold tracking-tight text-primary ">
                    College Admin
                  </h2>
                 
                </div>
              </div>

              <div>
                
                <div className="flex items-center py-3">
                  <hr className="flex-grow border-gray-300" />
                  <h3 className="px-4  text-center">Sign in</h3>
                  <hr className="flex-grow border-gray-300" />
                </div>
                
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label
                      htmlFor="username"
                      className="text-base mb-2 block font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute px-3 inset-y-0 left-0 flex items-center text-gray-400">
                        <BiUser size={20} />
                      </span>
                      <input
                        id="username"
                        className="w-full placeholder:capitalize px-10 py-2 border border-gray-300 focus:outline-none focus:border-blue-300 focus:bg-white text-base text-gray-900 rounded-md"
                        type="text"
                        {...register("username")}
                        placeholder="Enter username"
                      />
                    </div>
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.username.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-base mb-2 block font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute px-3 inset-y-0 left-0 flex items-center text-gray-400">
                        <IoLockClosedOutline size={20} />
                      </span>
                      <input
                        className="w-full placeholder:capitalize px-10 text-gray-500 py-2 border border-gray-300 focus:border-blue-300 focus:outline-none focus:bg-white text-base rounded-md"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Enter password"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.password.message)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        onChange={() => setShowPassword(!showPassword)}
                      />
                      <span className="text-gray-700 text-sm md:text-md">
                        Show Password
                      </span>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-primary cursor-pointer text-sm md:text-md"
                    >
                      <span>Forgot password?</span>
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className={`${
                      isLoading ? "bg-primary  border" : "bg-primary"
                    } text-lg font-medium py-2 rounded-lg w-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity mt-2`}
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center space-x-2 ">
                        <SubmitSpinner />
                        
                      </div>
                    ) : (
                      <div className="flex items-center">
                       
                        <span className="text-sm text-white font-medium uppercase">
                          Login
                        </span>
                      </div>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-4 flex  items-center justify-center space-x-3">
                <p className="text-gray-600">Don&apos;t have account?</p>
                <Link
                  href="/register"
                  className="text-blue-600 cursor-pointer font-semibold"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {isRedirecting ? (
        <PageLoadingSpinner />
      ) : (
        <div
          className="min-h-screen bg-gradient-to-br from-primary-50 font-nunito via-white to-secondary-50 
        flex items-center justify-center p-4 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl -translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>
          <div className="relative w-full max-w-c-400">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 relative">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/logo/logo.png"
                      alt="University Logo"
                      width={40}
                      height={40}
                      className="w-15 h-15 object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <h1 className="text-lg md:text-2xl  font-bold leading-tight uppercase">
                      College ERP
                    </h1>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <div className="relative">
                    {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BiUser className="text-xl text-gray-400" />
                    </div> */}
                    <input
                      id="username"
                      type="text"
                      {...register("username")}
                      className="block w-full pl-6 pr-4 py-3 border border-gray-300 rounded-md text-sm
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
                    {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                    </div> */}
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="block w-full pl-6 px-4 py-3 border border-gray-400 rounded-md text-sm placeholder-gray-500 focus:outline-none  
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
                    href="/forgot-password"
                    className="text-primary hover:text-primary-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border 
                  border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-primary
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
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="#"
                    className="text-primary hover:text-primary-700 font-semibold transition-colors"
                  >
                    Contact Administrator
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                © 2024 College Management System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
