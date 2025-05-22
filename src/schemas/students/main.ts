
import { z } from "zod";


export const userSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First Name must be at most 50 characters"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
//   username: z.string().min(1, "Username is required").max(150, "Username must be at most 150 characters"),
  gender: z.string().min(1, "Gender is required"),
  phone_number: z.string().min(1, "Phone number is required"),
//   id_number: z.string().nullable().optional(),
//   passport_number: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
//   state: z.string().nullable().optional(),
//   country: z.string().nullable().optional(),
  date_of_birth: z.string().min(1, "Date of birth is required"),
});


export const studentSpecificSchema = z.object({
  registration_number: z.string().min(1, "Registration number is required"),
  programme: z.number().int().positive("Programme is required"),
  guardian_name: z.string().nullable().optional(),
  guardian_phone_number: z.string().nullable().optional(),
cohort: z.number().int().positive("Programme is required"),
campus: z.number().int().positive("Campus is required"),
});


export const createStudentSchema = userSchema.merge(studentSpecificSchema);


export const updateStudentSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First Name must be at most 50 characters").optional(),
  last_name: z.string().min(1, "Last name is required").max(50, "Last Name must be at most 50 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  gender: z.string().min(1, "Gender is required").optional(),
  phone_number: z.string().min(1, "Phone number is required").optional(),
  id_number: z.string().nullable().optional(),
  passport_number: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  date_of_birth: z.string().min(1, "Date of birth is required").optional(),
  
});


export const uploadStudentSchema = z.object({
  programme: z.number().int().positive("Programme is required"),
  cohort: z.number().int().positive("Cohort is required"),
  campus: z.number().int().positive("Campus is required"),
  file: z.instanceof(File)
    .refine(file => {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      return validTypes.includes(file.type);
    }, "Please upload a CSV or Excel file")
    .refine(file => file.size <= 10 * 1024 * 1024, "File size should be less than 10MB")
});

export const updateStudentsCohortSchema= z.object({
    cohort: z.coerce.number().nullable().optional(),
});


export const updateGurdianDetailsSchema = z.object({
  guardian_name: z.string().nullable().optional(),
  guardian_phone_number: z.string().nullable().optional(),
  guardian_relationship: z.string().nullable().optional(),
  guardian_email: z.string().email("Invalid guardian email").nullable().optional(),

});
export const updateCampusSchema= z.object({
    campus: z.coerce.number().nullable().optional(),
});