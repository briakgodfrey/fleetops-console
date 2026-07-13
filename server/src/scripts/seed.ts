import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import { User } from "../models/User";
import { Asset, AssetStatus } from "../models/Asset";
import { AuditLog } from "../models/AuditLog";

const STATUSES: AssetStatus[] = ["pending", "in_transit", "delayed", "delivered", "exception"];
const CITIES = ["CLT", "ATL", "DAL", "PHX", "SEA", "BOS", "MIA", "DEN"];

// Roughly mirrors the real transitions enforced by the app so seeded history looks plausible
// (see docs/01-discovery.md for the actual status lifecycle).
const HISTORY_BY_STATUS: Record<AssetStatus, AssetStatus[]> = {
  pending: ["pending"],
  in_transit: ["pending", "in_transit"],
  delayed: ["pending", "in_transit", "delayed"],
  delivered: ["pending", "in_transit", "delivered"],
  exception: ["pending", "in_transit", "exception"],
};

function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}

async function seed() {
  await connectDB();

  await Promise.all([User.deleteMany({}), Asset.deleteMany({}), AuditLog.deleteMany({})]);

  const passwordHash = await bcrypt.hash("password123", 12);
  const [admin, operator] = await User.insertMany([
    { name: "Admin User", email: "admin@fleetops.dev", passwordHash, role: "admin" },
    { name: "Operator One", email: "operator@fleetops.dev", passwordHash, role: "operator" },
    { name: "Viewer One", email: "viewer@fleetops.dev", passwordHash, role: "viewer" },
  ]);

  const assetInputs = Array.from({ length: 500 }, (_, i) => ({
    referenceCode: `FL-${1000 + i}`,
    type: ["pallet", "container", "crate"][i % 3],
    origin: CITIES[i % CITIES.length],
    destination: CITIES[(i + 3) % CITIES.length],
    status: STATUSES[i % STATUSES.length],
  }));
  const assets = await Asset.insertMany(assetInputs);

  // Backfill audit history for every asset so the dashboard's Recent Activity feed
  // and each asset's Status Timeline aren't empty on first run. In real usage these
  // entries are written automatically by asset.controller.ts on every mutation.
  const auditDocs: any[] = [];
  assets.forEach((asset, i) => {
    const chain = HISTORY_BY_STATUS[asset.status as AssetStatus];
    chain.forEach((status, step) => {
      const hoursBack = (chain.length - step) * 6 + (i % 5);
      auditDocs.push({
        assetId: asset._id,
        actorId: step === 0 ? operator._id : (i % 7 === 0 ? admin._id : operator._id),
        action: step === 0 ? "created" : "status_changed",
        before: step === 0 ? undefined : { status: chain[step - 1] },
        after: { status },
        note: status === "delayed" ? "weather hold" : status === "exception" ? "customs flag" : undefined,
        timestamp: hoursAgo(hoursBack),
      });
    });
  });
  await AuditLog.insertMany(auditDocs);

  console.log(`Seeded 3 users, ${assets.length} assets, and ${auditDocs.length} audit log entries.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
