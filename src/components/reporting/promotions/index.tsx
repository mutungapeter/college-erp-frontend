'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import Pagination from '@/components/common/Pagination';
import FilterSelect from '@/components/common/Select';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';
import DataTable, { Column } from '@/components/common/Table/DataTable';
import { ProgrammeCohortType } from '@/definitions/curiculum';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import { useFilters } from '@/hooks/useFilters';
import { PAGE_SIZE } from '@/lib/constants';
import { RolePermission } from '@/store/definitions';
import { useAppSelector } from '@/store/hooks';
import { useGetCohortsQuery } from '@/store/services/curriculum/cohortsService';
import {
  useGetPromotionsQuery
} from '@/store/services/reporting/reportingService';
import { RootState } from '@/store/store';
import { YearMonthCustomDate } from '@/utils/date';
import { GoSearch } from 'react-icons/go';
import { PromotionLogType } from '../types';
import BulkPromotion from './bulkPromotion';
import SingleStudentsPromotion from './singlePromotion';
const Promotions = () => {
  const searchParams = useSearchParams();
  const router = useRouter();



  const { user } = useAppSelector((state: RootState) => state.auth);

  const permissions: RolePermission[] = useMemo(() => {
    return user?.role?.permissions ?? [];
  }, [user?.role?.permissions]);

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        adm_no: searchParams.get('adm_no') || '',
        study_year: searchParams.get('study_year') || '',

        status: searchParams.get('status') || '',
      },
      initialPage: parseInt(searchParams.get('page') || '1', 10),
      router,
      debounceTime: 100,
      debouncedFields: ['adm_no'],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters],
  );
  const promotionsPermissions = useMemo(() => {
    return permissions.find(
      (permission) => permission.module.code === 'promotion',
    );
  }, [permissions]);

  // Permission checks
  const canCreate = promotionsPermissions?.can_create ?? false;
  // const canEdit = promotionsPermissions?.can_edit ?? false;
  // const canDelete = promotionsPermissions?.can_delete ?? false;
  //   const hasActions = canEdit || canDelete;
  const {
    isLoading: loadingData,
    data: promotionsData,
    refetch,
    error,
  } = useGetPromotionsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  // console.log("promotionsData", promotionsData);
  const { data: cohortsData } = useGetCohortsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  // console.log("cohortsData",cohortsData)
  const classesOptions =
    cohortsData?.map((item: ProgrammeCohortType) => ({
      value: item.id,
      label: `${item.name} ${item.current_year.name}`,
    })) || [];

  const handleStudy_yearChange = (selectedOption: LabelOptionsType | null) => {
    handleFilterChange({
      study_year: selectedOption ? selectedOption.value : '',
    });
  };
 

  const columns: Column<PromotionLogType>[] = [
    {
      header: 'Student',
      accessor: 'student',
      cell: (item: PromotionLogType) => (
        <span className="text-md">
          {item.student.user.first_name} {item.student.user.last_name}
        </span>
      ),
    },
    {
      header: 'Promoted On',
      accessor: 'promoted_on',
      cell: (item: PromotionLogType) => (
        <span className="text-md whitespace-normal break-words">
          {YearMonthCustomDate(item.promoted_on)}
        </span>
      ),
    },

    {
      header: 'Study Promoted To',
      accessor: 'study_year',
      cell: (item: PromotionLogType) => (
        <span>
          <span className="text-md whitespace-normal break-words">
            {' '}
            {item.study_year.name}
          </span>
        </span>
      ),
    },
    {
      header: 'Done By',
      accessor: 'done_by',
      cell: (item: PromotionLogType) => (
        <span>
          <span className="text-md whitespace-normal break-words">
            {' '}
            {item.done_by.first_name} {item.done_by.last_name}
          </span>
        </span>
      ),
    },

    // ...(hasActions
    //       ? ([
    //           {
    //             header: "Actions",
    //             accessor: "id",
    //             cell: (item: PromotionLogType) => (
    //               <div className="flex items-center space-x-2">

    //                 {canDelete && (
    //                   <div
    //                     onClick={() => openDeleteModal(item.id)}
    //                     className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
    //                     title="Delete"
    //                   >
    //                     <FiTrash2 className="text-sm" />
    //                   </div>
    //                 )}
    //               </div>
    //             ),
    //           },
    //         ] as Column<PromotionLogType>[])
    //       : []),
  ];

  // console.log("students", promotionsData);
  return (
    <>
      <div className="bg-white w-full min-h-30  p-1 shadow-md rounded-lg font-nunito">
        <div className="p-3 flex flex-col md:flex-row md:items-center lg:items-center md:gap-4 lg:gap-6 gap-4 lg:justify-between md:justify-between">
          <div className="flex flex-col gap-3 flex-1 md:max-w-2xl lg:max-w-3xl">
            <h2 className="font-semibold text-black text-xl">
              Cohorts Promotions Logs
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manage student promotions efficiently. Promote individual students
              or entire cohorts while maintaining detailed records and audit
              trails for complete transparency.
            </p>
          </div>
          <div className="flex md:flex-row flex-col items-center gap-3 flex-shrink-0">
            <div>
              {canCreate && <SingleStudentsPromotion refetchData={refetch} />}
            </div>
            <div>{canCreate && <BulkPromotion refetchData={refetch} />}</div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-end lg:items-center lg:justify-end">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="adm_no"
              value={filters.adm_no}
              onChange={handleFilterChange}
              placeholder="Search by admission no"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>

          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={classesOptions}
              value={
                classesOptions.find(
                  (option: LabelOptionsType) =>
                    option.value === filters.study_year,
                ) || { value: '', label: 'Study Year' }
              }
              onChange={handleStudy_yearChange}
              placeholder=""
              defaultLabel="Study Year"
            />
          </div>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {'status' in error &&
            typeof error.data === 'object' &&
            error.data !== null &&
            'error' in error.data
              ? (error.data as { error: string }).error
              : 'An error occurred while fetching classes.'}
          </div>
        ) : promotionsData && promotionsData.results.length > 0 ? (
          <DataTable
            data={promotionsData?.results}
            columns={columns}
            isLoading={loadingData}
            error={error}
            // columnBgColor="bg-gray-100 "
            stripedRows={true}
            stripeColor="bg-slate-100"
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {promotionsData && promotionsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={promotionsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}

        
      </div>
    </>
  );
};
export default Promotions;
