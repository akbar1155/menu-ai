<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <div>
        <h2>Welcome back{{ profile?.name ? `, ${profile.name}` : '' }}</h2>
        <p>Here is your latest weekly meal plan.</p>
      </div>
      <a-space :size="12">
        <a-button type="default" @click="navigateTo('/generate')">Regenerate plan</a-button>
        <a-button type="primary" ghost @click="downloadPdf" :disabled="!plan">Download grocery PDF</a-button>
      </a-space>
    </div>

    <a-spin :spinning="loading">
      <template v-if="plan">
        <a-row :gutter="16">
          <a-col :xs="24" :md="16">
            <a-card title="7-day plan" class="card">
              <a-timeline>
                <a-timeline-item v-for="day in plan.meals" :key="day.day">
                  <h4>{{ day.day }}</h4>
                  <ul>
                    <li><strong>Breakfast:</strong> {{ day.meals.breakfast }}</li>
                    <li><strong>Lunch:</strong> {{ day.meals.lunch }}</li>
                    <li><strong>Dinner:</strong> {{ day.meals.dinner }}</li>
                  </ul>
                </a-timeline-item>
              </a-timeline>
            </a-card>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-card title="Grocery List" class="card">
              <a-list :data-source="plan.groceryList" bordered>
                <template #renderItem="{ item }">
                  <a-list-item>{{ item }}</a-list-item>
                </template>
              </a-list>
            </a-card>
            <a-card title="Plan details" class="card" style="margin-top: 16px">
              <p><strong>People:</strong> {{ plan.peopleCount }}</p>
              <p><strong>Preference:</strong> {{ plan.dietaryPref }}</p>
              <p><strong>Generated:</strong> {{ dayjs(plan.createdAt).format('MMM D, YYYY') }}</p>
            </a-card>
          </a-col>
        </a-row>
      </template>
      <a-empty v-else description="No meal plan yet. Generate your first plan!" />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useUserStore } from '~/stores/user';

const store = useUserStore();
const loading = computed(() => store.isLoadingPlan || store.isLoadingProfile);
const plan = computed(() => store.latestPlan);
const profile = computed(() => store.profile);

onMounted(async () => {
  if (!store.profile) {
    await store.fetchProfile();
  }
  await store.fetchLatestPlan();
});

definePageMeta({ middleware: 'auth' });

const downloadPdf = async () => {
  if (!plan.value) return;
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('MenuAI Grocery List', 14, 20);
  doc.setFontSize(12);
  plan.value.groceryList.forEach((item, index) => {
    const y = 30 + index * 8;
    doc.text(`• ${item}`, 14, y);
  });
  doc.save('menuai-grocery-list.pdf');
};
</script>

<style scoped>
.dashboard {
  max-width: 1100px;
  margin: 0 auto;
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  margin-bottom: 16px;
}
</style>
