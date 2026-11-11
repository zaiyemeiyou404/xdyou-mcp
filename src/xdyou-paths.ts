import { homedir } from "node:os";
import { join, resolve } from "node:path";

/** Campus cache and the login-window profile. Override with XDYOU_SYNC_DIR. */
export function syncedXdyouDataDir(): string {
  const override = process.env.XDYOU_SYNC_DIR?.trim();
  if (override) return resolve(override);
  return join(homedir(), ".xdyou");
}
