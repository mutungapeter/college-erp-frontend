import { apiSlice } from '../../api/apiSlice';

interface GetProgrammesType {
  page?: number;
  page_size?: number;
  programme_name?: string;
  department?: string;
}
export const programmeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProgrammes: builder.query({
      query: ({
        page,
        page_size,
        department,
        programme_name,
      }: GetProgrammesType = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (department) queryParams.department = department;
        if (programme_name) queryParams.programme_name = programme_name;
        return {
          url: `schools/programme/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    createProgramme: builder.mutation({
      query: (data) => ({
        url: `schools/programme/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateProgramme: builder.mutation({
      query: ({ id, data }) => ({
        url: `schools/programme/update-delete/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    getProgramme: builder.query({
      query: (id) => ({
        url: `schools/programme/${id}/`,
        method: 'GET',
      }),
    }),

    deleteProgramme: builder.mutation({
      query: (id) => ({
        url: `schools/programme/update-delete/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetProgrammesQuery,
  useCreateProgrammeMutation,
  useUpdateProgrammeMutation,
  useDeleteProgrammeMutation,
  useGetProgrammeQuery,
} = programmeApi;
