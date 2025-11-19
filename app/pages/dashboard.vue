<template>
  <div class="dashboard p-4 sm:p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 min-h-screen">
    <div class="dashboard__header mb-8">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h2 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Xush kelibsiz{{ profile?.name ? `, ${profile.name}` : '' }}! 👋
        </h2>
        <p class="text-gray-600 text-base sm:text-lg">Bu yerda sizning haftalik ovqat rejangiz ko'rsatiladi.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 flex-wrap w-full sm:w-auto">
        <UButton @click="navigateTo('/generate')" color="primary" variant="soft" size="sm" class="sm:size-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer" icon="i-lucide-sparkles">
          <span class="text-sm sm:text-base">Yangi reja yaratish</span>
        </UButton>
        <UButton @click="downloadPdf" :disabled="!plan" color="primary" size="sm" class="sm:size-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer" icon="i-lucide-download">
          <span class="text-sm sm:text-base">Xarid ro'yxatini yuklab olish</span>
        </UButton>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-blue-600" />
    </div>

    <template v-else-if="plan">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 7 kunlik reja -->
        <div class="lg:col-span-2">
          <UCard class="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <template #header>
              <div class="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-4 p-4 rounded-t-xl">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <UIcon name="i-lucide-calendar" class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-xl font-semibold text-gray-800">7 kunlik ovqat rejasi</h3>
              </div>
            </template>
            
            <div class="space-y-4">
              <div v-for="day in plan.meals" :key="day.day" class="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl p-5 border border-blue-100/50 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                  {{ day.day }}
                </h4>
                <div class="space-y-3">
                  <div class="flex items-start gap-3 bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors">
                    <span class="text-2xl">🌅</span>
                    <div>
                      <span class="text-orange-600 font-semibold text-sm block mb-1">Nonushta</span>
                      <span class="text-gray-700">{{ day.meals.breakfast }}</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-3 bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors">
                    <span class="text-2xl">☀️</span>
                    <div>
                      <span class="text-yellow-600 font-semibold text-sm block mb-1">Tushlik</span>
                      <span class="text-gray-700">{{ day.meals.lunch }}</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-3 bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors">
                    <span class="text-2xl">🌙</span>
                    <div>
                      <span class="text-purple-600 font-semibold text-sm block mb-1">Kechki ovqat</span>
                      <span class="text-gray-700">{{ day.meals.dinner }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Xarid ro'yxati va ma'lumotlar -->
        <div class="space-y-6">
          <UCard class="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <template #header>
              <div class="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 -m-6 mb-4 p-4 rounded-t-xl">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <UIcon name="i-lucide-shopping-cart" class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Xarid ro'yxati</h3>
              </div>
            </template>
            
            <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
              <ul class="space-y-2">
                <li v-for="(item, index) in plan.groceryList" :key="index" class="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 hover:shadow-sm group">
                  <span class="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-110 transition-transform">✓</span>
                  <span class="text-gray-700 flex-1">{{ item }}</span>
                </li>
              </ul>
            </div>
          </UCard>

          <UCard class="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <template #header>
              <div class="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 -m-6 mb-4 p-4 rounded-t-xl">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                  <UIcon name="i-lucide-info" class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Reja ma'lumotlari</h3>
              </div>
            </template>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl hover:shadow-sm transition-all">
                <span class="text-gray-600 flex items-center gap-2">👥 <span>Kishi soni:</span></span>
                <span class="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">{{ plan.peopleCount }} kishi</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-xl hover:shadow-sm transition-all">
                <span class="text-gray-600 flex items-center gap-2">🍽️ <span>Ovqat turi:</span></span>
                <span class="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">{{ getDietaryPrefLabel(plan.dietaryPref) }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl hover:shadow-sm transition-all">
                <span class="text-gray-600 flex items-center gap-2">📅 <span>Yaratilgan:</span></span>
                <span class="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">{{ dayjs(plan.createdAt).format('DD.MM.YYYY') }}</span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>

    <UCard v-else class="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/50">
      <div class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
          <UIcon name="i-lucide-utensils-crossed" class="w-12 h-12 text-blue-600" />
        </div>
        <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Hali ovqat rejasi yaratilmagan</h3>
        <p class="text-gray-600 text-lg mb-8">Birinchi ovqat rejangizni yaratish uchun quyidagi tugmani bosing.</p>
        <UButton @click="navigateTo('/generate')" color="primary" size="xl" icon="i-lucide-sparkles" class="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
          Ovqat rejasi yaratish
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useUserStore } from '~/stores/user';

const store = useUserStore();
const loading = computed(() => store.isLoadingPlan || store.isLoadingProfile);
const plan = computed(() => store.latestPlan);
const profile = computed(() => store.profile);

onMounted(async () => {
  if (!store.profile) {
    await store.fetchProfile();
  }
  await store.fetchLatestPlan();
});

definePageMeta({ middleware: 'auth' });

const getDietaryPrefLabel = (pref: string) => {
  const labels: Record<string, string> = {
    NORMAL: 'Oddiy',
    DIET: 'Dieta',
    KIDS: 'Bolalar uchun'
  };
  return labels[pref] || pref;
};

const downloadPdf = async () => {
  if (!plan.value) return;
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('MenuAI - Xarid ro\'yxati', 14, 20);
  doc.setFontSize(12);
  plan.value.groceryList.forEach((item, index) => {
    const y = 30 + index * 8;
    if (y < 280) {
      doc.text(`• ${item}`, 14, y);
    }
  });
  doc.save('menuai-xarid-ro\'yxati.pdf');
};
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
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
