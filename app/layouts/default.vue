<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18">
          <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105"
            @click="navigateTo('/')">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <span class="text-xl font-bold text-white">M</span>
            </div>
            <span class="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">MenuAI</span>
          </div>

          <nav class="flex items-center gap-2 sm:gap-4">
            <ClientOnly>
              <!-- Mobile menu button for logged in users -->
              <button v-if="user" @click="isMobileMenuOpen = !isMobileMenuOpen" 
                class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <UIcon :name="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="w-6 h-6 text-gray-700" />
              </button>
              <UButton v-if="!user" color="primary" size="sm" @click="navigateTo('/login')"
                class="gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl sm:size-lg">
                <UIcon name="i-lucide-key" class="w-4 h-4" />
                <span class="hidden sm:inline">Kirish</span>
              </UButton>
              <UDropdown v-else :items="menuItems" :popper="{ placement: 'bottom-end' }">
                <UButton color="neutral" variant="soft" trailing-icon="i-lucide-chevron-down"
                  class="rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
                  {{ user?.user_metadata?.name ?? user?.user_metadata?.full_name ?? 'Hisob' }}
                </UButton>
              </UDropdown>
              <template #fallback>
                <UButton color="primary" @click="navigateTo('/login')" class="gap-2 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-300">
                  <UIcon name="i-lucide-key" class="w-4 h-4" />
                  Kirish
                </UButton>
              </template>
            </ClientOnly>
          </nav>
        </div>
      </div>
    </header>

    <!-- Mobile Sidebar Overlay -->
    <ClientOnly>
      <div v-if="user && isMobileMenuOpen" 
        class="fixed inset-0 bg-black/50 z-40 lg:hidden" 
        @click="isMobileMenuOpen = false"></div>
    </ClientOnly>

    <!-- Main Content with Sidebar -->
    <main class="flex-1 flex flex-col lg:flex-row pt-[72px]">
      <!-- Desktop Sidebar -->
      <ClientOnly>
        <aside v-if="user" :class="['bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-100 h-[calc(100vh-72px)] lg:fixed lg:top-[72px] lg:left-0 shadow-sm transition-all duration-300 hidden lg:block overflow-hidden', isSidebarCollapsed ? 'w-20' : 'w-64']">
          <nav class="p-5 flex flex-col h-full overflow-hidden">
            <ul class="space-y-1.5 flex-1 overflow-hidden">
              <li>
                <NuxtLink to="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-sm hover:scale-[1.02] cursor-pointer" :class="{ 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm': $route.path === '/dashboard' }">
                  <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="font-medium">Boshqaruv paneli</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/generate" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-sm hover:scale-[1.02] cursor-pointer" :class="{ 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 shadow-sm': $route.path === '/generate' }">
                  <UIcon name="i-lucide-sparkles" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="font-medium">Ovqat rejasi yaratish</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/meal-list" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-300 hover:shadow-sm hover:scale-[1.02] cursor-pointer" :class="{ 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm': $route.path === '/meal-list' }">
                  <UIcon name="i-lucide-utensils-crossed" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="font-medium">Ovqatlar ro'yxati</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/settings" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-300 hover:shadow-sm hover:scale-[1.02] cursor-pointer" :class="{ 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 shadow-sm': $route.path === '/settings' }">
                  <UIcon name="i-lucide-settings" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="font-medium">Sozlamalar</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/subscription" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 transition-all duration-300 hover:shadow-sm hover:scale-[1.02] cursor-pointer" :class="{ 'bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-600 shadow-sm': $route.path === '/subscription' }">
                  <UIcon name="i-lucide-crown" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="font-medium">Obuna</span>
                </NuxtLink>
              </li>
            </ul>
            
            <!-- Bottom Actions -->
            <div class="mt-auto pt-4 border-t border-gray-200 space-y-2">
              <!-- Logout Button -->
              <button
                @click="logout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 hover:shadow-sm group cursor-pointer"
                :title="isSidebarCollapsed ? 'Chiqish' : 'Chiqish'"
              >
                <UIcon 
                  name="i-lucide-log-out" 
                  class="w-5 h-5 text-red-600 group-hover:text-red-700 transition-colors flex-shrink-0" 
                />
                <span v-if="!isSidebarCollapsed" class="font-medium text-red-600 group-hover:text-red-700">Chiqish</span>
              </button>
              
              <!-- Sidebar Toggle Button -->
              <button
                @click="toggleSidebar"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-300 hover:shadow-sm group cursor-pointer"
                :title="isSidebarCollapsed ? 'Sidebar\'ni ochish' : 'Sidebar\'ni yig\'ish'"
              >
                <UIcon 
                  :name="isSidebarCollapsed ? 'i-lucide-panel-right-open' : 'i-lucide-panel-left-close'" 
                  class="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors flex-shrink-0" 
                />
                <span v-if="!isSidebarCollapsed" class="font-medium text-gray-600 group-hover:text-gray-900">Sidebar'ni yig'ish</span>
              </button>
            </div>
          </nav>
        </aside>
        <template #fallback>
          <aside class="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-72px)]"></aside>
        </template>
      </ClientOnly>

      <!-- Mobile Sidebar -->
      <ClientOnly>
        <aside v-if="user && isMobileMenuOpen" 
          class="fixed top-[72px] left-0 w-64 h-[calc(100vh-72px)] bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-100 shadow-xl z-50 lg:hidden overflow-hidden">
          <nav class="p-5 flex flex-col h-full overflow-hidden">
            <ul class="space-y-1.5 flex-1 overflow-hidden">
              <li>
                <NuxtLink to="/dashboard" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-sm cursor-pointer" :class="{ 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm': $route.path === '/dashboard' }">
                  <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5 flex-shrink-0" />
                  <span class="font-medium">Boshqaruv paneli</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/generate" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-sm cursor-pointer" :class="{ 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 shadow-sm': $route.path === '/generate' }">
                  <UIcon name="i-lucide-sparkles" class="w-5 h-5 flex-shrink-0" />
                  <span class="font-medium">Ovqat rejasi yaratish</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/meal-list" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-300 hover:shadow-sm cursor-pointer" :class="{ 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-600 shadow-sm': $route.path === '/meal-list' }">
                  <UIcon name="i-lucide-utensils-crossed" class="w-5 h-5 flex-shrink-0" />
                  <span class="font-medium">Ovqatlar ro'yxati</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/settings" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-300 hover:shadow-sm cursor-pointer" :class="{ 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 shadow-sm': $route.path === '/settings' }">
                  <UIcon name="i-lucide-settings" class="w-5 h-5 flex-shrink-0" />
                  <span class="font-medium">Sozlamalar</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/subscription" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 transition-all duration-300 hover:shadow-sm cursor-pointer" :class="{ 'bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-600 shadow-sm': $route.path === '/subscription' }">
                  <UIcon name="i-lucide-crown" class="w-5 h-5 flex-shrink-0" />
                  <span class="font-medium">Obuna</span>
                </NuxtLink>
              </li>
            </ul>
            
            <!-- Bottom Actions -->
            <div class="mt-auto pt-4 border-t border-gray-200 space-y-2">
              <!-- Logout Button -->
              <button
                @click="logout; isMobileMenuOpen = false"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 hover:shadow-sm group cursor-pointer"
              >
                <UIcon 
                  name="i-lucide-log-out" 
                  class="w-5 h-5 text-red-600 group-hover:text-red-700 transition-colors flex-shrink-0" 
                />
                <span class="font-medium text-red-600 group-hover:text-red-700">Chiqish</span>
              </button>
            </div>
          </nav>
        </aside>
      </ClientOnly>
      
      <!-- Page Content -->
      <div class="flex-1 lg:pl-64" :class="{'lg:pl-20': isSidebarCollapsed}">
        <slot />
      </div>
    </main>

    <!-- Footer - Only show on landing page -->
    <footer v-if="$route.path === '/'" class="bg-white/80 backdrop-blur-lg border-t border-gray-200 py-10 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
        © {{ new Date().getFullYear() }} MenuAI. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * SSR-Safe Layout for Nuxt 3 with Supabase and Nuxt UI
 */

