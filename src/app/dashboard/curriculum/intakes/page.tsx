import PageLoadingSpinner from '@/components/common/spinners/pageLoadingSpinner'
import Intakes from '@/components/curriculum/Intakes'

import { Suspense } from 'react'

const InatakesPage = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
                  <Intakes />
                  </Suspense>
  )
}

export default InatakesPage
