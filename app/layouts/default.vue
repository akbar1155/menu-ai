<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18">
          <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            @click="navigateTo('/')">
            <div class="w-9 h-9 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span class="text-xl font-bold text-white">M</span>
            </div>
            <span class="text-xl font-bold text-gray-900">MenuAI</span>
          </div>

          <nav class="flex items-center gap-4">
            <ClientOnly>
              <UButton v-if="!user" color="primary" size="xl" @click="navigateTo('/login')"
                class="gap-2 cursor-pointer p-2 bg-linear-to-br from-blue-500 to-blue-600 text-white hover:bg-gray-100 rounded-2xl">
                <UIcon name="i-lucide-key" class="w-4 h-4" />
                Kirish
              </UButton>
              <UDropdown v-else :items="menuItems" :popper="{ placement: 'bottom-end' }">
                <UButton color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-down"
                  class="rounded-2xl cursor-pointer">
                  {{ user?.user_metadata?.name ?? user?.user_metadata?.full_name ?? 'Hisob' }}
                </UButton>
              </UDropdown>
              <template #fallback>
                <UButton color="primary" @click="navigateTo('/login')" class="gap-2 rounded-2xl cursor-pointer">
                  <UIcon name="i-lucide-key" class="w-4 h-4" />
                  Kirish
                </UButton>
              </template>
            </ClientOnly>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white/80 backdrop-blur-lg border-t border-gray-200 py-10 mt-auto">
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
