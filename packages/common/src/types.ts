import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  photo: z.string()
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const RoomSchema = z.object({
  slug: z.string()
});

export type User = z.infer<typeof UserSchema>;
export type SignIn = z.infer<typeof SignInSchema>;
export type Room = z.infer<typeof RoomSchema>;
