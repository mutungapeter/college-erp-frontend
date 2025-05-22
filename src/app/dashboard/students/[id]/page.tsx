import StudentDetails from "@/components/students/Details"
import { Suspense } from "react"
import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'
const StudentDetailsPage=async({ params}:{params: Promise<{id: string}>} )=>{
    const id = (await params).id
        
    return (
   
            <Suspense fallback={<PageLoadingSpinner />}>
        <StudentDetails student_id={id} />
            </Suspense>
        
    )
}
export default StudentDetailsPage;