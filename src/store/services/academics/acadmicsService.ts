import { apiSlice } from '../../api/apiSlice';

interface MarksInterface {
  page?: number;
  page_size?: number;
  reg_no?: string;
  semester?: string;
  cohort?: string;
  course?: string;
  programme?: string;
}
export const academicsApis = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMarks: builder.query({
      query: ({
        page,
        page_size,
        reg_no,
        course,
        semester,
      }: MarksInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (reg_no) queryParams.reg_no = reg_no;
        if (course) queryParams.course = course;
        if (semester) queryParams.semester = semester;
        console.log('queryParams====', queryParams);

        return {
          url: `academics/marks-records/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getTranscriptMarks: builder.query({
      query: ({
        page,
        page_size,
        reg_no,
        programme,
        semester,
        cohort,
      }: MarksInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (reg_no) queryParams.reg_no = reg_no;
        if (programme) queryParams.programme = programme;
        if (cohort) queryParams.cohort = cohort;
        if (semester) queryParams.semester = semester;
        console.log('queryParams====', queryParams);

        return {
          url: `academics/transcripts/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    addMarks: builder.mutation({
      query: (data) => ({
        url: `academics/marks-records/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadMarks: builder.mutation({
      query: (data) => ({
        url: `academics/marks-records/upload/`,
        method: 'POST',
        body: data,
      }),
    }),

    updateMarks: builder.mutation({
      query: ({ id, data }) => ({
        url: `academics/marks-records/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetMarksQuery,
  useAddMarksMutation,
  useUpdateMarksMutation,
  useUploadMarksMutation,
  useGetTranscriptMarksQuery,
} = academicsApis;
