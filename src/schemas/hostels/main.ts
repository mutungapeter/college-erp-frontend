import { z } from 'zod';


const hostelBaseSchema = z.object({
  name: z.string().min(1, "Name is required").max(200).nullable().optional(),
  gender: z.string().min(1, "Gender is required").max(200).nullable().optional(),
  rooms: z.coerce.number().min(1, "Rooms should be greater than 0").max(10000).nullable().optional(),
  room_cost: z.coerce.number().min(0, "Rooms cost can't be a negative value").max(50000).nullable().optional(),
  capacity: z.coerce.number().min(1,"capacity cannot be less than 1").max(10000).nullable().optional(),
  campus: z.number().int().positive("Campus is required").nullable().optional(),
});

const hostelRoomBaseSchema = z.object({
  room_number: z.string().min(1, "Room No required").max(10000).nullable().optional(),
  room_capacity: z.coerce.number().min(1,"capacity cannot be less than 1").max(10000).nullable().optional(),
});

const hostelRoomBookinBaseSchema = z.object({
  student: z.number().int().positive("Student is required").optional(),
  hostel_room: z.number().int().positive("Student is required").optional()
});


export const HostelRoomBookingCreateSchema = hostelRoomBookinBaseSchema.required();
// export const HostelRoomBookingCreateSchema = z.object({
//   student: z.number().int().positive("Student is required"),
//   hostel_room: z.number().int().positive("Room is required"),
// });
export const updateRoomBookingStatusSchema =z.object({
  status: z.string().min(1, "Student is required"),
});
const roomOccupantBaseSchema = z.object({
  student: z.number().int().positive("Student is required").nullable().optional(),
});
export const HostelRoomBookingUpdateSchema = hostelRoomBookinBaseSchema.partial();

export const hostelCreateSchema = hostelBaseSchema.required();
export const hostelUpdateSchema = hostelBaseSchema.partial();
export const hostelRoomCreateSchema = hostelRoomBaseSchema.required();
export const hostelRoomUpdateSchema = hostelRoomBaseSchema.partial();
    
export const addRoomOccupantSchema = roomOccupantBaseSchema.required();
export const updateRoomOccupantSchema = roomOccupantBaseSchema.partial();

export type HostelCreateType = z.infer<typeof hostelCreateSchema>;
export type HostelUpdateType = z.infer<typeof hostelUpdateSchema>;

export type HostelRoomCreateType = z.infer<typeof hostelRoomCreateSchema>;
export type HostelRoomUpdateType = z.infer<typeof hostelRoomUpdateSchema>;

export type HostelRoomBookingCreateType = z.infer<typeof HostelRoomBookingCreateSchema>;
export type HostelRoomBookingUpdateType = z.infer<typeof HostelRoomBookingUpdateSchema>;
export type AddRoomOccupantTye = z.infer<typeof addRoomOccupantSchema>;
export type UpdateRoomOccupantTye = z.infer<typeof updateRoomOccupantSchema>;

export type UpdateRoomBookingStatusType = z.infer<typeof updateRoomBookingStatusSchema>;