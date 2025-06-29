
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
// import PageLoadingSpinner from "@/components/common/spinners/pageLoadingSpinner";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-toastify";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { BiUser } from "react-icons/bi";
// import { IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import { useLoginMutation } from "@/store/services/auth/authService";
// import loginSchema from "@/schemas/auth/login";
// import SubmitSpinner from "../common/spinners/submitSpinner";
// import { PiGraduationCapLight } from "react-icons/pi";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState<boolean>(() => false);
//   const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
//   const router = useRouter();
//   const [login, { isLoading }] = useLoginMutation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (data: z.infer<typeof loginSchema>) => {
//     try {
//       const response = await login(data).unwrap();
//       console.log("response", response);
//       const successMessage = response?.message || "Login successful";
//       toast.success(successMessage);
//       setIsRedirecting(true);
//       router.push("/dashboard/admin");
//     } catch (error: unknown) {
//       setIsRedirecting(false);
//       console.log("error", error);
//       if (
//         error &&
//         typeof error === "object" &&
//         "data" in error &&
//         "detail" in (error as { data: { detail: string } }).data
//       ) {
//         const errorMessage = (error as { data: { detail: string } }).data.detail;
//         console.log("Error Message:", errorMessage);
//         toast.error(errorMessage);
//       } else {
//         toast.error("Failed to Login. Please try again.");
//       }
//     }
//   };

//   return (
//     <>
//       {isRedirecting ? (
//         <PageLoadingSpinner />
//       ) : (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
//           <div className="w-full max-w-c-400  border bg-white  border-gray-200 shadow-lg px-8 py-6">
//             {/* Header Card */}
//             <div className="  pb-5">
//               <div className="text-center">
//                 <div className="mx-auto p-2 bg-blue-100 rounded-full w-fit flex
//                  items-center justify-center mb-4">
//                   <PiGraduationCapLight className="text-3xl text-blue-600" />
//                 </div>
//                 <h1 className="text-xl font-bold text-gray-900 mb-1">College Admin</h1>
//                 <p className="text-sm text-gray-600">Educational Management System</p>
//               </div>
//             </div>

//             {/* Login Form Card */}
//             <div className="">
//               {/* <div className="mb-2">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-1">Welcome Back</h2>
//                 <p className="text-sm text-gray-600">Please sign in to your account</p>
//               </div> */}

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                 {/* Username Field */}
//                 <div>
//                   <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
//                     Username
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <BiUser className="h-4 w-4 text-gray-400" />
//                     </div>
//                     <input
//                       id="username"
//                       type="text"
//                       {...register("username")}
//                       className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:bg-blue-100 focus:border-transparent transition-colors"
//                       placeholder="Enter your username"
//                     />
//                   </div>
//                   {errors.username && (
//                     <p className="mt-1 text-xs text-red-600">{String(errors.username.message)}</p>
//                   )}
//                 </div>

//                 {/* Password Field */}
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <IoLockClosedOutline className="h-4 w-4 text-gray-400" />
//                     </div>
//                     <input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       {...register("password")}
//                       className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:bg-blue-100 focus:border-transparent transition-colors"
                      
//                       placeholder="Enter your password"
//                     />
//                     <button
//                       type="button"
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <IoEyeOffOutline className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//                       ) : (
//                         <IoEyeOutline className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//                       )}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="mt-1 text-xs text-red-600">{String(errors.password.message)}</p>
//                   )}
//                 </div>

//                 {/* Options */}
//                 <div className="flex items-center justify-between text-sm">
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <span className="ml-2 text-gray-600">Remember me</span>
//                   </label>
//                   <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
//                     Forgot password?
//                   </Link>
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center">
//                       <SubmitSpinner />
//                       <span className="ml-2">Signing in...</span>
//                     </div>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </button>
//               </form>

//               {/* Footer */}
//               <div className="mt-6 pt-4 border-t border-gray-200">
//                 <p className="text-center text-sm text-gray-600">
//                   Don't have an account?{" "}
//                   <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
//                     Contact Administrator
//                   </Link>
//                 </p>
//               </div>
//             </div>

//             {/* Footer Text */}
//             <div className="mt-4 text-center">
//               <p className="text-xs text-gray-500">
//                 © 2024 College Management System. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Login;