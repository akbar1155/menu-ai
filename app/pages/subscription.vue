<template>
  <div class="subscription p-4 sm:p-6">
    <h2 class="text-2xl sm:text-3xl font-bold mb-3">Choose your MenuAI plan</h2>
    <p class="subtitle text-base sm:text-lg">Upgrade to Pro for unlimited weekly plans and specialised diets.</p>
    <a-row :gutter="[16, 16]" class="sm:!gutter-24">
      <a-col :xs="24" :md="12">
        <a-card title="Free" class="tier" :bordered="store.isPro">
          <ul>
            <li>1 AI meal plan per week</li>
            <li>Standard dietary preference</li>
            <li>Grocery list PDF export</li>
          </ul>
          <a-tag color="default">$0</a-tag>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card title="Pro" class="tier" head-style="{ background: '#f0f5ff' }">
          <ul>
            <li>Unlimited AI meal plans</li>
            <li>Diet & kids meal presets</li>
            <li>Priority support</li>
          </ul>
          <a-tag color="success">9,900 UZS / month</a-tag>
          <a-button
            type="primary"
            style="margin-top: 16px"
            @click="startCheckout"
            :loading="loading"
            :disabled="store.isPro"
            class="cursor-pointer"
          >
            {{ store.isPro ? 'You are Pro' : 'Upgrade to Pro – 9,900 UZS' }}
          </a-button>
          <a-alert
            v-if="store.isPro"
            style="margin-top: 12px"
            type="success"
            message="Your subscription is active. Thank you!"
            show-icon
          />
        </a-card>
      </a-col>
    </a-row>
    <a-alert
      v-if="message"
      style="margin-top: 24px"
      type="info"
      :message="message"
      show-icon
      closable
      @close="message = ''"
    />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const store = useUserStore();
const loading = ref(false);
const message = ref('');

definePageMeta({ middleware: 'auth' });

onMounted(async () => {
  if (!store.profile) {
    await store.fetchProfile();
  }
});

const startCheckout = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/subscription/checkout', { method: 'POST' });
    message.value = 'Mock checkout completed! Redirecting to confirmation...';
    await store.fetchProfile();
    setTimeout(() => navigateTo('/subscription/confirmation'), 1200);
  } catch (error: any) {
    message.value = error?.data?.statusMessage ?? error?.message ?? 'Failed to start checkout';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.subscription {
  max-width: 900px;
  margin: 0 auto;
}

.subtitle {
  color: rgba(15, 23, 42, 0.7);
  margin-bottom: 24px;
}

.tier ul {
  padding-left: 18px;
  min-height: 120px;
}
</style>
