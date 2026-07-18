<template>
  <span :class="badgeClass">{{ displayStatus }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  status: string;
}>();

// Normalize for badge class (lowercase)
const normalizedStatus = computed(() => {
  return props.status.toLowerCase();
});

const badgeClass = computed(() => `badge badge-${normalizedStatus.value}`);

// Keep the display as-is (shows inconsistency of the backend)
const displayStatus = computed(() => props.status);
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-pending { background: #fff3cd; color: #856404; }
.badge-assigned { background: #cce5ff; color: #004085; }
.badge-picked_up { background: #d1ecf1; color: #0c5460; }
.badge-in_transit { background: #d4edda; color: #155724; }
.badge-delivered { background: #d4edda; color: #155724; }
.badge-failed { background: #f8d7da; color: #721c24; }
.badge-cancelled { background: #e2e3e5; color: #383d41; }
</style>
