"use client";
import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { BiUser } from "react-icons/bi";
import { IoLockClosedOutline } from "react-icons/io5";
import { useLoginMutation } from "@/store/services/auth/authService";
import loginSchema from "@/schemas/auth/login";
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
      {isRedirecting ? (
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
                <div className="flex items-center justify-center">
                  <h2 className="text-xl font-medium  mb-2 text-center md:text-left">
                    Welcome Back!
                  </h2>
                </div>
                <div className="flex items-center py-3">
                  <hr className="flex-grow border-gray-300" />
                  <h3 className="px-4  text-center">Sign in</h3>
                  <hr className="flex-grow border-gray-300" />
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-gray-600 text-sm mb-4 text-center md:text-left">
                    Login to your account using your username and password.
                  </p>
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
                        {/* <span className="text-white">Logging in</span> */}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {/* <IoLockClosedOutline
                          size={20}
                          className="text-white mr-2"
                        /> */}
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
      )}
    </>
  );
};

export default Login;
