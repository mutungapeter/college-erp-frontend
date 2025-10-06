import { apiSlice } from '../../api/apiSlice';

interface GetBooksInterface {
  page?: number;
  page_size?: number;
  application_no?: string;
  phone_no?: string;
  intake?: string;
  status?: string;
  search?: string;
}
export const libraryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({
        page,
        page_size,
        status,
        application_no,
        intake,
        phone_no,
        search,
      }: GetBooksInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (application_no) queryParams.application_no = application_no;
        if (status) queryParams.status = status;
        if (intake) queryParams.intake = intake;
        if (phone_no) queryParams.phone_no = phone_no;
        if (search) queryParams.search = search;
        console.log('queryParams====', queryParams);

        return {
          url: `library/books/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    createBook: builder.mutation({
      query: (data) => ({
        url: `library/books/create/`,
        method: 'POST',
        body: data,
      }),
    }),

    updateBook: builder.mutation({
      query: ({ id, data }) => ({
        url: `library/books/update/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    uploadBooks: builder.mutation({
      query: (data) => ({
        url: `library/books/upload/`,
        method: 'POST',
        body: data,
      }),
    }),
    getBookDetails: builder.query({
      query: (id) => ({
        url: `library/books/details/${id}/`,
        method: 'GET',
      }),
    }),

    getMembers: builder.query({
      query: ({
        page,
        page_size,
        status,
        application_no,
        intake,
        phone_no,
      }: GetBooksInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (application_no) queryParams.application_no = application_no;
        if (status) queryParams.status = status;
        if (intake) queryParams.intake = intake;
        if (phone_no) queryParams.phone_no = phone_no;
        console.log('queryParams====', queryParams);

        return {
          url: `library/members/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    createMember: builder.mutation({
      query: (data) => ({
        url: `library/members/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateMember: builder.mutation({
      query: ({ id, data }) => ({
        url: `library/members/update/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deactivateMember: builder.mutation({
      query: (id) => ({
        url: `library/members/deactivate/${id}/`,
        method: 'PATCH',
      }),
    }),
    activateMember: builder.mutation({
      query: (id) => ({
        url: `library/members/activate/${id}/`,
        method: 'PATCH',
      }),
    }),

    getMemberDetails: builder.query({
      query: (id) => ({
        url: `library/members/details/${id}/`,
        method: 'GET',
      }),
    }),

    getBorrowedBooks: builder.query({
      query: ({
        page,
        page_size,
        status,
        application_no,
        intake,
        phone_no,
        search,
      }: GetBooksInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (application_no) queryParams.application_no = application_no;
        if (status) queryParams.status = status;
        if (intake) queryParams.intake = intake;
        if (phone_no) queryParams.phone_no = phone_no;
        if (search) queryParams.search = search;
        console.log('queryParams====', queryParams);

        return {
          url: `library/borrowed-books/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    issueBook: builder.mutation({
      query: (data) => ({
        url: `library/borrowed-books/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateIssuedBook: builder.mutation({
      query: ({ id, data }) => ({
        url: `library/borrowed-books/update/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    getBorrowedBooksFines: builder.query({
      query: ({
        page,
        page_size,
        status,
        application_no,
        intake,
        phone_no,
        search,
      }: GetBooksInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (application_no) queryParams.application_no = application_no;
        if (status) queryParams.status = status;
        if (intake) queryParams.intake = intake;
        if (phone_no) queryParams.phone_no = phone_no;
        if (search) queryParams.search = search;
        console.log('queryParams====', queryParams);

        return {
          url: `library/borrowed-books-fines/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    finePaymentRequest: builder.mutation({
      query: (data) => ({
        url: `library/fine-payment-request/`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetBorrowedBooksQuery,
  useGetBorrowedBooksFinesQuery,
  useFinePaymentRequestMutation,
  useCreateBookMutation,
  useGetBooksQuery,
  useGetBookDetailsQuery,
  useGetMemberDetailsQuery,
  useGetMembersQuery,
  useUpdateBookMutation,
  useIssueBookMutation,
  useUpdateIssuedBookMutation,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeactivateMemberMutation,
  useActivateMemberMutation,
  useUploadBooksMutation,
} = libraryApi;
