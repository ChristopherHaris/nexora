import z from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(3),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(63, "Username must be at most 63 characters long")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers, and hyphens. It must start and end with a letter or number.",
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain double hyphens.",
    )
    .transform((val) => val.toLowerCase()),
  fullname: z
    .string()
    .min(3, "Full name must be at least 3 characters long")
    .max(100, "Full name must be at most 100 characters long"),
  major: z
    .string()
    .min(2, "Major must be at least 2 characters long")
    .max(100, "Major must be at most 100 characters long"),
  StudentID: z
    .string()
    .min(5, "Student ID must be at least 5 characters long")
    .max(20, "Student ID must be at most 20 characters long"),
});

export const registerTenantOrganizerSchema = z.object({
  email: z.email(),
  name: z
    .string()
    .min(3, "Full name must be at least 3 characters long")
    .max(100, "Full name must be at most 100 characters long"),
  password: z.string().min(3),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(63, "Username must be at most 63 characters long")
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      "Username can only contain lowercase letters, numbers, and hyphens. It must start and end with a letter or number.",
    )
    .refine(
      (val) => !val.includes("--"),
      "Username cannot contain double hyphens.",
    )
    .transform((val) => val.toLowerCase()),
});



export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});
