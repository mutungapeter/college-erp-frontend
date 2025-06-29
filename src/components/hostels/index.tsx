"use client";

import Pagination from "@/components/common/Pagination";

import { useFilters } from "@/hooks/useFilters";

import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";


import { PAGE_SIZE } from "@/lib/constants";
import { useGetHostelsQuery } from "@/store/services/hostels/hostelService";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GoSearch } from "react-icons/go";
import { HostelsType } from "@/definitions/hostels";
import { formatCurrency } from "@/utils/currency";
import { useGetCampusesQuery } from "@/store/services/curriculum/campusService";
import { CampusType } from "@/definitions/curiculum";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import FilterSelect from "../common/Select";
import AddHostel from "./NewHostel";
import EditHostel from "./UpdateHostel";
import Link from "next/link";

const Hostels = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        name: searchParams.get("name") || "",
        campus: searchParams.get("campus") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: ["name"],
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
  
  const { data:hostelsData, isLoading, error, refetch } = useGetHostelsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
   const { data:campusData } = useGetCampusesQuery({}, {refetchOnMountOrArgChange: true,});
     
       console.log("campusData", campusData)
    const campusOptions = campusData?.map((item:CampusType) => ({
        value: item.id, 
        label: `${item.name}`,
      })) || [];
    
   const handleCampusChange = (selectedOption: LabelOptionsType | null) => {
    const campusValue = selectedOption ? selectedOption.value : "";
        handleFilterChange({
        campus: campusValue,
      });
      };
   
console.log("hostelsData",hostelsData)

 
 
  const columns: Column<HostelsType>[] = [
    {
      header: "Name",
      accessor: "name",
      cell: (item: HostelsType) => <span className="font-semibold text-sm">{item.name}</span>,
    },
    {
      header: "Gender",
      accessor: "gender",
      cell: (item: HostelsType) => (
        <span className="text-sm font-normal">{item.gender}</span>
      ),
    },
    
    {
      header: "Capacity",
      accessor: "capacity",
      cell: (item: HostelsType) => (
        <span>
          <span className="text-sm font-nunito ">{item.capacity}</span>
        </span>
      ),
    },
    {
      header: "Rooms",
      accessor: "rooms",
      cell: (item: HostelsType) => (
        <span>
          <span className="text-sm normal">{item.rooms}</span>
        </span>
      ),
    },
    {
      header: "Room Cost",
      accessor: "room_cost",
      cell: (item: HostelsType) => (
        <span>
          <span className="text-xs font-semibold">{formatCurrency(item.room_cost)}</span>
        </span>
      ),
    },
    {
      header: "Campus",
      accessor: "campus",
      cell: (item: HostelsType) => (
        <span>
          <span className="text-sm font-normal">{item.campus.name}</span>
        </span>
      ),
    },
    
   
  
   
    {
      header: "Actions",
      accessor: "id",
      cell: (item: HostelsType) => (
        <div className="flex items-center justify-center space-x-2">
            
             <EditHostel data={item} refetchData={refetch} />
     
           <Link
            href={`/dashboard/hostels/${item.id}`}
            className="flex items-center justify-center px-2 py-1 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-500 hover:text-white transition duration-200 shadow-sm hover:shadow-md"
            title="View Event Details"
          >
            {/* <FiEye className="text-sm" /> */}
            Rooms
          </Link>
         

       
        </div>
      ),
    },
  ];
 
 
  return (
    <>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-nunito">
        <div className=" p-3  flex flex-col md:flex-row md:items-center  lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">Hostels</h2>
          
         <div>
            <AddHostel refetchData={refetch} />
         </div>
        </div>

        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="name"
              onChange={handleFilterChange}
              value={filters.name}
              placeholder="Search by  hostel name"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
             <FilterSelect
            options={campusOptions}
            value={campusOptions.find(
              (option:LabelOptionsType) => option.value === filters.campus  
            ) || { value: "", label: "Fiter By campus" }}
            onChange={handleCampusChange}
            placeholder=""
            defaultLabel="All Campuses"
          />
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
        ) : hostelsData && hostelsData.results.length > 0 ? (
          <DataTable
            data={hostelsData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {hostelsData && hostelsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={hostelsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}

     
      </div>
    </>
  );
};

export default Hostels;
