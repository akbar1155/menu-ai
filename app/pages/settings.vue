<template>
  <div class="settings">
    <a-row :gutter="24">
      <a-col :xs="24" :md="12">
        <a-card title="Profile">
          <a-form layout="vertical" @submit.prevent="onSave">
            <a-form-item label="Name">
              <a-input v-model:value="form.name" placeholder="Your name" />
            </a-form-item>
            <a-form-item label="Number of people">
              <a-input-number v-model:value="form.peopleCount" :min="1" :max="10" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Dietary preference">
              <a-select v-model:value="form.dietaryPref">
                <a-select-option value="NORMAL">Standard</a-select-option>
                <a-select-option value="DIET" :disabled="!store.isPro">Diet-friendly</a-select-option>
                <a-select-option value="KIDS" :disabled="!store.isPro">Kids</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Allergies (comma separated)">
              <a-input v-model:value="form.allergies" placeholder="nuts, gluten" />
            </a-form-item>
            <a-button type="primary" html-type="submit" :loading="store.isLoadingProfile">
              Save changes
            </a-button>
          </a-form>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card title="Subscription" class="settings__card">
          <p><strong>Status:</strong> {{ subscription.status }}</p>
          <p v-if="subscription.currentPeriodEnd">
            <strong>Renews:</strong>
            {{ dayjs(subscription.currentPeriodEnd).format('MMM D, YYYY') }}
          </p>
          <a-button v-if="!store.isPro" type="primary" @click="navigateTo('/subscription')">
            Upgrade to Pro – 9,900 UZS
          </a-button>
          <a-alert v-else type="success" message="You are a Pro member with unlimited plans." show-icon />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useUserStore } from '~/stores/user';

const store = useUserStore();
const profile = computed(() => store.profile);
const subscription = reactive({
  status: 'FREE',
  currentPeriodEnd: null as string | null,
});

const form = reactive({
  name: '',
  peopleCount: 1,
  dietaryPref: 'NORMAL',
  allergies: '',
});

definePageMeta({
  middleware: 'auth' as any
});

onMounted(async () => {
  if (!store.profile) {
    await store.fetchProfile();
  }
  if (store.profile) {
    form.name = store.profile.name ?? '';
    form.peopleCount = store.profile.peopleCount;
    form.dietaryPref = store.profile.dietaryPref;
    form.allergies = store.profile.allergies.join(', ');
  }

  const status = await $fetch('/api/subscription/status');
  subscription.status = status.status;
  subscription.currentPeriodEnd = status.currentPeriodEnd;
});

const onSave = async () => {
  const payload = {
    name: form.name,
    peopleCount: form.peopleCount,
    dietaryPref: form.dietaryPref,
    allergies: form.allergies
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  };
  await store.updateProfile(payload as any);
};
</script>

<style scoped>
.settings {
  max-width: 1000px;
  margin: 0 auto;
}

.settings__card {
  min-height: 200px;
}
</style>
