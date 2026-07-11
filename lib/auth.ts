import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const SECRET = process.env.AUTH_SECRET;
if (!SECRET) {
  throw new Error(
    "AUTH_SECRET environment variable is not set. See README for information",
  );
}

const UNLOCK_COOKIE_PREFIX = "unlock_";
const UNLOCK_TTL_MS = 1000 * 60 * 60 * 24 * 128; // 128d
// const UNLOCK_TTL_MS = 10_000;

export async function hashPasscode(passcode: string) {
  return bcrypt.hash(passcode, 10);
}

export async function verifyPasscode(passcode: string, hash: string) {
  return bcrypt.compare(passcode, hash);
}

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET!).update(value).digest("hex");
}

export function unlockCookieName(collectionId: string) {
  return `${UNLOCK_COOKIE_PREFIX}${collectionId}`;
}

export function createUnlockToken(collectionId: string) {
  const expires = Date.now() + UNLOCK_TTL_MS;
  const payload = `${collectionId}.${expires}`;
  const signature = sign(payload);
  return { value: `${expires}.${signature}`, expires: new Date(expires) };
}

export function verifyUnlockToken(
  collectionId: string,
  token: string | undefined,
) {
  if (!token) return false;
  const [expiresStr, signature] = token.split(".");
  if (!expiresStr || !signature) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const expected = sign(`${collectionId}.${expiresStr}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function verifyAdminPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const ADMIN_COOKIE_NAME = "admin_session";

export function createAdminToken() {
  const expires = Date.now() + 1000 * 60 * 60 * 12; // 12h
  const signature = sign(`admin.${expires}`);
  return {
    name: ADMIN_COOKIE_NAME,
    value: `${expires}.${signature}`,
    expires: new Date(expires),
  };
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return false;
  const [expiresStr, signature] = token.split(".");
  if (!expiresStr || !signature) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  const expected = sign(`admin.${expiresStr}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export { ADMIN_COOKIE_NAME };
