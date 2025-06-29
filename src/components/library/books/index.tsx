"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";

import { BookType } from "@/definitions/library";
import { PAGE_SIZE } from "@/lib/constants";
import { useGetBooksQuery } from "@/store/services/library/libraryService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GoSearch } from "react-icons/go";
import EditBook from "./New/Edit";
import CreateBook from "./New/NewBook";
import IssueBook from "./New/NewBookIssueRecord";


const Books = () => {
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
  
  const { data:booksData, isLoading, error, refetch } = useGetBooksQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
console.log("booksData",booksData)

 
 
  const columns: Column<BookType>[] = [
    {
      header: "Title",
      accessor: "title",
      cell: (item: BookType) => <span className="font-semibold text-sm">{item.title}</span>,
    },
    {
      header: "ISBN",
      accessor: "isbn",
      cell: (item: BookType) => (
        <span className="text-xs font-normal">{item.isbn}</span>
      ),
    },
    
    {
      header: "Author",
      accessor: "author",
      cell: (item: BookType) => (
        <span>
          <span className="text-xs font-nunito ">{item.author}</span>
        </span>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      cell: (item: BookType) => (
        <span>
          <span className="text-sm normal">{item.category}</span>
        </span>
      ),
    },
    {
      header: "Total Copies",
      accessor: "total_copies",
      cell: (item: BookType) => (
        <span>
          <span className="text-xs font-normal">{item.total_copies}</span>
        </span>
      ),
    },
    {
      header: "Copies Available",
      accessor: "copies_available",
      cell: (item: BookType) => (
        <span>
          <span className="text-xs font-normal">{item.copies_available}</span>
        </span>
      ),
    },
    
   
  
   
    {
      header: "Actions",
      accessor: "id",
      cell: (item: BookType) => (
        <div className="flex items-center justify-center space-x-2">
            <EditBook data={item} refetchData={refetch} />
            <IssueBook data={item} refetchData={refetch} />
           {/* <Link
            href={`/dashboard/library/books/${item.id}`}
            className="flex items-center justify-center p-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-500 hover:text-white transition duration-200 shadow-sm hover:shadow-md"
            title="View Event Details"
          >
            <FiEye className="text-sm" />
          </Link> */}
         

       
        </div>
      ),
    },
  ];
 
 
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Books</h2>
          
         <div>
            <CreateBook refetchData={refetch} />
         </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="search"
              onChange={handleFilterChange}
              value={filters.search}
              placeholder="Search by  isbn, title, author"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
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
            Error loading Books . Please try again later.
          </div>
        ) : booksData && booksData.results.length > 0 ? (
          <DataTable
            data={booksData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {booksData && booksData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={booksData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}

     
      </div>
    </>
  );
};

export default Books;
