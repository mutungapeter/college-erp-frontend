import { useEffect, useState, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UseFiltersProps<T> {
  initialFilters: T;
  initialPage: number;
  router: AppRouterInstance;
  debounceTime?: number;
  debouncedFields?: string[];
}

export function useFilters<T extends Record<string, string>>({
  initialFilters,
  initialPage,
  router,
  debounceTime = 300,
  debouncedFields = []
}: UseFiltersProps<T>) {
  console.log("initialFilters", initialFilters)
  const [filters, setFilters] = useState<T>(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [previousFilters, setPreviousFilters] = useState<T>(initialFilters);
  

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  }, [filters, currentPage, router]);
  
  useEffect(() => {
    const filtersChanged = Object.entries(filters).some(
      ([key, value]) => previousFilters[key] !== value
    );
    
    if (filtersChanged && currentPage !== 1) {
      setCurrentPage(1);
    }
    
    if (filtersChanged) {
      setPreviousFilters({...filters});
    }
  }, [filters, currentPage, previousFilters]);
  
  const handleDebouncedFilter = useDebouncedCallback((name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, debounceTime);
  
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement> | Partial<T>
  ) => {
    if ('target' in e) {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      const { name, value } = target;
      
      if (debouncedFields.includes(name)) {
        handleDebouncedFilter(name, value);
      } else {
        setFilters((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFilters((prev) => ({ ...prev, ...e }));
    }
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return {
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    handleFilterChange,
    handleDebouncedFilter,
    handlePageChange
  };
}