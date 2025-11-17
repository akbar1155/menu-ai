<!-- pages/index.vue -->
<template>
    <div class="min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-emerald-800 mb-2">🕌 Halal Taomlar Bazasi</h1>
                <p class="text-emerald-600">Musulmon taomlari retseptlari va maslahatlar</p>
            </div>

            <!-- Search and Filter -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <!-- Search -->
                    <div class="flex-1 relative">
                        <input v-model="searchTerm" type="text" placeholder="Taom yoki ingredient qidiring..."
                            class="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        <svg class="absolute left-3 top-3.5 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <!-- Category Filter -->
                    <div class="relative">
                        <select v-model="selectedCategory"
                            class="pl-10 pr-8 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white cursor-pointer">
                            <option v-for="cat in categories" :key="cat" :value="cat">
                                {{ cat }}
                            </option>
                        </select>
                        <svg class="absolute left-3 top-3.5 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </div>
                </div>

                <!-- Stats -->
                <div class="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{{ filteredFoods.length }} ta taom topildi</span>
                </div>
            </div>

            <!-- Food Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="food in filteredFoods" :key="food.id"
                    class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <!-- Card Header -->
                    <div class="bg-linear-to-r from-emerald-500 to-teal-500 p-4">
                        <h3 class="text-xl font-bold text-white mb-1">{{ food.name }}</h3>
                        <span class="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                            {{ food.category }}
                        </span>
                    </div>

                    <!-- Card Body -->
                    <div class="p-4">
                        <!-- Quick Info -->
                        <div class="grid grid-cols-3 gap-2 mb-4">
                            <div class="text-center p-2 bg-emerald-50 rounded-lg">
                                <svg class="w-5 h-5 mx-auto text-emerald-600 mb-1" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="text-xs text-emerald-800 font-medium">{{ food.prepTime }}</p>
                            </div>
                            <div class="text-center p-2 bg-teal-50 rounded-lg">
                                <svg class="w-5 h-5 mx-auto text-teal-600 mb-1" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p class="text-xs text-teal-800 font-medium">{{ food.servings }}</p>
                            </div>
                            <div class="text-center p-2 bg-amber-50 rounded-lg">
                                <svg class="w-5 h-5 mx-auto text-amber-600 mb-1" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <p class="text-xs text-amber-800 font-medium">{{ food.calories }}</p>
                            </div>
                        </div>

                        <!-- Ingredients -->
                        <div class="mb-4">
                            <h4 class="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Ingredientlar:
                            </h4>
                            <p class="text-sm text-gray-600 line-clamp-3">{{ food.ingredients }}</p>
                        </div>

                        <!-- Expand Button -->
                        <button @click="expandedId = expandedId === food.id ? null : food.id"
                            class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                            <span>{{ expandedId === food.id ? 'Yopish' : 'Batafsil' }}</span>
                            <svg class="w-4 h-4 transition-transform duration-200"
                                :class="{ 'rotate-180': expandedId === food.id }" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Expanded Content -->
                        <div v-if="expandedId === food.id" class="mt-4 pt-4 border-t border-emerald-100 animate-fadeIn">
                            <h4 class="font-semibold text-emerald-800 mb-2">To'liq ingredientlar ro'yxati:</h4>
                            <p class="text-sm text-gray-700 whitespace-pre-line">{{ food.ingredients }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Results -->
            <div v-if="filteredFoods.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 mx-auto text-emerald-300 mb-4" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xl text-emerald-600 font-medium">Hech narsa topilmadi</p>
                <p class="text-emerald-500 mt-2">Boshqa kalit so'zlar bilan qidirib ko'ring</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const searchTerm = ref('')
const selectedCategory = ref('Hammasi')
const expandedId = ref(null)

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
    { id: 21, name: "İskender", category: "Turk taomlari", ingredients: "Mol go'shti (yupqa kesimlar) 800g, pide noni 4 dona, yogurt 400ml, sariyog' 150g, pomidor pastasi 3 osh qoshiq, pomidor 4 dona (sous uchun), qora murch, qizil murch, tuz", prepTime: "35 daqiqa", servings: "4 kishi", calories: "480 kcal" },
    { id: 22, name: "Mantı (turk)", category: "Turk taomlari", ingredients: "Yuqori navli un 500g, mol go'shti 400g, piyoz 200g, tuxum 2 dona, yogurt 500ml, sariyog' 100g, sarimsoq 4 tish, qizil murch, yalpiz (nana), tuz, sovuq suv 200ml", prepTime: "60 daqiqa", servings: "4-5 kishi", calories: "360 kcal" },
    { id: 23, name: "Patlıcan kebabı", category: "Turk taomlari", ingredients: "Baqlajon 6 dona (o'rta hajmda), qiyma go'sht 500g, pomidor 400g, piyoz 300g, bulg'ori qalampir 3 dona, pomidor pastasi 2 osh qoshiq, sarimsoq 5 tish, maydanoz, qora murch, tuz, o'simlik yog'i", prepTime: "45 daqiqa", servings: "4-5 kishi", calories: "320 kcal" },
    { id: 24, name: "Tavuk şiş", category: "Turk taomlari", ingredients: "Tovuq go'shti 1kg (kub shaklida), yogurt 200ml, limon sharbati 100ml, o'simlik yog'i 50ml, kimyon 1 choy qoshiq, qizil murch 1 choy qoshiq, qora murch, tuz, sarimsoq 5 tish", prepTime: "25 daqiqa", servings: "4 kishi", calories: "280 kcal" },
    { id: 25, name: "Çorba", category: "Turk taomlari", ingredients: "Tovuq go'shti 500g, yasmiq 100g, un 2 osh qoshiq, tuxum 2 dona, limon sharbati 50ml, sariyog' 50g, piyoz 1 dona, sabzi 1 dona, tuz, qora murch", prepTime: "30 daqiqa", servings: "4-5 kishi", calories: "220 kcal" },

    // Arab taomlari
    { id: 26, name: "Hummus", category: "Arab taomlari", ingredients: "No'xat 400g (qaynatilgan), tahina 100g, limon sharbati 80ml, sarimsoq 4 tish, zira 1 choy qoshiq, tuz, zaytun yog'i 50ml, qizil murch (bezatish uchun)", prepTime: "15 daqiqa", servings: "6-8 kishi", calories: "180 kcal" },
    { id: 27, name: "Falafel", category: "Arab taomlari", ingredients: "No'xat 500g (namlantirilgan), piyoz 1 dona, sarimsoq 5 tish, maydanoz 1 bog', jambil 1/2 bog', zira 1 osh qoshiq, koriander 1 choy qoshiq, qora murch, qizil murch, tuz, sodavoy soda 1/4 choy qoshiq, o'simlik yog'i (qovurish uchun)", prepTime: "20 daqiqa", servings: "5-6 kishi", calories: "250 kcal" },
    { id: 28, name: "Shawarma", category: "Arab taomlari", ingredients: "Tovuq go'shti 1kg, yogurt 200ml, limon sharbati 100ml, sarimsoq 6 tish, kimyon, koriander, zafaron, qora murch, tuz, lavash 6 dona, pomidor 3 dona, bodring 2 dona, salat, tahina sousi 200ml", prepTime: "25 daqiqa", servings: "6 kishi", calories: "410 kcal" },
    { id: 29, name: "Kabsa", category: "Arab taomlari", ingredients: "Basmati guruchi 500g, tovuq (to'liq) 1.5kg, piyoz 2 dona, pomidor 3 dona, sarimsoq 6 tish, kabsa ziravorlari (qorachuchqa, murch, zira, dolchin, yashil qadag'ay), qizil murch, zafaron, tuz, yong'oq va mayiz (bezatish)", prepTime: "60 daqiqa", servings: "6-8 kishi", calories: "450 kcal" },
    { id: 30, name: "Mandi", category: "Arab taomlari", ingredients: "Basmati guruchi 600g, qo'y go'shti 1.5kg, piyoz 3 dona, pomidor 4 dona, sarimsoq 1 bosh, zafaron 1g, qorachuchqa 5 dona, dolchin 2 tayoqcha, yashil qadag'ay 5 dona, zira, tuz, o'simlik yog'i 100ml", prepTime: "120 daqiqa", servings: "6-8 kishi", calories: "520 kcal" },
    { id: 31, name: "Maqluba", category: "Arab taomlari", ingredients: "Basmati guruchi 500g, tovuq go'shti 800g, baqlajon 4 dona, gulkaram 300g, pomidor 4 dona, piyoz 2 dona, sarimsoq 5 tish, zira, kurkum, qorachuchqa, dolchin, tuz, o'simlik yog'i", prepTime: "70 daqiqa", servings: "6 kishi", calories: "430 kcal" },
    { id: 32, name: "Tabbouleh", category: "Arab taomlari", ingredients: "Bulgur 100g, maydanoz 3 bog', yalpiz 1 bog', pomidor 4 dona, bodring 2 dona, kok piyoz 1 bog', limon sharbati 100ml, zaytun yog'i 80ml, tuz, qora murch", prepTime: "20 daqiqa", servings: "4-6 kishi", calories: "160 kcal" },
    { id: 33, name: "Fattoush", category: "Arab taomlari", ingredients: "Salat 1 bosh, pomidor 4 dona, bodring 3 dona, bulg'ori qalampir 2 dona, turp 5 dona, kok piyoz 1 bog', maydanoz 1 bog', yalpiz 1 bog', arab noni 2 dona (qovurilgan), sumak 1 osh qoshiq, limon sharbati 80ml, zaytun yog'i 100ml, tuz", prepTime: "15 daqiqa", servings: "5-6 kishi", calories: "190 kcal" },
    { id: 34, name: "Kibbeh", category: "Arab taomlari", ingredients: "Bulgur 300g, mol go'shti (qiyma) 800g, piyoz 500g, yong'oq 100g, zira, dolchin, qorachuchqa, qora murch, qizil murch, tuz, o'simlik yog'i (qovurish uchun)", prepTime: "50 daqiqa", servings: "6-8 kishi", calories: "370 kcal" },
    { id: 35, name: "Mansaf", category: "Arab taomlari", ingredients: "Qo'y go'shti 2kg, guruch 600g, jameed (quritilgan yogurt) 500g yoki yogurt 1L, piyoz 3 dona, sariyog' 150g, yong'oq 100g, bodom 100g, maydanoz, tuz, qora murch", prepTime: "90 daqiqa", servings: "8-10 kishi", calories: "550 kcal" },

    // Pokiston taomlari
    { id: 36, name: "Biryani", category: "Pokiston taomlari", ingredients: "Basmati guruchi 600g, tovuq yoki go'sht 1kg, yogurt 300ml, pomidor 3 dona, piyoz 4 dona, sarimsoq-zanjabil pastasi 3 osh qoshiq, biryani masala 2 osh qoshiq, zafaron 1g, yalpiz, jambil, qizil murch, kurkum, garam masala, tuz, qaynatilgan yog' 200ml", prepTime: "75 daqiqa", servings: "6-8 kishi", calories: "480 kcal" },
    { id: 37, name: "Nihari", category: "Pokiston taomlari", ingredients: "Mol go'shti (suyakli) 1.5kg, un 100g, qaynatilgan yog' 150ml, piyoz 4 dona, sarimsoq-zanjabil pastasi 4 osh qoshiq, nihari masala 3 osh qoshiq, qizil murch, garam masala, tuz, jambil, limon", prepTime: "180 daqiqa", servings: "6-8 kishi", calories: "520 kcal" },
    { id: 38, name: "Haleem", category: "Pokiston taomlari", ingredients: "Mol go'shti 1kg, bug'doy 300g, yasmiq (turli xillari) 300g, qaynatilgan yog' 200ml, piyoz 5 dona, sarimsoq-zanjabil pastasi 3 osh qoshiq, haleem masala, qizil murch, kurkum, garam masala, tuz, jambil, limon, yalpiz", prepTime: "240 daqiqa", servings: "8-10 kishi", calories: "450 kcal" },
    { id: 39, name: "Karahi", category: "Pokiston taomlari", ingredients: "Tovuq yoki qo'y go'shti 1kg, pomidor 600g, bulg'ori qalampir 4 dona, piyoz 3 dona, sarimsoq-zanjabil pastasi 3 osh qoshiq, qaynatilgan yog' 150ml, qizil murch, kurkum, koriander, garam masala, tuz, ko'k jambil, yalpiz", prepTime: "40 daqiqa", servings: "5-6 kishi", calories: "390 kcal" },
    { id: 40, name: "Sajji", category: "Pokiston taomlari", ingredients: "To'liq tovuq yoki go'sht 2kg, yogurt 200ml, limon sharbati 100ml, sarimsoq-zanjabil pastasi 3 osh qoshiq, qizil murch 2 osh qoshiq, kurkum 1 choy qoshiq, zira, tuz, pomidor va piyoz (garnitura)", prepTime: "120 daqiqa", servings: "6-8 kishi", calories: "560 kcal" },

    // Malayziya taomlari
    { id: 41, name: "Nasi Lemak", category: "Malayziya taomlari", ingredients: "Guruch 500g, kokos suti 400ml, pandan bargi 3 dona, tovuq 4 dona (dona), tuxum 4 dona, bodring 1 dona, yerfistiq 100g, teri baliq 50g, sambal (qizil murch pastasi) 150g, tuz, shakar", prepTime: "45 daqiqa", servings: "4 kishi", calories: "420 kcal" },
    { id: 42, name: "Rendang", category: "Malayziya taomlari", ingredients: "Mol go'shti 1.5kg, kokos suti 800ml, qizil murch 10 dona, shallot 8 dona, sarimsoq 6 tish, zanjabil 50g, galangal 30g, lemongrass 3 poya, kurkum 20g, tamarind pasta 2 osh qoshiq, shakar 2 osh qoshiq, tuz", prepTime: "180 daqiqa", servings: "6-8 kishi", calories: "480 kcal" },
    { id: 43, name: "Satay", category: "Malayziya taomlari", ingredients: "Tovuq go'shti 1kg, shallot 5 dona, sarimsoq 5 tish, lemongrass 2 poya, kurkum 1 choy qoshiq, koriander 1 choy qoshiq, kimyon 1 choy qoshiq, shakar 2 osh qoshiq, tuz, yerfistiq sousi (yerfistiq 200g, kokos suti 200ml, shakar, tamarind)", prepTime: "30 daqiqa", servings: "5-6 kishi", calories: "340 kcal" },
    { id: 44, name: "Mee Goreng", category: "Malayziya taomlari", ingredients: "Yog'li makaron 500g, tovuq go'shti 300g, tuxum 3 dona, bodring 2 dona, pomidor 2 dona, karamning 200g, soya sousi 3 osh qoshiq, oyster sousi 2 osh qoshiq, shallot 4 dona, sarimsoq 4 tish, qizil murch, ko'k piyoz", prepTime: "25 daqiqa", servings: "4 kishi", calories: "380 kcal" },
    { id: 45, name: "Laksa", category: "Malayziya taomlari", ingredients: "Guruch makaroni 400g, dengiz mahsulotlari (krevetka) 300g, kokos suti 600ml, baliq buloni 500ml, laksa pastasi 4 osh qoshiq, tamarind 1 osh qoshiq, tuxum 2 dona, soya noxi 100g, bodring, ko'k piyoz, jambil, shakar, tuz", prepTime: "35 daqiqa", servings: "4 kishi", calories: "410 kcal" },

    // Marokash taomlari
    { id: 46, name: "Tajin", category: "Marokash taomlari", ingredients: "Qo'y yoki tovuq go'shti 1kg, piyoz 3 dona, sarimsoq 6 tish, zanjabil 30g, kurkum 1 choy qoshiq, dolchin 1 tayoqcha, zafaron 0.5g, quritilgan o'rik 150g, mayiz 100g, asal 2 osh qoshiq, zaytun yog'i 80ml, ko'kat, tuz, qora murch", prepTime: "90 daqiqa", servings: "5-6 kishi", calories: "380 kcal" },
    { id: 47, name: "Couscous", category: "Marokash taomlari", ingredients: "Kuskus 500g, qo'y go'shti 800g, piyoz 2 dona, sabzi 3 dona, kabak 2 dona, pomidor 4 dona, no'xat 200g, qovoq 300g, kurkum, dolchin, zanjabil, ko'kat, tuz, qora murch, sariyog' 100g", prepTime: "60 daqiqa", servings: "6-8 kishi", calories: "350 kcal" },
    { id: 48, name: "Harira", category: "Marokash taomlari", ingredients: "Qo'y go'shti 500g, yasmiq 100g, no'xat 150g, pomidor 400g, piyoz 2 dona, sarimsoq 4 tish, karam 1/4 bosh, un 2 osh qoshiq, kurkum, zanjabil, dolchin, ko'kat (jambil, maydanoz), tuz, qora murch, limon", prepTime: "75 daqiqa", servings: "6 kishi", calories: "290 kcal" },
    { id: 49, name: "Pastilla", category: "Marokash taomlari", ingredients: "Yupqa xamir (filo) 12 varoq, tovuq go'shti 1kg, piyoz 3 dona, bodom 200g, tuxum 6 dona, sariyog' 200g, zanjabil, zafaron, dolchin 1 osh qoshiq, shakar 100g, ko'kat, tuz, qora murch, shakar kukuni (bezatish)", prepTime: "90 daqiqa", servings: "8 kishi", calories: "450 kcal" },
    { id: 50, name: "Kefta Tagine", category: "Marokash taomlari", ingredients: "Qiyma go'sht 800g, tuxum 4 dona, pomidor 500g, piyoz 2 dona, sarimsoq 5 tish, maydanoz 1 bog', jambil 1 bog', kimyon 1 choy qoshiq, kok murch 1 choy qoshiq, qizil murch, zaytun yog'i 50ml, tuz", prepTime: "40 daqiqa", servings: "4-5 kishi", calories: "370 kcal" }
]

const categories = ['Hammasi', "O'zbek taomlari", "Turk taomlari", "Arab taomlari", "Pokiston taomlari", "Malayziya taomlari", "Marokash taomlari"]

const filteredFoods = computed(() => {
    return foods.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            food.ingredients.toLowerCase().includes(searchTerm.value.toLowerCase())
        const matchesCategory = selectedCategory.value === 'Hammasi' || food.category === selectedCategory.value
        return matchesSearch && matchesCategory
    })
})
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