<template>
  <!-- Updated background to warm beige with refined gradient background elements -->
  <div class="h-screen flex items-center justify-center px-4 py-6 bg-background relative overflow-hidden">
    <!-- Animated subtle background elements using new warm color palette -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Updated gradient colors to warm amber/orange accent tones -->
      <div class="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s;"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Header with improved typography hierarchy -->
      <div class="text-center mb-8 animate-fade-in">
        <!-- Updated gradient from blue to warm amber/orange using primary and accent colors -->

        <!-- Improved typography with better hierarchy and text balance -->
        <h1 class="text-5xl font-bold text-foreground mb-3 tracking-tight text-balance">MenuAI</h1>
        <h2 class="text-xl font-semibold text-foreground mb-3">Hisobingizni yarating</h2>
        <p class="text-muted-foreground text-base font-light leading-relaxed">Bugundan ovqatlanish rejasini boshlang</p>
      </div>

      <!-- Card with refined styling -->
      <!-- Updated card styling with better shadows and border for refined look -->
      <div class="bg-card rounded-2xl border border-border shadow-md p-8 space-y-6">
        <!-- Alerts -->
        <!-- Updated alert styling to match new color scheme -->
        <div v-if="!isSupabaseConfigured" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <span class="text-yellow-600 text-lg shrink-0">⚠️</span>
          <div class="grow">
            <p class="font-semibold text-yellow-900 text-sm">Supabase sozlanmagan</p>
            <p class="text-yellow-700 text-xs mt-1">Autentifikatsiyani yoqish uchun .env faylida
              NUXT_PUBLIC_SUPABASE_URL va NUXT_PUBLIC_SUPABASE_ANON_KEY ni o'rnating.</p>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <span class="text-red-600 text-lg shrink-0">✕</span>
          <div class="flex-1">
            <p class="font-semibold text-red-900 text-sm">{{ error }}</p>
          </div>
          <button @click="error = ''" class="text-red-400 hover:text-red-600 shrink-0">✕</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="space-y-5">
          <!-- Updated form input styling with better spacing and labels -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Ism</label>
            <input v-model="form.name" type="text" placeholder="Ismingiz" :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Telefon raqami</label>
            <input v-model="form.phone" type="tel" placeholder="+998901234567" :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Parol</label>
            <input v-model="form.password" type="password" placeholder="••••••••" :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Parolni tasdiqlash</label>
            <input v-model="form.confirm" type="password" placeholder="••••••••" :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required />
            <div v-if="form.password && form.confirm && form.password === form.confirm"
              class="flex items-center gap-2 text-green-600 text-xs mt-2">
              <span>✓</span>
              <span>Parollar mos keldi</span>
            </div>
          </div>

          <!-- Updated button with warm primary color and improved styling -->
          <button type="submit" :disabled="!isSupabaseConfigured || loading"
            class="w-full py-3 px-4 bg-primary border cursor-pointer hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold rounded-lg transition-all duration-200 mt-6 flex items-center justify-center gap-2">
            <span v-if="!loading">✨</span>
            <span v-else class="inline-block animate-spin">⟳</span>
            {{ loading ? 'Yaratilmoqda...' : 'Hisob yaratish' }}
          </button>
        </form>
      </div>

      <!-- Footer links with improved styling -->
      <!-- Improved footer link styling with better color scheme -->
      <div class="mt-6 text-center space-y-2">
        <p class="text-muted-foreground text-sm">
          Hisobingiz bormi?
          <NuxtLink to="/login" class="text-primary hover:text-accent font-semibold transition-colors">
            Kirish
          </NuxtLink>
        </p>
        <p class="text-muted-foreground text-xs">
          Ro'yxatdan o'tish orqali siz bizning
          <NuxtLink to="/terms" class="text-primary hover:text-accent transition-colors">
            foydalanish shartlariga
          </NuxtLink>
          rozilik bildirasiz
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * SSR-Safe Register Page for Nuxt 3 with Supabase and Nuxt UI
 */

