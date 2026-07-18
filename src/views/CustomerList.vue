<template>
  <div class="customer-list">
    <h1>Customers</h1>

    <!-- BUG: No loading state shown while fetching -->
    <div v-if="!customers.length" class="loading">
      No customers found. Try refreshing.
    </div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="customer in customers"
            :key="customer.id"
            @click="goToOrders(customer.id)"
            style="cursor: pointer;"
          >
            <td>{{ customer.name }}</td>
            <td>{{ customer.city }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.orderCount || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';

const router = useRouter();
const customers = ref<any[]>([]);

async function fetchCustomers() {
  // NOTE: This fetches directly via the API, not through a store
  // There's no customer store — might be worth adding one
  try {
    const res = await api.get('/orders', { limit: 100 });
    // FIXME: There's no /customers endpoint, so we extract from orders
    // This is a workaround — should add a proper /customers route
    const customerMap = new Map<string, any>();
    for (const order of res.data.data) {
      if (order.customer && !customerMap.has(order.customer.id)) {
        customerMap.set(order.customer.id, {
          ...order.customer,
          orderCount: 0,
        });
      }
      if (order.customer && customerMap.has(order.customer.id)) {
        customerMap.get(order.customer.id).orderCount++;
      }
    }
    customers.value = Array.from(customerMap.values());
  } catch (err) {
    console.error('Failed to fetch customers:', err);
  }
}

function goToOrders(customerId: string) {
  // TODO: Filter orders by customer
  router.push(`/orders`);
}

onMounted(fetchCustomers);
</script>
