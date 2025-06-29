
"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import { FIneType } from "@/definitions/library";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetBorrowedBooksFinesQuery } from "@/store/services/library/libraryService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GoSearch } from "react-icons/go";
import { formatCurrency } from "@/utils/currency";
import PayLibraryFine from "./Pay";
// import RequestFinePayment from "./RequestFinePaymen";


const LibraryPayments = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get("search") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["search"],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );
console.log("queryParams",queryParams)
  
  const { data:finesData, isLoading, error, refetch } = useGetBorrowedBooksFinesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
console.log("finesData",finesData)

 
 
  const columns: Column<FIneType>[] = [
    {
      header: "Member",
      accessor: "borrow_transaction",
      cell: (item: FIneType) => <span className="font-semibold text-xs">{item.borrow_transaction.member.user.first_name} {item.borrow_transaction.member.user.last_name}</span>,
    },
    {
      header: "Book",
      accessor: "borrow_transaction",
      cell: (item: FIneType) => <span className="font-semibold text-sm">{item.borrow_transaction.book.title}</span>,
    },
   
  
    
   
    {
      header: "Daily Fine",
      accessor: "fine_per_day",
      cell: (item: FIneType) => (
        <span>
          <span className="text-xs font-normal">{formatCurrency(item.fine_per_day)}</span>
        </span>
      ),
    },
    {
      header: "Total Fine",
      accessor: "calculated_fine",
      cell: (item: FIneType) => (
        <span>
          <span className="text-xs font-normal">{formatCurrency(item.calculated_fine)}</span>
        </span>
      ),
    },
    
    {
      header: "Status",
      accessor: "status_text",
      cell: (item: FIneType) => (
        <span className="flex items-center gap-2">
          <span className={`text-xs font-normal px-2 py-1 rounded-md
            ${
        item.status_text === "Paid"
          ? "bg-green-100 text-green-800"
          : item.status_text === "Requested"
          ? "bg-yellow-100 text-yellow-700"
          : item.status_text === "Unpaid"
          ? "bg-red-100 text-red-700"
          : "bg-gray-500 text-white"
          
      }
            `}>{item.status_text}</span>
        </span>
      ),
    },
    
   
  
   
    {
      header: "Actions",
      accessor: "id",
      cell: (item: FIneType) => (
        <div className="">
        
         
        {(item.status_text === "Unpaid" || item.status_text=== "Requested" || item.status_text==="Pending")&&(
            <PayLibraryFine refetchData={refetch} data={item} />
        )}
       
        </div>
      ),
    },
  ];
 
 
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Library Fines </h2>
          
         
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[60%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="search"
              onChange={handleFilterChange}
              value={filters.search}
              placeholder="Search by  member's phone no ,first name, last name , book title or author"
              className="w-full md:w-auto text-gray-900 md:min-w-[60%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
             {/* <FilterSelect
            options={intakeOptions}
            value={intakeOptions.find(
              (option:LabelOptionsType) => option.value === filters.intake  
            ) || { value: "", label: "All Intakes" }}
            onChange={handleIntakeChange}
            placeholder=""
            defaultLabel="All Intakes"
          /> */}
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Borrowing records . Please try again later.
          </div>
        ) : finesData && finesData.results.length > 0 ? (
          <DataTable
            data={finesData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {finesData && finesData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={finesData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}

     
      </div>
    </>
  );
};

export default LibraryPayments;
