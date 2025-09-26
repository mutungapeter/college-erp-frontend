"use client";

import { IntakeType } from "@/definitions/admissions";
import { useFilters } from "@/hooks/useFilters";
import {
  useGetEnrollmentsMetricsQuery,
  useGetIntakesQuery,
} from "@/store/services/admissions/admissionsService";
import { YearMonthCustomDate } from "@/utils/date";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { BsChevronDown } from "react-icons/bs";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface EnrollmentData {
  intake_id: number;
  intake_name: string;
  intake_start_date: string;
  total: number;
}

export default function EnrollmentsBarChart() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { filters, handleFilterChange } = useFilters({
    initialFilters: {
      intake: searchParams.get("intake") || "",
    },
    router,
  });
  const { data, isLoading } = useGetEnrollmentsMetricsQuery(filters, {
    refetchOnMountOrArgChange: true,
  });
  const { data: intakesData } = useGetIntakesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  console.log("data", data);

  const labels = data?.map((item: EnrollmentData) => item.intake_name);
  const seriesData = data?.map((item: EnrollmentData) => item.total);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    plotOptions: {
       bar: {
    columnWidth: "20%",
    distributed: true, 
    borderRadius: 4,
    borderRadiusApplication: "end",
  },
   
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: labels,
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
        },
      },
      title: {
        text: "Intake",
      },
    },
    yaxis: {
      title: {
        text: "Enrollments",
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} students`,
      },
    },
    colors: ["#3b82f6"],
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Enrollments Across Intakes
      </h3>
      <div className="mb-4 flex justify-end relative">
        <select
          name="intake"
          value={filters.intake}
          onChange={handleFilterChange}
          className="appearance-none py-2 pl-3 pr-10 rounded-md border w-full md:w-auto 
          focus:outline-none focus:border-primary"
        >
          <option value="">Filter by intake</option>
          {intakesData?.map((item: IntakeType) => (
            <option key={item.id} value={item.id}>
              {item.name} - {YearMonthCustomDate(item.start_date)}
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
          No enrollment data available.
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={[{ name: "Enrollments", data: seriesData }]}
          type="bar"
          height={300}
          width={"100%"}
        />
      )}
    </div>
  );
}
