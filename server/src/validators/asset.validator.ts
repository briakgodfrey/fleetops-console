import { z } from "zod";

export const statusEnum = z.enum(["pending", "in_transit", "delayed", "delivered", "exception"]);

export const createAssetSchema = z.object({
  referenceCode: z.string().min(3).max(20),
  type: z.string().min(2).max(50),
  origin: z.string().min(2).max(50),
  destination: z.string().min(2).max(50),
});

export const updateStatusSchema = z.object({
  status: statusEnum,
  note: z.string().max(500).optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
