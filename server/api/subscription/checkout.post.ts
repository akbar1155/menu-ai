import { useRuntimeConfig } from "#imports";
import { requireUser } from "../../utils/auth";
import { prisma } from "../../utils/prisma";

type CheckoutPayload = {
  priceId?: string;
};

function addMonth(date: Date) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
}

export default defineEventHandler(async (event) => {
  const { profile } = await requireUser(event);
  const body = (await readBody<CheckoutPayload>(event)) ?? {};

  const config = useRuntimeConfig();
  const priceId = body.priceId ?? config.public.proPriceId ?? "price_pro_mock";

  const now = new Date();
  const currentPeriodEnd = addMonth(now);

  await prisma.subscription.upsert({
    where: { userId: profile.id },
    update: {
      status: "ACTIVE",
      priceId,
      currentPeriodEnd,
    },
    create: {
      userId: profile.id,
      status: "ACTIVE",
      priceId,
      currentPeriodEnd,
    },
  });

  await prisma.userProfile.update({
    where: { id: profile.id },
    data: {
      isPro: true,
      proSince: now,
      proExpiresAt: currentPeriodEnd,
    },
  });

  return {
    checkoutUrl: `${
      config.public.appUrl
    }/subscription/confirmation?session=mock-${Date.now()}`,
    status: "ACTIVE",
    currentPeriodEnd,
  };
});
