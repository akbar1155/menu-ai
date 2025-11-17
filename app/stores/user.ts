import { defineStore } from "pinia";

type MealSlot = "breakfast" | "lunch" | "dinner";

type MealPlanDay = {
  date: string;
  meals: Record<MealSlot, string>;
};

type MealPlan = {
  id: string;
  weekOf: string;
  peopleCount: number;
  dietaryPref: string;
  allergies: string[];
  meals: MealPlanDay[];
  groceryList: string[];
  createdAt: string;
};

type SubscriptionStatus = "FREE" | "ACTIVE" | "CANCELED";

type UserProfile = {
  id: string;
  name?: string;
  peopleCount: number;
  dietaryPref: string;
  allergies: string[];
  isPro: boolean;
  subscriptionStatus: SubscriptionStatus;
};

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: null as UserProfile | null,
    latestPlan: null as MealPlan | null,
    isLoadingProfile: false,
    isLoadingPlan: false,
  }),
  getters: {
    isPro: (state) => state.profile?.isPro ?? false,
  },
  actions: {
    async fetchProfile() {
      this.isLoadingProfile = true;
      try {
        const data = await $fetch<UserProfile>("/api/profile");
        this.profile = data;
      } finally {
        this.isLoadingProfile = false;
      }
    },
    async updateProfile(payload: Partial<UserProfile>) {
      this.isLoadingProfile = true;
      try {
        const data = await $fetch<UserProfile>("/api/profile", {
          method: "PUT",
          body: payload,
        });
        this.profile = data;
      } finally {
        this.isLoadingProfile = false;
      }
    },
    async fetchLatestPlan() {
      this.isLoadingPlan = true;
      try {
        const data = await $fetch<MealPlan>("/api/mealplans/latest");
        this.latestPlan = data;
      } catch (error) {
        if ((error as { statusCode?: number }).statusCode !== 404) {
          console.error(error);
        } else {
          this.latestPlan = null;
        }
      } finally {
        this.isLoadingPlan = false;
      }
    },
  },
});
