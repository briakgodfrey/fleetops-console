import { Schema, model, Document, Types } from "mongoose";

export type AssetStatus = "pending" | "in_transit" | "delayed" | "delivered" | "exception";

export interface AssetDocument extends Document {
  referenceCode: string;
  type: string;
  origin: string;
  destination: string;
  status: AssetStatus;
  assignedTo?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<AssetDocument>(
  {
    referenceCode: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_transit", "delayed", "delivered", "exception"],
      default: "pending",
      index: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Compound index supporting the asset list's common filter + sort pattern
assetSchema.index({ status: 1, updatedAt: -1 });

export const Asset = model<AssetDocument>("Asset", assetSchema);
