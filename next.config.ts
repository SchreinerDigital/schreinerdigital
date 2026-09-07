import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Allow pages/routes to be authored as .md / .mdx in addition to the usual extensions.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async redirects() {
    return [
      {
        // E-Rechnung moved from Digitalisierung to Betrieb & Recht (it's a legal
        // obligation, not a software choice) – keep the old URL working.
        source: "/digitalisierung/e-rechnung",
        destination: "/betrieb-und-recht/e-rechnung",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  // Compile both .md and .mdx files.
  extension: /\.mdx?$/,
  options: {
    // Plugin names are passed as strings so they also work with Turbopack
    // (functions cannot be serialized into the Rust-based pipeline).
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
