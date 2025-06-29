import { z } from "zod";

export const SatffLeaveApplicationSchema = z
  .object({
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    reason: z.string().min(1, "Reason is required"),
    leave_type: z.string().min(1, "Leave type is required"),
  })
  .refine((data) => {
    const today = new Date();
    const startDate = new Date(data.start_date);
    return startDate >= new Date(today.toDateString());
  }, {
    path: ["start_date"],
    message: "Start date cannot be in the past",
  })
  .refine((data) => {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return endDate >= startDate;
  }, {
    path: ["end_date"],
    message: "End date must be after or same as start date",
  });

export const AdminLeaveApplicationSchema = z
  .object({
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    reason: z.string().min(1, "Reason is required"),
    leave_type: z.string().min(1, "Leave type is required"),
    staff: z.number().positive("Staff is required"),
  })
  .refine((data) => {
    const today = new Date();
    const startDate = new Date(data.start_date);
    return startDate >= new Date(today.toDateString());
  }, {
    path: ["start_date"],
    message: "Start date cannot be in the past",
  })
  .refine((data) => {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return endDate >= startDate;
  }, {
    path: ["end_date"],
    message: "End date must be after or same as start date",
  });

export const UpdateLeaveApplicationSchema = z.object({
  status: z.string()
    .max(150, "First name cannot exceed 150 characters")
    .optional(),
  reason_declined: z.string().optional(),
  
  
});

export const bulkLeaveEntitlementSchema = z.object({
  total_days: z.coerce.number().positive("Total days is required"),
  year: z.coerce.number().gt(4, "Year must be of 4 digits"),
});

export const LeaveEntitlementSchema = z.object({
  staff: z.coerce.number().positive("Staff is required"),
  total_days: z.coerce.number().positive("Total days is required"),
  year: z.coerce.number().gt(4, "Year must be of 4 digits"),
});

export type  BulkLeaveEntitlementFormData = z.infer<
  typeof bulkLeaveEntitlementSchema
>;
export type LeaveEntitlementFormData = z.infer<typeof LeaveEntitlementSchema>;
export type StaffApplicationType = z.infer<typeof SatffLeaveApplicationSchema>;
export type AdminLeaveApplicationType = z.infer<typeof AdminLeaveApplicationSchema>;
export type UpdateLeaveApplicationType = z.infer<typeof UpdateLeaveApplicationSchema>;