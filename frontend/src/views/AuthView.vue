<template>
	<main v-if="search" class="container flex items-center justify-center mx-auto mt-10">
		<span class="loading loading-bars w-20 lg:w-50 bg-gradient-to-r from-primary to-secondary"></span>
	</main>
	<main v-else class="container mx-auto">
		<div class="card mt-5 mx-auto w-full lg:w-1/2">
			<div class="card-title self-center">
				<h2 class="text-5xl font-bold">User list</h2>
			</div>

			<div class="divider"></div>

			<div class="card-body">
				<ul class="list w-full">
					<li class="list-row items-center" @click="create_modal_ref?.showModal()">
						<h3 class="text-3xl">add user</h3>

						<button class="btn btn-square btn-ghost ml-auto">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
						</button>
						<dialog ref="create_modal" class="modal modal-bottom sm:modal-middle">
							<div class="modal-box justify-content-center text-center">
								<form method="dialog">
									<button class="btn btn-sm btn-square btn-ghost absolute right-2 top-2">✕</button>
								</form>
								<h3 class="text-lg font-bold">Add User</h3>
								<form
									@submit.prevent="
										() => {
											add_user()
												.then(() => create_modal_ref?.close())
												.catch(() => {})
										}
									"
									class="flex flex-col gap-5 items-center text-center mt-5"
								>
									<input
										required
										type="text"
										v-model="username"
										autofocus
										placeholder="username"
										class="input input-secondary w-full validator"
									/>
									<input
										required
										type="email"
										v-model="email"
										autofocus
										placeholder="email"
										class="input input-secondary w-full validator"
									/>
									<input
										required
										type="password"
										v-model="password"
										autofocus
										placeholder="password"
										class="input input-secondary w-full validator"
									/>
									<button
										:disabled="creating"
										class="btn btn-block btn-dash btn-primary"
										type="submit"
									>
										<span v-show="creating" class="loading loading-spinner loading-md"></span>
										add
									</button>
								</form>
							</div>
						</dialog>
					</li>

					<li class="list-row items-center" v-for="(val, index) in users" :key="index">
						<h3 class="text-3xl">{{ val[0] }}</h3>
						<span class="text-sm truncate opacity-60"> {{ val[1] }}</span>
						<RouterLink
							:to="{ name: 'show-auth', params: { address: val[1] } }"
							class="btn btn-square btn-ghost"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
								/>
							</svg>
						</RouterLink>
					</li>
				</ul>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { addUser, getUsers } from '@/functions/Auth.ts'
import { onBeforeMount, onMounted, ref, useTemplateRef } from 'vue'
import { accessToAuth } from '@/functions/VoteCreator.ts'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const address = route.params.address as string

const search = ref(false)

onBeforeMount(async () => {
	search.value = true
	setTimeout(async () => {
		if (!(await accessToAuth(address))) {
			await router.push('/404')
		}
		search.value = false
	}, 500)
})

const users = ref([])

const username = ref('')
const email = ref('')
const password = ref('')
const creating = ref(false)
const create_modal_ref = useTemplateRef('create_modal')

async function add_user() {
	if (creating.value) return
	if (username.value === '') throw new Error('please enter name of username')

	creating.value = true
	await addUser(address, username.value, password.value, email.value)
		.then(async () => {
			toast.success('user added successfully.')
			await get_users()
		})
		.catch(() =>
			toast.error('the username is exist'),
		)
		.finally(() => {
			creating.value = false
			username.value = ''
			email.value = ''
			password.value = ''
		})
}

async function get_users() {
	getUsers(address).then((response) => {
		users.value = response
	})
}

onMounted(get_users)
</script>

<style scoped></style>
