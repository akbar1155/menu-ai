import { createError } from "h3";
import { requireUser } from "../../utils/auth";
import { prisma } from "../../utils/prisma";
import { generateMealPlan, shouldThrottlePlans } from "../../services/gemini";

type GeneratePayload = {
  peopleCount?: number;
  dietaryPref?: "NORMAL" | "DIET" | "KIDS";
  allergies?: string[];
};

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  copy.setDate(diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default defineEventHandler(async (event) => {
  const { profile, user } = await requireUser(event);
  const body = (await readBody<GeneratePayload>(event)) ?? {};

  const payload = {
    peopleCount: body.peopleCount ?? profile.peopleCount ?? 1,
    dietaryPref: body.dietaryPref ?? profile.dietaryPref ?? "NORMAL",
    allergies: body.allergies ?? profile.allergies ?? [],
  } as Required<GeneratePayload>;

  if (payload.peopleCount < 1 || payload.peopleCount > 10) {
    throw createError({
      statusCode: 400,
      statusMessage: "People count must be between 1 and 10",
    });
  }

  if (!profile.isPro) {
    const throttled = await shouldThrottlePlans(profile.id, profile.isPro);
    if (throttled) {
      throw createError({
        statusCode: 429,
        statusMessage:
          "Free plan allows only one meal plan per 7 days. Upgrade to Pro for more.",
      });
    }
  }

  const result = await generateMealPlan({
    peopleCount: payload.peopleCount,
    dietaryPref: payload.dietaryPref,
    allergies: payload.allergies,
  });

  const latestPlan = await prisma.mealPlan.create({
    data: {
      userId: profile.id,
      weekOf: startOfWeek(new Date()),
      peopleCount: payload.peopleCount,
      dietaryPref: payload.dietaryPref,
      allergies: payload.allergies,
      meals: result.raw.mealPlan,
      groceryList: result.raw.groceryList,
      generatedModel: result.model,
    },
  });

  return {
    id: latestPlan.id,
    weekOf: latestPlan.weekOf,
    peopleCount: latestPlan.peopleCount,
    dietaryPref: latestPlan.dietaryPref,
    allergies: latestPlan.allergies,
    meals: result.normalised.days,
    groceryList: result.normalised.groceryList,
    createdAt: latestPlan.createdAt,
  };
});
