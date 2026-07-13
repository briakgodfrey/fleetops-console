import { Schema, model, Document, Types } from "mongoose";

export interface AuditLogDocument extends Document {
  assetId: Types.ObjectId;
  actorId: Types.ObjectId;
  action: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  note?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>({
  assetId: { type: Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  before: { type: Schema.Types.Mixed },
  after: { type: Schema.Types.Mixed },
  note: { type: String },
  timestamp: { type: Date, default: Date.now },
});

// No update/delete routes are exposed for this model anywhere in the app —
// it is intentionally append-only at the application layer. See docs/06-security.md.
export const AuditLog = model<AuditLogDocument>("AuditLog", auditLogSchema);
