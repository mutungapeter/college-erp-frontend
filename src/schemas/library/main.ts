import { z } from 'zod';

const bookBaseSchema = {
  title: z.string().max(200).nullable().optional(),
  author: z.string().max(100).nullable().optional(),
  category: z.string().nullable().optional(),
  isbn: z.string().max(13).nullable().optional(),
  publication_date: z.string().nullable().optional(),
  copies_available: z.coerce.number().nullable().optional(),
  total_copies: z.coerce.number().nullable().optional(),
  unit_price: z.coerce.number().nullable().optional(),
};

export const bookCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  author: z
    .string()
    .min(1, 'Authoer is required')
    .max(100, 'Author must be less than 100 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be less than 100 characters'),
  isbn: bookBaseSchema.isbn,
  publication_date: bookBaseSchema.publication_date,
  copies_available: bookBaseSchema.copies_available,
  total_copies: z.coerce.number().min(1, 'Copies available must be at least 1'),
  unit_price: z.coerce.number().min(1, 'Unit price must be at least 1'),
});

export const bookUpdateSchema = z.object({
  title: bookBaseSchema.title.optional(),
  author: bookBaseSchema.author.optional(),
  category: bookBaseSchema.category.optional(),
  isbn: bookBaseSchema.isbn.optional(),
  publication_date: bookBaseSchema.publication_date.optional(),
  total_copies: bookBaseSchema.total_copies.optional(),
  unit_price: bookBaseSchema.unit_price.optional(),
});

export const IssueBookBaseSchema = z.object({
  member: z.number().int().nullable().optional(),
  due_date: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  copy_number: z.string().nullable().optional(),
});
export const UpdateIssuedBookStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export const IssueBookSchema = z.object({
  member: z.number().int().positive('Course is required'),
  due_date: z
    .string()
    .min(1, 'Due date is required')
    .refine(
      (date) => {
        const selectedDate = new Date(date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate.getTime() >= today.getTime();
      },
      {
        message: 'Due date must be today or in the future',
      },
    ),
  // copy_number: z.string().min(1, "Copy Number is required"),
});
export const MemberSchema = z.object({
  registration_number: z.string().nullable().optional(),
  staff_number: z.string().nullable().optional(),
});

export const uploadBooksSchema = z.object({
  books_csv: z
    .instanceof(File)
    .refine((file) => {
      const validTypes = ['text/csv'];
      return validTypes.includes(file.type);
    }, 'Please upload a CSV file')
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'File size should be less than 10MB',
    ),
});
export const IssueBookUpdateSchema = IssueBookBaseSchema.partial();

export type UploadBooksFormData = z.infer<typeof uploadBooksSchema>;
export type MemberCreateType = z.infer<typeof MemberSchema>;
export type IssueBookUpdateType = z.infer<typeof IssueBookUpdateSchema>;
export type IssueBookType = z.infer<typeof IssueBookSchema>;
export type BookCreateType = z.infer<typeof bookCreateSchema>;
export type BookUpdateType = z.infer<typeof bookUpdateSchema>;
export type UpdateIssuedBookStatusType = z.infer<
  typeof UpdateIssuedBookStatusSchema
>;
