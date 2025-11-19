import { serverSupabaseClient } from "#supabase/server";
import { createError } from "h3";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { phone, email, password } = body;

  // Determine if input is email or phone
  const input = email || phone;
  const isEmail = input?.includes("@");

  if (!input || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Telefon raqami yoki email va parol kiritilishi shart",
    });
  }

  // Get Supabase client (returns Promise, so we need await)
  const supabase = await serverSupabaseClient(event);

  // Format email or phone for Supabase
  let emailForAuth = "";

  if (isEmail) {
    // Input is email - use it directly
    emailForAuth = input;
  } else {
    // Input is phone - clean phone number (remove +, spaces, dashes)
    const cleanPhone = input.replace(/[\s+\-()]/g, "");
    // Convert to phone@phone.local format
    emailForAuth = `${cleanPhone}@phone.local`;
  }

  console.log("Login attempt:", {
    input,
    isEmail,
    emailForAuth,
    hasPassword: !!password,
  });

  // Try login with formatted email/phone
  let { data, error } = await supabase.auth.signInWithPassword({
    email: emailForAuth,
    password,
  });

  // If login failed with phone format, try with email if user provided email in metadata
  if (error && !isEmail && phone) {
    // Try to find user by email from database
    try {
      const userProfile = await prisma.userProfile.findFirst({
        where: {
          OR: [
            { email: { contains: phone } },
            { supabaseId: { contains: phone } },
          ],
        },
      });

      // If user found with email, try login with that email
      if (userProfile?.email && userProfile.email.includes("@")) {
        const emailResult = await supabase.auth.signInWithPassword({
          email: userProfile.email,
          password,
        });
        if (emailResult.data?.user) {
          data = emailResult.data;
          error = emailResult.error;
        }
      }
    } catch (dbError) {
      // Ignore database errors, continue with original error
      console.log("Database lookup error:", dbError);
    }
  }

  console.log("Login result:", {
    hasData: !!data,
    hasError: !!error,
    errorMessage: error?.message,
    hasUser: !!data?.user,
  });

  if (error) {
    // User-friendly error messages in Uzbek
    let errorMessage = error.message || "Kirishda xatolik yuz berdi";

    // If user is trying to login with phone and gets "Email logins are disabled"
    // This means Supabase is treating phone@phone.local as email
    if (
      (error.message === "Email signups are disabled" ||
        error.message === "Email logins are disabled") &&
      !isEmail
    ) {
      errorMessage =
        "Telefon raqami orqali kirish sozlangan emas. Iltimos, administrator bilan bog'laning.";
    } else if (error.message === "Email not confirmed") {
      errorMessage =
        "Email tasdiqlanmagan. Iltimos, email'ingizni tekshiring va tasdiqlash havolasini bosing.";
    } else if (error.message === "Invalid login credentials") {
      errorMessage =
        "Telefon raqami/email yoki parol noto'g'ri. Iltimos, qayta urinib ko'ring.";
    } else if (
      error.message === "Email signups are disabled" ||
      error.message === "Email logins are disabled"
    ) {
      errorMessage =
        "Email orqali kirish o'chirilgan. Iltimos, telefon raqamidan foydalaning.";
    } else if (error.message?.includes("User not found")) {
      errorMessage = "Foydalanuvchi topilmadi. Iltimos, ro'yxatdan o'ting.";
    } else if (error.message?.includes("Password")) {
      errorMessage = "Parol noto'g'ri. Iltimos, qayta urinib ko'ring.";
    }

    throw createError({
      statusCode: 401,
      statusMessage: errorMessage,
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
