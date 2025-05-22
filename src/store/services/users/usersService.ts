
import { apiSlice } from "../../api/apiSlice";


export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/update-student/${id}/`,
        method: "PATCH",
        body: data,
        
      }),
    }),
   
  }),
});

export const {
useUpdateUserProfileMutation


} = usersApi;
