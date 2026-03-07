import { z } from "zod";
type RegisterFormData = z.infer<typeof registerSchema>;
type Role = "USER" | "ROLE_ADMIN";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["USER", "ADMIN"]),
});

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export { registerSchema, loginSchema };
export type { RegisterFormData, Role, LoginFormData }