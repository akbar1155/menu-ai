<template>
  <div class="meal-list p-4 sm:p-6 bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30 min-h-screen">
    <div class="mb-6 sm:mb-8">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h2 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">Ovqatlar ro'yxati 🍽️</h2>
        <p class="text-gray-600 text-base sm:text-lg">Halal taomlar retseptlari va mahsulotlar ro'yxati</p>
      </div>
            </div>

    <!-- Qidiruv va filtrlash -->
    <UCard class="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <div class="flex flex-col md:flex-row gap-4">
        <!-- Qidiruv -->
        <div class="flex-1">
          <UInput
            v-model="searchTerm"
            placeholder="Taom yoki mahsulot qidiring..."
            icon="i-lucide-search"
            size="lg"
          />
                    </div>

        <!-- Kategoriya filtri -->
        <div class="w-full md:w-64">
          <USelect
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="Kategoriya tanlang"
            size="lg"
          />
                    </div>
                </div>

      <!-- Statistika -->
      <div class="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <UIcon name="i-lucide-utensils-crossed" class="w-5 h-5" />
                    <span>{{ filteredFoods.length }} ta taom topildi</span>
                </div>
    </UCard>

    <!-- Ovqatlar ro'yxati -->
    <div v-if="filteredFoods.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="food in filteredFoods"
        :key="food.id"
        class="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-0 bg-white/90 backdrop-blur-sm shadow-lg"
      >
                    <!-- Card Header -->
        <div class="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-5 -m-6 mb-5 rounded-t-xl shadow-md">
          <h3 class="text-xl font-bold text-white mb-3">{{ food.name }}</h3>
          <span class="inline-block bg-white/30 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full font-medium shadow-sm">
                            {{ food.category }}
                        </span>
                    </div>

                    <!-- Card Body -->
        <div>
          <!-- Tezkor ma'lumotlar -->
          <div class="grid grid-cols-3 gap-2 mb-5">
            <div class="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition-all duration-300">
              <UIcon name="i-lucide-clock" class="w-5 h-5 mx-auto text-orange-600 mb-1.5" />
              <p class="text-xs text-orange-800 font-semibold">{{ food.prepTime }}</p>
                            </div>
            <div class="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl hover:shadow-md transition-all duration-300">
              <UIcon name="i-lucide-users" class="w-5 h-5 mx-auto text-green-600 mb-1.5" />
              <p class="text-xs text-green-800 font-semibold">{{ food.servings }}</p>
                            </div>
            <div class="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl hover:shadow-md transition-all duration-300">
              <UIcon name="i-lucide-flame" class="w-5 h-5 mx-auto text-purple-600 mb-1.5" />
              <p class="text-xs text-purple-800 font-semibold">{{ food.calories }}</p>
                            </div>
                        </div>

          <!-- Mahsulotlar -->
          <div class="mb-5">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
              <UIcon name="i-lucide-list" class="w-4 h-4 text-gray-600" />
              <span>Mahsulotlar:</span>
                            </h4>
            <p class="text-sm text-gray-600 line-clamp-3 leading-relaxed">{{ food.ingredients }}</p>
                        </div>

          <!-- Batafsil ko'rish tugmasi -->
          <UButton
            @click="expandedId = expandedId === food.id ? null : food.id"
            color="primary"
            variant="soft"
            block
            :icon="expandedId === food.id ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            {{ expandedId === food.id ? 'Yopish' : 'Batafsil ko\'rish' }}
          </UButton>

          <!-- Kengaytirilgan kontent -->
          <div v-if="expandedId === food.id" class="mt-5 pt-5 border-t border-gray-200 animate-fadeIn bg-gradient-to-br from-gray-50/50 to-slate-50/50 rounded-xl p-4">
            <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UIcon name="i-lucide-list" class="w-4 h-4" />
              To'liq mahsulotlar ro'yxati:
            </h4>
            <p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{{ food.ingredients }}</p>
                        </div>
                    </div>
      </UCard>
            </div>

    <!-- Natija topilmadi -->
    <UCard v-else class="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50/50">
      <div class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-lg">
          <UIcon name="i-lucide-search-x" class="w-12 h-12 text-orange-500" />
        </div>
        <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Hech narsa topilmadi</h3>
        <p class="text-gray-600 text-lg">Boshqa kalit so'zlar bilan qidirib ko'ring</p>
      </div>
    </UCard>
    </div>
