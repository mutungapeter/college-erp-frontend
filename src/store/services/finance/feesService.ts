import { apiSlice } from '../../api/apiSlice';

interface BaseInterfacce {
  page?: number;
  page_size?: number;
  department?: string;
  status?: string;
  search?: string;
  cohort?: string;
  academic_year?: string;
  semester?: string;
  registration_number?: string;
}
interface FeesCollectedInterface {
  semester?: string;
}

interface FeeStatementInterface {
  student?: string;
  semester?: string;
}
export const feesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeesInvoices: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
        cohort,
      }: BaseInterfacce = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        if (cohort) queryParams.cohort = cohort;

        return {
          url: `fees/invoices/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getFeePayments: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
        cohort,
      }: BaseInterfacce = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        if (cohort) queryParams.cohort = cohort;

        return {
          url: `fees/fee-payments-list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getTotalFeesCollected: builder.query({
      query: ({ semester }: FeesCollectedInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (semester) queryParams.semester = semester;
        console.log('queryParams====', queryParams);
        console.log('query made');
        return {
          url: `fees/total-fees-collected/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getFeeStaments: builder.query({
      query: ({ semester, student }: FeeStatementInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (semester) queryParams.semester = semester;
        if (student) queryParams.student = student;
        console.log('queryParams====', queryParams);
        console.log('query made');
        return {
          url: `fees/all-fee-statements/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getFeeStamentsReports: builder.query({
      query: ({ registration_number, semester,cohort,academic_year }: BaseInterfacce = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (semester) queryParams.semester = semester;
        if (registration_number) queryParams.registration_number = registration_number;
        if (academic_year) queryParams.academic_year = academic_year;
        if (cohort) queryParams.cohort = cohort;
        console.log('queryParams====', queryParams);
        console.log('query made');
        return {
          url: `fees/fee-statements-reports/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    payFees: builder.mutation({
      query: (data) => ({
        url: `fees/fee-payments/`,
        method: 'POST',
        body: data,
      }),
    }),
    getInvoiceTypes: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
        cohort,
      }: BaseInterfacce = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        if (cohort) queryParams.cohort = cohort;

        return {
          url: `fees/invoice-types/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    createInvoiceType: builder.mutation({
      query: (data) => ({
        url: `fees/invoice-types/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateInvoiceType: builder.mutation({
      query: ({ id, data }) => ({
        url: `fees/invoice-types/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteInvoiceType: builder.mutation({
      query: (id) => ({
        url: `fees/invoice-types/${id}/`,
        method: 'DELETE',
      }),
    }),
        singleFeeInvoice: builder.mutation({
      query: (data) => ({
        url: `fees/single-fee-invoice/`,
        method: "POST",
        body: data,
      }),
    }),
    bulkFeeInvoice: builder.mutation({
      query: (data) => ({
        url: `fees/bulk-fee-invoices/`,
        method: "POST",
        body: data,
      }),
    }),
    singleInvoice: builder.mutation({
      query: (data) => ({
        url: `fees/single-invoice/`,
        method: "POST",
        body: data,
      }),
    }),
    bulkInvoice: builder.mutation({
      query: (data) => ({
        url: `fees/bulk-invoice/`,
        method: "POST",
        body: data,
      }),
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `fees/invoices/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetFeesInvoicesQuery,
  usePayFeesMutation,
  useGetFeePaymentsQuery,
  useGetTotalFeesCollectedQuery,
  useGetFeeStamentsQuery,
  useGetInvoiceTypesQuery,
  useCreateInvoiceTypeMutation,
  useUpdateInvoiceTypeMutation,
  useDeleteInvoiceTypeMutation,
  useBulkFeeInvoiceMutation,
  useBulkInvoiceMutation,
  useSingleFeeInvoiceMutation,
  useSingleInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetFeeStamentsReportsQuery
} = feesApi;