// Check Supabase configuration (SSR-safe)
const config = useRuntimeConfig();
const isSupabaseConfigured = computed(() => {
  return !!(config.public.supabaseUrl && config.public.supabaseKey);
});

// Supabase composables - initialized only on client-side
const supabase = ref<any>(null);
const user = ref<any>(null);
let userComposable: ReturnType<typeof useSupabaseUser> | null = null;
let stopWatcher: (() => void) | null = null;

// Sidebar collapse state
const isSidebarCollapsed = ref(false);
const isMobileMenuOpen = ref(false);

// Toggle sidebar function
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
  // Save to localStorage
  if (process.client) {
    localStorage.setItem('sidebarCollapsed', String(isSidebarCollapsed.value));
  }
};

// Load sidebar state from localStorage on mount
onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      isSidebarCollapsed.value = saved === 'true';
    }
  }
});

// Menu items for dropdown
const menuItems = computed(() => [
  [{
    label: 'Boshqaruv paneli',
    icon: 'i-lucide-layout-grid',
    click: () => navigateTo('/dashboard')
  }],
  [{
    label: 'Sozlamalar',
    icon: 'i-lucide-settings',
    click: () => navigateTo('/settings')
  }],
  [{
    label: 'Chiqish',
    icon: 'i-lucide-log-out',
    click: logout
  }]
]);

// Initialize Supabase composables ONLY on client-side
onMounted(() => {
  if (process.client && isSupabaseConfigured.value) {
    try {
      supabase.value = useSupabaseClient();
      userComposable = useSupabaseUser();

      // Initialize user value
      if (userComposable) {
        user.value = userComposable.value;

        // Watch for user changes
        stopWatcher = watchEffect(() => {
          user.value = userComposable?.value || null;
        });
      }
    } catch (err) {
      console.error('Failed to initialize Supabase in layout:', err);
    }
  }
});

// Cleanup watcher on unmount
onUnmounted(() => {
  if (stopWatcher) {
    stopWatcher();
  }
});

const logout = async () => {
  if (process.client && supabase.value?.auth) {
    await supabase.value.auth.signOut();
  }
  await navigateTo('/');
};
</script>
