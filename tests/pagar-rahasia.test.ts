import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/** Pemindai kebocoran rahasia: tidak ada kunci API atau token di berkas yang akan dikomit. */
const POLA = [/sk-or-v1-[0-9a-f]{16,}/i, /sk-ant-[A-Za-z0-9_-]{16,}/, /sk-[A-Za-z0-9]{32,}/, /AKIA[0-9A-Z]{16}/, /ghp_[A-Za-z0-9]{30,}/, /Bearer\s+[A-Za-z0-9._-]{30,}/];
const ABAIKAN = new Set(["node_modules", "dist", ".git", "coverage", ".wrangler"]);

function berkas(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    if (ABAIKAN.has(n)) return [];
    const p = join(dir, n);
    const s = statSync(p);
    return s.isDirectory() ? berkas(p) : s.size < 2_000_000 && /\.(ts|js|json|md|toml|html|css|yml|yaml|txt|py)$/.test(n) ? [p] : [];
  });
}

describe("pagar rahasia", () => {
  it("tidak ada kunci/token di berkas teks proyek", () => {
    for (const p of berkas(".")) {
      const t = readFileSync(p, "utf8");
      for (const re of POLA) expect(re.test(t), `${p} cocok ${re}`).toBe(false);
    }
  });
  it(".gitignore mengecualikan .dev.vars dan .wrangler", () => {
    const g = readFileSync(".gitignore", "utf8");
    expect(g).toContain(".dev.vars");
    expect(g).toContain(".wrangler/");
  });
  it("wrangler.toml tidak memuat kunci", () => {
    const t = readFileSync("wrangler.toml", "utf8");
    expect(t).not.toMatch(/OPENROUTER_API_KEY\s*=/);
  });
});
