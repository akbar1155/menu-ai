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
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-br from-primary to-accent mb-8 shadow-lg shadow-primary/20">
          <span class="text-3xl font-bold text-primary-foreground">🍽️</span>
        </div>
        <!-- Improved typography with better hierarchy and text balance -->
        <h1 class="text-4xl sm:text-5xl font-bold text-foreground mb-3 tracking-tight text-balance">MenuAI</h1>
        <h2 class="text-lg sm:text-xl font-semibold text-foreground mb-3">Xush kelibsiz</h2>
        <p class="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">Ovqatlanish rejasini davom ettirish uchun
          kirish qiling</p>
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

        <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 animate-fade-in">
          <span class="text-green-600 text-lg shrink-0">✓</span>
          <div class="flex-1">
            <p class="font-semibold text-green-900 text-sm">{{ success }}</p>
          </div>
          <button @click="success = ''"
            class="text-green-400 hover:text-green-600 shrink-0 transition-colors cursor-pointer">✕</button>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 animate-fade-in shadow-sm">
          <div class="shrink-0">
            <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-red-900 text-sm leading-relaxed">{{ error }}</p>
          </div>
          <button @click="error = ''"
            class="text-red-400 hover:text-red-600 shrink-0 transition-colors p-1 rounded hover:bg-red-100 cursor-pointer">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="space-y-5">
          <!-- Updated form input styling with better spacing and labels -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Telefon raqami yoki Email</label>
            <input v-model="form.phone" type="text" placeholder="+998901234567 yoki email@example.com"
              :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required />
            <p class="text-xs text-muted-foreground mt-1">Telefon raqami yoki email kiriting</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Parol</label>
            <input v-model="form.password" type="password" placeholder="••••••••" :disabled="loading"
              class="w-full px-4 py-3 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required />
          </div>

          <!-- Updated button with warm primary color and improved styling -->
          <button type="submit" :disabled="!isSupabaseConfigured || !isMounted || loading"
            class="w-full py-3 px-4 bg-primary border hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition-all duration-200 mt-6 flex items-center justify-center gap-2 cursor-pointer">
            <span v-if="!loading">🔐</span>
            <span v-else class="inline-block animate-spin">⟳</span>
            {{ loading ? 'Kirilmoqda...' : 'Kirish' }}
          </button>
        </form>
      </div>

      <!-- Footer links with improved styling -->
      <!-- Improved footer link styling with better color scheme -->
      <div class="mt-6 text-center space-y-2">
        <p class="text-muted-foreground text-sm">
          Hisobingiz yo'qmi?
          <NuxtLink to="/register" class="text-primary hover:text-accent font-semibold transition-colors">
            Hozir yarating
          </NuxtLink>
        </p>
        <NuxtLink to="/forgot-password"
          class="block text-muted-foreground hover:text-foreground text-sm transition-colors">
          Parolni unutdingizmi?
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * SSR-Safe Login Page for Nuxt 3 with Supabase and Nuxt UI
 */

definePageMeta({
  // Keep SSR enabled but handle it safely
});

const route = useRoute();

// Reactive form state (SSR-safe - just data)
const form = reactive({
  phone: '',
  password: '',
});
const loading = ref(false);
const error = ref('');
const success = ref('');
const isMounted = ref(false);

