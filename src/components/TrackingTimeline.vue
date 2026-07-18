<template>
  <ul class="timeline" v-if="history && history.length > 0">
    <li
      v-for="item in history"
      :key="item.id"
      class="timeline-item"
    >
      <div class="timeline-status">{{ item.status }}</div>
      <!-- BUG: Shows raw timestamp instead of formatted date -->
      <div class="timeline-time">{{ item.createdAt }}</div>
      <!-- FIXME: Should format as "Jul 18, 2026 23:24" -->
      <div v-if="item.note" class="timeline-note">{{ item.note }}</div>
    </li>
  </ul>
  <p v-else class="loading">No status history available</p>
</template>

<script setup lang="ts">
import type { StatusHistory } from '@/vite-env.d';

defineProps<{
  history: StatusHistory[];
}>();
</script>
