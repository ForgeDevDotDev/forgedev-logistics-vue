<template>
  <div class="courier-view">
    <h1>Courier Dashboard</h1>

    <div class="filter-bar">
      <select v-model="selectedCourierId" @change="loadCourierData">
        <option value="">Select a courier...</option>
        <option
          v-for="courier in couriersStore.couriers"
          :key="courier.id"
          :value="courier.id"
        >
          {{ courier.name }} — {{ courier.status }}
        </option>
      </select>
    </div>

    <div v-if="!selectedCourierId" class="loading">
      Please select a courier above.
    </div>
    <div v-else-if="couriersStore.loading" class="loading">
      Loading courier data...
    </div>
    <div v-else-if="couriersStore.currentCourier">
      <CourierCard :courier="couriersStore.currentCourier" />

      <h2>Assigned Deliveries</h2>
      <div v-if="couriersStore.currentCourier.orders && couriersStore.currentCourier.orders.length === 0" class="loading">
        No assigned deliveries
      </div>
      <div
        v-for="order in couriersStore.currentCourier.orders"
        :key="order.id"
      >
        <OrderCard :order="order" @click="goToOrder" />
        <div class="status-update-form">
          <label class="form-label">Update Status:</label>
          <select class="form-select" v-model="statusUpdates[order.id]">
            <option value="">Select status...</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="failed">Failed</option>
          </select>
          <input
            class="form-input"
            v-model="statusNotes[order.id]"
            placeholder="Note (optional)"
            style="margin-top: 0.5rem;"
          />
          <!-- BUG: Button doesn't disable while submitting — double submit possible -->
          <button
            @click="updateStatus(order.id)"
            class="btn btn-primary"
            style="margin-top: 0.5rem;"
          >
            Update
          </button>
          <!-- FIXME: Should disable button while API call is in progress -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCouriersStore } from '@/stores/couriers';
import { useDeliveriesStore } from '@/stores/deliveries';
import CourierCard from '@/components/CourierCard.vue';
import OrderCard from '@/components/OrderCard.vue';
import type { Order } from '@/vite-env.d';

const router = useRouter();
const couriersStore = useCouriersStore();
const deliveriesStore = useDeliveriesStore();

const selectedCourierId = ref('');
const statusUpdates = reactive<Record<string, string>>({});
const statusNotes = reactive<Record<string, string>>({});

async function loadCourierData() {
  if (selectedCourierId.value) {
    await couriersStore.fetchCourier(selectedCourierId.value);
  }
}

async function updateStatus(orderId: string) {
  const status = statusUpdates[orderId];
  if (!status) return;

  const note = statusNotes[orderId] || undefined;

  // Find the delivery for this order
  // TODO: This is fragile — should find delivery by orderId
  const delivery = deliveriesStore.deliveries.find(d => d.orderId === orderId);

  if (delivery) {
    await deliveriesStore.updateDeliveryStatus(delivery.id, status, note);
    // Reload courier data
    await loadCourierData();
  } else {
    // FIXME: If delivery doesn't exist in the store, we can't update
    // Should fetch deliveries for this courier first
    console.warn('Delivery not found for order', orderId);
  }

  statusUpdates[orderId] = '';
  statusNotes[orderId] = '';
}

function goToOrder(order: Order) {
  router.push(`/orders/${order.id}`);
}

onMounted(() => {
  couriersStore.fetchCouriers();
});
</script>

<style scoped>
.status-update-form {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 1rem;
}
</style>
