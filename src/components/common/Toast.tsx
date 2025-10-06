'use client';

import { ToastContainer, ToastPosition, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastClassNameContext =
  | {
      type?: TypeOptions;
      defaultClassName?: string;
      position?: ToastPosition;
      rtl?: boolean;
    }
  | undefined;

export function ClientToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      pauseOnFocusLoss
      theme="colored"
      toastClassName={(context: ToastClassNameContext) => {
        const type = context?.type ?? 'default';
        const base =
          'relative flex flex-row items-center gap-2 w-full p-3 rounded-lg overflow-hidden cursor-pointer text-sm font-medium';
        const typeClasses: Record<TypeOptions, string> = {
          success: 'bg-green-100 text-green-600',
          error: 'bg-red-100 text-red-600',
          info: 'bg-blue-100 text-blue-600',
          warning: 'bg-yellow-100 text-yellow-600',
          default: 'bg-gray-100 text-gray-700',
        };
        return `${base} ${typeClasses[type]}`;
      }}
    />
  );
}
