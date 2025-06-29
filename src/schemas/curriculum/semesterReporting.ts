import { z } from "zod";

export const semesterReportingSchema = z.object({
  semester: z.number().int().positive("Current Semester is required"),
  
 
});
export const singleStudentReportingSchema = z.object({
  semester: z.number().int().positive("Current Semester is required"),
  student: z.number().int().positive("Current Semester is required"),

});


export type SingleStudentReportingType = z.infer<typeof singleStudentReportingSchema>;
export type SemesterReportingType = z.infer<typeof semesterReportingSchema>;