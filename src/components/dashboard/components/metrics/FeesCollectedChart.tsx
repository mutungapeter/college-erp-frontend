'use client';
import { SemesterType } from '@/definitions/curiculum';
import { PaymentMethod } from '@/definitions/dashboard';
import { useFilters } from '@/hooks/useFilters';
import { useGetSemestersQuery } from '@/store/services/curriculum/semestersService';
import { useGetTotalFeesCollectedQuery } from '@/store/services/finance/feesService';
import { formatCurrency } from '@/utils/currency';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { BsChevronDown } from 'react-icons/bs';
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function FeeCollectionChart() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, handleFilterChange } = useFilters({
    initialFilters: {
      semester: searchParams.get('semester') || '',
    },
    router,
  });
  const { data, isLoading } = useGetTotalFeesCollectedQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  console.log('data', data);
  console.log('filters', filters);
  const { data: semestersData } = useGetSemestersQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const totalCollected = data?.total_collected || 0;
  const totalInvoiced = data?.total_invoiced || 0;
  const collectionRate = data?.collection_rate_percentage || 0;
  const byPaymentMethod = data?.by_payment_method || [];

  const labels = byPaymentMethod.map(
    (item: PaymentMethod) => item.payment_method,
  );
  const seriesData = byPaymentMethod.map((item: PaymentMethod) => item.total);

  const options: ApexOptions = {
    colors: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'donut',
      height: 300,
    },
    legend: {
      position: 'bottom',
      fontFamily: 'Outfit',
      fontSize: '14px',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Collected',
              fontSize: '14px',
              fontFamily: 'Outfit, sans-serif',
              formatter: function () {
                return formatCurrency(totalCollected);
              },
            },
          },
        },
      },
    },
    labels,
    tooltip: {
      y: {
        formatter: (val: number) => formatCurrency(val),
      },
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Fee Collection Overview
        </h3>
        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Total Invoiced</p>
            <p className="font-medium">{formatCurrency(totalInvoiced)}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Collected</p>
            <p className="font-medium text-green-600">
              {formatCurrency(totalCollected)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Collection Rate</p>
            <p className="font-medium">{collectionRate}%</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-end relative">
        <select
          name="semester"
          value={filters.semester}
          onChange={handleFilterChange}
          className="appearance-none py-2 pl-3 pr-10 rounded-md border focus:outline-none focus:border-primary"
        >
          <option value="">Current Semester</option>
          {semestersData?.map((semester: SemesterType) => (
            <option key={semester.id} value={semester.id}>
              {semester?.name ?? ""} {semester?.academic_year?.name ?? ""}
            </option>
          ))}
        </select>
        <BsChevronDown
          size={15}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none"
        />
      </div>
      {isLoading ? (
        <div className="text-center p-6">Loading...</div>
      ) : seriesData.length === 0 ? (
        <div className="text-center text-gray-500">
          No Payments data for give semester available
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={seriesData}
          type="donut"
          height={300}
        />
      )}
    </div>
  );
}
