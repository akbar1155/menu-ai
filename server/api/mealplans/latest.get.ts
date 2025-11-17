import { createError } from "h3";
import { requireUser } from "../../utils/auth";
import { prisma } from "../../utils/prisma";

function normaliseMeals(meals: any) {
  return Array.isArray(meals)
    ? meals.map((day: any, index: number) => ({
        day: day.day ?? `Day ${index + 1}`,
        meals: {
          breakfast: day.breakfast ?? "",
          lunch: day.lunch ?? "",
          dinner: day.dinner ?? "",
        },
      }))
    : [];
}

function flattenGrocery(list: any) {
  if (!Array.isArray(list)) return [];
  return list.flatMap((section: any) => {
    if (!Array.isArray(section?.items)) return [];
    return section.items.map(
      (item: string) => `${section.category ?? "General"}: ${item}`
    );
  });
}

export default defineEventHandler(async (event) => {
  const { profile } = await requireUser(event);

  const plan = await prisma.mealPlan.findFirst({
    where: { userId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  if (!plan) {
    throw createError({ statusCode: 404, statusMessage: "No meal plan found" });
  }

  return {
    id: plan.id,
    weekOf: plan.weekOf,
    peopleCount: plan.peopleCount,
    dietaryPref: plan.dietaryPref,
    allergies: plan.allergies,
    meals: normaliseMeals(plan.meals),
    groceryList: flattenGrocery(plan.groceryList),
    createdAt: plan.createdAt,
  };
});
