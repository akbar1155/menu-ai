# SSR-Safe Supabase Integration Guide

## Problem: White Screen on Login Page

### Why SSR Causes White Screen

1. **Browser API Access During SSR**
   - `useSupabaseClient()` and `useSupabaseUser()` access browser APIs like `localStorage`, `window`, `document`
   - During SSR (Server-Side Rendering), these APIs don't exist
   - Calling these composables during SSR causes errors or returns `undefined`

2. **Hydration Mismatch**
   - SSR renders the page with `undefined` Supabase values
   - Client-side tries to hydrate with actual Supabase values
   - Vue detects mismatch and fails to hydrate properly
   - Result: Blank white screen

3. **Error Propagation**
   - Errors during SSR can prevent the entire component from rendering
   - Even if caught, the component state becomes inconsistent
   - Vue's hydration process fails silently

## Solution: Client-Side Only Initialization

### Key Principles

1. **SSR-Safe Configuration Check**
   - Use `useRuntimeConfig()` - works on both SSR and client
   - Check configuration before initializing Supabase

2. **Client-Side Only Initialization**
   - Use `onMounted()` hook - only runs on client-side
   - Initialize Supabase composables inside `onMounted()`

3. **Reactive State Management**
   - Use `ref()` for Supabase client and user
   - Initialize as `null` during SSR
   - Set values only on client-side

4. **Safe Watchers**
   - Use `watchEffect()` inside `onMounted()`
   - Only watch after Supabase is initialized

## Implementation Pattern

```vue
<script setup lang="ts">
// 1. SSR-Safe: Check configuration (works on both SSR and client)
const config = useRuntimeConfig();
const isSupabaseConfigured = !!(config.public.supabaseUrl && config.public.supabaseKey);

// 2. SSR-Safe: Initialize reactive refs (null during SSR)
const supabase = ref<any>(null);
const user = ref<any>(null);

// 3. Client-Side Only: Initialize Supabase composables
onMounted(() => {
  if (isSupabaseConfigured) {
    try {
      supabase.value = useSupabaseClient();
      user.value = useSupabaseUser();
      
      // Watch for user changes
      watchEffect(() => {
        if (user.value?.value) {
          navigateTo('/dashboard');
        }
      });
    } catch (err) {
      console.error('Failed to initialize Supabase:', err);
    }
  }
});

// 4. SSR-Safe: Form handling (works without Supabase)
const onSubmit = async () => {
  if (!supabase.value?.auth) {
    // Handle error
    return;
  }
  // Use supabase.value for authentication
};
</script>
```

## Complete Example: Login Page

See `pages/login.vue` for a complete SSR-safe implementation with:
- Ant Design Vue components (`<a-card>`, `<a-form>`, `<a-input>`)
- `useRuntimeConfig()` for configuration check
- `onMounted()` for client-side initialization
- `watchEffect()` for user redirection
- Proper error handling
- Form validation

## Best Practices

1. **Always check configuration first**
   ```ts
   const isSupabaseConfigured = !!(config.public.supabaseUrl && config.public.supabaseKey);
   ```

2. **Initialize composables in onMounted()**
   ```ts
   onMounted(() => {
     if (isSupabaseConfigured) {
       supabase.value = useSupabaseClient();
       user.value = useSupabaseUser();
     }
   });
   ```

3. **Use ref() for Supabase values**
   ```ts
   const supabase = ref<any>(null);  // Not: const supabase = useSupabaseClient()
   ```

4. **Check before using**
   ```ts
   if (!supabase.value?.auth) {
     // Handle error
     return;
   }
   ```

5. **Handle errors gracefully**
   ```ts
   try {
     // Supabase operations
   } catch (err) {
     error.value = err.message;
   }
   ```

## Testing

1. **SSR Test**: Check page source - should render HTML without errors
2. **Client Test**: Check browser console - no hydration errors
3. **Functionality Test**: Login should work correctly
4. **Error Test**: Test with Supabase disabled - should show warning, not crash

## Common Mistakes to Avoid

❌ **Don't call composables during SSR**
```ts
// BAD - Called during SSR
const supabase = useSupabaseClient();
```

✅ **Do initialize in onMounted()**
```ts
// GOOD - Only called on client
onMounted(() => {
  supabase.value = useSupabaseClient();
});
```

❌ **Don't use composables directly in template**
```vue
<!-- BAD - May be undefined during SSR -->
<div v-if="user">Welcome</div>
```

✅ **Do use refs with null checks**
```vue
<!-- GOOD - Safe null check -->
<div v-if="user?.value">Welcome</div>
```

## Additional Resources

- [Nuxt 3 SSR Guide](https://nuxt.com/docs/guide/concepts/server-side-rendering)
- [Supabase Nuxt Module](https://supabase.nuxtjs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

