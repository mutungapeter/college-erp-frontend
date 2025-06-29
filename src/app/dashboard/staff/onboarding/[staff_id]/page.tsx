import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'
import StaffOnBoarding from '@/components/staff/onboarding/OnBoardStaff'
import { Suspense } from "react"
const OnBoardingPage=async({ params}:{params: Promise<{staff_id: string}>} )=>{
    const id = (await params).staff_id
        
    return (
   
            <Suspense fallback={<PageLoadingSpinner />}>
        <StaffOnBoarding staff_id={id} />
            </Suspense>
        
    )
}
export default OnBoardingPage;