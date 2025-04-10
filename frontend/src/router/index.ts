import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../views/HomeView.vue'),
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/AboutView.vue'),
		},
		{
			path: '/dashboard',
			name: 'dashboard',
			component: () => import('../views/DashboardView.vue'),
		},
		{
			path: '/auth/:address',
			name: 'show-auth',
			component: () => import('../views/AuthView.vue'),
		},
		{
			path: '/404',
			name: '404',
			component: () => import('../views/404View.vue'),
		},
	],
})

export default router
