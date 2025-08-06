"use client";

import Pagination from "@/components/common/Pagination";
import DataTable, { Column } from "@/components/common/Table/DataTable";
import ContentSpinner from "@/components/common/spinners/dataLoadingSpinner";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZE } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FiChevronRight } from "react-icons/fi";

import NoData from "@/components/common/NoData";


import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { useGetInventoryItemsQuery } from "@/store/services/finance/inventoryService";
import Link from "next/link";
import { SlBasket } from "react-icons/sl";
import FilterSelect from "../common/Select";
import { CategoryTypeOptions, InventoryItem } from "./types";
const InventoryItems = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        category_type: searchParams.get("category_type") || "",
        category: searchParams.get("category") || "",
      },
      initialPage: parseInt(searchParams.get("page") || "1", 10),
      router,
      debounceTime: 100,
      debouncedFields: [""],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );
  console.log("queryParams", queryParams);

  const { data, error, isLoading } = useGetInventoryItemsQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  console.log("data", data);

 
  
    const handleCategoryTypeChange = (selectedOption: LabelOptionsType | null) => {
        handleFilterChange({
          category_type: selectedOption ? selectedOption.value : "",
        });
      };
  const columns: Column<InventoryItem>[] = [
    {
      header: "Item Name",
      accessor: "name",
      cell: (item: InventoryItem) => (
        <span className="text-sm whitespace-normal break-words">
          {item.name}
        </span>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      cell: (item: InventoryItem) => (
        <span>{item.category.name}</span>
      ),
    },
    {
      header: "Quantity",
      accessor: "quantity_in_stock",
      cell: (item: InventoryItem) => (
        <span>{item.quantity_in_stock}</span>
      ),
    },
    {
      header: "Unit of Measure",
      accessor: "unit",
      cell: (item: InventoryItem) => (
        <span>{item.unit.name}</span>
      ),
    },
    {
      header: "Unit Valuation",
      accessor: "unit_valuation",
      cell: (item: InventoryItem) => (
        <span>{item?.unit_valuation}</span>
      ),
    },
    {
      header: "Total Valuation",
      accessor: "total_valuation",
      cell: (item: InventoryItem) => (
        <span>{item?.total_valuation}</span>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      cell: (item: InventoryItem) => (
        <span>{item.category.name}</span>
      ),
    },
    {
      header: "Category Type",
      accessor: "category",
      cell: (item: InventoryItem) => (
        <span>{item.category.category_type_label}</span>
      ),
    },

   

    // {
    //   header: "Actions",
    //   accessor: "id",
    //   cell: (item: InventoryItem) => (
    //     <div className="flex items-center space-x-2">
    //       {item.status === "pending" && (
    //         <ReceiveOrder data={item} refetchData={refetch} />
    //       )}
    //     </div>
    //   ),
    // },
  ];
  return (
    <div className=" w-full ">
      {/* Header */}
      <div className="mb-8 md:p-4 flex md:flex-row flex-col gap-4 md:gap-0 md:justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory/Store</h1>
        </div>
        <div className="">
          <Link
            href="/dashboard/procurement/orders/new-order"
            className="bg-green-600 text-white flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
          >
            <SlBasket className="text-sm text-white" />
            <span>Make New Order</span>
          </Link>
        </div>
      </div>
<div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="flex md:flex-row flex-col md:gap-0 gap-3 md:space-x-2">
          <Link 
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
          href="/dashboard/inventory/categories">

          <span>Categories</span>
          <FiChevronRight className="ml-2 text-gray-500" />
    
      </Link>

      <Link href="/dashboard/inventory/units-of-measure"
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
      >
  
          <span>Units of Measure</span>
          <FiChevronRight className="ml-2 text-gray-500" />

      </Link>
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={CategoryTypeOptions}
              value={
                CategoryTypeOptions.find(
                  (option) => option.value === filters.category_type
                ) || { value: "", label: "Filter by Category Type" }
              }
              onChange={handleCategoryTypeChange}
              placeholder="Filter by category type"
              defaultLabel="All"
            />
          </div>
        </div>
       {/* <div className="flex items-center md:justify-end lg:justify-end px-5">
        <div className="  w-full md:w-auto md:min-w-[40%]  ">
          <FilterSelect
            options={catOptions}
            value={
              catOptions.find(
                (option: LabelOptionsType) => option.value === filters.category
              ) || { value: "", label: "All Categories" }
            }
            onChange={handleCatChange}
            placeholder=""
            defaultLabel="All Categories"
          />
        </div>
      </div> */}
      <div className="w-full  p-1  font-nunito">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading data . Please try again later.
          </div>
        ) : data && data.results.length > 0 ? (
          <DataTable
            data={data?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
            columnBgColor="bg-gray-100 "
            stripedRows={true}
            stripeColor="bg-slate-100"
          />
        ) : (
          <NoData />
        )}

        {data && data.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={data.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      {/* <ActionModal
        isOpen={isModalOpen}
        onClose={closeActionModal}
        onDelete={handleReopenTender}
        isDeleting={isUpdating}
        confirmationMessage="Are you sure you want to Reopen this Tender?"
        deleteMessage="The Tender  will be revoked from the current vendor and reopened for new applications."
        title="Receive Goods"
        actionText="Receive"
      /> */}
    </div>
  );
};

export default InventoryItems;
