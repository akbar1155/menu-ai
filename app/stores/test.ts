/**
 * Test Store - Minimal example for Pinia SSR testing
 * 
 * This store demonstrates proper Pinia usage in Nuxt 3/4 with SSR.
 * All state properties are initialized with default values to prevent
 * "Cannot read properties of undefined" errors.
 */
import { defineStore } from "pinia";

export const useTestStore = defineStore("test", {
  state: () => ({
    // Always initialize state properties with default values
    count: 0,
    message: "Hello from Pinia!",
    initialized: false,
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    greeting: (state) => `${state.message} Count: ${state.count}`,
  },

  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    setMessage(message: string) {
      this.message = message;
    },
    initialize() {
      this.initialized = true;
    },
  },
});

