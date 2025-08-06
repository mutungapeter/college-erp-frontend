"use client";
import TrialBalanceReports from '@/components/accounting/reports/TrialBalance';
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner';

import { Suspense } from 'react';

const TrialBalanceReportsPage = () => {
  return (
                <Suspense fallback={<PageLoadingSpinner />}>
            <TrialBalanceReports />
            </Suspense>
  )
}

export default TrialBalanceReportsPage
          

             
            
              
                                    
             
             
            
              
                              