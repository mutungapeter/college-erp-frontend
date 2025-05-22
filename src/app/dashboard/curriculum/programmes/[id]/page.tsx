import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'
import ProgrammeDetails from '@/components/curriculum/programmes/Details'
import { Suspense } from "react"
const ProgrammeDetailsPage=async({ params}:{params: Promise<{id: string}>} )=>{
    const id = (await params).id
        
    return (
   
            <Suspense fallback={<PageLoadingSpinner />}>
        <ProgrammeDetails programme_id={id} />
            </Suspense>
        
    )
}
export default ProgrammeDetailsPage;