// Check Supabase configuration (SSR-safe - uses runtimeConfig)
const config = useRuntimeConfig();
const isSupabaseConfigured = computed(() => {
  const hasUrl = !!config.public.supabaseUrl;
  const hasKey = !!config.public.supabaseKey;
  // Debug: log in browser console
  if (process.client) {
    console.log('Supabase Config:', {
      url: hasUrl ? '✓' : '✗',
      key: hasKey ? '✓' : '✗',
      urlValue: config.public.supabaseUrl?.substring(0, 30) + '...',
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
onMounted(async () => {
  isMounted.value = true;

  // Initialize Supabase if configured
  if (isSupabaseConfigured.value) {
    try {
      supabase.value = useSupabaseClient();
      userComposable = useSupabaseUser();

      // Watch for user changes and redirect if logged in
      if (userComposable) {
        // Update user ref
        user.value = userComposable.value;

        // Check if user is already logged in
        if (user.value) {
          const redirectPath = (route.query.redirect as string) || '/dashboard';
          await nextTick();
          await navigateTo(redirectPath);
          return;
        }

        // Watch for changes
        stopWatcher = watchEffect(async () => {
          const currentUser = userComposable?.value;
          user.value = currentUser;

          if (currentUser) {
            const redirectPath = (route.query.redirect as string) || '/dashboard';
            // Use nextTick to avoid navigation during render
            await nextTick();
            await navigateTo(redirectPath);
          }
        });
      }
    } catch (err: any) {
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
  // Validate configuration
  if (!isSupabaseConfigured.value) {
    error.value = 'Supabase sozlanmagan. Iltimos, .env faylida NUXT_PUBLIC_SUPABASE_URL va NUXT_PUBLIC_SUPABASE_ANON_KEY ni o\'rnating.';
    return;
  }

  // Validate Supabase client is available
  if (!supabase.value?.auth) {
    error.value = 'Supabase klienti mavjud emas. Iltimos, biroz kuting va qayta urinib ko\'ring.';
    return;
  }

  // Validate form
  if (!form.phone || !form.password) {
    error.value = 'Iltimos, barcha maydonlarni to\'ldiring.';
    return;
  }

  // Format email or phone for Supabase
  // Agar email bo'lsa, uni ishlatamiz, aks holda telefon raqamni email formatida
  const emailForAuth = form.phone.includes('@')
    ? form.phone
    : `${form.phone.replace(/\s+/g, '')}@phone.local`;

  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    // Format email or phone for Supabase
    const emailForAuth = form.phone.includes('@')
      ? form.phone
      : `${form.phone.replace(/\s+/g, '')}@phone.local`;

    // Use Supabase client directly to ensure session cookie is set
    const { data, error } = await supabase.value.auth.signInWithPassword({
      email: emailForAuth,
      password: form.password,
    });

    if (error) {
      // Handle errors
      let errorMessage = error.message || 'Kirish paytida xatolik yuz berdi';

      if (error.message === 'Invalid login credentials' || error.message === 'Invalid login') {
        errorMessage = 'Telefon raqami/email yoki parol noto\'g\'ri. Iltimos, qayta urinib ko\'ring.';
      } else if (error.message === 'Email not confirmed') {
        errorMessage = 'Email tasdiqlanmagan. Iltimos, email\'ingizni tekshiring.';
      } else if (
        error.message === 'Email signups are disabled' ||
        error.message === 'Email logins are disabled'
      ) {
        if (!form.phone.includes('@')) {
          errorMessage = 'Telefon raqami orqali kirish sozlangan emas. Iltimos, administrator bilan bog\'laning.';
        } else {
          errorMessage = 'Email orqali kirish o\'chirilgan. Iltimos, telefon raqamidan foydalaning.';
        }
      }

      throw new Error(errorMessage);
    }

    if (data?.user) {
      // Ensure user profile exists in database (this will be handled by requireUser on first API call)
      // But we can also call it explicitly here to ensure profile is created
      try {
        await $fetch('/api/profile');
      } catch (profileError) {
        // Profile might not exist yet, but that's okay - it will be created on first API call
        console.log('Profile fetch error (expected on first login):', profileError);
      }

      // Success message
      success.value = 'Muvaffaqiyatli kirildi! Yo\'naltirilmoqda...';

      // Clear form
      form.phone = '';
      form.password = '';

      // Redirect after showing success message
      setTimeout(async () => {
        const redirectPath = (route.query.redirect as string) || '/dashboard';
        await navigateTo(redirectPath);
      }, 1000);
    }
  } catch (err: any) {
    // Handle errors from backend API
    const errorMessage = err.data?.statusMessage || err.message || 'Kirish paytida xatolik yuz berdi';

    // User-friendly error messages
    if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Invalid login')) {
      error.value = 'Telefon raqami/email yoki parol noto\'g\'ri. Iltimos, qayta urinib ko\'ring.';
    } else if (errorMessage.includes('Email not confirmed')) {
      error.value = 'Email tasdiqlanmagan. Iltimos, email\'ingizni tekshiring.';
    } else {
      error.value = errorMessage;
    }
  } finally {
    loading.value = false;
  }
};

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
