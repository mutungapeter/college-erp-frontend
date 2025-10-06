"use client";
import Pagination from "@/components/common/Pagination";
import DataTable, { Column } from "@/components/common/Table/DataTable";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { GoSearch } from "react-icons/go";
import ContentSpinner from "../../../common/spinners/dataLoadingSpinner";

import FilterSelect from "@/components/common/Select";

import { ProgrammeCohortType, SemesterType } from "@/definitions/curiculum";
import { LabelOptionsType } from "@/definitions/Labels/labelOptionsType";
import { useFilters } from "@/hooks/useFilters";
import { PAGE_SIZE } from "@/lib/constants";
import { RolePermission } from "@/store/definitions";
import { useAppSelector } from '@/store/hooks';
import { useGetCohortsQuery } from "@/store/services/curriculum/cohortsService";
import { useGetSemestersQuery } from "@/store/services/curriculum/semestersService";
import { useGetFeeStamentsQuery } from "@/store/services/finance/feesService";
import { RootState } from '@/store/store';
import { formatCurrency } from "@/utils/currency";
import { FeeStatementType } from "../types";
import BulkFeeInvoicing from "./BulkFeeInvoice";
import SingleFeeInvoicing from "./SingleFeeInvoice";
const FeeBalances = () => {
  const searchParams = useSearchParams();
  
  const router = useRouter();
  const { user } = useAppSelector((state: RootState) => state.auth);

  

  const permissions: RolePermission[] = useMemo(() => {
    return user?.role?.permissions ?? [];
  }, [user?.role?.permissions]);


  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        search: searchParams.get("search") || "",
        academic_year: searchParams.get("academic_year") || "",
        semester: searchParams.get("semester") || "",

        status: searchParams.get("status") || "",
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
  const invoicesPermissions = useMemo(() => {
    return permissions.find(
      (permission) => permission.module.code === "fee_balances"
    );
  }, [permissions]);

  // Permission checks
  const canCreate = invoicesPermissions?.can_create ?? false;
  // const canEdit = invoicesPermissions?.can_edit ?? false;
  // const canDelete = invoicesPermissions?.can_delete ?? false;
  // const hasActions = canEdit || canDelete;
  const {
    isLoading: loadingFees,
    data: feesData,
    refetch,
    error,
  } = useGetFeeStamentsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: semestersData } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const cohortsOptions =
    cohortsData?.map((item: ProgrammeCohortType) => ({
      value: item.id,
      label: `${item.name} ${item.current_semester.academic_year.name}`,
    })) || [];

  const semesterOptions =
    semestersData?.map((item: SemesterType) => ({
      value: item.id,
      label: `${item.name} ${item.academic_year.name}`,
    })) || [];

  const handleClassChange = (selectedOption: LabelOptionsType | null) => {
    handleFilterChange({
      academic_year: selectedOption ? selectedOption.value : "",
    });
  };

  const handleTermChange = (selectedOption: LabelOptionsType | null) => {
    handleFilterChange({
      semester: selectedOption ? selectedOption.value : "",
    });
  };
 
  const columns: Column<FeeStatementType>[] = [
    {
      header: "Student",
      accessor: "student",
      cell: (item: FeeStatementType) => (
        <span className="text-xs">
          {item.student.user.first_name} {item.student.user.last_name}
        </span>
      ),
    },
    {
      header: "Class",
      accessor: "student",
      cell: (item: FeeStatementType) => (
        <span className="text-sm">
          {item.student.programme.name} -{" "}
          
        </span>
      ),
    },
    {
      header: "Semester Invoiced",
      accessor: "semester",
      cell: (item: FeeStatementType) => (
        <span className="text-sm">
          {item.semester.name} {item.semester.academic_year.name}
        </span>
      ),
    },

    {
      header: "Balance",
      accessor: "balance",
      cell: (item: FeeStatementType) => (
        <span>
          <span className="text-sm">
            {" "}
            {formatCurrency(item.balance)}
          </span>
        </span>
      ),
    },

    // ...(hasActions
    //   ? ([
    //       {
    //         header: "Actions",
    //         accessor: "id",
    //         cell: (item: FeeStatementType) => (
    //           <div className="flex items-center space-x-2">
    //             {canEdit && (
    //               <Link
    //                 title="View Details"
    //                 className="group relative px-2 py-2 bg-indigo-100 text-indigo-500 rounded-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
    //                 href={`/dashboard/finance/fees/statements`}
    //               >
    //                 <FiEye className="text-sm" />
    //                 <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
    //                   View Details
    //                 </span>
    //               </Link>
    //             )}
    //           </div>
    //         ),
    //       },
    //     ] as Column<FeeStatementType>[])
    //   : []),
  ];

  console.log("feesData", feesData?.results);
  return (
    <div className="space-y-5 bg-white shadow-md  px-3 py-4  ">
      <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
        <h2 className="font-semibold text-black text-xl">Fees Balances</h2>
        {canCreate && (
          <div className="flex items-center space-x-3">
            <div>
              <BulkFeeInvoicing refetchData={refetch} />
            </div>
            <div>
              <SingleFeeInvoicing refetchData={refetch} />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row md:items-center p-2 md:justify-end lg:items-center lg:justify-end">
        <div className="relative w-full md:w-auto md:min-w-[55%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
          <GoSearch size={20} className="" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by adm no, first name "
            className="w-full md:w-auto text-gray-900 md:min-w-[55%] text-sm px-2 py-2 bg-white outline-none border-b border-gray-300 focus:border-blue-600"
          />
        </div>

        <div className="flex flex-col gap-3 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
          <FilterSelect
            options={cohortsOptions}
            value={
              cohortsOptions.find(
                (option: LabelOptionsType) =>
                  option.value === filters.academic_year
              ) || { value: "", label: "Cohort" }
            }
            onChange={handleClassChange}
            placeholder=""
            defaultLabel="Cohort"
          />
          <FilterSelect
            options={semesterOptions}
            value={
              semesterOptions.find(
                (option: LabelOptionsType) => option.value === filters.semester
              ) || {
                value: "",
                label: "Semester",
              }
            }
            onChange={handleTermChange}
            placeholder=""
            defaultLabel="All"
          />
        </div>
      </div>
      {loadingFees ? (
        <div className="flex justify-center py-8">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
          {"status" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "error" in error.data
            ? (error.data as { error: string }).error
            : "An error occurred while fetching classes."}
        </div>
      ) : feesData && feesData.results.length > 0 ? (
        <DataTable
          data={feesData?.results}
          columns={columns}
          isLoading={loadingFees}
          error={error}
          // columnBgColor="bg-gray-100 "
          stripedRows={true}
          stripeColor="bg-slate-100"
        />
      ) : (
        <div className="text-center text-gray-500 py-8">No data</div>
      )}

      {feesData && feesData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={feesData.count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      {/* <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteProgram}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to Delete this Term ?"
        deleteMessage="This action cannot be undone."
        title="Delete"
        actionText="Delete"
      /> */}
    </div>
  );
};
export default FeeBalances;
