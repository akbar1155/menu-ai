import { createError } from "h3";
import { useRuntimeConfig } from "#imports";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../utils/prisma";

export type GeminiMealPlanInput = {
  peopleCount: number;
  dietaryPref: "NORMAL" | "DIET" | "KIDS";
  allergies: string[];
};

type GeminiMealPlan = {
  mealPlan: Array<{
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  }>;
  groceryList: Array<{
    category: string;
    items: string[];
  }>;
  notes?: string;
};

const MODEL = "gemini-1.5-pro";

const dietaryMap: Record<GeminiMealPlanInput["dietaryPref"], string> = {
  NORMAL: "Standard balanced meals",
  DIET: "Lower calorie, macro-balanced meals",
  KIDS: "Kid-friendly meals with simple flavours",
};

function getGeminiClient(apiKey?: string) {
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gemini API key missing. Set GEMINI_API_KEY.",
    });
  }
  return new GoogleGenerativeAI(apiKey);
}

function extractJsonBlock(text: string) {
  const match = text.match(/```json([\s\S]*?)```/);
  if (match) {
    return match[1];
  }
  return text;
}

function normaliseMealPlan(payload: GeminiMealPlan) {
  if (!payload.mealPlan || payload.mealPlan.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gemini returned an empty meal plan.",
    });
  }

  const days = payload.mealPlan.slice(0, 7).map((day, index) => ({
    day: day.day || `Day ${index + 1}`,
    meals: {
      breakfast: day.breakfast,
      lunch: day.lunch,
      dinner: day.dinner,
    },
  }));

  const grocery = payload.groceryList?.flatMap((section) =>
    section.items.map((item) => `${section.category ?? "General"}: ${item}`)
  );

  return {
    days,
    groceryList: grocery ?? [],
  };
}

export async function generateMealPlan(input: GeminiMealPlanInput) {
  const config = useRuntimeConfig();
  // Debug: log Gemini API key
  console.log(
    "GEMINI_API_KEY from runtimeConfig:",
    config.geminiApiKey
      ? `${config.geminiApiKey.substring(0, 10)}...`
      : "NOT SET"
  );
  console.log(
    "GEMINI_API_KEY from process.env:",
    process.env.GEMINI_API_KEY
      ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...`
      : "NOT SET"
  );
  // Use runtimeConfig (which uses import.meta.env in nuxt.config.ts) or fallback to process.env
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;
  const client = getGeminiClient(apiKey);
  const model = client.getGenerativeModel({ model: MODEL });

  const prompt = `You are MenuAI, an expert meal planner. Create a 7 day meal plan with breakfast, lunch, and dinner.
People: ${input.peopleCount}
Dietary preference: ${dietaryMap[input.dietaryPref]}
Allergies to avoid: ${
    input.allergies.length ? input.allergies.join(", ") : "None"
  }

Return ONLY valid JSON in the shape:
{
  "mealPlan": [
    {
      "day": "Monday",
      "breakfast": "...",
      "lunch": "...",
      "dinner": "..."
    }
  ],
  "groceryList": [
    {
      "category": "Produce",
      "items": ["Broccoli", "Lettuce"]
    }
  ],
  "notes": "Optional quick tip"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed: GeminiMealPlan;
  try {
    parsed = JSON.parse(extractJsonBlock(text));
  } catch (error) {
    console.error("Gemini parse error", text);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to parse Gemini response",
    });
  }

  return {
    raw: parsed,
    normalised: normaliseMealPlan(parsed),
    model: MODEL,
  };
}

export async function shouldThrottlePlans(userId: string, isPro: boolean) {
  if (isPro) return false;

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const count = await prisma.mealPlan.count({
    where: {
      userId,
      createdAt: { gte: sevenDaysAgo },
    },
  });

  return count >= 1;
}
