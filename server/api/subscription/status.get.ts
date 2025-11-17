import { requireUser } from "../../utils/auth";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const { profile } = await requireUser(event);

  const subscription = await prisma.subscription.findUnique({
    where: { userId: profile.id },
  });

  return {
    isPro: profile.isPro,
    status: subscription?.status ?? "FREE",
    priceId: subscription?.priceId ?? null,
    currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
  };
});
