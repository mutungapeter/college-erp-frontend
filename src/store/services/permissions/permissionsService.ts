import { apiSlice } from "../../api/apiSlice";

interface BaseInterfacce {
  page?: number;
  page_size?: number;
  department?: string;
  status?: string;
  search?: string;
  cohort?: string;
}

export const rolesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserRoles: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
        cohort,
      }: BaseInterfacce = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        if (cohort) queryParams.cohort = cohort;

        return {
          url: `core/roles/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getModules: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
        cohort,
      }: BaseInterfacce = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        if (cohort) queryParams.cohort = cohort;

        return {
          url: `core/modules/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),

    createRole: builder.mutation({
      query: (data) => ({
        url: `core/roles/create/`,
        method: "POST",
        body: data,
      }),
    }),
    updateRole: builder.mutation({
      query: ({id,data}) => ({
        url: `core/roles/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
   getRoleWithPermissionsDetails: builder.query({
      query: (id) => ({
        url: `core/roles/${id}/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
useCreateRoleMutation,
useGetUserRolesQuery,
useUpdateRoleMutation,
useGetModulesQuery,
useGetRoleWithPermissionsDetailsQuery
} = rolesApi;

