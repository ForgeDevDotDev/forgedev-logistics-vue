<template>
  <div class="route-map" :style="containerStyle">
    <div class="map-placeholder">
      <!-- TODO: Integrate actual map (Leaflet, Google Maps, or Mapbox) -->
      <!-- For now this is just a placeholder -->
      <p>🗺️ Map Integration Coming Soon</p>
      <p v-if="waypoints.length > 0" class="waypoints-info">
        {{ waypoints.length }} waypoints on route
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Add Leaflet or Google Maps integration
// For now this is just a visual placeholder

defineProps<{
  waypoints?: Array<{ lat: number; lng: number; address: string }>;
}>();

// Using inline styles here — bad practice but was a quick fix
// FIXME: Move these to the main CSS file
const containerStyle = 'width: 100%; height: 300px; background: #e8e8e8; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative;';
</script>

<style scoped>
.map-placeholder {
  text-align: center;
  color: #888;
}

.map-placeholder p {
  margin-bottom: 0.5rem;
}

.waypoints-info {
  font-size: 0.9rem;
  color: #555;
}
</style>
