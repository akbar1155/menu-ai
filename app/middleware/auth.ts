export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check on server-side - let client handle it
  if (process.server) {
    return;
  }

  // Only check auth on client-side
  if (process.client) {
    try {
      const user = useSupabaseUser();
      
      if (!user.value) {
        return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
      }
    } catch (err) {
      // If Supabase is not configured or fails, allow access
      // The page itself will handle showing appropriate errors
      console.warn('Auth middleware error:', err);
    }
  }
});

