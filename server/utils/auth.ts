import { H3Event, createError, getHeader } from "h3";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { prisma } from "./prisma";

export async function requireUser(event: H3Event) {
  // Method 1: Try serverSupabaseUser first (this reads from cookies automatically)
  let user = await serverSupabaseUser(event);
  
  // Method 2: If no user, try getSession from client
  if (!user) {
    const supabase = await serverSupabaseClient(event);
    const { data: { session } } = await supabase.auth.getSession();
    user = session?.user || null;
  }
  
  // Method 3: If still no user, try getUser (reads from Authorization header or cookies)
  if (!user) {
    const supabase = await serverSupabaseClient(event);
    const { data: { user: clientUser } } = await supabase.auth.getUser();
    user = clientUser || null;
  }

  if (!user) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: "Unauthorized - Iltimos, qayta login qiling" 
    });
  }

  // Check if user.id exists
  if (!user.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "User ID not found in session",
    });
  }

  const profile = await prisma.userProfile.upsert({
    where: { supabaseId: user.id },
    update: {},
    create: {
      supabaseId: user.id,
      name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
      email: user.user_metadata?.email ?? user.email ?? undefined,
    },
  });

  return { user, profile };
}

export type RequireUserResult = Awaited<ReturnType<typeof requireUser>>;
