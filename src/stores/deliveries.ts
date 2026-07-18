import { defineStore } from 'pinia';
import { deliveriesApi } from '@/api';
import type { Delivery } from '@/vite-env.d';

interface DeliveriesState {
  deliveries: Delivery[];
  currentDelivery: Delivery | null;
  loading: boolean;
  error: string | null;
}

export const useDeliveriesStore = defineStore('deliveries', {
  state: (): DeliveriesState => ({
    deliveries: [],
    currentDelivery: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDeliveries(params?: { status?: string; courierId?: string }) {
      this.loading = true;
      this.error = null;
      try {
        const res = await deliveriesApi.list(params);
        this.deliveries = res.data.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to fetch deliveries';
      } finally {
        this.loading = false;
      }
    },

    async assignCourier(orderId: string, courierId: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await deliveriesApi.assign(orderId, courierId);
        this.deliveries.unshift(res.data);
        return res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to assign courier';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateDeliveryStatus(id: string, status: string, note?: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await deliveriesApi.updateStatus(id, status, note);
        const idx = this.deliveries.findIndex(d => d.id === id);
        if (idx !== -1) {
          this.deliveries[idx] = res.data;
        }
        return res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to update status';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async getTrackingInfo(code: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await deliveriesApi.getByTrackingCode(code);
        this.currentDelivery = res.data;
        return res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to fetch tracking info';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
