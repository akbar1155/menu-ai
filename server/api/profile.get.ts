import { requireUser } from "../utils/auth";
import { prisma } from "../utils/prisma";

export default defineEventHandler(async (event) => {
  // Debug: log environment variables
  const config = useRuntimeConfig();
  console.log("=== Environment Variables Debug (Backend) ===");
  console.log(
    "GEMINI_API_KEY (process.env):",
    process.env.GEMINI_API_KEY
      ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...`
      : "NOT SET"
  );
  console.log(
    "GEMINI_API_KEY (runtimeConfig):",
    config.geminiApiKey
      ? `${config.geminiApiKey.substring(0, 10)}...`
      : "NOT SET"
  );
  console.log(
    "NUXT_PUBLIC_SUPABASE_URL (process.env):",
    process.env.NUXT_PUBLIC_SUPABASE_URL || "NOT SET"
  );
  console.log(
    "NUXT_PUBLIC_SUPABASE_URL (runtimeConfig):",
    config.public.supabaseUrl || "NOT SET"
  );
  console.log(
    "NUXT_PUBLIC_SUPABASE_ANON_KEY (process.env):",
    process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT SET"
  );
  console.log(
    "NUXT_PUBLIC_SUPABASE_ANON_KEY (runtimeConfig):",
    config.public.supabaseKey ? "SET" : "NOT SET"
  );
  console.log("==============================================");

  const { profile } = await requireUser(event);

  const subscription = await prisma.subscription.findUnique({
    where: { userId: profile.id },
  });

  return {
    id: profile.id,
    name: profile.name,
    peopleCount: profile.peopleCount,
    dietaryPref: profile.dietaryPref,
    allergies: profile.allergies,
    isPro: profile.isPro,
    subscriptionStatus: subscription?.status ?? "FREE",
  };
});
