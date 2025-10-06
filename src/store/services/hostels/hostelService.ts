import { apiSlice } from '../../api/apiSlice';

interface GetHostelsInterface {
  page?: number;
  page_size?: number;
  hostel_id?: string;
  campus?: string;
  status?: string;
  search?: string;
  name?: string;
  reg_no?: string;
}
interface GetRoomsByHostelsInterface {
  page?: number;
  page_size?: number;
  hostel_id: string;
  campus?: string;
  status?: string;
  search?: string;
  name?: string;
  reg_no?: string;
  room_no?: string;
}
interface GetRoomsOccupantsInterface {
  page?: number;
  page_size?: number;
  room_id: string;
  search?: string;
  name?: string;
  reg_no?: string;
  room_no?: string;
}
interface GetBookingsInterface {
  page?: number;
  page_size?: number;
  search?: string;
  name?: string;
  reg_no?: string;
  hostel_room?: string;
  hostel?: string;
}
export const hostelsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHostels: builder.query({
      query: ({
        page,
        page_size,
        status,
        name,
        campus,
        search,
      }: GetHostelsInterface = {}) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (campus) queryParams.campus = campus;
        if (status) queryParams.status = status;
        if (name) queryParams.name = name;
        if (search) queryParams.search = search;
        // console.log("queryParams====",queryParams)

        return {
          url: `hostels/list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    createHostels: builder.mutation({
      query: (data) => ({
        url: `hostels/create/`,
        method: 'POST',
        body: data,
      }),
    }),

    updateHostel: builder.mutation({
      query: ({ id, data }) => ({
        url: `hostels/update/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    getHostelDetails: builder.query({
      query: (id) => ({
        url: `hostel/details/${id}/`,
        method: 'GET',
      }),
    }),

    getHostelRooms: builder.query({
      query: ({
        page,
        page_size,
        status,
        campus,
        name,
        search,
        room_no,
        hostel_id,
      }: GetRoomsByHostelsInterface) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (campus) queryParams.campus = campus;
        if (status) queryParams.status = status;
        if (name) queryParams.name = name;
        if (search) queryParams.search = search;
        if (room_no) queryParams.room_no = room_no;

        return {
          url: `hostels/${hostel_id}/rooms/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getHostelRoomOccupants: builder.query({
      query: ({
        page,
        page_size,
        reg_no,
        name,
        search,
        room_no,
        room_id,
      }: GetRoomsOccupantsInterface) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (name) queryParams.name = name;
        if (search) queryParams.search = search;
        if (room_no) queryParams.room_no = room_no;
        if (reg_no) queryParams.reg_no = reg_no;

        return {
          url: `hostels/rooms/${room_id}/occupants/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getHostelRoomBookings: builder.query({
      query: ({
        page,
        page_size,
        reg_no,
        name,
        search,
        hostel,
        hostel_room,
      }: GetBookingsInterface) => {
        const queryParams: Record<
          string,
          string | number | boolean | undefined
        > = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (name) queryParams.name = name;
        if (search) queryParams.search = search;
        if (hostel) queryParams.hostel = hostel;
        if (reg_no) queryParams.reg_no = reg_no;
        if (hostel_room) queryParams.hostel_room = hostel_room;

        return {
          url: `hostels/bookings/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    createHostelRoom: builder.mutation({
      query: (data) => ({
        url: `hostels/rooms/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateHostelRoom: builder.mutation({
      query: ({ id, data }) => ({
        url: `hostels/rooms/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    updateHostelRoomBooking: builder.mutation({
      query: (id) => ({
        url: `hostels/bookings/${id}/update/`,
        method: 'PATCH',
      }),
    }),
    CreateHostelRoomBooking: builder.mutation({
      query: (data) => ({
        url: `hostels/bookings/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    addHostelRoomOccupant: builder.mutation({
      query: (data) => ({
        url: `hostels/occupants/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    removeHostelRoomOccupant: builder.mutation({
      query: (data) => ({
        url: `hostels/occupants/remove/`,
        method: 'POST',
        body: data,
      }),
    }),
    deletHostelRoom: builder.mutation({
      query: (id) => ({
        url: `hostels/rooms/${id}/delete/`,
        method: 'DELETE',
      }),
    }),
    confirmHostelRoomBooking: builder.mutation({
      query: ({ id, data }) => ({
        url: `hostels/bookings/${id}/confirm-or-cancel/`,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useConfirmHostelRoomBookingMutation,
  useCreateHostelRoomMutation,
  useGetHostelRoomsQuery,
  useGetHostelsQuery,
  useGetHostelDetailsQuery,
  useCreateHostelsMutation,
  useUpdateHostelMutation,
  useUpdateHostelRoomBookingMutation,
  useUpdateHostelRoomMutation,
  useCreateHostelRoomBookingMutation,
  useGetHostelRoomOccupantsQuery,
  useAddHostelRoomOccupantMutation,
  useRemoveHostelRoomOccupantMutation,
  useDeletHostelRoomMutation,
  useGetHostelRoomBookingsQuery,
} = hostelsApi;
