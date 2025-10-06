import { apiSlice } from '../../api/apiSlice';

interface BaseAccountsInterface {
  account_type?: string;
  page?: number;
  page_size?: number;
}

interface GetVendors {
  vendor_no?: string;
  page?: number;
  page_size?: number;
}
interface GetOrdersInterface {
  order_no?: string;
  page?: number;
  page_size?: number;
}

export const procurementApis = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: ({ vendor_no, page, page_size }: GetVendors = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (vendor_no) queryParams.vendor_no = vendor_no;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `procurement/vendors/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getTenders: builder.query({
      query: ({
        account_type,
        page,
        page_size,
      }: BaseAccountsInterface = {}) => {
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
          url: `procurement/tenders/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getTenderApplications: builder.query({
      query: ({
        account_type,
        page,
        page_size,
      }: BaseAccountsInterface = {}) => {
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
          url: `procurement/tender-applications/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getAwardedTenders: builder.query({
      query: ({
        account_type,
        page,
        page_size,
      }: BaseAccountsInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (account_type) queryParams.account_type = account_type;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `procurement/awarded-tenders/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getVendorPayments: builder.query({
      query: ({
        account_type,
        page,
        page_size,
      }: BaseAccountsInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (account_type) queryParams.account_type = account_type;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `procurement/vendor-payments/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    createTender: builder.mutation({
      query: (data) => ({
        url: `procurement/tenders/`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadTenderApplicationDocuments: builder.mutation({
      query: (data) => ({
        url: `procurement/tender-application-documents/`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteTenderApplicationDocuments: builder.mutation({
      query: (id) => ({
        url: `procurement/tender-application-documents/${id}/`,
        method: 'DELETE',
      }),
    }),

    reviewApplication: builder.mutation({
      query: ({ id, data }) => ({
        url: `procurement/tender-applications/${id}/review/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    reopenApplication: builder.mutation({
      query: (id) => ({
        url: `procurement/tenders/${id}/reopen/`,
        method: 'PATCH',
        // body: data,
      }),
    }),
    getApplicationDetails: builder.query({
      query: (id) => ({
        url: `procurement/tender-applications/${id}/details/`,
        method: 'GET',
      }),
    }),
    getVendorDetails: builder.query({
      query: (id) => ({
        url: `procurement/vendors/${id}/`,
        method: 'GET',
      }),
    }),
    payVendor: builder.mutation({
      query: (data) => ({
        url: `procurement/vendor-payments/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    createTenderApplication: builder.mutation({
      query: (data) => ({
        url: `procurement/tender-applications/`,
        method: 'POST',
        body: data,
      }),
    }),
    MakeOrder: builder.mutation({
      query: (data) => ({
        url: `procurement/purchase-orders/`,
        method: 'POST',
        body: data,
      }),
    }),
    receiveGoods: builder.mutation({
      query: (data) => ({
        url: `procurement/goods-received/receive/`,
        method: 'POST',
        body: data,
      }),
    }),
    getPurchaseOrders: builder.query({
      query: ({ order_no, page, page_size }: GetOrdersInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (order_no) queryParams.order_no = order_no;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `procurement/purchase-orders/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetTendersQuery,
  useCreateTenderMutation,
  useReviewApplicationMutation,
  useCreateTenderApplicationMutation,
  useGetTenderApplicationsQuery,
  useGetApplicationDetailsQuery,
  useUploadTenderApplicationDocumentsMutation,
  useDeleteTenderApplicationDocumentsMutation,
  useReopenApplicationMutation,
  useGetVendorDetailsQuery,
  useGetAwardedTendersQuery,
  usePayVendorMutation,
  useGetVendorPaymentsQuery,
  useMakeOrderMutation,
  useGetPurchaseOrdersQuery,
  useReceiveGoodsMutation,
} = procurementApis;
