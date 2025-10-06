'use client';

import Pagination from '@/components/common/Pagination';

import { useFilters } from '@/hooks/useFilters';

import DataTable, { Column } from '@/components/common/Table/DataTable';
import ContentSpinner from '@/components/common/spinners/dataLoadingSpinner';

import { AiOutlineCheckCircle } from 'react-icons/ai';
import { FaUserGraduate } from 'react-icons/fa6';
import { HiOutlineDocumentAdd } from 'react-icons/hi';

import FilterSelect from '@/components/common/Select';
import { LabelOptionsType } from '@/definitions/Labels/labelOptionsType';
import { ApplicationType, IntakeType } from '@/definitions/admissions';
import { PAGE_SIZE } from '@/lib/constants';
import {
  useGetApplicationMetricsQuery,
  useGetApplicationsListQuery,
  useGetIntakesQuery,
} from '@/store/services/admissions/admissionsService';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { FiEye } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import { PiStudentLight } from 'react-icons/pi';
import MetricCard from './CardData';
import CreateApplication from './NewApplication';

const GetApplications = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, currentPage, handleFilterChange, handlePageChange } =
    useFilters({
      initialFilters: {
        phone_no: searchParams.get('phone_no') || '',
        intake: searchParams.get('intake') || '',
        status: searchParams.get('status') || '',
      },
      initialPage: parseInt(searchParams.get('page') || '1', 10),
      router,
      debounceTime: 100,
      debouncedFields: ['phone_no'],
    });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters],
  );
  console.log('queryParams', queryParams);

  const {
    data: applicationsData,
    isLoading,
    error,
    refetch,
  } = useGetApplicationsListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const { data: metricsData } =
    useGetApplicationMetricsQuery(queryParams, {
      refetchOnMountOrArgChange: true,
    });

  console.log('applicationsData', applicationsData);

  const { data: intakesData } = useGetIntakesQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  console.log('intakesData', intakesData);
  const intakeOptions =
    intakesData?.map((item: IntakeType) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];

  const handleIntakeChange = (selectedOption: LabelOptionsType | null) => {
    const intakeValue = selectedOption ? selectedOption.value : '';
    handleFilterChange({
      intake: intakeValue,
    });
  };

  const cardData = [
    {
      title: 'Total Applications',
      total: metricsData?.total ?? 0,
      icon: <PiStudentLight className="text-[#771BCC]" size={24} />,
      bgColor: 'bg-[#F3EEF6]',
    },
    {
      title: 'Accepted',
      total: metricsData?.accepted ?? 0,
      icon: <AiOutlineCheckCircle className="text-[#22C55E]" size={24} />,
      bgColor: 'bg-[#DCFCE7]',
    },
    {
      title: 'Enrolled',
      total: metricsData?.enrolled ?? 0,
      icon: <FaUserGraduate className="text-[#0077B6]" size={24} />,
      bgColor: 'bg-[#CDEEFF]',
    },
    {
      title: 'New / Draft Applications',
      total: metricsData?.draft_or_new ?? 0,
      icon: <HiOutlineDocumentAdd className="text-[#F59E0B]" size={24} />,
      bgColor: 'bg-[#FFF8DE]',
    },
    // optional extras:
    // {
    //   title: "Pending",
    //   total: metricsData?.pending ?? 0,
    //   icon: <MdOutlinePendingActions className="text-[#FBBF24]" size={24} />,
    //   bgColor: "bg-yellow-50",
    // },
    // {
    //   title: "Rejected",
    //   total: metricsData?.rejected ?? 0,
    //   icon: <IoCloseCircleOutline className="text-[#EF4444]" size={24} />,
    //   bgColor: "bg-red-50",
    // },
  ];

  const columns: Column<ApplicationType>[] = [
    {
      header: 'Name',
      accessor: 'first_name',
      cell: (item: ApplicationType) => (
        <span>
          {item.first_name} {item.last_name}
        </span>
      ),
    },
    {
      header: 'Application No',
      accessor: 'application_number',
      cell: (item: ApplicationType) => (
        <span className="text-sm font-normal">{item.application_number}</span>
      ),
    },

    {
      header: 'Phone',
      accessor: 'phone_number',
      cell: (item: ApplicationType) => (
        <span>
          <span className="text-sm">{item.phone_number}</span>
        </span>
      ),
    },
    {
      header: 'Programme Choice 1',
      accessor: 'first_choice_programme',
      cell: (item: ApplicationType) => (
        <span>
          <span className="text-sm normal whitespace-normal break-words">
            {item.first_choice_programme.name}
            {item.first_choice_programme.level}
          </span>
        </span>
      ),
    },
    {
      header: 'Intake',
      accessor: 'intake',
      cell: (item: ApplicationType) => (
        <span>
          <span className="text-sm normal">{item.intake?.name}</span>
        </span>
      ),
    },

    {
      header: 'Status',
      accessor: 'status',
      cell: (item: ApplicationType) => (
        <div className="flex items-center justify-center">
          <span
            className={`
    px-2 py-1 rounded-md border font-medium text-xs  ${
      item.status === 'Under Review'
        ? 'bg-blue-100 text-blue-500 border-blue-500'
        : item.status === 'Declined'
          ? 'bg-red-100 text-red-500 border-red-500'
          : item.status === 'Info Requested'
            ? 'bg-amber-100 text-amber-500 border-amber500'
            : item.status === 'Accepted'
              ? 'bg-yellow-100 text-yellow-500 border-yellow-500'
              : item.status === 'Draft'
                ? 'bg-slate-100 text-slate-500 border-slate-500'
                : item.status === 'Enrolled'
                  ? 'bg-green-100 text-green-500 border-green-500 '
                  : item.status === 'Incomplete'
                    ? 'bg-orange-100 text-orange-500 border-orange-500'
                    : 'bg-gray-100 text-gray-800'
    }`}
          >
            {item.status}
          </span>
        </div>
      ),
    },

    {
      header: 'Actions',
      accessor: 'id',
      cell: (prog: ApplicationType) => (
        <div className="flex items-center justify-center space-x-2">
          <Link
            href={`/dashboard/admissions/applications/${prog.id}`}
            className="flex items-center justify-center p-2 rounded-xl bg-indigo-100 text-indigo-600 hover:bg-indigo-500 hover:text-white transition duration-200 shadow-sm hover:shadow-md"
            title="View Event Details"
          >
            <FiEye className="text-sm" />
          </Link>
        </div>
      ),
    },
  ];

  console.log('applicationsData', applicationsData);
  return (
    <>
      <div className="flex items-center justify-between w-full p-2 font-poppins  ">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Applications Management</h2>
          <p>View ,Create manage intake applications</p>
        </div>
        <div>
          <CreateApplication refetchData={refetch} />
        </div>
      </div>
      <div
        className="flex flex-col gap-4 py-3 mb-6 lg:gap-0 md:gap-0 lg:flex-row md:flex-row 
      md:items-center p-2 md:justify-between lg:items-center lg:justify-between"
      >
        <div className="relative w-full md:w-auto md:min-w-[40%]">
          <GoSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 "
          />
          <input
            type="text"
            name="phone_no"
            onChange={handleFilterChange}
            value={filters.phone_no}
            placeholder="Search by applicant phone number"
            aria-label="Search by applicant phone number"
            className="
      w-full
      pl-10 pr-4 py-2
      text-sm text-gray-900
      rounded-lg
      bg-white
      border border-gray-300
      focus:outline-none focus:ring-none focus:border-primary-500
      shadow-sm
      placeholder-gray-400
    "
          />
        </div>

        <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
          <FilterSelect
            options={intakeOptions}
            value={
              intakeOptions.find(
                (option: LabelOptionsType) => option.value === filters.intake,
              ) || { value: '', label: 'All Intakes' }
            }
            onChange={handleIntakeChange}
            placeholder=""
            defaultLabel="All Intakes"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 gap-6">
        {cardData.map((card) => (
          <MetricCard
            key={card.title}
            title={card.title}
            count={card.total}
            iconBgColor={card.bgColor}
            icon={card.icon}
          />
        ))}
      </div>
      <div className="bg-white w-full  p-1 shadow-md rounded-lg font-inter">
        <div className=" p-3  flex flex-col md:flex-row md:items-center lg:items-center md:gap-0 lg:gap-0 gap-4 lg:justify-between md:justify-between">
          <h2 className="font-semibold text-black text-xl">All Applications</h2>
          <div>{/* <CreateApplication refetchData={refetch} /> */}</div>
        </div>

        {/* <div className="flex flex-col gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row  md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
          <div className="relative w-full md:w-auto md:min-w-[40%] flex-grow flex items-center gap-2 text-gray-500 focus-within:text-blue-600 px-2">
            <GoSearch size={20} className="" />
            <input
              type="text"
              name="phone_no"
              onChange={handleFilterChange}
              value={filters.phone_no}
              placeholder="Search by  applicant phone number"
              className="w-full md:w-auto text-gray-900 md:min-w-[40%]  text-sm px-2 py-2 bg-transparent outline-none border-b border-gray-300 focus:border-blue-600"
            />
          </div>
          <div className="flex flex-col gap-3  lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
            <FilterSelect
              options={intakeOptions}
              value={
                intakeOptions.find(
                  (option: LabelOptionsType) => option.value === filters.intake
                ) || { value: "", label: "All Intakes" }
              }
              onChange={handleIntakeChange}
              placeholder=""
              defaultLabel="All Intakes"
            />
          </div>
        </div> */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            Error loading Students . Please try again later.
          </div>
        ) : applicationsData && applicationsData.results.length > 0 ? (
          <DataTable
            data={applicationsData?.results}
            columns={columns}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">No data</div>
        )}

        {applicationsData && applicationsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={applicationsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default GetApplications;