const route = useRoute();

// Reactive form state (SSR-safe)
const form = reactive({
  name: '',
  phone: '',
  password: '',
  confirm: '',
});
const loading = ref(false);
const error = ref('');

// Check Supabase configuration (SSR-safe)
const config = useRuntimeConfig();
const isSupabaseConfigured = computed(() => {
  const hasUrl = !!(config.public.supabaseUrl && config.public.supabaseUrl.trim() !== '');
  const hasKey = !!(config.public.supabaseKey && config.public.supabaseKey.trim() !== '');
  // Debug: log in browser console
  if (process.client) {
    console.log('Supabase Config:', {
      url: hasUrl ? '✓' : '✗',
      key: hasKey ? '✓' : '✗',
      urlValue: config.public.supabaseUrl?.substring(0, 30) + '...',
      urlLength: config.public.supabaseUrl?.length || 0,
      keyLength: config.public.supabaseKey?.length || 0,
    });
  }
  return hasUrl && hasKey;
});

// Supabase composables - initialized only on client-side
const supabase = ref<any>(null);
const user = ref<any>(null);
let userComposable: ReturnType<typeof useSupabaseUser> | null = null;
let stopWatcher: (() => void) | null = null;

// Initialize Supabase composables ONLY on client-side
onMounted(() => {
  if (process.client && isSupabaseConfigured.value) {
    try {
      supabase.value = useSupabaseClient();
      userComposable = useSupabaseUser();

      // Watch for user changes and redirect if logged in
      if (userComposable) {
        user.value = userComposable.value;

        stopWatcher = watchEffect(async () => {
          const currentUser = userComposable?.value;
          user.value = currentUser;

          if (currentUser) {
            const redirectPath = (route.query.redirect as string) || '/dashboard';
            await nextTick();
            await navigateTo(redirectPath);
          }
        });
      }
    } catch (err) {
      console.error('Failed to initialize Supabase:', err);
      error.value = 'Autentifikatsiya ishga tushirishda xatolik. Iltimos, sahifani yangilang.';
    }
  }
});

// Cleanup watcher on unmount
onUnmounted(() => {
  if (stopWatcher) {
    stopWatcher();
  }
});

// Form submission handler
const onSubmit = async () => {
  // Only allow submission on client
  if (!process.client) return;

  // Check Supabase configuration
  if (!isSupabaseConfigured.value) {
    error.value = 'Supabase sozlanmagan. Iltimos, .env faylida NUXT_PUBLIC_SUPABASE_URL va NUXT_PUBLIC_SUPABASE_ANON_KEY ni o\'rnating.';
    return;
  }

  // Validate passwords match
  if (form.password !== form.confirm) {
    error.value = 'Parollar mos kelmaydi';
    return;
  }

  // Validate form
  if (!form.name || !form.phone || !form.password) {
    error.value = 'Iltimos, barcha maydonlarni to\'ldiring.';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // Call backend API for registration
    const response = await $fetch<{ user?: any; session?: any }>('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        password: form.password,
        confirm: form.confirm,
      },
    });

    if (response?.user) {
      // Success - refresh user state and redirect
      if (userComposable) {
        // Force refresh user state
        await nextTick();
      }
      await navigateTo('/dashboard');
    }
  } catch (err: any) {
    error.value = err.data?.statusMessage || err.message || 'Ro\'yxatdan o\'tish paytida xatolik yuz berdi';
  } finally {
    loading.value = false;
  }
};
console.log("supabaseUrl", config.public.supabaseUrl)
console.log("supabaseKey", config.public.supabaseKey)
console.log("appUrl", config.public.appUrl)
console.log("proPriceId", config.public.proPriceId)
// Note: geminiApiKey is not in public config (server-side only for security)
console.log("geminiApiKey", "Not available on client-side (server-only)")
</script>


<style scoped>
@layer components {
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.7s ease-out;
  }
}
</style>
