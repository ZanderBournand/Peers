import { configDefaults, defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig(() => {
  return {
    test: {
      globals: true,
      exclude: [...configDefaults.exclude, "**/e2e/**"],
      alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
      setupFiles: ["dotenv/config"],
    },
  };
});
