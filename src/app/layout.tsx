import type { Metadata } from 'next';
import '../styles/css/fonts.css';
import '../styles/css/nunito.css';
import '../styles/css/satoshi.css';
import '../styles/css/style.css';
import './globals.css';

import { ClientToastContainer } from '@/components/common/Toast';
import 'react-toastify/dist/ReactToastify.css';
import { ReduxProvider } from './provider';

export const metadata: Metadata = {
  title: 'College Portal',
  description: 'College Erp',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="">
        <ReduxProvider>
          {/* <ToastContainer
               position="top-right"
               autoClose={5000}
               hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
               theme="colored" 
             /> */}
          <ClientToastContainer />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
