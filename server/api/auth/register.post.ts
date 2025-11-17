// server/api/auth/register.post.ts
import { serverSupabaseClient } from "#supabase/server";
import { createError } from "h3";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  // 1️⃣ Body ni o‘qish
  const body = await readBody(event);
  const { name, phone, password, confirm } = body;
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

  // 4️⃣ Telefon orqali ro'yxatdan o'tish
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: {
      data: {
        name,
        phone,
        full_name: name,
      },
    },
  });

  if (error) {
    // Telefon auth yoqilmagan yoki boshqa xato
    throw createError({
      statusCode: 400,
      statusMessage: error.message || "Ro'yxatdan o'tishda xatolik yuz berdi",
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
    },
    create: {
      supabaseId: data.user.id,
      name,
    },
  });

  return {
    user: data.user,
    session: data.session,
  };
});
