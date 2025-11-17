import { createError } from "h3";
import { requireUser } from "../utils/auth";
import { prisma } from "../utils/prisma";

interface ProfilePayload {
  name?: string;
  peopleCount?: number;
  dietaryPref?: "NORMAL" | "DIET" | "KIDS";
  allergies?: string[];
}

export default defineEventHandler(async (event) => {
  const { profile } = await requireUser(event);
  const body = (await readBody<ProfilePayload>(event)) ?? {};

  if (
    body.peopleCount !== undefined &&
    (body.peopleCount < 1 || body.peopleCount > 10)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "People count must be between 1 and 10",
    });
  }

  const updated = await prisma.userProfile.update({
    where: { id: profile.id },
    data: {
      name: body.name ?? profile.name,
      peopleCount: body.peopleCount ?? profile.peopleCount,
      dietaryPref: body.dietaryPref ?? profile.dietaryPref,
      allergies: body.allergies ?? profile.allergies,
    },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { userId: profile.id },
  });

  return {
    id: updated.id,
    name: updated.name,
    peopleCount: updated.peopleCount,
    dietaryPref: updated.dietaryPref,
    allergies: updated.allergies,
    isPro: updated.isPro,
    subscriptionStatus: subscription?.status ?? "FREE",
  };
});
