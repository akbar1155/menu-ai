// server/api/auth/register.post.ts
import { serverSupabaseClient } from "#supabase/server";
import { createError } from "h3";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  // 1️⃣ Body ni o'qish
  const body = await readBody(event);
  const { name, phone, email, password, confirm } = body;
  const config = useRuntimeConfig();

  // 2️⃣ Input validation
  if (!name || !phone || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Barcha maydonlar to'ldirilishi shart",
    });
  }

  if (password !== confirm) {
    throw createError({
      statusCode: 400,
      statusMessage: "Parollar mos kelmaydi",
    });
  }

  // 3️⃣ Supabase server client yaratish (returns Promise, so we need await)
  const supabase = await serverSupabaseClient(event);

  // 4️⃣ Email yoki telefon orqali ro'yxatdan o'tish
  // Agar email bo'lsa, uni asosiy email sifatida ishlatamiz
  // Agar email bo'lmasa, telefon raqamni email formatida ishlatamiz
  const emailForAuth =
    email && email.includes("@")
      ? email
      : phone.includes("@")
      ? phone
      : `${phone.replace(/\s+/g, "")}@phone.local`;

  const { data, error } = await supabase.auth.signUp({
    email: emailForAuth, // Email yoki telefon raqam (email formatida)
    password,
    options: {
      emailRedirectTo: `${config.public.appUrl}/dashboard`, // Redirect after email confirmation
      data: {
        name,
        phone, // Store original phone number in metadata
        email: email || null, // Store email in metadata if provided
        full_name: name,
      },
    },
  });

  if (error) {
    // User-friendly error messages in Uzbek
    let errorMessage = error.message || "Ro'yxatdan o'tishda xatolik yuz berdi";

    if (
      error.message === "Email signups are disabled" ||
      error.message === "Email logins are disabled"
    ) {
      errorMessage =
        "Email orqali ro'yxatdan o'tish o'chirilgan. Iltimos, telefon raqamidan foydalaning.";
    } else if (error.message === "User already registered") {
      errorMessage =
        "Bu telefon raqami yoki email allaqachon ro'yxatdan o'tgan";
    } else if (error.message?.includes("Password")) {
      errorMessage =
        "Parol talablarga javob bermaydi. Iltimos, kuchliroq parol kiriting.";
    } else if (error.message?.includes("email")) {
      errorMessage =
        "Email noto'g'ri formatda. Iltimos, to'g'ri email kiriting.";
    }

    throw createError({
      statusCode: 400,
      statusMessage: errorMessage,
    });
  }

  if (!data.user) {
    throw createError({
      statusCode: 400,
      statusMessage: "Foydalanuvchi yaratilmadi",
    });
  }

  // 5️⃣ Prisma bilan user profil yaratish/upsert qilish
  await prisma.userProfile.upsert({
    where: { supabaseId: data.user.id },
    update: {
      name,
      email: email || null,
    },
    create: {
      supabaseId: data.user.id,
      name,
      email: email || null,
    },
  });

  // Email ni metadata'dan olish va qaytarish
  const userWithEmail = {
    ...data.user,
    email: email || data.user.email,
  };

  return {
    user: userWithEmail,
    session: data.session,
  };
});
