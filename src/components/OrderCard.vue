<template>
  <div class="card" @click="$emit('click', order)">
    <div class="card-header">
      <span class="card-title">{{ order.trackingCode }}</span>
      <StatusBadge :status="order.status" />
    </div>
    <div class="order-info">
      <p><strong>From:</strong> {{ order.pickupAddress }}</p>
      <p><strong>To:</strong> {{ order.deliveryAddress }}</p>
      <p v-if="order.customer"><strong>Customer:</strong> {{ order.customer.name }}</p>
      <p v-if="order.courier"><strong>Courier:</strong> {{ order.courier.name }}</p>
      <!-- BUG: Shows raw timestamp instead of formatted date -->
      <p class="order-time">Created: {{ order.createdAt }}</p>
      <!-- FIXME: Should use toLocaleDateString() or a date formatter -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/vite-env.d';
import StatusBadge from './StatusBadge.vue';

defineProps<{
  order: Order;
}>();

defineEmits<{
  click: [order: Order];
}>();
</script>

<style scoped>
.order-info p {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.order-time {
  color: #888;
  font-size: 0.85rem;
}

.card {
  cursor: pointer;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}
</style>
