import { apiSlice } from "../../api/apiSlice";

interface GetInventoryInterface {
  category?: string;
  category_type?: string;
  page?: number;
  page_size?: number;
}

interface GetVendors {
  vendor_no?: string;
  page?: number;
  page_size?: number;
}

export const inventoryApis = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ vendor_no, page, page_size }: GetVendors = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (vendor_no) queryParams.vendor_no = vendor_no;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `inventory/categories/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `inventory/categories/create/`,
        method: "POST",
        body: data,
      }),
    }),
    createUnit: builder.mutation({
      query: (data) => ({
        url: `inventory/units-of-measure/create/`,
        method: "POST",
        body: data,
      }),
    }),
    updateUnit: builder.mutation({
      query: ({ id, data }) => ({
        url: `inventory/units-of-measure/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateInventoryCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `inventory/categories/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({
        url: `inventory/units-of-measure/${id}/`,
        method: "DELETE",
      }),
    }),
    deleteCategoryUnit: builder.mutation({
      query: (id) => ({
        url: `inventory/categories/${id}/`,
        method: "DELETE",
      }),
    }),
    getUnits: builder.query({
      query: ({ vendor_no, page, page_size }: GetVendors = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (vendor_no) queryParams.vendor_no = vendor_no;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `inventory/units-of-measure/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getInventoryItems: builder.query({
      query: ({
        category,
        category_type,
        page,
        page_size,
      }: GetInventoryInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (category) queryParams.category = category;
        if (category_type) queryParams.category_type = category_type;
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `inventory/items/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),

    createInventoryItem: builder.mutation({
      query: (data) => ({
        url: `inventory/items/create/`,
        method: "POST",
        body: data,
      }),
    }),
    updateInventoryItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `inventory/items/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteInventoryItem: builder.mutation({
      query: (id) => ({
        url: `inventory/items/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetUnitsQuery,
  useGetInventoryItemsQuery,
  useCreateCategoryMutation,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useDeleteCategoryUnitMutation,
  useUpdateInventoryCategoryMutation,
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
} = inventoryApis;
