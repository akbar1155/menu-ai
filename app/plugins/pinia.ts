/**
 * Pinia SSR Fix for Nuxt 4 - Final Solution
 *
 * This plugin ensures $pinia is always attached to nuxtApp before
 * @pinia/nuxt's hook tries to access it.
 */
import { nextTick } from 'vue';

// @ts-expect-error - defineNuxtPlugin is auto-imported by Nuxt
export default defineNuxtPlugin({
  name: "pinia-ssr-fix",
  enforce: "pre", // Must run before @pinia/nuxt
  setup(nuxtApp) {
    let piniaInstance: any = null;

    // 1. Capture Pinia when installed via vueApp.use()
    const originalUse = nuxtApp.vueApp.use.bind(nuxtApp.vueApp);
    nuxtApp.vueApp.use = function (plugin: any, ...options: any[]) {
      const result = originalUse(plugin, ...options);

      if (
        plugin &&
        typeof plugin === "object" &&
        "state" in plugin &&
        "_p" in plugin &&
        typeof plugin.state === "object"
      ) {
        piniaInstance = plugin;
        nuxtApp.$pinia = plugin;
        nuxtApp.vueApp.config.globalProperties.$pinia = plugin;

        if (nuxtApp.vueApp._context.provides) {
          nuxtApp.vueApp._context.provides.pinia = plugin;
        }
      }

      return result;
    };

    // 2. Patch hooks.callHook to ensure $pinia before app:rendered
    const hooks = nuxtApp.hooks as any;
    if (hooks.callHook) {
      const originalCallHook = hooks.callHook.bind(hooks);
      hooks.callHook = function (name: string, ...args: any[]) {
        if (name === "app:rendered") {
          // Use nuxtApp from closure instead of useNuxtApp()
          if (!nuxtApp.$pinia) {
            const pinia =
              piniaInstance ||
              nuxtApp.vueApp._context.provides?.pinia ||
              nuxtApp.vueApp.config.globalProperties.$pinia;

            if (pinia) {
              nuxtApp.$pinia = pinia;
              nuxtApp.vueApp.config.globalProperties.$pinia = pinia;
            }
          }
        }
        return originalCallHook(name, ...args);
      };
    }

    // 4. Ensure Pinia is attached after @pinia/nuxt provides it
    nextTick(() => {
      const pinia = nuxtApp.vueApp._context.provides?.pinia;
      if (pinia) {
        piniaInstance = pinia;
        nuxtApp.$pinia = pinia;
        nuxtApp.vueApp.config.globalProperties.$pinia = pinia;
      }
    });
  },
});
