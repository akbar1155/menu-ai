import type { Ref } from "vue";
import type { RouteLocationNormalizedLoaded } from "vue-router";

declare const defineNuxtRouteMiddleware: (
  handler: (
    to: RouteLocationNormalizedLoaded,
    from: RouteLocationNormalizedLoaded
  ) => any
) => any;

declare function useSupabaseUser(): Ref<any>;

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
        return { path: "/login", query: { redirect: to.fullPath } };
      }
    } catch (err) {
      // If Supabase is not configured or fails, allow access
      // The page itself will handle showing appropriate errors
      console.warn('Auth middleware error:', err);
    }
  }
});
