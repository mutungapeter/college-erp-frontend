import { apiSlice } from '../../api/apiSlice';

interface StaffInterface {
  page?: number;
  page_size?: number;

  department?: string;
  status?: string;
  search?: string;
}
interface PayrollInterface {
  page?: number;
  page_size?: number;

  department?: string;
  status?: string;
  search?: string;
}
interface PaySlipInterface {
  page?: number;
  page_size?: number;
  period_start?: string;
  period_end?: string;
  department?: string;
  status?: string;
  search?: string;
}
export const staffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffList: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
      }: StaffInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;

        return {
          url: `staff/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getActiveStaffList: builder.query({
      query: () => {
        return {
          url: `staff/active-staff/`,
          method: 'GET',
        };
      },
    }),

    createStaff: builder.mutation({
      query: (data) => ({
        url: `staff/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    generatePaySlips: builder.mutation({
      query: (data) => ({
        url: `payroll/process-payroll/`,
        method: 'POST',
        body: data,
      }),
    }),
    AddStaffToPayroll: builder.mutation({
      query: (data) => ({
        url: `staff/payroll/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    UpdateStaffToPayroll: builder.mutation({
      query: ({ id, data }) => ({
        url: `staff/payroll/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    toggleStaffStatus: builder.mutation({
      query: (id) => ({
        url: `staff/status/${id}/toggle-status/`,
        method: 'POST',
      }),
    }),

    updateStaff: builder.mutation({
      query: ({ id, data }) => ({
        url: `staff/update/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    updateStaffDocument: builder.mutation({
      query: ({ id, data }) => ({
        url: `staff/documents/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    uploadStaffDocument: builder.mutation({
      query: (data) => ({
        url: `staff/documents/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    createPosition: builder.mutation({
      query: (data) => ({
        url: `staff/positions/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePosition: builder.mutation({
      query: ({ id, data }) => ({
        url: `staff/positions/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deletePosition: builder.mutation({
      query: (id) => ({
        url: `staff/positions/${id}/`,
        method: 'DELETE',
      }),
    }),
    completeOnboarding: builder.mutation({
      query: ({ id, data }) => ({
        url: `staff/onboarding-progress/${id}/complete/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteStaffDocument: builder.mutation({
      query: (id) => ({
        url: `admissions/documents/${id}/`,
        method: 'DELETE',
      }),
    }),
    getOnboardingProgress: builder.query({
      query: (id) => ({
        url: `staff/onboarding-progress/${id}/`,
        method: 'GET',
      }),
    }),
    getStaffDetails: builder.query({
      query: (id) => ({
        url: `staff/details/${id}/`,
        method: 'GET',
      }),
    }),
    getPositions: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
      }: StaffInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;

        return {
          url: `staff/positions/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getPayrolls: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
      }: PayrollInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;

        return {
          url: `staff/payroll/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getPaySlips: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
        period_start,
        period_end,
      }: PaySlipInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        if (period_start) queryParams.period_start = period_start;
        if (period_end) queryParams.period_end = period_end;

        return {
          url: `staff/payslips/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getOvertimePayments: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
      }: PayrollInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;

        return {
          url: `staff/overtime-payments/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    createOvertimePayment: builder.mutation({
      query: (data) => ({
        url: `staff/overtime-payments/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateOvertimePayment: builder.mutation({
      query: ({ id, data }) => ({
        url: `staff/overtime-payments/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    approveOvertimePayment: builder.mutation({
      query: ({ id, data }) => ({
        url: `staff/overtime-payments/${id}/approve/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    payWages: builder.mutation({
      query: (data) => ({
        url: `payroll/pay-wages/`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetStaffListQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useUpdateStaffDocumentMutation,
  useUploadStaffDocumentMutation,
  useDeleteStaffDocumentMutation,
  useGetOnboardingProgressQuery,
  useAddStaffToPayrollMutation,
  useCompleteOnboardingMutation,
  useGetPayrollsQuery,
  useGetPaySlipsQuery,
  useGeneratePaySlipsMutation,
  useGetPositionsQuery,
  useGetStaffDetailsQuery,
  useToggleStaffStatusMutation,
  useUpdateStaffToPayrollMutation,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useGetActiveStaffListQuery,
  useGetOvertimePaymentsQuery,
  useCreateOvertimePaymentMutation,
  useUpdateOvertimePaymentMutation,
  useApproveOvertimePaymentMutation,
  usePayWagesMutation,

  useDeletePositionMutation,
} = staffApi;
