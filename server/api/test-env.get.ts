export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  return {
    message: "Environment Variables Test",
    variables: {
      gemini: {
        fromRuntimeConfig: config.geminiApiKey
          ? `${config.geminiApiKey.substring(0, 15)}...`
          : "NOT SET",
        fromProcessEnv: process.env.GEMINI_API_KEY
          ? `${process.env.GEMINI_API_KEY.substring(0, 15)}...`
          : "NOT SET",
      },
      supabase: {
        url: {
          fromRuntimeConfig: config.public.supabaseUrl || "NOT SET",
          fromProcessEnv: process.env.NUXT_PUBLIC_SUPABASE_URL || "NOT SET",
        },
        anonKey: {
          fromRuntimeConfig: config.public.supabaseKey ? "SET (hidden)" : "NOT SET",
          fromProcessEnv: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
            ? "SET (hidden)"
            : "NOT SET",
        },
        serviceRoleKey: {
          fromRuntimeConfig: config.supabaseServiceRoleKey
            ? "SET (hidden)"
            : "NOT SET",
          fromProcessEnv: process.env.NITRO_SUPABASE_SERVICE_ROLE_KEY
            ? "SET (hidden)"
            : "NOT SET",
        },
      },
      database: {
        fromRuntimeConfig: config.databaseUrl
          ? config.databaseUrl.replace(/:[^:@]+@/, ":***@")
          : "NOT SET",
        fromProcessEnv: process.env.DATABASE_URL
          ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":***@")
          : "NOT SET",
        nitroUrl: process.env.NITRO_DATABASE_URL
          ? process.env.NITRO_DATABASE_URL.replace(/:[^:@]+@/, ":***@")
          : "NOT SET",
      },
    },
  };
});
