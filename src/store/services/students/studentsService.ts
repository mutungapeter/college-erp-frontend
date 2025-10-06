import { apiSlice } from '../../api/apiSlice';

interface GetStudets {
  page?: number;
  page_size?: number;
  reg_no?: string;
  status?: string;
  programme?: string;
  department?: string;
  course?: string;
  semester?: string;
  cohort?: string;
}
export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query({
      query: ({
        page,
        page_size,
        reg_no,
        status,
        programme,
        department,
      }: GetStudets = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (reg_no) queryParams.reg_no = reg_no;
        if (programme) queryParams.programme = programme;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;

        console.log('queryParams**************+', queryParams);
        return {
          url: `students/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getStudentMetrics: builder.query({
      query: ({
        page,
        page_size,
        reg_no,
        status,
        programme,
        department,
      }: GetStudets = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (reg_no) queryParams.reg_no = reg_no;
        if (programme) queryParams.programme = programme;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;

        console.log('queryParams**************+', queryParams);
        return {
          url: `students/metrics/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getAssessmentList: builder.query({
      query: ({
        page,
        page_size,
        reg_no,
        status,
        programme,
        department,
        course,
        semester,
        cohort,
      }: GetStudets = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};

        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (reg_no) queryParams.reg_no = reg_no;
        if (programme) queryParams.programme = programme;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        if (course) queryParams.course = course;
        if (semester) queryParams.semester = semester;
        if (cohort) queryParams.cohort = cohort;

        console.log('queryParams**************+', queryParams);
        return {
          url: `students/assessment-list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    createStudent: builder.mutation({
      query: (data) => ({
        url: `students/create-student/`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadStudents: builder.mutation({
      query: (data) => ({
        url: `students/upload/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateStudent: builder.mutation({
      query: ({ id, data }) => ({
        url: `students/update-student/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    updateStudentAccount: builder.mutation({
      query: ({ id, data }) => ({
        url: `students/update-student-account/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `students/delete-student/${id}/`,
        method: 'DELETE',
      }),
    }),
    getStudent: builder.query({
      query: (id) => ({
        url: `students/${id}/`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useUploadStudentsMutation,
  useGetStudentQuery,
  useUpdateStudentAccountMutation,
  useGetAssessmentListQuery,
  useGetStudentMetricsQuery,
} = studentsApi;
