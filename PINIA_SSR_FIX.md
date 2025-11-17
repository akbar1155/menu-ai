# Pinia SSR Fix for Nuxt 4

## Problem Analysis

### Root Cause
The error `Cannot read properties of undefined (reading 'state')` occurs because:

1. **Nuxt 4 Compatibility Issue**: `@pinia/nuxt` v0.11.3 provides Pinia via Vue's `provide` mechanism but doesn't attach it to `nuxtApp.$pinia` in Nuxt 4.

2. **Hook Timing**: The `app:rendered` hook in `@pinia/nuxt` tries to access `nuxtApp.$pinia.state.value` before Pinia is attached to `nuxtApp`.

3. **Provide vs Direct Attachment**: In Nuxt 4, the `provide` mechanism doesn't automatically create `nuxtApp.$pinia` - it must be explicitly attached.

### Error Location
```
node_modules/@pinia/nuxt/dist/runtime/plugin.vue3.js:26:78
nuxtApp.payload.pinia = toRaw(nuxtApp.$pinia).state.value;
```

## Solution

### 1. Pinia SSR Fix Plugin (`plugins/pinia.ts`)

This plugin:
- Intercepts `vueApp.use()` to detect when Pinia is installed
- Immediately attaches Pinia to `nuxtApp.$pinia`
- Registers an early `app:rendered` hook to ensure `$pinia` exists before `@pinia/nuxt`'s hook runs

### 2. Proper Configuration (`nuxt.config.ts`)

Key configuration points:
- **Module Order**: `@pinia/nuxt` should be listed first in modules array
- **Pinia Config**: `storesDirs: ["stores"]` for auto-importing stores
- **Imports**: `dirs: ["stores"]` for auto-importing store files

### 3. Store Best Practices

All state properties must be initialized with default values:
```typescript
state: () => ({
  count: 0,        // ✅ Initialized
  message: "",     // ✅ Initialized
  // ❌ Don't leave undefined
})
```

## Compatible Versions

### Recommended (Current Setup)
- **Nuxt**: `^4.2.1` ✅
- **Pinia**: `^3.0.4` ✅
- **@pinia/nuxt**: `^0.11.3` ✅ (with fix plugin)
- **Vue**: `^3.5.24` ✅

### Alternative (If Issues Persist)
If you encounter persistent issues, consider:
- **Nuxt**: `^3.13.0` (more stable, but older)
- **Pinia**: `^2.1.7` (compatible with Nuxt 3)
- **@pinia/nuxt**: `^0.5.1` (for Nuxt 3)

**Note**: Current versions work correctly with the fix plugin.

## Usage Examples

### Basic Store Usage
```vue
<script setup lang="ts">
// Stores are auto-imported from stores/ directory
const testStore = useTestStore();

// Access state
console.log(testStore.count);

// Use getters
console.log(testStore.doubleCount);

// Call actions
testStore.increment();
</script>
```

### With storeToRefs (for reactivity)
```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia';

const testStore = useTestStore();
// Destructure reactive state
const { count, message } = storeToRefs(testStore);
</script>
```

### SSR-Safe Store Access
```vue
<script setup lang="ts">
const testStore = useTestStore();

// Safe: Initialize on client-side only
onMounted(() => {
  testStore.initialize();
});

// Safe: Access in computed (works in SSR)
const greeting = computed(() => testStore.greeting);
</script>
```

## Testing

1. **Start dev server**: `npm run dev`
2. **Check console**: No Pinia errors should appear
3. **Test SSR**: View page source - should render without errors
4. **Test hydration**: Check browser console for hydration warnings

## Troubleshooting

### If error persists:
1. Clear `.nuxt` directory: `rm -rf .nuxt`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check plugin order in `nuxt.config.ts`
4. Verify Pinia is being detected (check console logs)

### Common Issues:
- **Store not found**: Ensure store file is in `stores/` directory
- **State undefined**: Always initialize state properties
- **Hydration mismatch**: Avoid accessing stores in `setup()` before `onMounted()`

