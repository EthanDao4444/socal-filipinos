// Example code below:

// Use Zod for schema validation at runtime
import { z } from 'zod';

// For example when you fetch from Supabase
export const UserSchema = z.object({
  user_id: z.string().uuid(),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  profile_picture: z.string().url().optional(),
  // use regex to validate phone number format
  phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
});

export type User = z.infer<typeof UserSchema>;

// Sample validation
export function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}

// For example when updating user info
export const UpdateUserSchema = UserSchema.partial();
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

// TODO: create user schema validation (for uploading and fetching)
