<template>
  <div class="order-detail" v-if="order">
    <div class="card">
      <div class="card-header">
        <span class="card-title">Order {{ order.trackingCode }}</span>
        <StatusBadge :status="order.status" />
      </div>
      <div class="order-info">
        <p><strong>From:</strong> {{ order.pickupAddress }}</p>
        <p><strong>To:</strong> {{ order.deliveryAddress }}</p>
        <p v-if="order.customer"><strong>Customer:</strong> {{ order.customer.name }}</p>
        <p v-if="order.courier"><strong>Courier:</strong> {{ order.courier.name }}</p>
        <p v-if="order.weight"><strong>Weight:</strong> {{ order.weight }} kg</p>
        <p v-if="order.notes"><strong>Notes:</strong> {{ order.notes }}</p>
        <!-- BUG: Raw timestamp -->
        <p>Created: {{ order.createdAt }}</p>
        <p>Updated: {{ order.updatedAt }}</p>
      </div>
    </div>

    <div class="grid grid-2">
      <div>
        <h2>Status History</h2>
        <TrackingTimeline
          v-if="order.statusHistory"
          :history="order.statusHistory"
        />
      </div>

      <div>
        <h2>Route</h2>
        <RouteMap
          v-if="waypoints.length > 0"
          :waypoints="waypoints"
        />
        <div v-else class="loading">
          No route information available
        </div>
      </div>
    </div>

    <div v-if="order.notifications && order.notifications.length > 0">
      <h2>Notifications ({{ order.notifications.length }})</h2>
      <div
        v-for="notif in order.notifications"
        :key="notif.id"
        class="card"
      >
        <div class="card-header">
          <span class="card-title">{{ notif.type }}</span>
          <span :class="['badge', `badge-${notif.status}`]">{{ notif.status }}</span>
        </div>
        <p>{{ notif.message }}</p>
      </div>
    </div>
  </div>

  <div v-else-if="ordersStore.loading" class="loading">
    Loading order...
  </div>
  <div v-else-if="ordersStore.error" class="error">
    {{ ordersStore.error }}
  </div>
  <div v-else class="loading">
    Order not found.
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useOrdersStore } from '@/stores/orders';
import StatusBadge from '@/components/StatusBadge.vue';
import TrackingTimeline from '@/components/TrackingTimeline.vue';
import RouteMap from '@/components/RouteMap.vue';

const route = useRoute();
const ordersStore = useOrdersStore();

const order = computed(() => ordersStore.currentOrder);

const waypoints = computed(() => {
  if (!order.value?.route?.waypoints) return [];
  try {
    return JSON.parse(order.value.route.waypoints);
  } catch {
    return [];
  }
});

async function loadOrder() {
  const id = route.params.id as string;
  if (id) {
    await ordersStore.fetchOrder(id);
  }
}

onMounted(loadOrder);
watch(() => route.params.id, loadOrder);
</script>
