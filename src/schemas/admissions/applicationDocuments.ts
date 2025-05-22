import { z } from 'zod';


const applicationDocumentBaseSchema = {
//   student_application: z.string().min(1, "Student Application ID is required"),
  document_name: z.string().min(1, "Document name is required").max(255),
  document_type: z.string().min(1, "Document type is required"),
 document_file: z.instanceof(File)
    .refine(file => file.type === 'application/pdf', "Please upload a PDF file") 
    .refine(file => file.size <= 10 * 1024 * 1024, "File size should be less than 10MB"),
  verified: z.boolean().default(false),
};


export const applicationDocumentCreateSchema = z.object({
//   student_application: applicationDocumentBaseSchema.student_application,
  document_name: applicationDocumentBaseSchema.document_name,
  document_type: applicationDocumentBaseSchema.document_type,
  document_file: applicationDocumentBaseSchema.document_file,
  
});


export const applicationDocumentUpdateSchema = z.object({
  document_name: applicationDocumentBaseSchema.document_name.optional(),
  document_type: applicationDocumentBaseSchema.document_type.optional(),
  document_file: applicationDocumentBaseSchema.document_file.optional(),
  verified: applicationDocumentBaseSchema.verified.optional(),
});

export type ApplicationDocumentCreate = z.infer<typeof applicationDocumentCreateSchema>;
export type ApplicationDocumentUpdate = z.infer<typeof applicationDocumentUpdateSchema>;
