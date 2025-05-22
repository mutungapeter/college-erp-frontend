import { z } from "zod";

const schoolSchema = z.object({
  name: z.string().min(1, "Campus name is required").max(50, "Name must be at most 50 characters"),
  phone: z.string().min(1, "Phone number is required").max(10, "phone  must be at most 10 digits"),
  location: z.string().min(1, "location is required").max(50, "Location mus bt at most 50 characters"),
  email: z.string().min(1,"Email is required").email("Invalid email"),
});

export default schoolSchema;
