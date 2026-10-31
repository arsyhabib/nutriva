import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    // Mesin inti harus murni: uji berjalan tanpa DOM dan tanpa jaringan (INV-09, INV-11).
  },
});
