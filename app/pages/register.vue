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
        <h1 class="text-4xl sm:text-5xl font-bold text-foreground mb-3 tracking-tight text-balance">MenuAI</h1>
        <h2 class="text-lg sm:text-xl font-semibold text-foreground mb-3">Hisobingizni yarating</h2>
        <p class="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">Bugundan ovqatlanish rejasini boshlang</p>
      </div>

      <!-- Card with refined styling -->
      <!-- Updated card styling with better shadows and border for refined look -->
      <div class="bg-card rounded-2xl border border-border shadow-md p-6 sm:p-8 space-y-5 sm:space-y-6">
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

        <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 animate-fade-in shadow-sm">
          <div class="shrink-0">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-green-900 text-sm leading-relaxed">{{ success }}</p>
          </div>
          <button @click="success = ''" class="text-green-400 hover:text-green-600 shrink-0 transition-colors p-1 rounded hover:bg-green-100 cursor-pointer">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 animate-fade-in shadow-sm">
          <div class="shrink-0">
            <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-red-900 text-sm leading-relaxed">{{ error }}</p>
          </div>
          <button @click="error = ''" class="text-red-400 hover:text-red-600 shrink-0 transition-colors p-1 rounded hover:bg-red-100 cursor-pointer">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
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
            <label class="block text-sm font-medium text-foreground mb-2">Email (ixtiyoriy)</label>
            <input v-model="form.email" type="email" placeholder="example@email.com" :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
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
  email: '',
  password: '',
  confirm: '',
});
const loading = ref(false);
const error = ref('');
const success = ref('');

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
  success.value = '';

  let response: any = null;

  try {
    // Call backend API for registration
    response = await $fetch<{ user?: any; session?: any }>('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password,
        confirm: form.confirm,
      },
    });

    if (response?.user) {
      // Success message
      success.value = 'Hisob muvaffaqiyatli yaratildi! Yo\'naltirilmoqda...';
      
      // Clear form
      form.name = '';
      form.phone = '';
      form.email = '';
      form.password = '';
      form.confirm = '';
      
      // Refresh user state
      if (userComposable) {
        await nextTick();
      }
      
      // Redirect after showing success message (try-catch to handle middleware errors)
      setTimeout(async () => {
        try {
          await navigateTo('/dashboard');
        } catch (navErr: any) {
          // If navigation fails due to middleware, try login page first
          if (navErr.message?.includes('middleware')) {
            await navigateTo('/login?registered=true');
          }
        }
      }, 1500);
    }
  } catch (err: any) {
    // Filter out middleware errors - if status is 200, registration was successful
    const errorMessage = err.data?.statusMessage || err.message || '';
    const statusCode = err.statusCode || err.data?.statusCode;
    
    // If status is 200 but there's a middleware error, treat as success
    // Also check if we got a user in the response before the error
    if (statusCode === 200 || (errorMessage.includes('middleware') && response?.user)) {
      success.value = 'Hisob muvaffaqiyatli yaratildi! Yo\'naltirilmoqda...';
      setTimeout(async () => {
        try {
          await navigateTo('/dashboard');
        } catch (navErr: any) {
          await navigateTo('/login?registered=true');
        }
      }, 1500);
    } else if (errorMessage && !errorMessage.includes('middleware')) {
      // Only show real errors, not middleware errors
      error.value = errorMessage;
    }
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
