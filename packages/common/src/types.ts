import { z } from "zod";

export const UserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const RoomSchema = z.object({
  name: z.string()
});

export type User = z.infer<typeof UserSchema>;
export type SignIn = z.infer<typeof SignInSchema>;
export type Room = z.infer<typeof RoomSchema>;
