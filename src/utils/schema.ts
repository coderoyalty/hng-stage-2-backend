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

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password cannot be longer than 100 characters." })
    .regex(/(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/(?=.*\d)/, {
      message: "Password must contain at least one number.",
    })
    .regex(/(?=.*[@$!%*?&])/, {
      message: "Password must contain at least one special character.",
    }),

  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters long." })
    .max(15, { message: "Phone number cannot be longer than 15 characters." })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Phone number must be a valid international phone number.",
    })
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password cannot be longer than 100 characters." })
    .regex(/(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/(?=.*\d)/, {
      message: "Password must contain at least one number.",
    })
    .regex(/(?=.*[@$!%*?&])/, {
      message: "Password must contain at least one special character.",
    }),
});

const orgSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

export { userSchema, loginSchema, orgSchema };
