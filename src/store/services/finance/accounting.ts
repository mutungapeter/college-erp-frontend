import { apiSlice } from "../../api/apiSlice";

interface BaseAccountsInterface {
  account_type?: string;
  page?: number;
  page_size?: number;
}


interface TransactionInterface {
  account?: string;
  reference?: string;
  page?: number;
  page_size?: number;
}
interface CashflowReportInterface {
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}
interface TrialBalanceInterface {
  as_of_date?: string;
  
}
interface BalanceSheetReportInterface {
  as_of_date?: string;
  
}
export const accountingApis = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAccountType: builder.mutation({
      query: (data) => ({
        url: `accounts/account-types/create/`,
        method: "POST",
        body: data,
      }),
    }),
    newAccount: builder.mutation({
      query: (data) => ({
        url: `accounts/create/`,
        method: "POST",
        body: data,
      }),
    }),
    
    updateFinAccount: builder.mutation({
      query: ({id, data}) => ({
        url: `accounts/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteFinAccount: builder.mutation({
      query: (id) => ({
        url: `accounts/${id}/`,
        method: "DELETE",
      }),
    }),
    recoverFinAccount: builder.mutation({
      query: (id) => ({
        url: `accounts/${id}/unarchive/`,
        method: "PATCH",
      }),
    }),
    deleteFinAccountType: builder.mutation({
      query: (id) => ({
        url: `accounts/account-types/${id}/`,
        method: "DELETE",
      }),
    }),
    recoverFinAccountType: builder.mutation({
      query: (id) => ({
        url: `accounts/account-types/${id}/unarchive/`,
        method: "PATCH",
      }),
    }),
    updateAccountType: builder.mutation({
      query: ({id, data}) => ({
        url: `accounts/account-types/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    getAccounts: builder.query({
      query: ({ account_type, page, page_size }: BaseAccountsInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (account_type) queryParams.account_type = account_type;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        // console.log("queryParams====", queryParams);
        // console.log("query made");
        return {
          url: `accounts/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getArchivedAccounts: builder.query({
      query: ({ account_type, page, page_size }: BaseAccountsInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (account_type) queryParams.account_type = account_type;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        // console.log("queryParams====", queryParams);
        // console.log("query made");
        return {
          url: `accounts/archived/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getAccountTypes: builder.query({
      query: ({ account_type, page, page_size }: BaseAccountsInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (account_type) queryParams.account_type = account_type;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        // console.log("queryParams====", queryParams);
        // console.log("query made");
        return {
          url: `accounts/account-types/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getArchievedAccountTypes: builder.query({
      query: ({ account_type, page, page_size }: BaseAccountsInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (account_type) queryParams.account_type = account_type;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        // console.log("queryParams====", queryParams);
        // console.log("query made");
        return {
          url: `accounts/account-types/archived/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getTransactions: builder.query({
      query: ({ account, reference, page, page_size }: TransactionInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (reference) queryParams.reference = reference;
        if (account) queryParams.account = account;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        // console.log("queryParams====", queryParams);
        // console.log("query made");
        return {
          url: `accounts/transactions/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getCashflow: builder.query({
      query: ({ start_date,end_date, page, page_size }: CashflowReportInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (start_date) queryParams.start_date = start_date;
        if (end_date) queryParams.end_date = end_date;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        // console.log("queryParams====", queryParams);
        // console.log("query made");
        return {
          url: `accounts/cashflow/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getIncomeStatement: builder.query({
      query: ({ start_date,end_date, page, page_size }: CashflowReportInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (start_date) queryParams.start_date = start_date;
        if (end_date) queryParams.end_date = end_date;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        // console.log("queryParams====", queryParams);
        // console.log("query made");
        return {
          url: `accounts/income-statement/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getBalanceSheet: builder.query({
      query: ({ as_of_date }: BalanceSheetReportInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (as_of_date) queryParams.as_of_date = as_of_date;
        
        return {
          url: `accounts/balance-sheet/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getTrialBalance: builder.query({
      query: ({ as_of_date }: TrialBalanceInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (as_of_date) queryParams.as_of_date = as_of_date;
        
        return {
          url: `accounts/trial-balance/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
 
  }),
});

export const {
 useGetAccountsQuery,
 useNewAccountMutation,
 useUpdateFinAccountMutation,
 useCreateAccountTypeMutation,
 useUpdateAccountTypeMutation,
 useGetAccountTypesQuery,
 useDeleteFinAccountMutation,
 useDeleteFinAccountTypeMutation,
 useRecoverFinAccountMutation,
 useRecoverFinAccountTypeMutation,
 useGetArchivedAccountsQuery,
 useGetArchievedAccountTypesQuery,
 useGetTransactionsQuery,
 useGetCashflowQuery,
 useGetIncomeStatementQuery,
 useGetBalanceSheetQuery,
 useGetTrialBalanceQuery,
} = accountingApis;
