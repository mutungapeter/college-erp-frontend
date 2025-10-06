import { apiSlice } from '../../api/apiSlice';

interface GetStudyYears {
  page?: number;
  page_size?: number;
  year_name?: string;
  status?: string;
}
export const academicYarService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudyYears: builder.query({
      query: ({ page, page_size, year_name, status }: GetStudyYears = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (year_name) queryParams.year_name = year_name;
        if (status) queryParams.status = status;
        return {
          url: `core/studyyear/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getAcademicYears: builder.query({
      query: ({ page, page_size, year_name, status }: GetStudyYears = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (year_name) queryParams.year_name = year_name;
        if (status) queryParams.status = status;
        return {
          url: `core/academic-years/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    createStudyYear: builder.mutation({
      query: (data) => ({
        url: `core/studyyear/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateStudyYear: builder.mutation({
      query: ({ id, data }) => ({
        url: `core/studyyear/update-delete/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteStudyYear: builder.mutation({
      query: (id) => ({
        url: `core/studyyear/update-delete/${id}/`,
        method: 'DELETE',
      }),
    }),
    createAcademicYear: builder.mutation({
      query: (data) => ({
        url: `core/academic-years/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateAcademicYear: builder.mutation({
      query: ({ id, data }) => ({
        url: `core/academic-years/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteAcademicYear: builder.mutation({
      query: (id) => ({
        url: `core/academic-years/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetStudyYearsQuery,
  useCreateStudyYearMutation,
  useUpdateStudyYearMutation,
  useDeleteStudyYearMutation,
  useGetAcademicYearsQuery,
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useDeleteAcademicYearMutation,
} = academicYarService;