</template>

<script setup lang="ts">
const searchTerm = ref('');
const selectedCategory = ref('Hammasi');
const expandedId = ref<string | null>(null);

const foods = [
    // O'zbek taomlari
    { id: 1, name: "Osh", category: "O'zbek taomlari", ingredients: "Devzira guruchi 500g, qo'y go'shti 700g, sabzi 300g, piyoz 400g, o'simlik yog'i 200ml, zira 2 osh qoshiq, barberys 1 osh qoshiq, sarimsoq 1 bosh, qora murch, qizil murch, tuz", prepTime: "90 daqiqa", servings: "6 kishi", calories: "450 kcal" },
    { id: 2, name: "Somsa", category: "O'zbek taomlari", ingredients: "Yuqori navli un 1kg, qo'y go'shti 600g, qo'y dumi yog'i 200g, piyoz 500g, zira 1 choy qoshiq, qora murch, tuz, sovuq suv 400ml, tuxum sarig'i 2 dona (20-25 dona somsa)", prepTime: "60 daqiqa", servings: "6-8 kishi", calories: "320 kcal" },
    { id: 3, name: "Lag'mon", category: "O'zbek taomlari", ingredients: "Yuqori navli un 500g, mol go'shti 400g, pomidor 300g, baqlajon 2 dona, bulg'ori qalampir 2 dona, piyoz 2 dona, sarimsoq 5 tish, tuxum 1 dona, sirka 1 osh qoshiq, zeera, badyon, qora murch, tuz, ko'kat", prepTime: "45 daqiqa", servings: "4 kishi", calories: "380 kcal" },
    { id: 4, name: "Manti", category: "O'zbek taomlari", ingredients: "Yuqori navli un 800g, mol yoki qo'y go'shti 700g, piyoz 600g, qora murch 1 choy qoshiq, zira 1 choy qoshiq, tuz, tuxum 2 dona, sovuq suv 300ml, sariyog' 100g", prepTime: "70 daqiqa", servings: "6 kishi", calories: "350 kcal" },
    { id: 5, name: "Shurva", category: "O'zbek taomlari", ingredients: "Qo'y go'shti (suyakli) 800g, kartoshka 500g, sabzi 300g, piyoz 300g, pomidor 300g, bulg'ori qalampir 2 dona, lavlagi 100g, ko'kat (rayhon, ukrop, jambil) 1 bog', tuz, qora murch", prepTime: "50 daqiqa", servings: "5-6 kishi", calories: "280 kcal" },
    { id: 6, name: "Norin", category: "O'zbek taomlari", ingredients: "At go'shti (yoki mol go'shti) 1kg, yuqori navli un 500g, tuxum 3 dona, piyoz 400g, qora murch, tuz, sirka 50ml, kok piyoz, jambil", prepTime: "80 daqiqa", servings: "6-8 kishi", calories: "400 kcal" },
    { id: 7, name: "Chuchvara", category: "O'zbek taomlari", ingredients: "Yuqori navli un 600g, qo'y go'shti 500g, piyoz 300g, tuxum 2 dona, qora murch, zira, tuz, ko'kat (ukrop, rayhon), sariyog' 80g, sovuq suv 250ml", prepTime: "60 daqiqa", servings: "5-6 kishi", calories: "310 kcal" },
    { id: 8, name: "Dimlama", category: "O'zbek taomlari", ingredients: "Qo'y go'shti 1kg, kartoshka 800g, sabzi 400g, piyoz 500g, bodring 3 dona, pomidor 400g, baqlajon 3 dona, bulg'ori qalampir 4 dona, kabak 2 dona, sarimsoq 1 bosh, ko'kat, tuz, qora murch", prepTime: "90 daqiqa", servings: "6-8 kishi", calories: "360 kcal" },
    { id: 9, name: "Mastava", category: "O'zbek taomlari", ingredients: "Qo'y go'shti 600g, guruch 300g, qatiq 500ml, kartoshka 300g, sabzi 200g, piyoz 250g, pomidor 200g, o'simlik yog'i 100ml, ko'kat, tuz, qora murch, qizil murch", prepTime: "55 daqiqa", servings: "5 kishi", calories: "340 kcal" },
    { id: 10, name: "Qozon kabob", category: "O'zbek taomlari", ingredients: "Qo'y go'shti 1.5kg, qo'y dumi yog'i 300g, piyoz 1kg, kartoshka 1kg, pomidor 500g, bulg'ori qalampir 5 dona, zira 2 osh qoshiq, qora murch, tuz, ko'kat", prepTime: "40 daqiqa", servings: "8-10 kishi", calories: "420 kcal" },
    { id: 11, name: "Tandir kabob", category: "O'zbek taomlari", ingredients: "Qo'y go'shti (qovurg'a) 1.5kg, piyoz 500g, sirka 100ml, zira 1 osh qoshiq, qora murch 1 choy qoshiq, qizil murch 1 choy qoshiq, tuz, sarimsoq 5 tish", prepTime: "50 daqiqa", servings: "4-5 kishi", calories: "380 kcal" },
    { id: 12, name: "Jiz", category: "O'zbek taomlari", ingredients: "Qo'y ingichka ichagi 2m, qo'y go'shti 500g, qo'y jigari 300g, guruch 200g, piyoz 300g, qo'y yog'i 200g, zira, qora murch, tuz", prepTime: "120 daqiqa", servings: "6-8 kishi", calories: "460 kcal" },
    { id: 13, name: "Xonim", category: "O'zbek taomlari", ingredients: "Yuqori navli un 500g, qo'y go'shti 600g, piyoz 500g, tuxum 3 dona, qora murch, zira, tuz, sovuq suv 200ml, sariyog' 100g", prepTime: "75 daqiqa", servings: "6 kishi", calories: "390 kcal" },
    { id: 14, name: "Barak", category: "O'zbek taomlari", ingredients: "Yuqori navli un 400g, qo'y go'shti 400g, piyoz 300g, qatiq 400ml, tuxum 2 dona, sarimsoq 5 tish, zira, qora murch, tuz, ko'kat", prepTime: "65 daqiqa", servings: "4-5 kishi", calories: "330 kcal" },
    { id: 15, name: "Shashlik", category: "O'zbek taomlari", ingredients: "Qo'y go'shti (orqa qism) 2kg, piyoz 1kg, sirka 150ml, qora murch 1 osh qoshiq, zira 1 osh qoshiq, tuz, sarimsoq 7 tish", prepTime: "30 daqiqa", servings: "6-8 kishi", calories: "400 kcal" },

    // Turk taomlari
    { id: 16, name: "Kebab", category: "Turk taomlari", ingredients: "Mol go'shti (qiyma) 1kg, piyoz 500g, maydanoz 1 bog', qora murch 1 choy qoshiq, qizil murch 1 choy qoshiq, kimyon 1 choy qoshiq, tuz, sarimsoq 5 tish", prepTime: "25 daqiqa", servings: "4-5 kishi", calories: "350 kcal" },
    { id: 17, name: "Lahmacun", category: "Turk taomlari", ingredients: "Yuqori navli un 500g, qiyma go'sht 400g, pomidor 300g, piyoz 200g, bulg'ori qalampir 2 dona, maydanoz 1 bog', pomidor pastasi 2 osh qoshiq, kimyon, sumak, qora murch, tuz, xamirturush 10g, shakar 1 choy qoshiq, iliq suv 250ml", prepTime: "35 daqiqa", servings: "6 kishi", calories: "290 kcal" },
    { id: 18, name: "Pide", category: "Turk taomlari", ingredients: "Yuqori navli un 600g, pishloq 300g, qiyma go'sht 400g, tuxum 3 dona, piyoz 200g, pomidor 2 dona, xamirturush 15g, shakar 1 choy qoshiq, sariyog' 50g, iliq sut 200ml, tuz", prepTime: "40 daqiqa", servings: "4-6 kishi", calories: "380 kcal" },
    { id: 19, name: "Döner", category: "Turk taomlari", ingredients: "Tovuq go'shti yoki mol go'shti 1kg, yogurt 200ml, pomidor pastasi 2 osh qoshiq, zira 1 choy qoshiq, kimyon, qora murch, qizil murch, tuz, sarimsoq 6 tish, limon sharbati 50ml, lavash 6 dona, pomidor, bodring, salat, sous", prepTime: "20 daqiqa", servings: "6 kishi", calories: "420 kcal" },
    { id: 20, name: "Köfte", category: "Turk taomlari", ingredients: "Mol go'shti (qiyma) 800g, piyoz 300g, bayot non 100g (suvga ivitilgan), tuxum 1 dona, maydanoz 1 bog', kimyon 1 choy qoshiq, qora murch, tuz, o'simlik yog'i", prepTime: "30 daqiqa", servings: "5 kishi", calories: "340 kcal" },

    // Arab taomlari
    { id: 26, name: "Hummus", category: "Arab taomlari", ingredients: "No'xat 400g (qaynatilgan), tahina 100g, limon sharbati 80ml, sarimsoq 4 tish, zira 1 choy qoshiq, tuz, zaytun yog'i 50ml, qizil murch (bezatish uchun)", prepTime: "15 daqiqa", servings: "6-8 kishi", calories: "180 kcal" },
    { id: 27, name: "Falafel", category: "Arab taomlari", ingredients: "No'xat 500g (namlantirilgan), piyoz 1 dona, sarimsoq 5 tish, maydanoz 1 bog', jambil 1/2 bog', zira 1 osh qoshiq, koriander 1 choy qoshiq, qora murch, qizil murch, tuz, sodavoy soda 1/4 choy qoshiq, o'simlik yog'i (qovurish uchun)", prepTime: "20 daqiqa", servings: "5-6 kishi", calories: "250 kcal" },
    { id: 28, name: "Shawarma", category: "Arab taomlari", ingredients: "Tovuq go'shti 1kg, yogurt 200ml, limon sharbati 100ml, sarimsoq 6 tish, kimyon, koriander, zafaron, qora murch, tuz, lavash 6 dona, pomidor 3 dona, bodring 2 dona, salat, tahina sousi 200ml", prepTime: "25 daqiqa", servings: "6 kishi", calories: "410 kcal" },
    { id: 29, name: "Kabsa", category: "Arab taomlari", ingredients: "Basmati guruchi 500g, tovuq (to'liq) 1.5kg, piyoz 2 dona, pomidor 3 dona, sarimsoq 6 tish, kabsa ziravorlari (qorachuchqa, murch, zira, dolchin, yashil qadag'ay), qizil murch, zafaron, tuz, yong'oq va mayiz (bezatish)", prepTime: "60 daqiqa", servings: "6-8 kishi", calories: "450 kcal" },
    { id: 30, name: "Mandi", category: "Arab taomlari", ingredients: "Basmati guruchi 600g, qo'y go'shti 1.5kg, piyoz 3 dona, pomidor 4 dona, sarimsoq 1 bosh, zafaron 1g, qorachuchqa 5 dona, dolchin 2 tayoqcha, yashil qadag'ay 5 dona, zira, tuz, o'simlik yog'i 100ml", prepTime: "120 daqiqa", servings: "6-8 kishi", calories: "520 kcal" },
];

const categories = ['Hammasi', "O'zbek taomlari", "Turk taomlari", "Arab taomlari", "Pokiston taomlari", "Malayziya taomlari", "Marokash taomlari"];

const categoryOptions = categories.map(cat => ({ label: cat, value: cat }));

const filteredFoods = computed(() => {
    return foods.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      food.ingredients.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesCategory = selectedCategory.value === 'Hammasi' || food.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
