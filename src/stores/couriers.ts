import { defineStore } from 'pinia';
import { couriersApi } from '@/api';
import type { Courier } from '@/vite-env.d';

interface CouriersState {
  couriers: Courier[];
  currentCourier: Courier | null;
  loading: boolean;
  error: string | null;
}

export const useCouriersStore = defineStore('couriers', {
  state: (): CouriersState => ({
    couriers: [],
    currentCourier: null,
    loading: false,
    error: null,
  }),

  getters: {
    availableCouriers: (state) => state.couriers.filter(c => c.status === 'available'),
    busyCouriers: (state) => state.couriers.filter(c => c.status === 'on_delivery'),
    offlineCouriers: (state) => state.couriers.filter(c => c.status === 'offline'),
  },

  actions: {
    async fetchCouriers(params?: { status?: string }) {
      this.loading = true;
      this.error = null;
      try {
        const res = await couriersApi.list(params);
        this.couriers = res.data.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to fetch couriers';
      } finally {
        this.loading = false;
      }
    },

    async fetchCourier(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await couriersApi.get(id);
        this.currentCourier = res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to fetch courier';
      } finally {
        this.loading = false;
      }
    },

    async createCourier(data: any) {
      this.loading = true;
      try {
        const res = await couriersApi.create(data);
        this.couriers.push(res.data);
        return res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to create courier';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateCourier(id: string, data: any) {
      try {
        const res = await couriersApi.update(id, data);
        const idx = this.couriers.findIndex(c => c.id === id);
        if (idx !== -1) {
          this.couriers[idx] = res.data;
        }
        if (this.currentCourier?.id === id) {
          this.currentCourier = res.data;
        }
        return res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Failed to update courier';
        throw err;
      }
    },
  },
});
