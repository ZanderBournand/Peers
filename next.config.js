/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    domains: ["github.githubassets.com", "upload.wikimedia.org"],
  },
  // Add other configurations here as needed.
};

export default nextConfig;
