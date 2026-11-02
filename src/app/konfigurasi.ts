/**
 * Konfigurasi waktu-build untuk UI. URL Worker AI datang dari VITE_URL_WORKER_AI; kosong atau tidak valid = AI mati.
 * Hanya https (atau http ke localhost untuk pengembangan) yang diterima.
 */
export function urlWorkerAiValid(mentah: unknown): string | undefined {
  if (typeof mentah !== "string" || mentah.trim() === "") return undefined;
  let u: URL;
  try {
    u = new URL(mentah.trim());
  } catch {
    return undefined;
  }
  const lokal = u.hostname === "localhost" || u.hostname === "127.0.0.1";
  if (u.protocol !== "https:" && !(u.protocol === "http:" && lokal)) return undefined;
  if (u.username || u.password || u.search || u.hash) return undefined;
  return u.origin + u.pathname.replace(/\/+$/, "");
}

export function urlWorkerAiDariEnv(env: Record<string, unknown> | undefined): string | undefined {
  return urlWorkerAiValid(env?.["VITE_URL_WORKER_AI"]);
}
