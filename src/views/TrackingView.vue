<template>
  <div class="tracking-view">
    <h1>Track Your Order</h1>

    <div class="tracking-search">
      <input
        class="form-input"
        v-model="trackingCode"
        placeholder="Enter tracking code (e.g., TRK-001-MAD)"
        @keyup.enter="trackOrder"
      />
      <button @click="trackOrder" class="btn btn-primary">
        Track
      </button>
    </div>

    <div v-if="loading" class="loading">
      Searching for your order...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="trackingData" class="tracking-result">
      <div class="card">
        <div class="card-header">
          <span class="card-title">{{ trackingData.trackingCode }}</span>
          <StatusBadge :status="trackingData.status" />
        </div>
        <div class="tracking-info">
          <p><strong>From:</strong> {{ trackingData.pickupAddress }}</p>
          <p><strong>To:</strong> {{ trackingData.deliveryAddress }}</p>
          <p v-if="trackingData.courier">
            <strong>Courier:</strong> {{ trackingData.courier.name }}
          </p>
          <!-- BUG: Shows raw timestamp -->
          <p>Created: {{ trackingData.createdAt }}</p>
          <!-- FIXME: Should use toLocaleDateString() -->

          <!-- BUG: Tracking endpoint returns customer data which we display here -->
          <div v-if="trackingData.customer">
            <p><strong>Customer:</strong> {{ trackingData.customer.name }}</p>
            <p><strong>Phone:</strong> {{ trackingData.customer.phone }}</p>
            <!-- This is a privacy issue — the public tracking page shows customer PII -->
          </div>
        </div>
      </div>

      <h2>Tracking History</h2>
      <TrackingTimeline
        v-if="trackingData.statusHistory"
        :history="trackingData.statusHistory"
      />
    </div>

    <div v-else class="loading">
      Enter a tracking code to see your order status.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { trackingApi } from '@/api';
import StatusBadge from '@/components/StatusBadge.vue';
import TrackingTimeline from '@/components/TrackingTimeline.vue';

const route = useRoute();
const trackingCode = ref((route.params.code as string) || '');
const trackingData = ref<any>(null);
const loading = ref(false);
const error = ref('');

async function trackOrder() {
  if (!trackingCode.value.trim()) return;

  loading.value = true;
  error.value = '';
  trackingData.value = null;

  try {
    const res = await trackingApi.track(trackingCode.value.trim());
    trackingData.value = res.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      error.value = 'Tracking code not found. Please check and try again.';
    } else {
      error.value = 'Failed to fetch tracking information.';
    }
  } finally {
    loading.value = false;
  }
}

// If code is in the URL, auto-track
if (trackingCode.value) {
  trackOrder();
}
</script>

<style scoped>
.tracking-search {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tracking-search .form-input {
  flex: 1;
}

.tracking-info p {
  margin-bottom: 0.25rem;
}
</style>
