<template>
  <div class="generate">
    <a-row :gutter="24">
      <a-col :xs="24" :md="10">
        <a-card title="Plan details">
          <a-alert
            v-if="error"
            type="error"
            :message="error"
            show-icon
            closable
            @close="error = ''"
            style="margin-bottom: 16px"
          />
          <a-form layout="vertical" @submit.prevent="onSubmit">
            <a-form-item label="Number of people">
              <a-input-number v-model:value="form.peopleCount" :min="1" :max="10" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Dietary preference">
              <a-select v-model:value="form.dietaryPref" :disabled="!store.isPro">
                <a-select-option value="NORMAL">Standard</a-select-option>
                <a-select-option value="DIET">Diet-friendly</a-select-option>
                <a-select-option value="KIDS">Kids</a-select-option>
              </a-select>
              <small v-if="!store.isPro" class="generate__hint">
                Upgrade to Pro to unlock diet and kids plans.
              </small>
            </a-form-item>
            <a-form-item label="Allergies (comma separated optional)">
              <a-input v-model:value="form.allergies" placeholder="nuts, gluten" />
            </a-form-item>
            <a-space direction="vertical" style="width: 100%">
              <a-button type="primary" html-type="submit" :loading="loading" block>
                Generate meal plan
              </a-button>
              <NuxtLink to="/subscription" v-if="!store.isPro">
                <a-button block>Upgrade to Pro – 9,900 UZS</a-button>
              </NuxtLink>
            </a-space>
          </a-form>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="14">
        <a-spin :spinning="loading">
          <a-card v-if="latest" title="New plan" class="generate__result">
            <p>
              <strong>People:</strong> {{ latest.peopleCount }} |
              <strong>Preference:</strong> {{ latest.dietaryPref }}
            </p>
            <a-timeline>
              <a-timeline-item v-for="day in latest.meals" :key="day.day">
                <h4>{{ day.day }}</h4>
                <ul>
                  <li>Breakfast: {{ day.meals.breakfast }}</li>
                  <li>Lunch: {{ day.meals.lunch }}</li>
                  <li>Dinner: {{ day.meals.dinner }}</li>
                </ul>
              </a-timeline-item>
            </a-timeline>
            <a-button type="primary" @click="navigateTo('/dashboard')" block>View on dashboard</a-button>
          </a-card>
          <a-empty v-else description="Fill the form to generate your first plan." />
        </a-spin>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const store = useUserStore();
const loading = ref(false);
const error = ref('');
const latest = computed(() => store.latestPlan);
const form = reactive({
  peopleCount: 2,
  dietaryPref: 'NORMAL',
  allergies: '',
});

definePageMeta({ middleware: 'auth' });

onMounted(async () => {
  if (!store.profile) {
    await store.fetchProfile();
  }
  form.peopleCount = store.profile?.peopleCount ?? 2;
  form.dietaryPref = store.profile?.dietaryPref ?? 'NORMAL';
  if (!store.latestPlan) {
    await store.fetchLatestPlan().catch(() => {});
  }
});

const onSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    const payload = {
      peopleCount: form.peopleCount,
      dietaryPref: store.isPro ? form.dietaryPref : 'NORMAL',
      allergies: form.allergies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };
    await $fetch('/api/mealplans/generate', {
      method: 'POST',
      body: payload,
    });
    await store.fetchLatestPlan();
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.message || 'Failed to generate meal plan';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.generate {
  max-width: 1100px;
  margin: 0 auto;
}

.generate__result {
  min-height: 400px;
}

.generate__hint {
  color: #f97316;
}
</style>
