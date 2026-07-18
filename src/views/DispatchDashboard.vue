<template>
  <div class="dispatch-dashboard">
    <div class="dashboard-header">
      <h1>Dispatch Dashboard</h1>
      <button @click="refresh" class="btn btn-primary">
        🔄 Refresh
      </button>
    </div>

    <!-- TODO: This should auto-refresh with WebSocket updates -->
    <!-- For now we just have a manual refresh button -->
    <!-- FIXME: Implement WebSocket connection to /ws for live updates -->

    <div class="filter-bar">
      <select v-model="statusFilter" @change="applyFilter">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="ASSIGNED">Assigned</option>
        <option value="PICKED_UP">Picked Up</option>
        <option value="in_transit">In Transit</option>
        <option value="DELIVERED">Delivered</option>
      </select>
    </div>

    <div v-if="ordersStore.loading" class="loading">
      Loading orders...
    </div>
    <div v-else-if="ordersStore.error" class="error">
      {{ ordersStore.error }}
    </div>
    <div v-else>
      <div class="grid grid-2">
        <div>
          <h2>Orders ({{ ordersStore.orders.length }})</h2>
          <div v-if="ordersStore.orders.length === 0" class="loading">
            No orders found
          </div>
          <OrderCard
            v-for="order in ordersStore.orders"
            :key="order.id"
            :order="order"
            @click="selectOrder"
          />
        </div>
        <div>
          <h2>Available Couriers ({{ couriersStore.availableCouriers.length }})</h2>
          <AssignCourierForm v-if="showAssignForm" />
          <div v-if="couriersStore.loading" class="loading">
            Loading couriers...
          </div>
          <CourierCard
            v-for="courier in couriersStore.couriers"
            :key="courier.id"
            :courier="courier"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrdersStore } from '@/stores/orders';
import { useCouriersStore } from '@/stores/couriers';
import OrderCard from '@/components/OrderCard.vue';
import CourierCard from '@/components/CourierCard.vue';
import AssignCourierForm from '@/components/AssignCourierForm.vue';
import type { Order } from '@/vite-env.d';

const router = useRouter();
const ordersStore = useOrdersStore();
const couriersStore = useCouriersStore();

const statusFilter = ref('');
const showAssignForm = ref(true);

async function refresh() {
  await ordersStore.fetchOrders();
  await couriersStore.fetchCouriers();
}

function applyFilter() {
  // BUG: The filter passes the status to the API which does a case-sensitive comparison
  // But the DB has mixed case statuses so this doesn't filter correctly
  ordersStore.fetchOrders(
    statusFilter.value ? { status: statusFilter.value } : undefined
  );
}

function selectOrder(order: Order) {
  router.push(`/orders/${order.id}`);
}

onMounted(() => {
  refresh();
});
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  font-size: 1.5rem;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
</style>
