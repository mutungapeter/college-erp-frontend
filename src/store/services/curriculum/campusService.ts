import { apiSlice } from '../../api/apiSlice';

interface GetCampuses {
  page?: number;
  page_size?: number;
  campus_name?: string;
  status?: string;
}
export const campusesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampuses: builder.query({
      query: ({ page, page_size, campus_name, status }: GetCampuses = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (campus_name) queryParams.campus_name = campus_name;
        if (status) queryParams.status = status;
        return {
          url: `core/campus/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getRecentActions: builder.query({
      query: () => {
        return {
          url: `core/recent-actions`,
          method: 'GET',
        };
      },
    }),
    getRoles: builder.query({
      query: () => {
        return {
          url: `core/user-roles/`,
          method: 'GET',
        };
      },
    }),

    createCampus: builder.mutation({
      query: (data) => ({
        url: `core/campus/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    upateCampus: builder.mutation({
      query: ({ id, data }) => ({
        url: `core/campus/update-delete/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteCampus: builder.mutation({
      query: (id) => ({
        url: `core/campus/update-delete/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCampusesQuery,
  useCreateCampusMutation,
  useUpateCampusMutation,
  useDeleteCampusMutation,
  useGetRolesQuery,
  useGetRecentActionsQuery,
} = campusesApi;
