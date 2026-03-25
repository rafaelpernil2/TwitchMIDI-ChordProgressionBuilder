import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://loop.twitchmidi.com",
  integrations: [preact(), tailwind()],
  adapter: cloudflare()
});