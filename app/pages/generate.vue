<template>
  <div class="generate p-4 sm:p-6 bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 min-h-screen">
    <div class="mb-6 sm:mb-8">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h2 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Ovqat rejasi yaratish ✨</h2>
        <p class="text-gray-600 text-base sm:text-lg">AI yordamida shaxsiy haftalik ovqat rejangizni yarating</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Form -->
      <UCard class="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <template #header>
          <div class="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 -m-6 mb-4 p-4 rounded-t-xl">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
              <UIcon name="i-lucide-settings" class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800">Reja parametrlari</h3>
          </div>
        </template>

        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          :title="error"
          icon="i-lucide-alert-circle"
          class="mb-4"
          @close="error = ''"
        />

        <form @submit.prevent="onSubmit" class="space-y-5">
          <UFormGroup label="👥 Kishi soni" name="peopleCount">
            <UInput
              v-model.number="form.peopleCount"
              type="number"
              :min="1"
              :max="10"
              size="lg"
              class="rounded-xl"
            />
          </UFormGroup>

          <UFormGroup label="🍽️ Ovqat turi" name="dietaryPref">
            <USelect
              v-model="form.dietaryPref"
              :options="dietaryOptions"
              :disabled="!store.isPro"
              size="lg"
              class="rounded-xl"
            />
            <div v-if="!store.isPro" class="mt-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
              <p class="text-sm text-orange-700 flex items-center gap-2">
                <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
                Pro obunaga o'ting va dieta va bolalar uchun rejalarni oching
              </p>
            </div>
          </UFormGroup>

          <UFormGroup label="⚠️ Allergiya (vergul bilan ajratilgan, ixtiyoriy)" name="allergies">
            <UInput
              v-model="form.allergies"
              placeholder="yong'oq, gluten"
              size="lg"
              class="rounded-xl"
            />
          </UFormGroup>

          <div class="space-y-3 pt-2">
            <UButton
              type="submit"
              :loading="loading"
              color="primary"
              size="xl"
              block
              icon="i-lucide-sparkles"
              class="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl cursor-pointer"
            >
              Ovqat rejasini yaratish
            </UButton>
            <NuxtLink v-if="!store.isPro" to="/subscription">
              <UButton color="orange" variant="soft" size="lg" block icon="i-lucide-crown" class="shadow-md hover:shadow-lg transition-all duration-300 rounded-xl cursor-pointer">
                Pro obunaga o'tish – 9,900 UZS
              </UButton>
            </NuxtLink>
          </div>
        </form>
      </UCard>

      <!-- Natija -->
      <UCard class="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <template #header>
          <div class="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-4 p-4 rounded-t-xl">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <UIcon name="i-lucide-file-text" class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800">Yaratilgan reja</h3>
          </div>
        </template>

        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
              <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-blue-600" />
            </div>
            <p class="text-gray-600">Reja yaratilmoqda...</p>
          </div>
        </div>

        <div v-else-if="latest" class="space-y-5">
          <div class="flex gap-4 p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl">
            <div class="flex-1 text-center p-3 bg-white rounded-lg shadow-sm">
              <div class="text-2xl mb-1">👥</div>
              <div class="text-sm text-gray-600">Kishi</div>
              <div class="font-bold text-gray-900">{{ latest.peopleCount }}</div>
            </div>
            <div class="flex-1 text-center p-3 bg-white rounded-lg shadow-sm">
              <div class="text-2xl mb-1">🍽️</div>
              <div class="text-sm text-gray-600">Tur</div>
              <div class="font-bold text-gray-900">{{ getDietaryPrefLabel(latest.dietaryPref) }}</div>
            </div>
          </div>

          <div class="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            <div v-for="day in latest.meals" :key="day.day" class="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl p-4 border border-blue-100/50 hover:shadow-md transition-all duration-300">
              <h4 class="text-lg font-semibold mb-3 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                {{ day.day }}
              </h4>
              <div class="space-y-2">
                <div class="flex items-start gap-3 bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors">
                  <span class="text-xl">🌅</span>
                  <div class="flex-1">
                    <span class="text-orange-600 font-semibold text-sm block mb-1">Nonushta</span>
                    <span class="text-gray-700 text-sm">{{ day.meals.breakfast }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-3 bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors">
                  <span class="text-xl">☀️</span>
                  <div class="flex-1">
                    <span class="text-yellow-600 font-semibold text-sm block mb-1">Tushlik</span>
                    <span class="text-gray-700 text-sm">{{ day.meals.lunch }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-3 bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors">
                  <span class="text-xl">🌙</span>
                  <div class="flex-1">
                    <span class="text-purple-600 font-semibold text-sm block mb-1">Kechki ovqat</span>
                    <span class="text-gray-700 text-sm">{{ day.meals.dinner }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <UButton
            @click="navigateTo('/dashboard')"
            color="primary"
            size="xl"
            block
            icon="i-lucide-arrow-right"
            class="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl"
          >
            Dashboard'da ko'rish
          </UButton>
        </div>

        <div v-else class="text-center py-16">
          <div class="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
            <UIcon name="i-lucide-file-text" class="w-10 h-10 text-gray-400" />
          </div>
          <p class="text-gray-600 text-lg">Formani to'ldiring va birinchi rejangizni yarating</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const store = useUserStore();
const loading = ref(false);
const error = ref('');
const latest = computed(() => store.latestPlan);
const form = reactive({
  peopleCount: 2,
  dietaryPref: 'NORMAL',
  allergies: '',
});

const dietaryOptions = [
  { label: 'Oddiy', value: 'NORMAL' },
  { label: 'Dieta', value: 'DIET' },
  { label: 'Bolalar uchun', value: 'KIDS' },
];

definePageMeta({ middleware: 'auth' });

onMounted(async () => {
  if (!store.profile) {
    await store.fetchProfile();
  }
  form.peopleCount = store.profile?.peopleCount ?? 2;
  form.dietaryPref = store.profile?.dietaryPref ?? 'NORMAL';
  if (!store.latestPlan) {
    await store.fetchLatestPlan().catch(() => {});
  }
});

const getDietaryPrefLabel = (pref: string) => {
  const labels: Record<string, string> = {
    NORMAL: 'Oddiy',
    DIET: 'Dieta',
    KIDS: 'Bolalar uchun'
  };
  return labels[pref] || pref;
};

const onSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    const payload = {
      peopleCount: form.peopleCount,
      dietaryPref: store.isPro ? form.dietaryPref : 'NORMAL',
      allergies: form.allergies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };
    await $fetch('/api/mealplans/generate', {
      method: 'POST',
      body: payload,
    });
    await store.fetchLatestPlan();
  } catch (err: any) {
    const errorMsg = err?.data?.statusMessage || err?.message || 'Ovqat rejasi yaratishda xatolik yuz berdi';
    if (errorMsg.includes('Free plan allows')) {
      error.value = 'Bepul rejada haftada faqat bitta reja yaratish mumkin. Pro obunaga o\'ting.';
    } else {
      error.value = errorMsg;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.generate {
  max-width: 1400px;
  margin: 0 auto;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #6366f1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #4f46e5);
}
</style>
