import { z } from "zod";
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
    password: z.string().min(4, "Password must be atleast 4 characters"),
  });

  export default loginSchema;
