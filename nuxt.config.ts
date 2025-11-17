// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "pathe";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  // Module order matters: Nuxt UI should be first
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxtjs/supabase"],

  // Explicitly enable pages directory (required for Nuxt 4)
  pages: true,

  // Pinia configuration
  pinia: {
    storesDirs: ["app/stores"], // Auto-import stores from this directory
  },

  // Auto-imports configuration
  imports: {
    dirs: ["app/stores"], // Auto-import store files
    // Pinia auto-imports are handled by @pinia/nuxt
    // defineStore, storeToRefs, etc. are automatically available
  },

  css: [resolve("./app/assets/styles/main.css")],
  app: {
    head: {
      title: "MenuAI – Smart Meal Planner",
      meta: [
        {
          name: "description",
          content:
            "AI-powered weekly meal planning with automatic grocery lists.",
        },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  runtimeConfig: {
    // Server-side: Nitro reads all env vars from process.env
    // For server-only vars, use without NUXT_PUBLIC_ prefix
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    supabaseServiceRoleKey: process.env.NITRO_SUPABASE_SERVICE_ROLE_KEY || "",
    databaseUrl: process.env.NITRO_DATABASE_URL || "",

    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3000",
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
      proPriceId: process.env.NUXT_PUBLIC_PRO_PRICE_ID || "price_pro_mock",
      // @nuxtjs/supabase module expects config.public.supabase.url and config.public.supabase.key
      supabase: {
        url: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
        key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
    },
  },
  build: {
    // Nuxt UI handles its own transpilation
  },
  supabase: {
    redirect: false,
    // Note: Missing URL/key warnings are expected when Supabase is not configured.
    // The app works without Supabase - see patches/@nuxtjs+supabase+2.0.1.patch
  },
  nitro: {
    preset: process.env.NITRO_PRESET || undefined,
    // Explicitly load .env file for Nitro
    experimental: {
      wasm: true,
    },
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },
  routeRules: {
    "/**": { ssr: true },
  },
  vite: {
    resolve: {
      alias: {
        "@assets": resolve("./app/assets"),
      },
    },
  },
});
