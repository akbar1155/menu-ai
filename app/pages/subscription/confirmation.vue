<template>
  <div class="confirmation">
    <a-result
      status="success"
      title="Subscription activated!"
      sub-title="You now have unlimited access to MenuAI meal planning."
    >
      <template #extra>
        <a-space>
          <NuxtLink to="/dashboard">
            <a-button type="primary">Go to dashboard</a-button>
          </NuxtLink>
          <NuxtLink to="/generate">
            <a-button>Generate a plan</a-button>
          </NuxtLink>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
</script>

<style scoped>
.confirmation {
  max-width: 700px;
  margin: 40px auto;
}
</style>
