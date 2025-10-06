import { apiSlice } from '../../api/apiSlice';

interface FeeStructureInterface {
  semester?: string;
  page?: number;
  page_size?: number;
}
interface FeeStructureItemsInterface {
  fee_structure_id?: string;
  page?: number;
  page_size?: number;
}

export const finaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    payLibraryFine: builder.mutation({
      query: (data) => ({
        url: `finance/library/process-payment/`,
        method: 'POST',
        body: data,
      }),
    }),

    createFeeStructure: builder.mutation({
      query: (data) => ({
        url: `finance/fee-structures/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    UpdateFeeStructure: builder.mutation({
      query: ({ id, data }) => ({
        url: `finance/fee-structures/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteFeeStructure: builder.mutation({
      query: (id) => ({
        url: `finance/fee-structures/${id}/delete/`,
        method: 'DELETE',
      }),
    }),

    getFeeStructuresList: builder.query({
      query: ({ semester, page, page_size }: FeeStructureInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (semester) queryParams.semester = semester;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        // console.log("queryParams====", queryParams);
        // console.log("query made");
        return {
          url: `finance/fee-structures/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getFeeStructureItems: builder.query({
      query: ({
        fee_structure_id,
        page,
        page_size,
      }: FeeStructureItemsInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        // console.log("queryParams====", queryParams);
        // console.log("query made");
        return {
          url: `finance/fee-structures/${fee_structure_id}/items/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    createFeeStructureItem: builder.mutation({
      query: (data) => ({
        url: `finance/fee-structure-items/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateFeeStructureItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `finance/fee-structure-items/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteFeeStructureItem: builder.mutation({
      query: (id) => ({
        url: `finance/fee-structure-items/${id}/delete/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  usePayLibraryFineMutation,
  useCreateFeeStructureItemMutation,
  useCreateFeeStructureMutation,
  useGetFeeStructuresListQuery,
  useGetFeeStructureItemsQuery,
  useUpdateFeeStructureMutation,
  useDeleteFeeStructureMutation,
  useUpdateFeeStructureItemMutation,
  useDeleteFeeStructureItemMutation,
} = finaceApi;
