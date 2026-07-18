import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/dispatch',
  },
  {
    path: '/dispatch',
    name: 'dispatch',
    component: () => import('@/views/DispatchDashboard.vue'),
  },
  {
    path: '/courier/:id?',
    name: 'courier',
    component: () => import('@/views/CourierView.vue'),
  },
  {
    path: '/tracking/:code?',
    name: 'tracking',
    component: () => import('@/views/TrackingView.vue'),
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('@/views/OrderDetail.vue'),
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrderDetail.vue'),
    // TODO: This should be a separate order list view
    // Currently reusing OrderDetail which doesn't make sense
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import('@/views/CustomerList.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
