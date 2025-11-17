import { serverSupabaseClient } from "#supabase/server";
import { createError } from "h3";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { phone, password } = body;

  if (!phone || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Telefon raqami va parol kiritilishi shart",
    });
  }

  // Format phone number for Supabase (phone stored as phone@phone.local format)
  const phoneForAuth = phone.includes("@")
    ? phone
    : `${phone.replace(/\s+/g, "")}@phone.local`;

  console.log("Login attempt:", { phone, hasPassword: !!password });

  // Get Supabase client (returns Promise, so we need await)
  const supabase = await serverSupabaseClient(event);

  // Sign in with password (Supabase API requires 'phone' parameter, but we use phone number)
  const { data, error } = await supabase.auth.signInWithPassword({
    phone: phoneForAuth, // Supabase API requires 'phone' field, but we pass phone number
    password,
  });

  console.log("Login result:", {
    hasData: !!data,
    hasError: !!error,
    errorMessage: error?.message,
    hasUser: !!data?.user,
  });

  if (error) {
    throw createError({
      statusCode: 401,
      statusMessage: error.message || "Kirishda xatolik yuz berdi",
    });
  }

  if (!data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Foydalanuvchi topilmadi",
    });
  }

  // Ensure user profile exists in database
  await prisma.userProfile.upsert({
    where: { supabaseId: data.user.id },
    update: {},
    create: {
      supabaseId: data.user.id,
      name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
    },
  });

  return {
    user: data.user,
    session: data.session,
  };
});
