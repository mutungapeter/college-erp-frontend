import { apiSlice } from "../../api/apiSlice";

interface BaseInterfacce {
  page?: number;
  page_size?: number;
  department?: string;
  status?: string;
  search?: string;
  cohort?: string;
}
interface FeesCollectedInterface{
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
          method: "GET",
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
          method: "GET",
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
        console.log("queryParams====",queryParams)
        console.log("query made")
        return {
          url: `fees/total-fees-collected/`,
          method: "GET",
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
        console.log("queryParams====",queryParams)
        console.log("query made")
        return {
          url: `fees/fee-statements/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    
    payFees: builder.mutation({
      query: (data) => ({
        url: `fees/fee-payments/`,
        method: "POST",
        body: data,
      }),
    }),
   
  }),
});

export const {
  useGetFeesInvoicesQuery,
  usePayFeesMutation,
  useGetFeePaymentsQuery,
  useGetTotalFeesCollectedQuery,
  useGetFeeStamentsQuery
} = feesApi;

