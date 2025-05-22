import { z } from 'zod';




const applicationBaseSchema = {
  application_number: z.string().min(1).max(255).nullable().optional(),
  lead: z.number().int().nullable().optional(),
  first_name: z.string().min(1, "First name is required").max(255),
  last_name: z.string().min(1, "Last name is required").max(255),
  email: z.string().email().max(254),
  phone_number: z.string().min(1, "Phone number is required").max(20),
  id_number: z.string().max(255).nullable().optional(),
  passport_number: z.string().max(255).nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  first_choice_programme: z.number().int().nullable().optional(),
  second_choice_programme: z.number().int().nullable().optional(),
  guardian_name: z.string().max(255).nullable().optional(),
  guardian_email: z.string().email().max(254).nullable().optional(),
  guardian_relationship: z.string().max(255).nullable().optional(),
  guardian_phone_number: z.string().max(255).nullable().optional(),
  address: z.string().max(255).nullable().optional(),
  postal_code: z.string().max(255).nullable().optional(),
  city: z.string().max(255).nullable().optional(),
  country: z.string().max(255).nullable().optional(),
  intake: z.number().int().nullable().optional(),
  status: z.string().max(255).nullable().optional(),
  campus: z.number().int().nullable().optional(),
//   z.number().int().positive().nullable().optional(),
};


export const applicationCreateSchema = z.object({
  first_name: applicationBaseSchema.first_name,
  last_name: applicationBaseSchema.last_name,
  email: applicationBaseSchema.email,
  phone_number: applicationBaseSchema.phone_number,
  gender: applicationBaseSchema.gender,
  status: applicationBaseSchema.status,
  

  application_number: applicationBaseSchema.application_number,
  lead: applicationBaseSchema.lead,
  id_number: applicationBaseSchema.id_number,
  passport_number: applicationBaseSchema.passport_number,
  date_of_birth: z.string().min(1, "Date of birth is required"),
  first_choice_programme: z.number().int().positive("First choice programme is required"),
  second_choice_programme: applicationBaseSchema.second_choice_programme,
  guardian_name: applicationBaseSchema.guardian_name,
  guardian_email: applicationBaseSchema.guardian_email,
  guardian_relationship: applicationBaseSchema.guardian_relationship,
  guardian_phone_number: applicationBaseSchema.guardian_phone_number,
  address: applicationBaseSchema.address,
  postal_code: applicationBaseSchema.postal_code,
  city: applicationBaseSchema.city,
  country: applicationBaseSchema.country,
  intake: z.number().int().positive('Intake required'),
  campus: applicationBaseSchema.campus,
});


export const updateApplicationSchema = z.object({
  first_name: applicationBaseSchema.first_name.optional(),
  last_name: applicationBaseSchema.last_name.optional(),
  email: applicationBaseSchema.email.optional(),
  phone_number: applicationBaseSchema.phone_number.optional(),
  gender: applicationBaseSchema.gender.optional(),
  status: applicationBaseSchema.status.optional(),
  
  lead: applicationBaseSchema.lead,
  id_number: applicationBaseSchema.id_number,
  passport_number: applicationBaseSchema.passport_number,
  date_of_birth: applicationBaseSchema.date_of_birth,
  first_choice_programme: applicationBaseSchema.first_choice_programme,
  second_choice_programme: applicationBaseSchema.second_choice_programme,
  guardian_name: applicationBaseSchema.guardian_name,
  guardian_email: applicationBaseSchema.guardian_email,
  guardian_relationship: applicationBaseSchema.guardian_relationship,
  guardian_phone_number: applicationBaseSchema.guardian_phone_number,
  address: applicationBaseSchema.address,
  postal_code: applicationBaseSchema.postal_code,
  city: applicationBaseSchema.city,
  country: applicationBaseSchema.country,
  intake: applicationBaseSchema.intake,
  campus: applicationBaseSchema.campus,
});


export const updateApplicationPersonalInfoSchema = z.object({
  first_name: applicationBaseSchema.first_name.optional(),
  last_name: applicationBaseSchema.last_name.optional(),
  email: applicationBaseSchema.email.optional(),
  phone_number: applicationBaseSchema.phone_number.optional(),
  gender: applicationBaseSchema.gender.optional(),
  id_number: applicationBaseSchema.id_number,
  passport_number: applicationBaseSchema.passport_number,
  date_of_birth: applicationBaseSchema.date_of_birth,
  postal_code: applicationBaseSchema.postal_code,
  city: applicationBaseSchema.city,
  country: applicationBaseSchema.country,
});
export const updateGurdianSchema = z.object({
    guardian_name: applicationBaseSchema.guardian_name,
    guardian_email: applicationBaseSchema.guardian_email,
    guardian_relationship: applicationBaseSchema.guardian_relationship,
    guardian_phone_number: applicationBaseSchema.guardian_phone_number,
    
})
const applicationEducationHistoryBaseSchema = {
  level: z.string().max(255).nullable().optional(),
  grade_or_gpa: z.string().max(255).nullable().optional(),
  year: z.string().max(255).nullable().optional(),
  major: z.string().max(255).nullable().optional(),
  institution: z.string().max(255).nullable().optional(),
  graduated: z.boolean().nullable().optional(),
}

export const applicationEducationHistoryCreateSchema = z.object({
    institution: z.string().min(1, "Institution required").max(255, "Institution must be less than 255 characters"),
    grade_or_gpa: z.string().min(1, "Grade or GPA required").max(255, "Grade or GPA must be less than 255 characters"),
    year: z.string().min(1, "Year required").max(255, "Year must be less than 255 characters"),
    major: applicationEducationHistoryBaseSchema.major,
    graduated: applicationEducationHistoryBaseSchema.graduated,
    level: z.string().min(1, "Level required").max(255, "Level must be less than 255 characters"),
})

export const updateApplicationEducationHistorySchema = z.object({
    ...applicationEducationHistoryBaseSchema
})
export const updateProgrammeInterestSchema = z.object({
    first_choice_programme: applicationBaseSchema.first_choice_programme,
    second_choice_programme: applicationBaseSchema.second_choice_programme,
    intake:  applicationBaseSchema.intake,
    campus:  applicationBaseSchema.campus,
})
export const enrollStudentSchema = z.object({
    cohort: z.number().int().positive('Class/Cohort is required'),
})

export type StudentApplicationProgrammeInterestUpdate = z.infer<typeof updateProgrammeInterestSchema>;
export type StudentApplicationCreate = z.infer<typeof applicationCreateSchema>;
export type StudentApplicationUpdate = z.infer<typeof updateApplicationSchema>;