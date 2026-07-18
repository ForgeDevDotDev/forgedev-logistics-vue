import { defineStore } from 'pinia';
import { ordersApi } from '@/api';
import type { Order } from '@/vite-env.d';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 20,
  }),

  getters: {
    pendingOrders: (state) => state.orders.filter(o => o.status === 'pending' || o.status === 'PENDING'),
    activeOrders: (state) => state.orders.filter(o =>
      !['DELIVERED', 'CANCELLED', 'failed', 'delivered', 'cancelled'].includes(o.status)
    ),
    // BUG: The status comparison above is inconsistent
    // Some orders have lowercase status, some uppercase
    // This filter might not catch all active orders
  },

  actions: {
    async fetchOrders(params?: { status?: string; customerId?: string; courierId?: string }) {
      this.loading = true;
      this.error = null;
      try {
        const res = await ordersApi.list({ ...params, page: this.page, limit: this.limit });
        this.orders = res.data.data;
        this.total = res.data.total;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to fetch orders';
      } finally {
        this.loading = false;
      }
    },

    async fetchOrder(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await ordersApi.get(id);
        this.currentOrder = res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to fetch order';
      } finally {
        this.loading = false;
      }
    },

    async createOrder(data: any) {
      this.loading = true;
      try {
        const res = await ordersApi.create(data);
        this.orders.unshift(res.data);
        return res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to create order';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(id: string, data: any) {
      try {
        const res = await ordersApi.update(id, data);
        const idx = this.orders.findIndex(o => o.id === id);
        if (idx !== -1) {
          this.orders[idx] = res.data;
        }
        if (this.currentOrder?.id === id) {
          this.currentOrder = res.data;
        }
        return res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to update order';
        throw err;
      }
    },

    // BUG: This filter doesn't work correctly
    // The status comparison is case-sensitive but statuses in the DB are inconsistent
    filterByStatus(status: string) {
      return this.orders.filter(o => o.status === status);
      // FIXME: This won't match "pending" if the order status is "PENDING"
      // Need to normalize status to lowercase before comparing
    },
  },
});
