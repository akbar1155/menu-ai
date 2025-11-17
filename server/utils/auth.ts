import { H3Event, createError } from "h3";
import { serverSupabaseUser } from "#supabase/server";
import { prisma } from "./prisma";

export async function requireUser(event: H3Event) {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const profile = await prisma.userProfile.upsert({
    where: { supabaseId: user.id },
    update: {},
    create: {
      supabaseId: user.id,
      name: user.user_metadata?.full_name ?? undefined,
    },
  });

  return { user, profile };
}

export type RequireUserResult = Awaited<ReturnType<typeof requireUser>>;
