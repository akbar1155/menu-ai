<template>
  <div class="min-h-screen bg-linear-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
    <!-- Pattern Background -->
    <div class="absolute inset-0 opacity-30"
      style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <!-- Left Column -->
        <div>
          <h1
            class="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-linear-to-r from-white to-white/90 bg-clip-text text-transparent">
            AI yordamida ovqatlanish rejalashtirish oson
          </h1>
          <p class="text-xl text-white/90 mb-8 leading-relaxed">
            MenuAI Google Gemini yordamida shaxsiylashtirilgan haftalik ovqatlanish rejalari va oziq-ovqat ro'yxatlarini
            yaratadi, shunda siz endi nima pishirishni bilmasligingiz kerak emas.
          </p>
          <div class="flex flex-wrap gap-5 mb-10">
            <UButton to="/register" variant="solid" size="xl"
              class="gap-2 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl">
              <UIcon name="i-lucide-rocket" class="w-5 h-5" />
              Boshlash
            </UButton>

          </div>
          <ul class="space-y-3 text-white/95">
            <li class="flex items-center gap-3 text-lg">
              <UIcon name="i-lucide-check-circle-2" class="w-6 h-6 text-green-300" />
              <span>Oilangiz uchun moslashtirilgan haftalik rejalar</span>
            </li>
            <li class="flex items-center gap-3 text-lg">
              <UIcon name="i-lucide-check-circle-2" class="w-6 h-6 text-green-300" />
              <span>Avtomatik oziq-ovqat ro'yxati PDF eksporti</span>
            </li>
            <li class="flex items-center gap-3 text-lg">
              <UIcon name="i-lucide-check-circle-2" class="w-6 h-6 text-green-300" />
              <span>Bepul tarifda har hafta bitta reja</span>
            </li>
          </ul>
        </div>

        <!-- Right Column -->
        <div class="mt-8 md:mt-0">
          <UCard class="bg-white/95 backdrop-blur-lg shadow-2xl">
            <template #header>
              <div class="flex items-center gap-3 text-xl font-bold text-gray-900">
                <UIcon name="i-lucide-calendar" class="w-6 h-6 animate-pulse" />
                <span>Bu hafta</span>
              </div>
            </template>

            <div class="space-y-4">
              <div v-for="(item, index) in preview" :key="index"
                class="p-4 rounded-lg border border-gray-200 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 transition-all hover:translate-x-1 hover:border-blue-200">
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {{ index + 1 }}
                  </div>
                  <h3 class="font-bold text-lg text-gray-900">{{ item.day }}</h3>
                </div>
                <div class="space-y-2 mt-3">
                  <!-- Added .filter() to remove empty strings and .trim() to clean whitespace -->
                  <div v-for="(meal, idx) in item.menu.split(' • ').map(m => m.trim()).filter(m => m)" :key="idx"
                    class="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all">
                    <UIcon name="i-lucide-utensils-crossed" class="w-4 h-4" />
                    <span>{{ meal }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const preview = [
  { day: 'Dushanba', menu: 'Mevali daryo • Grill tovuq salati • Losos va kinua' },
  { day: 'Seshanba', menu: 'Yogurt parfe • Sabzavotli wrap • Turkiya kofte' },
  { day: 'Chorshanba', menu: 'Smoothie kosa • Buddha kosa • Tofu qovurilgan' },
];
</script>
