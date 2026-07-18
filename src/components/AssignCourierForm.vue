<template>
  <div class="card">
    <h3 class="card-title">Assign Courier</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label class="form-label">Order</label>
        <select class="form-select" v-model="selectedOrderId" required>
          <option value="">Select an order...</option>
          <option
            v-for="order in pendingOrders"
            :key="order.id"
            :value="order.id"
          >
            {{ order.trackingCode }} — {{ order.deliveryAddress }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Courier</label>
        <select class="form-select" v-model="selectedCourierId" required>
          <option value="">Select a courier...</option>
          <option
            v-for="courier in availableCouriers"
            :key="courier.id"
            :value="courier.id"
          >
            {{ courier.name }} ({{ courier.vehicle }})
          </option>
        </select>
      </div>

      <!-- BUG: Button is not disabled while submitting -->
      <!-- This allows double-submit if the user clicks twice quickly -->
      <button type="submit" class="btn btn-primary">
        {{ submitting ? 'Assigning...' : 'Assign Courier' }}
      </button>
      <!-- FIXME: Should add :disabled="submitting" to prevent double-submit -->
    </form>

    <div v-if="error" class="error" style="margin-top: 1rem;">{{ error }}</div>
    <div v-if="success" style="margin-top: 1rem; color: #155724; background: #d4edda; padding: 0.75rem; border-radius: 4px;">
      {{ success }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOrdersStore } from '@/stores/orders';
import { useCouriersStore } from '@/stores/couriers';
import { useDeliveriesStore } from '@/stores/deliveries';

const ordersStore = useOrdersStore();
const couriersStore = useCouriersStore();
const deliveriesStore = useDeliveriesStore();

const selectedOrderId = ref('');
const selectedCourierId = ref('');
const submitting = ref(false);
const error = ref('');
const success = ref('');

const pendingOrders = computed(() => {
  // BUG: filterByStatus doesn't handle case inconsistency
  return ordersStore.orders.filter(o =>
    o.status === 'pending' || o.status === 'PENDING'
  );
});

const availableCouriers = computed(() => couriersStore.availableCouriers);

async function handleSubmit() {
  if (!selectedOrderId.value || !selectedCourierId.value) return;

  // BUG: submitting is set but never checked — button isn't disabled
  submitting.value = true;
  error.value = '';
  success.value = '';

  try {
    await deliveriesStore.assignCourier(selectedOrderId.value, selectedCourierId.value);
    success.value = 'Courier assigned successfully!';
    selectedOrderId.value = '';
    selectedCourierId.value = '';
    // Refresh orders
    ordersStore.fetchOrders();
  } catch (err: any) {
    error.value = deliveriesStore.error || 'Failed to assign courier';
  } finally {
    submitting.value = false;
  }
}

// Load data on mount
ordersStore.fetchOrders();
couriersStore.fetchCouriers();
</script>
