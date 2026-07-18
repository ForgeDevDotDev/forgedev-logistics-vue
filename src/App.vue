<template>
  <div id="app">
    <nav class="navbar" v-if="!isTrackingPage">
      <router-link to="/dispatch">Dispatch</router-link>
      <router-link to="/courier">Courier</router-link>
      <router-link to="/customers">Customers</router-link>
      <router-link to="/tracking">Track Order</router-link>
    </nav>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isTrackingPage = computed(() => route.name === 'tracking');
</script>
