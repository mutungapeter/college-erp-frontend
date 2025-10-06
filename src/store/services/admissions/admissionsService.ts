import { apiSlice } from '../../api/apiSlice';

interface GetApplicationsTypes {
  page?: number;
  page_size?: number;
  application_no?: string;
  phone_no?: string;
  intake?: string;
  status?: string;
}
interface GetEnrollmentsType {
  intake?: string;
  start_date?: string;
  end_date?: string;
}
interface GetIntakesType {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  closed?: string;
}
export const admissionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApplicationsList: builder.query({
      query: ({
        page,
        page_size,
        status,
        application_no,
        intake,
        phone_no,
      }: GetApplicationsTypes = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (application_no) queryParams.application_no = application_no;
        if (status) queryParams.status = status;
        if (intake) queryParams.intake = intake;
        if (phone_no) queryParams.phone_no = phone_no;
        console.log('queryParams====', queryParams);

        return {
          url: `admissions/applications/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getApplicationMetrics: builder.query({
      query: ({
        page,
        page_size,
        status,
        application_no,
        intake,
        phone_no,
      }: GetApplicationsTypes = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (application_no) queryParams.application_no = application_no;
        if (status) queryParams.status = status;
        if (intake) queryParams.intake = intake;
        if (phone_no) queryParams.phone_no = phone_no;
        console.log('queryParams====', queryParams);

        return {
          url: `admissions/applications-metrics/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    makeApplication: builder.mutation({
      query: (data) => ({
        url: `admissions/applications/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    createEducationHistory: builder.mutation({
      query: (data) => ({
        url: `admissions/education-history/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateEducationHistory: builder.mutation({
      query: ({ id, data }) => ({
        url: `admissions/education-history/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteEducationHistory: builder.mutation({
      query: (id) => ({
        url: `admissions/education-history/${id}/update/`,
        method: 'DELETE',
      }),
    }),
    getIntakes: builder.query({
      query: ({ page, page_size, closed }: GetIntakesType = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (closed === 'true') queryParams.closed = true;
        if (closed === 'false') queryParams.closed = false;

        console.log('queryParams====', queryParams);

        return {
          url: `admissions/intakes/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    createIntake: builder.mutation({
      query: (data) => ({
        url: `admissions/intakes/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateIntake: builder.mutation({
      query: ({ id, data }) => ({
        url: `admissions/intakes/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    enrollApplication: builder.mutation({
      query: (data) => ({
        url: `admissions/applications/enroll-student/`,
        method: 'POST',
        body: data,
      }),
    }),

    updateApplication: builder.mutation({
      query: ({ id, data }) => ({
        url: `admissions/applications/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    updateApplicationDocument: builder.mutation({
      query: ({ id, data }) => ({
        url: `admissions/documents/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    createApplicationDocument: builder.mutation({
      query: (data) => ({
        url: `admissions/documents/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `admissions/documents/${id}/`,
        method: 'DELETE',
      }),
    }),

    getApplication: builder.query({
      query: (id) => ({
        url: `admissions/applications/details/${id}/`,
        method: 'GET',
      }),
    }),
    getEnrollmentsMetrics: builder.query({
      query: ({ start_date, intake, end_date }: GetEnrollmentsType = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (start_date) queryParams.start_date = start_date;
        if (end_date) queryParams.end_date = end_date;
        if (intake) queryParams.intake = intake;
        console.log('queryParams====', queryParams);

        return {
          url: `admissions/enrollments-metrics/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
  }),
});

export const {
  useGetApplicationQuery,
  useMakeApplicationMutation,
  useGetApplicationsListQuery,
  useUpdateApplicationMutation,
  useGetIntakesQuery,
  useUpdateEducationHistoryMutation,
  useCreateEducationHistoryMutation,
  useCreateApplicationDocumentMutation,
  useUpdateApplicationDocumentMutation,
  useEnrollApplicationMutation,
  useDeleteDocumentMutation,
  useDeleteEducationHistoryMutation,
  useGetEnrollmentsMetricsQuery,
  useCreateIntakeMutation,
  useUpdateIntakeMutation,
  useGetApplicationMetricsQuery,
} = admissionsApi;
