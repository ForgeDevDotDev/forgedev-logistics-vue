<template>
  <div class="card">
    <div class="card-header">
      <span class="card-title">{{ courier.name }}</span>
      <span :class="['badge', `badge-${courier.status}`]">{{ courier.status }}</span>
    </div>
    <div class="courier-info">
      <p><strong>Vehicle:</strong> {{ courier.vehicle }}</p>
      <p v-if="courier.company"><strong>Company:</strong> {{ courier.company }}</p>
      <p v-if="courier.city"><strong>City:</strong> {{ courier.city }}</p>
      <p><strong>Phone:</strong> {{ courier.phone }}</p>
      <p v-if="courier.orders && courier.orders.length > 0">
        <strong>Active orders:</strong> {{ courier.orders.length }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Courier } from '@/vite-env.d';

defineProps<{
  courier: Courier;
}>();
</script>

<style scoped>
.courier-info p {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}
</style>
