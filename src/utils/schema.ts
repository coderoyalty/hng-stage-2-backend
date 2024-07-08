import { z } from "zod";
const userSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required." })
    .max(50, { message: "First name cannot be longer than 50 characters." }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required." })
    .max(50, { message: "Last name cannot be longer than 50 characters." }),

  email: z
    .string()
    .email({ message: "Invalid email format." })
    .max(100, { message: "Email cannot be longer than 100 characters." }),

  password: z.string().min(1, { message: "Password must be not be empty" }),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password must be not be empty" }),
});

const orgSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

export { userSchema, loginSchema, orgSchema };
