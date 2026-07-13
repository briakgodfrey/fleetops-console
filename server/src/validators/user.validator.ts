import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.enum(["admin", "operator", "viewer"]),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
