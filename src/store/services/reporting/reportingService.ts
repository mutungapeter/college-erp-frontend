import { apiSlice } from '../../api/apiSlice';

interface ReportingInterface {
  page?: number;
  page_size?: number;
  department?: string;
  cohort?: string;
  search?: string;
}
export const reportingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReportingList: builder.query({
      query: ({
        page,
        page_size,
        cohort,
        search,
        department,
      }: ReportingInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (cohort) queryParams.cohort = cohort;
        if (department) queryParams.department = department;

        return {
          url: `students/semester-reporting/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getPromotions: builder.query({
      query: ({
        page,
        page_size,
        cohort,
        search,
        department,
      }: ReportingInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (cohort) queryParams.cohort = cohort;
        if (department) queryParams.department = department;

        return {
          url: `students/semester-reporting/promotions/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    singleReporting: builder.mutation({
      query: (data) => ({
        url: `students/semester-reporting/single/`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteReporting: builder.mutation({
      query: (id) => ({
        url: `students/reporting/reporting-records/${id}/`,
        method: 'DELETE',
      }),
    }),
    bulkReporting: builder.mutation({
      query: (data) => ({
        url: `students/semester-reporting/bulk/`,
        method: 'POST',
        body: data,
      }),
    }),

    promoteStudent: builder.mutation({
      query: (data) => ({
        url: `students/semester-reporting/promote-single/`,
        method: 'POST',
        body: data,
      }),
    }),
    deletePromotionLog: builder.mutation({
      query: (id) => ({
        url: `students/promotions/logs/${id}/`,
        method: 'DELETE',
      }),
    }),
    promoteBulk: builder.mutation({
      query: (data) => ({
        url: `students/semester-reporting/promote-bulk/`,
        method: 'POST',
        body: data,
      }),
    }),
    GraduateStudent: builder.mutation({
      query: (data) => ({
        url: `students/semester-reporting/graduate-single/`,
        method: 'POST',
        body: data,
      }),
    }),

    graduateBulk: builder.mutation({
      query: (data) => ({
        url: `students/semester-reporting/graduate-bulk/`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetReportingListQuery,
  useBulkReportingMutation,
  useSingleReportingMutation,
  usePromoteBulkMutation,
  usePromoteStudentMutation,
  useDeletePromotionLogMutation,
  useGraduateBulkMutation,
  useGraduateStudentMutation,
  useGetPromotionsQuery,
} = reportingApi;
