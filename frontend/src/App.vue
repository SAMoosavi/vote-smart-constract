<template>
	<header class="border-b-2 border-base-300">
		<nav class="navbar bg-base-100 shadow-sm">
			<div class="navbar-start">
				<div class="dropdown">
					<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</div>
					<ul
						tabindex="0"
						class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
					>
						<li>
							<RouterLink to="/">Home</RouterLink>
						</li>
						<li v-if="user.isLoggedIn">
							<RouterLink to="/dashboard">dashboard</RouterLink>
						</li>
					</ul>
				</div>
				<RouterLink
					class="btn btn-ghost text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
					to="/"
				>
					Votereum
				</RouterLink>
			</div>
			<div class="navbar-center hidden lg:flex">
				<ul class="menu menu-horizontal px-1">
					<li>
						<RouterLink to="/">Home</RouterLink>
					</li>
					<li v-if="user.isLoggedIn">
						<RouterLink to="/dashboard">dashboard</RouterLink>
					</li>
				</ul>
			</div>
			<div class="navbar-end">
				<div class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="btn m-1">Theme</div>
					<ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
						<li v-for="name in themes" :key="name">
							<a @click="change_theme(name)">{{ name }}</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	</header>
	<div>
		<RouterView />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user.ts'
import { createConnection } from '@/functions/Connector.ts'
import { getUser } from '@/functions/api-handler.ts'
import { toast } from 'vue3-toastify'

const user = useUserStore()
const themes = ['dracula', 'dark', 'light', 'luxury']

function change_theme(theme: string) {
	document.documentElement.setAttribute('data-theme', theme)
	localStorage.setItem('theme', theme)
}

onMounted(async () => {
	change_theme(localStorage.getItem('theme') || 'dracula')

	if (!user.isLoggedIn) {
		try {
			const { signer } = await createConnection()

			const public_address = signer.address
			const digital_signature = await signer.signMessage(public_address)

			getUser(public_address)
				.then((res) => {
					const user = res.data
					if (user.digital_signature == digital_signature) useUserStore().loginUser(user)
					toast.success('automatically login successful')
				})
				.catch(() => {})
		} catch {
			toast.error('invalid private key')
		}
	}
})
</script>
