import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/functions/api-handler'

export const useUserStore = defineStore('user', () => {
	const user = ref<User | null>(null)
	const isLoggedIn = ref(false)

	const loginUser = (userData: User) => {
		user.value = userData
		isLoggedIn.value = true
	}

	const logoutUser = () => {
		user.value = null
		isLoggedIn.value = false
	}

	return {
		user,
		isLoggedIn,
		loginUser,
		logoutUser,
	}
})
