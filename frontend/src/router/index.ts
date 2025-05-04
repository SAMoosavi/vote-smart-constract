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
			path: '/dashboard',
			name: 'dashboard',
			component: () => import('../views/DashboardView.vue'),
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/RegisterView.vue'),
		},
		{
			path: '/vote/:address',
			name: 'vote',
			component: () => import('../views/VoteView.vue'),
		},
		{
			path: '/404',
			name: '404',
			component: () => import('../views/404View.vue'),
		},
	],
})

export default router
