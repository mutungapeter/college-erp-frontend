
import { apiSlice } from "../../api/apiSlice";


interface ApplicationsInterface{

  page?:number;
  page_size?:number;
  
  department?:string;
  status?:string;
  search?:string;
}

interface EntitlementsInterface{

  page?:number;
  page_size?:number;
  
  department?:string;
  status?:string;
  search?:string;
}

export const leavesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
  getLeaveApplications: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
      }: ApplicationsInterface = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        
      
  
        return {
          url: `staff/leave-applications/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
  getLeaveEntitlements: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
      }: EntitlementsInterface = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        
      
  
        return {
          url: `staff/leave-entitlements/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
   
    createLeaveEntitlement: builder.mutation({
      query: (data) => ({
        url: `staff/leave-entitlements/create/`,
        method: "POST",
        body: data,
        
      }),
    }),
    createBulkLeaveEntitlements: builder.mutation({
      query: (data) => ({
        url: `staff/leave-entitlements/bulk-create/`,
        method: "POST",
        body: data,
        
      }),
    }),
    updateLeaveEntitlement: builder.mutation({
      query: ({id, data}) => ({
        url: `staff/leave-entitlements/${id}/update/`,
        method: "PATCH",
        body: data,
        
      }),
    }),
    
    createLeaveApplication: builder.mutation({
      query: (data) => ({
        url: `staff/leave-applications/create/`,
        method: "POST",
        body: data,
        
      }),
    }),
   
    updateLeaveApplication: builder.mutation({
      query: ({id, data}) => ({
        url: `staff/leave-applications/${id}/`,
        method: "PATCH",
        body: data,
        
      }),
    }),
    
    
    getLeaves: builder.query({
      query: ({
        page,
        page_size,
        status,
        search,
        department,
      }: ApplicationsInterface = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        
      
  
        return {
          url: `staff/leaves/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
   
  }),
});

export const {
useCreateLeaveApplicationMutation,
useGetLeaveApplicationsQuery,
useGetLeavesQuery,
useUpdateLeaveApplicationMutation,
useCreateLeaveEntitlementMutation,
useGetLeaveEntitlementsQuery,
useUpdateLeaveEntitlementMutation,
useCreateBulkLeaveEntitlementsMutation

} = leavesApi;
